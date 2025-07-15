"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { MAX_HEARTS, POINTS_TO_REFILL } from "@/constants";
import db from "@/db/drizzle";
import {
  getCourseById,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";

// New action for guest users to select a course
export const selectCourseAsGuest = async (courseId: number) => {
  // This will be handled on the client side using guest user utilities
  // Just validate that the course exists
  const course = await getCourseById(courseId);
  
  if (!course) throw new Error("Course not found.");
  
  if (!course.units.length || !course.units[0].lessons.length)
    throw new Error("Course is empty.");
    
  return { success: true, courseId };
};

export const upsertUserProgress = async (courseId: number) => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) throw new Error("Unauthorized.");

  const course = await getCourseById(courseId);

  if (!course) throw new Error("Course not found.");

  if (!course.units.length || !course.units[0].lessons.length)
    throw new Error("Course is empty.");

  const existingUserProgress = await getUserProgress();

  if (existingUserProgress) {
    await db
      .update(userProgress)
      .set({
        activeCourseId: courseId,
        userName: user.firstName || "User",
        userImageSrc: user.imageUrl || "/mascotnew.svg",
      })
      .where(eq(userProgress.userId, userId));

    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
  }

  await db.insert(userProgress).values({
    userId,
    activeCourseId: courseId,
    userName: user.firstName || "User",
    userImageSrc: user.imageUrl || "/mascotnew.svg",
  });

  revalidatePath("/courses");
  revalidatePath("/learn");
  redirect("/learn");
};

export const reduceHearts = async (challengeId: number) => {
  const { userId } = await auth();
  const currentUserProgress = await getUserProgress();

  if (!currentUserProgress) throw new Error("User progress not found.");

  // Handle guest users
  if (!userId && "isGuest" in currentUserProgress) {
    // For guest users, hearts reduction is handled client-side
    // We can't persist this in the database, so return client state
    const newHearts = Math.max(0, currentUserProgress.hearts - 1);
    
    if (newHearts === 0) {
      return { error: "hearts", hearts: newHearts };
    }
    
    return { hearts: newHearts };
  }

  // Handle authenticated users
  if (!userId) throw new Error("Unauthorized.");

  const userSubscription = await getUserSubscription();

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
  });

  if (!challenge) throw new Error("Challenge not found.");

  const lessonId = challenge.lessonId;

  const existingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.userId, userId),
      eq(challengeProgress.challengeId, challengeId)
    ),
  });

  const isPractice = !!existingChallengeProgress;

  if (isPractice) return { error: "practice" };

  if (!currentUserProgress) throw new Error("User progress not found.");

  if (userSubscription?.isActive) return { error: "subscription" };

  if (currentUserProgress.hearts === 0) return { error: "hearts" };

  const newHeartCount = Math.max(currentUserProgress.hearts - 1, 0);

  await db
    .update(userProgress)
    .set({
      hearts: newHeartCount,
    })
    .where(eq(userProgress.userId, userId));

  // If hearts become 0 after this reduction, return hearts error
  if (newHeartCount === 0) {
    revalidatePath("/shop");
    revalidatePath("/learn");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);
    return { error: "hearts", hearts: newHeartCount };
  }

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath(`/lesson/${lessonId}`);
  
  return { hearts: newHeartCount };
};

export const refillHearts = async () => {
  const { userId } = await auth();
  const currentUserProgress = await getUserProgress();

  if (!currentUserProgress) throw new Error("User progress not found.");
  if (currentUserProgress.hearts === MAX_HEARTS)
    throw new Error("Hearts are already full.");

  // Handle guest users
  if (!userId && "isGuest" in currentUserProgress) {
    if (currentUserProgress.points < POINTS_TO_REFILL)
      throw new Error("Not enough points.");
    
    // For guest users, this will be handled client-side
    return { success: true };
  }

  // Handle authenticated users
  if (!userId) throw new Error("Unauthorized.");
  if (currentUserProgress.points < POINTS_TO_REFILL)
    throw new Error("Not enough points.");

  await db
    .update(userProgress)
    .set({
      hearts: MAX_HEARTS,
      points: currentUserProgress.points - POINTS_TO_REFILL,
    })
    .where(eq(userProgress.userId, userId));

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
};

export const refillHeartsFromVideo = async () => {
  const { userId } = await auth();
  const currentUserProgress = await getUserProgress();

  if (!currentUserProgress) throw new Error("User progress not found.");
  if (currentUserProgress.hearts === MAX_HEARTS)
    throw new Error("Hearts are already full.");

  // Handle guest users
  if (!userId && "isGuest" in currentUserProgress) {
    // For guest users, this will be handled client-side
    return { success: true };
  }

  // Handle authenticated users
  if (!userId) throw new Error("Unauthorized.");

  await db
    .update(userProgress)
    .set({
      hearts: MAX_HEARTS,
    })
    .where(eq(userProgress.userId, userId));

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath("/lesson");
  revalidatePath("/lesson/[lessonId]", "page");
};
