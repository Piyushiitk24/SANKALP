import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";

import db from "@/db/drizzle";
import { userSubscription } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { securityLogger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      securityLogger.logError(new Error("Stripe webhook secret not configured"), "stripe-webhook");
      return new NextResponse("Webhook secret not configured", { status: 500 });
    }

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Log webhook event for security monitoring
    securityLogger.logAdminAction("system", "WEBHOOK_RECEIVED", `stripe:${event.type}`);

  } catch (error: unknown) {
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown webhook error"),
      "stripe-webhook-verification"
    );
    return new NextResponse(`Webhook error: ${error instanceof Error ? error.message : 'Unknown error'}`, {
      status: 400,
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  try {
    // Handle different webhook events
    if (event.type === "checkout.session.completed") {
      const subscription = (await stripe.subscriptions.retrieve(
        session.subscription as string
      )) as Stripe.Subscription;

      if (!session?.metadata?.userId) {
        securityLogger.logError(
          new Error("Missing user ID in webhook metadata"),
          "stripe-webhook-checkout"
        );
        return new NextResponse("User id is required.", { status: 400 });
      }

      // Validate subscription data
      if (!subscription.customer || !subscription.id) {
        securityLogger.logError(
          new Error("Invalid subscription data from Stripe"),
          "stripe-webhook-checkout"
        );
        return new NextResponse("Invalid subscription data", { status: 400 });
      }

  const currentPeriodEndSec = (subscription as any).current_period_end as number | undefined;
      await db.insert(userSubscription).values({
        userId: session.metadata.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date((currentPeriodEndSec ?? 0) * 1000), // in ms
      });

      securityLogger.logAdminAction(
        session.metadata.userId,
        "SUBSCRIPTION_CREATED",
        `stripe:${subscription.id}`
      );

    } else if (event.type === "invoice.payment_succeeded") {
      const subscription = (await stripe.subscriptions.retrieve(
        session.subscription as string
      )) as Stripe.Subscription;

  const currentPeriodEndSec2 = (subscription as any).current_period_end as number | undefined;
      await db
        .update(userSubscription)
        .set({
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date((currentPeriodEndSec2 ?? 0) * 1000), // in ms
        })
        .where(eq(userSubscription.stripeSubscriptionId, subscription.id));

      securityLogger.logAdminAction(
        "system",
        "SUBSCRIPTION_UPDATED",
        `stripe:${subscription.id}`
      );

    } else {
      // Log unhandled webhook events
      securityLogger.logSuspiciousActivity(
        null,
        "UNHANDLED_WEBHOOK_EVENT",
        { eventType: event.type, eventId: event.id }
      );
    }

    return new NextResponse(null, { status: 200 });

  } catch (error) {
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown webhook processing error"),
      "stripe-webhook-processing"
    );
    return new NextResponse("Webhook processing failed", { status: 500 });
  }
}
