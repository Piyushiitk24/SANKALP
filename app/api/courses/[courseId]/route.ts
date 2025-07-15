import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { securityLogger } from "@/lib/logger";

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  try {
    await requireAdmin();
    const { courseId } = await params;
    const courseIdNumber = parseInt(courseId);

    const data = await db.query.courses.findFirst({
      where: eq(courses.id, courseIdNumber),
    });

    securityLogger.logAdminAction("admin", "COURSE_READ", `id:${courseIdNumber}`);
    return NextResponse.json(data);
  } catch (error) {
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown error"),
      "course-get"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  try {
    await requireAdmin();
    const { courseId } = await params;
    const courseIdNumber = parseInt(courseId);

    const body = (await req.json()) as typeof courses.$inferSelect;
    const data = await db
      .update(courses)
      .set({
        ...body,
      })
      .where(eq(courses.id, courseIdNumber))
      .returning();

    securityLogger.logAdminAction("admin", "COURSE_UPDATED", `id:${courseIdNumber}`);
    return NextResponse.json(data[0]);
  } catch (error) {
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown error"),
      "course-put"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  try {
    await requireAdmin();
    const { courseId } = await params;
    const courseIdNumber = parseInt(courseId);

    const data = await db
      .delete(courses)
      .where(eq(courses.id, courseIdNumber))
      .returning();

    securityLogger.logAdminAction("admin", "COURSE_DELETED", `id:${courseIdNumber}`);
    return NextResponse.json(data[0]);
  } catch (error) {
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown error"),
      "course-delete"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
