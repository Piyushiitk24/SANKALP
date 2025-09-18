import type { CourseDefinition } from "../types";

export const flashingCourse: CourseDefinition = {
  title: "Flashing (Morse Code)",
  imageSrc: "/flashing.svg",
  units: [
    {
      order: 1,
      title: "Unit 1: Morse Basics",
      description: "Dots, dashes, spacing, and rhythm.",
      lessons: [
        {
          order: 1,
          title: "What is Morse?",
          challenges: [
            {
              order: 1,
              type: "SELECT",
              question: "A dot and a dash differ in:",
              options: [
                { correct: true, text: "Duration (dash is three units)" },
                { correct: false, text: "Pitch (dash is higher)" },
                { correct: false, text: "Brightness (dash is brighter)" },
              ],
            },
            {
              order: 2,
              type: "SELECT",
              question: "What separates letters in Morse?",
              options: [
                { correct: true, text: "Short silence (three units)" },
                { correct: false, text: "Long silence (seven units)" },
                { correct: false, text: "No silence required" },
              ],
            },
          ],
        },
        {
          order: 2,
          title: "Timing & Cadence",
          challenges: [
            {
              order: 3,
              type: "SELECT",
              question: "Which describes correct timing?",
              options: [
                { correct: true, text: "Dot=1, dash=3, intra-letter gap=1" },
                { correct: false, text: "Dot=3, dash=1, intra-letter gap=3" },
                { correct: false, text: "Dot=2, dash=2, intra-letter gap=2" },
              ],
            },
          ],
        },
      ],
    },
    {
      order: 2,
      title: "Unit 2: Letters & Numbers",
      description: "Common letter/number codes.",
      lessons: [
        {
          order: 1,
          title: "Common Letters",
          challenges: [
            {
              order: 1,
              type: "SELECT",
              question: "Which is 'E' in Morse?",
              options: [
                { correct: true, text: "." },
                { correct: false, text: "-" },
                { correct: false, text: "..." },
              ],
            },
            {
              order: 2,
              type: "SELECT",
              question: "Which is 'S' in Morse?",
              options: [
                { correct: true, text: "..." },
                { correct: false, text: "-.." },
                { correct: false, text: ".-." },
              ],
            },
          ],
        },
        {
          order: 2,
          title: "Numbers 0–9",
          challenges: [
            {
              order: 3,
              type: "SELECT",
              question: "Which is '0' in Morse?",
              options: [
                { correct: true, text: "-----" },
                { correct: false, text: ".----" },
                { correct: false, text: "----." },
              ],
            },
          ],
        },
      ],
    },
    {
      order: 3,
      title: "Unit 3: Prosigns & Practice",
      description: "CQ, SOS, and message flow.",
      lessons: [
        {
          order: 1,
          title: "Prosigns",
          challenges: [
            {
              order: 1,
              type: "SELECT",
              question: "SOS corresponds to:",
              options: [
                { correct: true, text: "... --- ..." },
                { correct: false, text: "--- ... ---" },
                { correct: false, text: ".-. ... .-." },
              ],
            },
            {
              order: 2,
              type: "SELECT",
              question: "'CQ' is used to:",
              options: [
                { correct: true, text: "Call any station" },
                { correct: false, text: "Cease transmission" },
                { correct: false, text: "Confirm quality" },
              ],
            },
          ],
        },
        {
          order: 2,
          title: "Practice Messages",
          challenges: [
            {
              order: 3,
              type: "SELECT",
              question: "Which is a good practice message?",
              options: [
                { correct: true, text: "TEST TEST" },
                { correct: false, text: "ZQX JKV" },
                { correct: false, text: "No spacing at all" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
