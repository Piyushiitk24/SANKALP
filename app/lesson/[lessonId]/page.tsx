import { getLesson, getUserProgress, getUserSubscription } from "@/db/queries";

import { LessonPageClient } from "../page-client";

type LessonIdPageProps = {
  params: {
    lessonId: number;
  };
};

const LessonIdPage = async ({ params }: LessonIdPageProps) => {
  const lessonData = getLesson(params.lessonId);
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
      lessonId={params.lessonId}
    />
  );
};

export default LessonIdPage;
