import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import db from "@/db/drizzle";
import { challenges } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { securityLogger } from "@/lib/logger";

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ challengeId: string }> }
) => {
  try {
    await requireAdmin();
    const { challengeId } = await params;
    const challengeIdNumber = parseInt(challengeId);

    const data = await db.query.challenges.findFirst({
      where: eq(challenges.id, challengeIdNumber),
    });

    securityLogger.logAdminAction(
      "admin",
      "CHALLENGE_READ",
      `id:${challengeIdNumber}`
    );

    return NextResponse.json(data);
  } catch (error) {
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown error"),
      "challenge-get"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ challengeId: string }> }
) => {
  try {
    await requireAdmin();
    const { challengeId } = await params;
    const challengeIdNumber = parseInt(challengeId);

    const body = (await req.json()) as typeof challenges.$inferSelect;
    const data = await db
      .update(challenges)
      .set({
        ...body,
      })
      .where(eq(challenges.id, challengeIdNumber))
      .returning();

    securityLogger.logAdminAction(
      "admin",
      "CHALLENGE_UPDATED",
      `id:${challengeIdNumber}`
    );

    return NextResponse.json(data[0]);
  } catch (error) {
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown error"),
      "challenge-put"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ challengeId: string }> }
) => {
  try {
    await requireAdmin();
    const { challengeId } = await params;
    const challengeIdNumber = parseInt(challengeId);

    const data = await db
      .delete(challenges)
      .where(eq(challenges.id, challengeIdNumber))
      .returning();

    securityLogger.logAdminAction(
      "admin",
      "CHALLENGE_DELETED",
      `id:${challengeIdNumber}`
    );

    return NextResponse.json(data[0]);
  } catch (error) {
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown error"),
      "challenge-delete"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
