"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createGuestUser, getGuestUser, setGuestUser, updateGuestUser } from "@/lib/guest-user";

type Course = {
  id: number;
  title: string;
  imageSrc: string;
};

type Props = {
  courses?: Course[];
};

export const GuestCourseSelection = ({ courses: propCourses }: Props = {}) => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>(propCourses || []);
  const [isLoading, setIsLoading] = useState(!propCourses);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  useEffect(() => {
    // Ensure guest user exists
    let guestUser = getGuestUser();
    if (!guestUser) {
      guestUser = createGuestUser();
      setGuestUser(guestUser);
    }

    // Only fetch courses if not provided as props
    if (!propCourses) {
      const fetchCourses = async () => {
        try {
          const response = await fetch("/api/public/courses");
          if (response.ok) {
            const data = await response.json() as { success: boolean; courses: Course[] };
            if (data.success) {
              setCourses(data.courses);
            } else {
              throw new Error("Failed to fetch courses from API");
            }
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        } catch (error) {
          console.error("Failed to fetch courses:", error);
          toast.error("Failed to load courses");
        } finally {
          setIsLoading(false);
        }
      };

      void fetchCourses();
    } else {
      setIsLoading(false);
    }
  }, [propCourses]);

  const handleCourseSelect = (courseId: number) => {
    try {
      setSelectedCourse(courseId);
      console.log("Attempting to select course:", courseId);

      // Find the course in our local data to validate it exists
      const selectedCourseData = courses.find(course => course.id === courseId);
      if (!selectedCourseData) {
        throw new Error("Course not found");
      }

      console.log("Course found locally:", selectedCourseData.title);

      // Ensure guest user exists before updating
      let guestUser = getGuestUser();
      if (!guestUser) {
        guestUser = createGuestUser();
        setGuestUser(guestUser);
      }

      // Update guest user with selected course
      const updatedUser = updateGuestUser({ 
        activeCourseId: courseId,
        activeCourse: selectedCourseData
      });
      console.log("Updated guest user:", updatedUser);
      
      if (updatedUser) {
        toast.success("Course selected! Starting your learning journey...");
        // Add small delay to show the toast
        setTimeout(() => {
          router.push("/learn");
        }, 1000);
      } else {
        throw new Error("Failed to update guest user");
      }
    } catch (error) {
      console.error("Full error in handleCourseSelect:", error);
      toast.error(`Failed to select course: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setSelectedCourse(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#a259ff]"></div>
      </div>
    );
  }

  return (
    <div className="h-full max-w-[912px] px-3 mx-auto">
      <h1 className="text-2xl font-bold text-neutral-700 mb-6 text-center">
        Choose a course to get started
      </h1>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex flex-col items-center justify-between p-3 pb-6 min-h-[217px] border-2 rounded-xl border-b-4 hover:bg-black/5 cursor-pointer active:border-b-2 transition"
            onClick={() => void handleCourseSelect(course.id)}
          >
            <div className="min-[24px] flex items-center justify-center">
              <Image
                src={course.imageSrc}
                alt={course.title}
                height={70}
                width={93.33}
              />
            </div>

            <p className="text-neutral-700 text-center font-bold mt-3">
              {course.title}
            </p>

            <Button
              size="lg"
              variant="secondary"
              className="w-full"
              disabled={selectedCourse === course.id}
            >
              {selectedCourse === course.id ? "Selecting..." : "Select"}
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          You&apos;re browsing as a guest. Progress won&apos;t be saved permanently.
        </p>
        <Button variant="ghost" className="text-[#a259ff]" onClick={() => router.push("/")}>
          ← Back to Sign Up
        </Button>
      </div>
    </div>
  );
};
