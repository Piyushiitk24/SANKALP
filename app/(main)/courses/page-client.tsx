"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

import { useGuestUser } from "@/hooks/use-guest-user";
import { GuestCourseSelection } from "@/components/guest-course-selection";

import { List } from "./list";

type Course = {
  id: number;
  title: string;
  imageSrc: string;
};

type Props = {
  courses: Course[];
  userProgress: any;
};

export const CoursesClient = ({ courses, userProgress }: Props) => {
  const { user, isLoaded: userLoaded } = useUser();
  const { guestUser, isLoaded: guestLoaded } = useGuestUser();

  // Loading state
  if (!userLoaded || !guestLoaded) {
    return (
      <div className="mx-auto h-full max-w-[912px] px-3">
        <h1 className="text-2xl font-bold text-neutral-700">Courses</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#a259ff]"></div>
        </div>
      </div>
    );
  }

  // Show guest course selection for guest users
  if (!user && guestUser) {
    return <GuestCourseSelection courses={courses} />;
  }

  // Show regular list for authenticated users
  return (
    <div className="mx-auto h-full max-w-[912px] px-3">
      <h1 className="text-2xl font-bold text-neutral-700">Courses</h1>
      <List courses={courses} activeCourseId={userProgress?.activeCourseId} />
    </div>
  );
};
