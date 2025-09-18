import type { CourseDefinition } from "../types";

export const andragogyCourse: CourseDefinition = {
  title: "Andragogy",
  imageSrc: "/ag.png",
  units: [
    {
      order: 1,
      title: "Unit 1: Core Principles",
      description: "Understanding the adult learner.",
      lessons: [
        {
          order: 1,
          title: "Knowles' Assumptions",
          challenges: [
            {
              order: 1,
              type: "SELECT",
              question: "Which is a key assumption of Andragogy?",
              options: [
                { correct: true, text: "Adults are self-directed" },
                { correct: false, text: "Adults prefer rote memorization" },
                {
                  correct: false,
                  text: "Adults are motivated primarily by external rewards",
                },
              ],
            },
            {
              order: 2,
              type: "SELECT",
              question: "Who is considered the father of Andragogy?",
              options: [
                { correct: true, text: "Malcolm Knowles" },
                { correct: false, text: "John Dewey" },
                { correct: false, text: "Paulo Freire" },
              ],
            },
            {
              order: 3,
              type: "SELECT",
              question: "What does 'andragogy' literally mean?",
              options: [
                { correct: true, text: "Man-leading" },
                { correct: false, text: "Adult-teaching" },
                { correct: false, text: "Self-learning" },
              ],
            },
          ],
        },
      ],
    },
    {
      order: 2,
      title: "Unit 2: Learner's Experience",
      description: "The role of experience in learning.",
      lessons: [
        {
          order: 1,
          title: "Leveraging Experience",
          challenges: [
            {
              order: 1,
              type: "SELECT",
              question: "How should an instructor use the experience of adult learners?",
              options: [
                { correct: true, text: "As a rich resource for learning" },
                { correct: false, text: "As something to be ignored" },
                { correct: false, text: "As a barrier to new knowledge" },
              ],
            },
            {
              order: 2,
              type: "SELECT",
              question: "What can be a barrier when adults have extensive experience?",
              options: [
                { correct: true, text: "Resistance to new ideas" },
                { correct: false, text: "Lack of motivation" },
                { correct: false, text: "Poor memory retention" },
              ],
            },
            {
              order: 3,
              type: "SELECT",
              question: "Which teaching method best utilizes adult experience?",
              options: [
                { correct: true, text: "Case studies and problem-solving" },
                { correct: false, text: "Lectures and note-taking" },
                { correct: false, text: "Memorization and repetition" },
              ],
            },
          ],
        },
      ],
    },
    {
      order: 3,
      title: "Unit 3: Motivation to Learn",
      description: "What drives adult learners.",
      lessons: [
        {
          order: 1,
          title: "Internal vs. External Motivation",
          challenges: [
            {
              order: 1,
              type: "SELECT",
              question: "Which is an example of internal motivation for an adult learner?",
              options: [
                {
                  correct: true,
                  text: "A desire for increased job satisfaction",
                },
                { correct: false, text: "A requirement from their employer" },
                { correct: false, text: "A potential salary increase" },
              ],
            },
            {
              order: 2,
              type: "SELECT",
              question: "What typically motivates adults more than children?",
              options: [
                { correct: true, text: "Internal motivation" },
                { correct: false, text: "External rewards" },
                { correct: false, text: "Peer pressure" },
              ],
            },
            {
              order: 3,
              type: "SELECT",
              question: "When are adults most ready to learn?",
              options: [
                {
                  correct: true,
                  text: "When they need to solve a real-life problem",
                },
                { correct: false, text: "When they have free time" },
                {
                  correct: false,
                  text: "When they are required to attend training",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
