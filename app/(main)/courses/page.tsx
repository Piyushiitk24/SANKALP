import { getCourses, getUserProgress } from "@/db/queries";

import { CoursesClient } from "./page-client";

const CoursesPage = async () => {
  const coursesData = getCourses();
  const userProgressData = getUserProgress();

  const [courses, userProgress] = await Promise.all([
    coursesData,
    userProgressData,
  ]);

  return (
    <CoursesClient courses={courses} userProgress={userProgress || null} />
  );
};

export default CoursesPage;
