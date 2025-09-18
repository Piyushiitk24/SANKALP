import type { CourseDefinition } from "../types";

export const satCourse: CourseDefinition = {
  title: "Systematic Approach to Training (SAT)",
  imageSrc: "/st.png",
  units: [
    {
      order: 1,
      title: "Unit 1: The ADDIE Model",
      description: "The core framework of SAT.",
      lessons: [
        {
          order: 1,
          title: "Overview of ADDIE",
          challenges: [
            {
              order: 1,
              type: "SELECT",
              question: "What does the 'D' in ADDIE stand for?",
              options: [
                { correct: true, text: "Design" },
                { correct: false, text: "Develop" },
                { correct: false, text: "Deploy" },
              ],
            },
            {
              order: 2,
              type: "SELECT",
              question: "Which phase comes before 'Implementation' in ADDIE?",
              options: [
                { correct: true, text: "Development" },
                { correct: false, text: "Analysis" },
                { correct: false, text: "Evaluation" },
              ],
            },
            {
              order: 3,
              type: "SELECT",
              question: "What is the main characteristic of the ADDIE model?",
              options: [
                { correct: true, text: "It's systematic and iterative" },
                { correct: false, text: "It's only used for online training" },
                { correct: false, text: "It's primarily for children" },
              ],
            },
          ],
        },
      ],
    },
    {
      order: 2,
      title: "Unit 2: Needs Analysis",
      description: "The 'Analysis' phase.",
      lessons: [
        {
          order: 1,
          title: "Identifying Training Gaps",
          challenges: [
            {
              order: 1,
              type: "SELECT",
              question: "What is the primary goal of a needs analysis?",
              options: [
                {
                  correct: true,
                  text: "To determine if training is the right solution",
                },
                { correct: false, text: "To design the training materials" },
                { correct: false, text: "To implement the training program" },
              ],
            },
            {
              order: 2,
              type: "SELECT",
              question: "Which is NOT a type of needs analysis?",
              options: [
                { correct: true, text: "Budget analysis" },
                { correct: false, text: "Organizational analysis" },
                { correct: false, text: "Task analysis" },
              ],
            },
            {
              order: 3,
              type: "SELECT",
              question: "What should you do if the needs analysis reveals no performance gap?",
              options: [
                { correct: true, text: "Do not proceed with training" },
                { correct: false, text: "Design training anyway" },
                { correct: false, text: "Skip to the evaluation phase" },
              ],
            },
          ],
        },
      ],
    },
    {
      order: 3,
      title: "Unit 3: Evaluation",
      description: "The 'Evaluation' phase.",
      lessons: [
        {
          order: 1,
          title: "Kirkpatrick's Four Levels",
          challenges: [
            {
              order: 1,
              type: "SELECT",
              question: "Which level of Kirkpatrick's model measures the impact on the business?",
              options: [
                { correct: true, text: "Level 4: Results" },
                { correct: false, text: "Level 1: Reaction" },
                { correct: false, text: "Level 2: Learning" },
              ],
            },
            {
              order: 2,
              type: "SELECT",
              question: "What does Level 2 (Learning) evaluate?",
              options: [
                { correct: true, text: "Knowledge and skills acquired" },
                { correct: false, text: "Participant satisfaction" },
                { correct: false, text: "Business impact" },
              ],
            },
            {
              order: 3,
              type: "SELECT",
              question: "Which level is the most difficult to measure?",
              options: [
                { correct: true, text: "Level 4: Results" },
                { correct: false, text: "Level 1: Reaction" },
                { correct: false, text: "Level 3: Behavior" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
