"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { useGuestUser } from "@/hooks/use-guest-user";
import { GuestUser } from "@/lib/guest-user";
import { getGuestProgress } from "@/lib/guest-progress";

import { Header } from "./header";
import { Unit } from "./unit";

type Course = {
  id: number;
  title: string;
  imageSrc: string;
};

type Challenge = {
  id: number;
  type: "SELECT" | "ASSIST";
  order: number;
  lessonId: number;
  question: string;
  challengeOptions?: any[];
  completed?: boolean;
};

type Lesson = {
  id: number;
  title: string;
  order: number;
  unitId: number;
  completed: boolean;
  challenges: Challenge[];
};

type UnitType = {
  id: number;
  title: string;
  description: string;
  order: number;
  courseId: number;
  lessons: Lesson[];
};

type Props = {
  userProgress: any;
  units: UnitType[];
  courseProgress: any;
  lessonPercentage: number;
  userSubscription: any;
  courses: Course[];
};

export const LearnPageClient = ({
  userProgress: initialUserProgress,
  units: initialUnits,
  courseProgress: initialCourseProgress,
  lessonPercentage: initialLessonPercentage,
  userSubscription,
  courses,
}: Props) => {
  const { user, isLoaded: userLoaded } = useUser();
  const { guestUser, isLoaded: guestLoaded } = useGuestUser();
  const router = useRouter();

  const [userProgress, setUserProgress] = useState(initialUserProgress);
  const [units, setUnits] = useState(initialUnits);
  const [courseProgress, setCourseProgress] = useState(initialCourseProgress);
  const [lessonPercentage, setLessonPercentage] = useState(initialLessonPercentage);

  useEffect(() => {
    if (!userLoaded || !guestLoaded) return;

    // If user is authenticated, use server data
    if (user) {
      if (!initialCourseProgress || !initialUserProgress || !initialUserProgress.activeCourse) {
        router.push("/courses");
        return;
      }
      return;
    }

    // Handle guest user
    if (guestUser && guestUser.activeCourseId) {
      const activeCourse = courses.find(c => c.id === guestUser.activeCourseId);
      if (!activeCourse) {
        router.push("/courses");
        return;
      }

      // Fetch guest course data
      fetch(`/api/public/course-data?courseId=${guestUser.activeCourseId}`)
        .then(res => res.json())
        .then(data => {
          if (!data.success) {
            router.push("/courses");
            return;
          }

          const guestProgress = getGuestProgress() || [];
          
          // Process units with guest progress
          const processedUnits = data.units.map((unit: any) => ({
            ...unit,
            lessons: unit.lessons.map((lesson: any) => {
              const lessonProgress = guestProgress.find(lp => lp.lessonId === lesson.id);
              const challenges = lesson.challenges.map((challenge: any) => {
                const challengeProgress = lessonProgress?.challengeProgress.find(cp => cp.challengeId === challenge.id);
                return {
                  ...challenge,
                  challengeOptions: challenge.challengeOptions || [],
                  completed: challengeProgress?.completed || false,
                };
              });

              return {
                ...lesson,
                challenges,
                completed: lessonProgress?.completed || false,
              };
            }),
          }));

          // Find active lesson
          const firstUncompletedLesson = processedUnits
            .flatMap((unit: any) => unit.lessons)
            .find((lesson: any) => !lesson.completed);

          const activeLessonPercentage = firstUncompletedLesson 
            ? Math.round((firstUncompletedLesson.challenges.filter((c: any) => c.completed).length / firstUncompletedLesson.challenges.length) * 100)
            : 0;

          setUserProgress({
            ...guestUser,
            activeCourse,
          });
          setUnits(processedUnits);
          setCourseProgress({
            activeLesson: firstUncompletedLesson,
            activeLessonId: firstUncompletedLesson?.id,
          });
          setLessonPercentage(activeLessonPercentage);
        })
        .catch(() => {
          router.push("/courses");
        });
    } else {
      // No user progress, redirect to courses
      router.push("/courses");
    }
  }, [user, guestUser, userLoaded, guestLoaded, router, courses, initialUserProgress, initialCourseProgress]);

  // Loading state
  if (!userLoaded || !guestLoaded) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  // No progress available
  if (!userProgress || !userProgress.activeCourse) {
    return <div className="flex items-center justify-center h-full">Redirecting...</div>;
  }

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />

        {!isPro && <Promo />}
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons}
              activeLesson={courseProgress?.activeLesson}
              activeLessonPercentage={lessonPercentage}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  );
};
