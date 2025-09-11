import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import db from "@/db/drizzle";
import { challenges } from "@/db/schema";
import { requireAdmin, logAdminAction } from "@/lib/admin";
import { asyncHandler } from "@/lib/errors";
import { checkRateLimit, rateLimiters } from "@/lib/rate-limit";
import { securityLogger } from "@/lib/logger";

// Input validation schema
const challengeSchema = z.object({
  question: z.string()
    .min(1, "Question is required")
    .max(1000, "Question must be less than 1000 characters")
    .refine(
      (val) => !val.includes("<script>") && !val.includes("javascript:"),
      "Question contains invalid content"
    ),
  type: z.enum(["SELECT", "ASSIST"], { message: "Type must be SELECT or ASSIST" }),
  order: z.number()
    .int("Order must be an integer")
    .positive("Order must be positive")
    .max(1000, "Order must be less than 1000"),
  lessonId: z.number()
    .int("Lesson ID must be an integer")
    .positive("Lesson ID must be positive"),
});

export const GET = async (req: NextRequest) => {
  try {
    // Rate limiting
    const rateLimitResult = await checkRateLimit(req, rateLimiters.admin);
    if (!rateLimitResult.allowed) {
      return rateLimitResult.response;
    }

    const userId = await requireAdmin();
    await logAdminAction("READ", "challenges");

    const data = await db.query.challenges.findMany();
    
    securityLogger.logAdminAction(userId, "READ", "challenges");
    
    return NextResponse.json(data);
  } catch (error) {
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown error"),
      "challenges-get"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    // Rate limiting
    const rateLimitResult = await checkRateLimit(req, rateLimiters.admin);
    if (!rateLimitResult.allowed) {
      return rateLimitResult.response;
    }

    const userId = await requireAdmin();
    
    const body = await req.json();
    
    // Validate input
    const validation = challengeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "Invalid input", 
          details: validation.error.issues.map(err => `${err.path.join(".")}: ${err.message}`)
        }, 
        { status: 400 }
      );
    }

    const data = await db
      .insert(challenges)
      .values(validation.data)
      .returning();

    await logAdminAction("CREATE", "challenges", { challengeId: data[0].id });
    securityLogger.logAdminAction(userId, "CREATE", "challenges");

    return NextResponse.json(data[0]);
  } catch (error) {
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown error"),
      "challenges-post"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
