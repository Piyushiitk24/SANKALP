import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import db from "@/db/drizzle";
import { units } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { securityLogger } from "@/lib/logger";

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ unitId: string }> }
) => {
  try {
    await requireAdmin();
    const { unitId } = await params;

    const data = await db.query.units.findFirst({
      where: eq(units.id, parseInt(unitId)),
    });

    securityLogger.logAdminAction("admin", "UNIT_READ", `id:${unitId}`);
    return NextResponse.json(data);
  } catch (error) {
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown error"),
      "unit-get"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ unitId: string }> }
) => {
  try {
    await requireAdmin();
    const { unitId } = await params;

    const body = (await req.json()) as typeof units.$inferSelect;
    const data = await db
      .update(units)
      .set({
        ...body,
      })
      .where(eq(units.id, parseInt(unitId)))
      .returning();

    securityLogger.logAdminAction("admin", "UNIT_UPDATED", `id:${unitId}`);
    return NextResponse.json(data[0]);
  } catch (error) {
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown error"),
      "unit-put"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ unitId: string }> }
) => {
  try {
    await requireAdmin();
    const { unitId } = await params;

    const data = await db
      .delete(units)
      .where(eq(units.id, parseInt(unitId)))
      .returning();

    securityLogger.logAdminAction("admin", "UNIT_DELETED", `id:${unitId}`);
    return NextResponse.json(data[0]);
  } catch (error) {
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown error"),
      "unit-delete"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
