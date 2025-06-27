"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

import { FeedWrapper } from "@/components/feed-wrapper";
import { Quests } from "@/components/quests";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { useGuestUser } from "@/hooks/use-guest-user";

import { Items } from "./items";

type Props = {
  initialUserProgress: any;
  initialUserSubscription: any;
};

export const ShopClient = ({
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

        <Quests points={userProgress.points} />
      </StickyWrapper>

      <FeedWrapper>
        <div className="flex w-full flex-col items-center">
          <Image src="/shop.svg" alt="Shop" height={90} width={90} />

          <h1 className="my-6 text-center text-2xl font-bold text-neutral-800">
            Shop
          </h1>
          <p className="mb-6 text-center text-lg text-muted-foreground">
            Spend your points on cool stuff.
          </p>

          {/* Show notice for guest users */}
          {!user && guestUser && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Guest Mode:</strong> Your progress and purchases won't be saved. 
                Sign up to keep your items and progress!
              </p>
            </div>
          )}

          <Items
            hearts={userProgress.hearts}
            points={userProgress.points}
            hasActiveSubscription={isPro}
          />
        </div>
      </FeedWrapper>
    </div>
  );
};
