import { getLesson, getUserProgress, getUserSubscription } from "@/db/queries";

import { LessonPageClient } from "./page-client";

const LessonPage = async () => {
  const lessonData = getLesson();
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
    />
  );
};

export default LessonPage;
