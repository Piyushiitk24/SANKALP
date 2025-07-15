import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import db from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { securityLogger } from "@/lib/logger";

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ challengeOptionId: string }> }
) => {
  try {
    await requireAdmin();
    const { challengeOptionId } = await params;
    const challengeOptionIdNumber = parseInt(challengeOptionId);

    const data = await db.query.challengeOptions.findFirst({
      where: eq(challengeOptions.id, challengeOptionIdNumber),
    });

    securityLogger.logAdminAction(
      "admin",
      "CHALLENGE_OPTION_READ",
      `id:${challengeOptionIdNumber}`
    );

    return NextResponse.json(data);
  } catch (error) {
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown error"),
      "challenge-option-get"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ challengeOptionId: string }> }
) => {
  try {
    await requireAdmin();
    const { challengeOptionId } = await params;
    const challengeOptionIdNumber = parseInt(challengeOptionId);

    const body = (await req.json()) as typeof challengeOptions.$inferSelect;
    const data = await db
      .update(challengeOptions)
      .set({
        ...body,
      })
      .where(eq(challengeOptions.id, challengeOptionIdNumber))
      .returning();

    securityLogger.logAdminAction(
      "admin",
      "CHALLENGE_OPTION_UPDATED",
      `id:${challengeOptionIdNumber}`
    );

    return NextResponse.json(data[0]);
  } catch (error) {
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown error"),
      "challenge-option-put"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ challengeOptionId: string }> }
) => {
  try {
    await requireAdmin();
    const { challengeOptionId } = await params;
    const challengeOptionIdNumber = parseInt(challengeOptionId);

    const data = await db
      .delete(challengeOptions)
      .where(eq(challengeOptions.id, challengeOptionIdNumber))
      .returning();

    securityLogger.logAdminAction(
      "admin",
      "CHALLENGE_OPTION_DELETED",
      `id:${challengeOptionIdNumber}`
    );

    return NextResponse.json(data[0]);
  } catch (error) {
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown error"),
      "challenge-option-delete"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
