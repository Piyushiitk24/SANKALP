import { bloomsTaxonomyCourse } from "./blooms-taxonomy";
import { learningTheoriesCourse } from "./learning-theories";
import { andragogyCourse } from "./andragogy";
import { satCourse } from "./systematic-approach-to-training";
import { domainsOfLearningCourse } from "./domains-of-learning";
import { semaphoreCourse } from "./semaphore";
import { flashingCourse } from "./flashing-morse-code";

export {
  bloomsTaxonomyCourse,
  learningTheoriesCourse,
  andragogyCourse,
  satCourse,
  domainsOfLearningCourse,
  semaphoreCourse,
  flashingCourse,
};

export const allCourses = [
  bloomsTaxonomyCourse,
  learningTheoriesCourse,
  andragogyCourse,
  satCourse,
  domainsOfLearningCourse,
  semaphoreCourse,
  flashingCourse,
];

export type {
  CourseDefinition,
  UnitDefinition,
  LessonDefinition,
  ChallengeDefinition,
  ChallengeOptionDefinition,
} from "./types";
