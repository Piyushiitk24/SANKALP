import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import db from "@/db/drizzle";
import { lessons } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { securityLogger } from "@/lib/logger";

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) => {
  try {
    await requireAdmin();
    const { lessonId } = await params;

    const data = await db.query.lessons.findFirst({
      where: eq(lessons.id, parseInt(lessonId)),
    });

    securityLogger.logAdminAction("admin", "LESSON_READ", `id:${lessonId}`);
    return NextResponse.json(data);
  } catch (error) {
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown error"),
      "lesson-get"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) => {
  try {
    await requireAdmin();
    const { lessonId } = await params;

    const body = (await req.json()) as typeof lessons.$inferSelect;
    const data = await db
      .update(lessons)
      .set({
        ...body,
      })
      .where(eq(lessons.id, parseInt(lessonId)))
      .returning();

    securityLogger.logAdminAction("admin", "LESSON_UPDATED", `id:${lessonId}`);
    return NextResponse.json(data[0]);
  } catch (error) {
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown error"),
      "lesson-put"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) => {
  try {
    await requireAdmin();
    const { lessonId } = await params;

    const data = await db
      .delete(lessons)
      .where(eq(lessons.id, parseInt(lessonId)))
      .returning();

    securityLogger.logAdminAction("admin", "LESSON_DELETED", `id:${lessonId}`);
    return NextResponse.json(data[0]);
  } catch (error) {
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown error"),
      "lesson-delete"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
