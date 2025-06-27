"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserProgress } from "@/components/user-progress";
import { useGuestUser } from "@/hooks/use-guest-user";

type Props = {
  initialUserProgress: any;
  initialUserSubscription: any;
  initialLeaderboard: any[];
};

export const LeaderboardClient = ({
  initialUserProgress,
  initialUserSubscription,
  initialLeaderboard,
}: Props) => {
  const { user, isLoaded: userLoaded } = useUser();
  const { guestUser, isLoaded: guestLoaded } = useGuestUser();
  const router = useRouter();

  const [userProgress, setUserProgress] = useState(initialUserProgress);
  const [userSubscription] = useState(initialUserSubscription);
  const [leaderboard] = useState(initialLeaderboard);

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
        <Quests points={userProgress.points} />
      </StickyWrapper>

      <FeedWrapper>
        <div className="flex w-full flex-col items-center">
          <Image
            src="/leaderboard.svg"
            alt="Leaderboard"
            height={90}
            width={90}
          />

          <h1 className="my-6 text-center text-2xl font-bold text-neutral-800">
            Leaderboard
          </h1>

          <p className="mb-6 text-center text-lg text-muted-foreground">
            See where you stand among other learners in the community.
          </p>

          <Separator className="mb-4 h-0.5 rounded-full" />

          {/* Show notice for guest users */}
          {!user && guestUser && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Guest Mode:</strong> Your progress won't be saved to the leaderboard. 
                Sign up to compete with other learners!
              </p>
            </div>
          )}

          {leaderboard.map((userProgress: any, index: number) => (
            <div
              key={userProgress.userId}
              className="flex w-full items-center rounded-xl p-2 px-4 hover:bg-gray-200/50 dark:hover:bg-gray-800/50"
            >
              <p className="mr-4 font-bold text-lime-700">{index + 1}</p>

              <Avatar className="ml-3 mr-6 h-12 w-12 border bg-green-500">
                <AvatarImage
                  className="object-cover"
                  src={userProgress.userImageSrc}
                />
              </Avatar>

              <p className="flex-1 font-bold text-neutral-800">
                {userProgress.userName}
              </p>

              <p className="text-muted-foreground">{userProgress.points} XP</p>
            </div>
          ))}
        </div>
      </FeedWrapper>
    </div>
  );
};
