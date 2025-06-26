import { NextResponse } from "next/server";

import { getCourses } from "@/db/queries";

export const GET = async () => {
  try {
    const courses = await getCourses();
    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch courses" }, { status: 500 });
  }
};
