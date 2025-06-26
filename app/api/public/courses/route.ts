import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { courses, units } from "@/db/schema";
import { eq, exists } from "drizzle-orm";

export const GET = async () => {
  try {
    // Only return courses that have units
    const coursesWithUnits = await db.query.courses.findMany({
      where: exists(db.select().from(units).where(eq(units.courseId, courses.id))),
    });
    
    return NextResponse.json({ success: true, courses: coursesWithUnits });
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch courses" }, { status: 500 });
  }
};
