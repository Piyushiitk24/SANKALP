import type { CourseDefinition } from "../types";

export const learningTheoriesCourse: CourseDefinition = {
  title: "Learning Theories",
  imageSrc: "/lt.png",
  units: [
    {
      order: 1,
      title: "Unit 1: Behaviorism",
      description: "Learning as a response to stimuli.",
      lessons: [
        {
          order: 1,
          title: "Classical & Operant Conditioning",
          challenges: [
            {
              order: 1,
              type: "SELECT",
              question: "Who is most associated with operant conditioning?",
              options: [
                { correct: true, text: "B.F. Skinner" },
                { correct: false, text: "Ivan Pavlov" },
                { correct: false, text: "John Watson" },
              ],
            },
            {
              order: 2,
              type: "SELECT",
              question: "What is positive reinforcement?",
              options: [
                {
                  correct: true,
                  text: "Adding something pleasant to increase behavior",
                },
                {
                  correct: false,
                  text: "Removing something unpleasant to decrease behavior",
                },
                {
                  correct: false,
                  text: "Adding something unpleasant to decrease behavior",
                },
              ],
            },
            {
              order: 3,
              type: "SELECT",
              question: "Who conducted the famous 'Little Albert' experiment?",
              options: [
                { correct: true, text: "John Watson" },
                { correct: false, text: "B.F. Skinner" },
                { correct: false, text: "Ivan Pavlov" },
              ],
            },
          ],
        },
      ],
    },
    {
      order: 2,
      title: "Unit 2: Cognitivism",
      description: "The mind as an information processor.",
      lessons: [
        {
          order: 1,
          title: "Information Processing Model",
          challenges: [
            {
              order: 1,
              type: "SELECT",
              question: "What is 'chunking' in cognitive psychology?",
              options: [
                {
                  correct: true,
                  text: "Grouping information into meaningful units",
                },
                { correct: false, text: "Forgetting information over time" },
                { correct: false, text: "A method of reinforcement" },
              ],
            },
            {
              order: 2,
              type: "SELECT",
              question: "Which component of memory has unlimited capacity?",
              options: [
                { correct: true, text: "Long-term memory" },
                { correct: false, text: "Short-term memory" },
                { correct: false, text: "Sensory memory" },
              ],
            },
            {
              order: 3,
              type: "SELECT",
              question: "What is the duration of short-term memory?",
              options: [
                { correct: true, text: "15-30 seconds" },
                { correct: false, text: "1-2 minutes" },
                { correct: false, text: "5-10 minutes" },
              ],
            },
          ],
        },
      ],
    },
    {
      order: 3,
      title: "Unit 3: Constructivism",
      description: "Learners constructing knowledge.",
      lessons: [
        {
          order: 1,
          title: "Piaget's Stages",
          challenges: [
            {
              order: 1,
              type: "SELECT",
              question: "In which stage does abstract thought typically develop?",
              options: [
                { correct: true, text: "Formal Operational" },
                { correct: false, text: "Sensorimotor" },
                { correct: false, text: "Concrete Operational" },
              ],
            },
            {
              order: 2,
              type: "SELECT",
              question: "What is 'scaffolding' in Vygotsky's theory?",
              options: [
                {
                  correct: true,
                  text: "Temporary support to help learners achieve goals",
                },
                {
                  correct: false,
                  text: "A type of reinforcement schedule",
                },
                {
                  correct: false,
                  text: "The process of forgetting information",
                },
              ],
            },
            {
              order: 3,
              type: "SELECT",
              question: "At what age does the preoperational stage typically begin?",
              options: [
                { correct: true, text: "2 years old" },
                { correct: false, text: "4 years old" },
                { correct: false, text: "6 years old" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
