import { NextResponse } from "next/server";

import { getUnits } from "@/db/queries";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return new NextResponse("Course ID required", { status: 400 });
    }

    // Get units for the course
    const units = await getUnits();
    
    // Get guest progress from headers or return empty progress
    const guestProgressHeader = request.headers.get('x-guest-progress');
    let guestProgress = null;
    
    if (guestProgressHeader) {
      try {
        guestProgress = JSON.parse(guestProgressHeader);
      } catch {
        // Invalid JSON, ignore
      }
    }

    return NextResponse.json({
      units,
      courseProgress: guestProgress?.courseProgress || null,
      lessonPercentage: guestProgress?.lessonPercentage || 0,
    });
  } catch (error) {
    console.error("Failed to fetch course data:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
