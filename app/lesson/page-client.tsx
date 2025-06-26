"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import { useGuestUser } from "@/hooks/use-guest-user";
import { getGuestProgress } from "@/lib/guest-progress";

import { QuizClient } from "./quiz-client";

type Props = {
  initialLesson: any;
  initialUserProgress: any;
  initialUserSubscription: any;
  lessonId?: number;
};

export const LessonPageClient = ({
  initialLesson,
  initialUserProgress,
  initialUserSubscription,
  lessonId,
}: Props) => {
  const { user, isLoaded: userLoaded } = useUser();
  const { guestUser, isLoaded: guestLoaded } = useGuestUser();
  const router = useRouter();

  const [lesson, setLesson] = useState(initialLesson);
  const [userProgress, setUserProgress] = useState(initialUserProgress);

  useEffect(() => {
    if (!userLoaded || !guestLoaded) return;

    // If user is authenticated, use server data
    if (user) {
      if (!initialLesson || !initialUserProgress) {
        router.push("/learn");
        return;
      }
      return;
    }

    // Handle guest user
    if (guestUser && guestUser.activeCourseId) {
      // Fetch lesson data for guest
      const currentLessonId = lessonId || guestUser.activeCourseId; // This needs to be the actual lesson ID
      
      // For now, let's try to get the current lesson from the API
      fetch(`/api/public/course-data?courseId=${guestUser.activeCourseId}`)
        .then(res => res.json())
        .then(data => {
          if (!data.success) {
            router.push("/learn");
            return;
          }

          const guestProgress = getGuestProgress() || [];
          
          // Find the first uncompleted lesson if no specific lesson ID
          let targetLesson = null;
          if (lessonId) {
            // Find specific lesson
            for (const unit of data.units) {
              targetLesson = unit.lessons.find((l: any) => l.id === lessonId);
              if (targetLesson) break;
            }
          } else {
            // Find first uncompleted lesson
            for (const unit of data.units) {
              for (const unitLesson of unit.lessons) {
                const lessonProgress = guestProgress.find(lp => lp.lessonId === unitLesson.id);
                if (!lessonProgress || !lessonProgress.completed) {
                  targetLesson = unitLesson;
                  break;
                }
              }
              if (targetLesson) break;
            }
          }

          if (!targetLesson) {
            router.push("/learn");
            return;
          }

          // Process lesson with guest progress
          const lessonProgress = guestProgress.find(lp => lp.lessonId === targetLesson.id);
          const processedChallenges = targetLesson.challenges.map((challenge: any) => {
            const challengeProgress = lessonProgress?.challengeProgress.find(cp => cp.challengeId === challenge.id);
            return {
              ...challenge,
              completed: challengeProgress?.completed || false,
            };
          });

          setLesson({
            ...targetLesson,
            challenges: processedChallenges,
          });

          setUserProgress(guestUser);
        })
        .catch(() => {
          router.push("/learn");
        });
    } else {
      // No user progress, redirect to courses
      router.push("/learn");
    }
  }, [user, guestUser, userLoaded, guestLoaded, router, lessonId]);

  // Loading state
  if (!userLoaded || !guestLoaded) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  // No progress available
  if (!lesson || !userProgress) {
    return <div className="flex items-center justify-center h-full">Redirecting...</div>;
  }

  const initialPercentage =
    (lesson.challenges.filter((challenge: any) => challenge.completed).length /
      lesson.challenges.length) *
    100;

  return (
    <QuizClient
      initialLessonId={lesson.id}
      initialLessonChallenges={lesson.challenges}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      userSubscription={initialUserSubscription}
    />
  );
};
