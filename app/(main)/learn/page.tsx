import { redirect } from "next/navigation";

import { getCourses } from "@/db/queries";
import {
  getCourseProgress,
  getLessonPercentage,
  getUnits,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";

import { LearnPageClient } from "./page-client";

const LearnPage = async () => {
  const userProgressData = getUserProgress();
  const courseProgressData = getCourseProgress();
  const lessonPercentageData = getLessonPercentage();
  const unitsData = getUnits();
  const userSubscriptionData = getUserSubscription();
  const coursesData = getCourses();

  const [
    userProgress,
    units,
    courseProgress,
    lessonPercentage,
    userSubscription,
    courses,
  ] = await Promise.all([
    userProgressData,
    unitsData,
    courseProgressData,
    lessonPercentageData,
    userSubscriptionData,
    coursesData,
  ]);

  return (
    <LearnPageClient
      userProgress={userProgress}
      units={units}
      courseProgress={courseProgress}
      lessonPercentage={lessonPercentage}
      userSubscription={userSubscription}
      courses={courses}
    />
  );
};

export default LearnPage;
