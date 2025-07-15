import { getLesson, getUserProgress, getUserSubscription } from "@/db/queries";

import { LessonPageClient } from "../page-client";

type LessonIdPageProps = {
  params: Promise<{
    lessonId: string;
  }>;
};

const LessonIdPage = async ({ params }: LessonIdPageProps) => {
  const { lessonId } = await params;
  const lessonIdNumber = parseInt(lessonId);
  
  const lessonData = getLesson(lessonIdNumber);
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [lesson, userProgress, userSubscription] = await Promise.all([
    lessonData,
    userProgressData,
    userSubscriptionData,
  ]);

  return (
    <LessonPageClient
      initialLesson={lesson}
      initialUserProgress={userProgress}
      initialUserSubscription={userSubscription}
      lessonId={lessonIdNumber}
    />
  );
};

export default LessonIdPage;
