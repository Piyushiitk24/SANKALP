import { MAX_HEARTS } from "@/constants";
import { GuestUser, getGuestUser, updateGuestUser } from "@/lib/guest-user";

export type GuestChallengeProgress = {
  challengeId: number;
  completed: boolean;
  lessonId: number;
};

export type GuestLessonProgress = {
  lessonId: number;
  challengeProgress: GuestChallengeProgress[];
  completed: boolean;
};

const GUEST_PROGRESS_KEY = "sankalp_guest_progress";

export const getGuestProgress = () => {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = localStorage.getItem(GUEST_PROGRESS_KEY);
    if (!stored) return [];
    
    return JSON.parse(stored) as GuestLessonProgress[];
  } catch {
    return [];
  }
};

export const setGuestProgress = (progress: GuestLessonProgress[]) => {
  if (typeof window === "undefined") return;
  
  localStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(progress));
};

export const updateGuestChallengeProgress = (
  challengeId: number,
  lessonId: number,
  completed: boolean = true
): { success: boolean; hearts?: number; points?: number } => {
  const currentProgress = getGuestProgress() || [];
  const currentUser = getGuestUser();
  
  if (!currentUser) return { success: false };

  // Find or create lesson progress
  let lessonProgress = currentProgress.find(lp => lp.lessonId === lessonId);
  if (!lessonProgress) {
    lessonProgress = {
      lessonId,
      challengeProgress: [],
      completed: false,
    };
    currentProgress.push(lessonProgress);
  }

  // Find or create challenge progress
  let challengeProgress = lessonProgress.challengeProgress.find(cp => cp.challengeId === challengeId);
  if (!challengeProgress) {
    challengeProgress = {
      challengeId,
      completed: false,
      lessonId,
    };
    lessonProgress.challengeProgress.push(challengeProgress);
  }

  // Update challenge completion
  const wasAlreadyCompleted = challengeProgress.completed;
  challengeProgress.completed = completed;

  // Check if lesson is now completed
  lessonProgress.completed = lessonProgress.challengeProgress.every(cp => cp.completed);

  // Update points for new completions
  let pointsGained = 0;
  if (completed && !wasAlreadyCompleted) {
    pointsGained = 10;
  }

  // Update user progress
  const updatedUser = updateGuestUser({
    points: currentUser.points + pointsGained,
  });

  // Save progress
  setGuestProgress(currentProgress);

  return {
    success: true,
    hearts: updatedUser?.hearts,
    points: updatedUser?.points,
  };
};

export const reduceGuestHearts = (challengeId: number): { success: boolean; hearts: number; error?: string } => {
  const currentUser = getGuestUser();
  
  if (!currentUser) return { success: false, hearts: 0, error: "No guest user found" };

  const newHearts = Math.max(0, currentUser.hearts - 1);
  
  const updatedUser = updateGuestUser({
    hearts: newHearts,
  });

  if (newHearts === 0) {
    return { success: true, hearts: newHearts, error: "hearts" };
  }

  return { success: true, hearts: newHearts };
};

export const refillGuestHearts = (): { success: boolean; hearts?: number } => {
  const currentUser = getGuestUser();
  
  if (!currentUser) return { success: false };
  if (currentUser.hearts === MAX_HEARTS) return { success: false };

  const updatedUser = updateGuestUser({
    hearts: MAX_HEARTS,
  });

  return { success: true, hearts: updatedUser?.hearts };
};

export const getGuestLessonProgress = (lessonId: number): GuestLessonProgress | null => {
  const progress = getGuestProgress();
  if (!progress) return null;
  
  return progress.find(lp => lp.lessonId === lessonId) || null;
};

export const clearGuestProgress = () => {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem(GUEST_PROGRESS_KEY);
};
