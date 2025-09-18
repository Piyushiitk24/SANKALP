import type { CourseDefinition } from "../types";

export const domainsOfLearningCourse: CourseDefinition = {
  title: "Domains of Learning",
  imageSrc: "/dl.png",
  units: [
    {
      order: 1,
      title: "Unit 1: The Cognitive Domain",
      description: "Thinking and intellectual skills.",
      lessons: [
        {
          order: 1,
          title: "Levels of Cognition",
          challenges: [
            {
              order: 1,
              type: "SELECT",
              question: "Designing a new product falls into which cognitive level?",
              options: [
                { correct: true, text: "Creating" },
                { correct: false, text: "Analyzing" },
                { correct: false, text: "Remembering" },
              ],
            },
            {
              order: 2,
              type: "SELECT",
              question: "How many levels are in the revised cognitive domain?",
              options: [
                { correct: true, text: "Six" },
                { correct: false, text: "Five" },
                { correct: false, text: "Seven" },
              ],
            },
            {
              order: 3,
              type: "SELECT",
              question: "Which is the foundation level of the cognitive domain?",
              options: [
                { correct: true, text: "Remembering" },
                { correct: false, text: "Understanding" },
                { correct: false, text: "Applying" },
              ],
            },
          ],
        },
      ],
    },
    {
      order: 2,
      title: "Unit 2: The Affective Domain",
      description: "Feelings, values, and attitudes.",
      lessons: [
        {
          order: 1,
          title: "Levels of Affect",
          challenges: [
            {
              order: 1,
              type: "SELECT",
              question:
                "Willingly participating in a group discussion shows which level of the affective domain?",
              options: [
                { correct: true, text: "Responding" },
                { correct: false, text: "Receiving" },
                { correct: false, text: "Valuing" },
              ],
            },
            {
              order: 2,
              type: "SELECT",
              question: "What is the highest level of the affective domain?",
              options: [
                { correct: true, text: "Characterization" },
                { correct: false, text: "Organization" },
                { correct: false, text: "Valuing" },
              ],
            },
            {
              order: 3,
              type: "SELECT",
              question: "Which level involves being aware of or attending to something?",
              options: [
                { correct: true, text: "Receiving" },
                { correct: false, text: "Responding" },
                { correct: false, text: "Valuing" },
              ],
            },
          ],
        },
      ],
    },
    {
      order: 3,
      title: "Unit 3: The Psychomotor Domain",
      description: "Physical skills and coordination.",
      lessons: [
        {
          order: 1,
          title: "Levels of Physical Skill",
          challenges: [
            {
              order: 1,
              type: "SELECT",
              question:
                "A pianist performing a complex piece from memory is at which psychomotor level?",
              options: [
                { correct: true, text: "Origination" },
                { correct: false, text: "Imitation" },
                { correct: false, text: "Precision" },
              ],
            },
            {
              order: 2,
              type: "SELECT",
              question: "What is the first level of the psychomotor domain?",
              options: [
                { correct: true, text: "Perception" },
                { correct: false, text: "Imitation" },
                { correct: false, text: "Set" },
              ],
            },
            {
              order: 3,
              type: "SELECT",
              question: "Which level involves creating new movement patterns?",
              options: [
                { correct: true, text: "Origination" },
                { correct: false, text: "Adaptation" },
                { correct: false, text: "Articulation" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
