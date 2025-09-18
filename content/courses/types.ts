export type ChallengeOptionDefinition = {
  text: string;
  correct: boolean;
  imageSrc?: string | null;
  audioSrc?: string | null;
};

export type ChallengeDefinition = {
  order: number;
  type?: "SELECT" | "ASSIST";
  question: string;
  options: ChallengeOptionDefinition[];
};

export type LessonDefinition = {
  order: number;
  title: string;
  description?: string;
  challenges: ChallengeDefinition[];
};

export type UnitDefinition = {
  order: number;
  title: string;
  description: string;
  lessons: LessonDefinition[];
};

export type CourseDefinition = {
  title: string;
  imageSrc: string;
  units: UnitDefinition[];
};
