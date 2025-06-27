// Common types used across the application

export type Course = {
  id: number;
  title: string;
  imageSrc: string;
};

export type Challenge = {
  id: number;
  type: "SELECT" | "ASSIST";
  order: number;
  lessonId: number;
  question: string;
  challengeOptions?: ChallengeOption[];
  completed?: boolean;
};

export type ChallengeOption = {
  id: number;
  challengeId: number;
  text: string;
  correct: boolean;
  imageSrc?: string;
  audioSrc?: string;
};

export type Lesson = {
  id: number;
  title: string;
  unitId: number;
  order: number;
  challenges: Challenge[];
  completed?: boolean;
};

export type Unit = {
  id: number;
  title: string;
  description: string;
  courseId: number;
  order: number;
  lessons: Lesson[];
};

export type UserProgress = {
  id: number;
  userId: string;
  userName: string;
  userImageSrc: string;
  activeCourseId: number | null;
  activeCourse: Course | null;
  hearts: number;
  points: number;
  hasActiveSubscription?: boolean;
  isActive?: boolean;
};

export type CourseProgress = {
  courseId: number;
  units: Unit[];
};

export type LessonPercentage = {
  lessonId: number;
  percentage: number;
};

export type UserSubscription = {
  id: number;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  stripeCurrentPeriodEnd: Date;
} | null;

export type LeaderboardEntry = {
  userId: string;
  userName: string;
  userImageSrc: string;
  points: number;
};
