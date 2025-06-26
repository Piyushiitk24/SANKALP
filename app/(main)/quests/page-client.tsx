"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Progress } from "@/components/ui/progress";
import { UserProgress } from "@/components/user-progress";
import { QUESTS } from "@/constants";
import { useGuestUser } from "@/hooks/use-guest-user";

type Props = {
  initialUserProgress: any;
  initialUserSubscription: any;
};

export const QuestsClient = ({
  initialUserProgress,
  initialUserSubscription,
}: Props) => {
  const { user, isLoaded: userLoaded } = useUser();
  const { guestUser, isLoaded: guestLoaded } = useGuestUser();
  const router = useRouter();

  const [userProgress, setUserProgress] = useState(initialUserProgress);
  const [userSubscription] = useState(initialUserSubscription);

  useEffect(() => {
    if (!userLoaded || !guestLoaded) return;

    // If user is authenticated, use server data
    if (user) {
      if (!initialUserProgress || !initialUserProgress.activeCourse) {
        router.push("/courses");
        return;
      }
      return;
    }

    // Handle guest user
    if (guestUser && guestUser.activeCourseId) {
      // For guests, we need to get the course info
      fetch(`/api/public/courses`)
        .then(res => res.json())
        .then(data => {
          if (!data.success) {
            router.push("/courses");
            return;
          }

          const activeCourse = data.courses.find((c: any) => c.id === guestUser.activeCourseId);
          if (!activeCourse) {
            router.push("/courses");
            return;
          }

          setUserProgress({
            ...guestUser,
            activeCourse,
          });
        })
        .catch(() => {
          router.push("/courses");
        });
    } else {
      // No user progress, redirect to courses
      router.push("/courses");
    }
  }, [user, guestUser, userLoaded, guestLoaded, router, initialUserProgress]);

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
      </StickyWrapper>

      <FeedWrapper>
        <div className="flex w-full flex-col items-center">
          <Image
            src="/quests.svg"
            alt="Quests"
            height={90}
            width={90}
          />

          <h1 className="my-6 text-center text-2xl font-bold text-neutral-800">
            Quests
          </h1>

          <p className="mb-6 text-center text-lg text-muted-foreground">
            Complete quests by earning points.
          </p>

          <ul className="w-full">
            {QUESTS.map((quest) => {
              const progress = (userProgress.points / quest.value) * 100;

              return (
                <div
                  className="flex w-full items-center gap-x-4 border-t-2 p-4"
                  key={quest.title}
                >
                  <Image src="/points.svg" alt="Points" width={60} height={60} />

                  <div className="flex w-full flex-col gap-y-2">
                    <p className="text-xl font-bold text-neutral-700">
                      {quest.title}
                    </p>

                    <Progress value={progress} className="h-3" />
                  </div>
                </div>
              );
            })}
          </ul>
        </div>
      </FeedWrapper>
    </div>
  );
};
