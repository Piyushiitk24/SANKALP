import { NextResponse } from "next/server";

import { getCourses } from "@/db/queries";

export const GET = async () => {
  try {
    const courses = await getCourses();
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
