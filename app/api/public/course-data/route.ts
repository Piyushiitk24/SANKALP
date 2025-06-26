import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { lessons, challenges, units } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return new NextResponse("Course ID required", { status: 400 });
    }

    const courseIdNum = parseInt(courseId, 10);
    if (isNaN(courseIdNum)) {
      return new NextResponse("Invalid course ID", { status: 400 });
    }

    // Get units for the specific course with lessons and challenges
    const courseUnits = await db.query.units.findMany({
      where: eq(units.courseId, courseIdNum),
      with: {
        lessons: {
          orderBy: [asc(lessons.order)],
          with: {
            challenges: {
              orderBy: [asc(challenges.order)],
              with: {
                challengeOptions: true,
              },
            },
          },
        },
      },
      orderBy: [asc(units.order)],
    });

    if (!courseUnits || courseUnits.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No units found for this course",
      });
    }

    return NextResponse.json({
      success: true,
      units: courseUnits,
    });
  } catch (error) {
    console.error("Failed to fetch course data:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
