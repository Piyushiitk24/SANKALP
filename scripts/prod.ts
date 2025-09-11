import { neon } from "@neondatabase/serverless";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";

// Prefer .env.local if present to match Next.js dev server behavior
(() => {
  try {
    const cwd = process.cwd();
    const envLocal = path.join(cwd, ".env.local");
    const env = path.join(cwd, ".env");
    if (fs.existsSync(envLocal)) {
      dotenv.config({ path: envLocal });
      // eslint-disable-next-line no-console
      console.log("Loaded environment from .env.local");
    } else if (fs.existsSync(env)) {
      dotenv.config({ path: env });
      // eslint-disable-next-line no-console
      console.log("Loaded environment from .env");
    } else {
      dotenv.config();
      // eslint-disable-next-line no-console
      console.log("Loaded environment from process only (no .env files found)");
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Warning: failed to initialize environment:", e);
  }
})();

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql, { schema });

const main = async () => {
  try {
    // Safe hint about which DB host we're seeding (avoid leaking secrets)
    try {
      const url = new URL(process.env.DATABASE_URL || "");
      console.log(`Seeding database on host: ${url.hostname}`);
    } catch {
      console.log("Seeding database (DATABASE_URL host unavailable)");
    }

    // Delete all existing data
    await Promise.all([
      db.delete(schema.userProgress),
      db.delete(schema.challenges),
      db.delete(schema.units),
      db.delete(schema.lessons),
      db.delete(schema.courses),
      db.delete(schema.challengeOptions),
      db.delete(schema.userSubscription),
    ]);

    // Insert courses
    const courses = await db
      .insert(schema.courses)
      .values([
        { title: "Bloom's Taxonomy", imageSrc: "/bt.png" },
        { title: "Learning Theories", imageSrc: "/lt.png" },
        { title: "Andragogy", imageSrc: "/ag.png" },
        { title: "Systematic Approach to Training (SAT)", imageSrc: "/st.png" },
        { title: "Domains of Learning", imageSrc: "/dl.png" },
        { title: "Semaphore", imageSrc: "/semaphore.svg" },
        { title: "Flashing (Morse Code)", imageSrc: "/flashing.svg" },
      ])
      .returning();

    // For each course, insert units
    for (const course of courses) {
      if (course.title === "Bloom's Taxonomy") {
        const units = await db.insert(schema.units).values([
          {
            courseId: course.id,
            title: "Unit 1: The Basics of Bloom's Taxonomy",
            description: "Learn the fundamentals of Bloom's Taxonomy",
            order: 1,
          },
          {
            courseId: course.id,
            title: "Unit 2: The Lower-Order Thinking Skills (LOTS)",
            description: "Focus on the foundational cognitive skills",
            order: 2,
          },
          {
            courseId: course.id,
            title: "Unit 3: The Higher-Order Thinking Skills (HOTS)",
            description: "Explore the more advanced cognitive skills",
            order: 3,
          },
          {
            courseId: course.id,
            title: "Unit 4: Applying Bloom's Taxonomy in the Classroom",
            description: "Learn to apply the taxonomy in a practical setting",
            order: 4,
          },
        ]).returning();

        for (const unit of units) {
          // Unit 1
          if (unit.order === 1) {
            const lessons = await db.insert(schema.lessons).values([
              { unitId: unit.id, title: "Introduction to Bloom's Taxonomy", order: 1 },
              { unitId: unit.id, title: "The Original vs. Revised Taxonomy", order: 2 },
              { unitId: unit.id, title: "The Cognitive Domain", order: 3 },
              { unitId: unit.id, title: "The Affective and Psychomotor Domains", order: 4 },
            ]).returning();

            // Lesson 1
            let challenges = await db.insert(schema.challenges).values([
              {
                lessonId: lessons[0].id,
                type: "SELECT",
                question: "What is the primary purpose of Bloom's Taxonomy in education?",
                order: 1,
              },
              {
                lessonId: lessons[0].id,
                type: "SELECT",
                question: "Who led the team of educational psychologists that developed the taxonomy?",
                order: 2,
              },
              {
                lessonId: lessons[0].id,
                type: "SELECT",
                question: "Bloom's Taxonomy is a hierarchical model, which means:",
                order: 3,
              },
            ]).returning();
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[0].id, correct: false, text: "To rank students based on their intelligence." },
              { challengeId: challenges[0].id, correct: true, text: "To provide a framework for categorizing educational goals and objectives." },
              { challengeId: challenges[0].id, correct: false, text: "To dictate the curriculum for all subjects." },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[1].id, correct: true, text: "Benjamin Bloom" },
              { challengeId: challenges[1].id, correct: false, text: "B.F. Skinner" },
              { challengeId: challenges[1].id, correct: false, text: "Jean Piaget" },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[2].id, correct: true, text: "Each level builds upon the one before it." },
              { challengeId: challenges[2].id, correct: false, text: "All levels are of equal importance." },
              { challengeId: challenges[2].id, correct: false, text: "The levels are independent of each other." },
            ]);

            // Lesson 2
            challenges = await db.insert(schema.challenges).values([
              {
                lessonId: lessons[1].id,
                type: "SELECT",
                question: "In the revised version of Bloom's Taxonomy, which is the highest level of cognitive skill?",
                order: 1,
              },
              {
                lessonId: lessons[1].id,
                type: "SELECT",
                question: "What is the primary difference between the original and revised taxonomy?",
                order: 2,
              },
              {
                lessonId: lessons[1].id,
                type: "SELECT",
                question: "Which level was replaced by 'Creating' in the revised taxonomy?",
                order: 3,
              },
            ]).returning();
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[0].id, correct: false, text: "Evaluating" },
              { challengeId: challenges[0].id, correct: false, text: "Synthesizing" },
              { challengeId: challenges[0].id, correct: true, text: "Creating" },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[1].id, correct: true, text: "The revised version uses verbs instead of nouns for the levels." },
              { challengeId: challenges[1].id, correct: false, text: "The original version had more levels." },
              { challengeId: challenges[1].id, correct: false, text: "The revised version is only for digital learning." },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[2].id, correct: false, text: "Knowledge" },
              { challengeId: challenges[2].id, correct: true, text: "Synthesis" },
              { challengeId: challenges[2].id, correct: false, text: "Application" },
            ]);

            // Lesson 3
            challenges = await db.insert(schema.challenges).values([
              {
                lessonId: lessons[2].id,
                type: "SELECT",
                question: "The cognitive domain of Bloom's Taxonomy deals with:",
                order: 1,
              },
              {
                lessonId: lessons[2].id,
                type: "SELECT",
                question: "Which of these is a lower-order thinking skill in the cognitive domain?",
                order: 2,
              },
              {
                lessonId: lessons[2].id,
                type: "SELECT",
                question: "Which of these is a higher-order thinking skill in the cognitive domain?",
                order: 3,
              },
            ]).returning();
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[0].id, correct: false, text: "Emotional responses and attitudes." },
              { challengeId: challenges[0].id, correct: true, text: "Intellectual skills and knowledge acquisition." },
              { challengeId: challenges[0].id, correct: false, text: "Physical skills and motor abilities." },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[1].id, correct: true, text: "Remembering" },
              { challengeId: challenges[1].id, correct: false, text: "Analyzing" },
              { challengeId: challenges[1].id, correct: false, text: "Evaluating" },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[2].id, correct: false, text: "Understanding" },
              { challengeId: challenges[2].id, correct: false, text: "Applying" },
              { challengeId: challenges[2].id, correct: true, text: "Creating" },
            ]);

            // Lesson 4
            challenges = await db.insert(schema.challenges).values([
              {
                lessonId: lessons[3].id,
                type: "SELECT",
                question: "A teacher wants to assess a student's ability to show empathy. Which domain of Bloom's Taxonomy would this fall under?",
                order: 1,
              },
              {
                lessonId: lessons[3].id,
                type: "SELECT",
                question: "The psychomotor domain focuses on:",
                order: 2,
              },
              {
                lessonId: lessons[3].id,
                type: "SELECT",
                question: "Which activity primarily involves the affective domain?",
                order: 3,
              },
            ]).returning();
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[0].id, correct: false, text: "Cognitive" },
              { challengeId: challenges[0].id, correct: true, text: "Affective" },
              { challengeId: challenges[0].id, correct: false, text: "Psychomotor" },
            ]);
             await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[1].id, correct: true, text: "Physical skills and coordination" },
              { challengeId: challenges[1].id, correct: false, text: "Problem-solving and critical thinking" },
              { challengeId: challenges[1].id, correct: false, text: "Values and attitudes" },
            ]);
             await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[2].id, correct: false, text: "Solving a math problem" },
              { challengeId: challenges[2].id, correct: true, text: "Participating in a group discussion" },
              { challengeId: challenges[2].id, correct: false, text: "Writing a research paper" },
            ]);
          }

          // Unit 2
          if (unit.order === 2) {
            const lessons = await db.insert(schema.lessons).values([
              { unitId: unit.id, title: "Remembering", order: 1 },
              { unitId: unit.id, title: "Understanding", order: 2 },
              { unitId: unit.id, title: "Applying", order: 3 },
            ]).returning();

            // Lesson 1
            let challenges = await db.insert(schema.challenges).values([
              {
                lessonId: lessons[0].id,
                type: "SELECT",
                question: "Which of the following is an example of a \"Remembering\" level activity?",
                order: 1,
              },
               {
                lessonId: lessons[0].id,
                type: "SELECT",
                question: "Which verb is most associated with the 'Remembering' level?",
                order: 2,
              },
              {
                lessonId: lessons[0].id,
                type: "SELECT",
                question: "A student listing the capitals of European countries is operating at what level?",
                order: 3,
              },
            ]).returning();
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[0].id, correct: false, text: "Summarizing a story." },
              { challengeId: challenges[0].id, correct: true, text: "Recalling the dates of historical events." },
              { challengeId: challenges[0].id, correct: false, text: "Writing a new ending for a play." },
            ]);
             await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[1].id, correct: true, text: "List" },
              { challengeId: challenges[1].id, correct: false, text: "Explain" },
              { challengeId: challenges[1].id, correct: false, text: "Critique" },
            ]);
             await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[2].id, correct: true, text: "Remembering" },
              { challengeId: challenges[2].id, correct: false, text: "Understanding" },
              { challengeId: challenges[2].id, correct: false, text: "Applying" },
            ]);

            // Lesson 2
            challenges = await db.insert(schema.challenges).values([
              {
                lessonId: lessons[1].id,
                type: "SELECT",
                question: "A student who can explain a scientific concept in their own words is demonstrating which level of Bloom's Taxonomy?",
                order: 1,
              },
              {
                lessonId: lessons[1].id,
                type: "SELECT",
                question: "Which of the following is NOT an example of 'Understanding'?",
                order: 2,
              },
              {
                lessonId: lessons[1].id,
                type: "SELECT",
                question: "What is the key difference between 'Remembering' and 'Understanding'?",
                order: 3,
              },
            ]).returning();
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[0].id, correct: false, text: "Remembering" },
              { challengeId: challenges[0].id, correct: true, text: "Understanding" },
              { challengeId: challenges[0].id, correct: false, text: "Applying" },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[1].id, correct: false, text: "Paraphrasing a speech" },
              { challengeId: challenges[1].id, correct: true, text: "Reciting a poem from memory" },
              { challengeId: challenges[1].id, correct: false, text: "Giving examples of a concept" },
            ]);
             await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[2].id, correct: true, text: "Remembering is about recalling facts, while understanding is about explaining ideas." },
              { challengeId: challenges[2].id, correct: false, text: "Understanding involves creating something new, while remembering does not." },
              { challengeId: challenges[2].id, correct: false, text: "There is no difference between the two." },
            ]);

            // Lesson 3
            challenges = await db.insert(schema.challenges).values([
              {
                lessonId: lessons[2].id,
                type: "SELECT",
                question: "\"Use the formula for calculating the area of a circle to solve the following problems.\" This is an example of an instruction at which level?",
                order: 1,
              },
              {
                lessonId: lessons[2].id,
                type: "SELECT",
                question: "Which of the following activities best represents the 'Applying' level?",
                order: 2,
              },
              {
                lessonId: lessons[2].id,
                type: "SELECT",
                question: "What is a key requirement for a student to be at the 'Applying' level?",
                order: 3,
              },
            ]).returning();
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[0].id, correct: false, text: "Remembering" },
              { challengeId: challenges[0].id, correct: false, text: "Understanding" },
              { challengeId: challenges[0].id, correct: true, text: "Applying" },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[1].id, correct: false, text: "Listing the steps of a process." },
              { challengeId: challenges[1].id, correct: true, text: "Using a learned procedure in a new situation." },
              { challengeId: challenges[1].id, correct: false, text: "Explaining the theory behind a process." },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[2].id, correct: true, text: "The ability to use knowledge in a practical way." },
              { challengeId: challenges[2].id, correct: false, text: "The ability to memorize facts and figures." },
              { challengeId: challenges[2].id, correct: false, text: "The ability to form an opinion on a topic." },
            ]);
          }

          // Unit 3
          if (unit.order === 3) {
            const lessons = await db.insert(schema.lessons).values([
              { unitId: unit.id, title: "Analyzing", order: 1 },
              { unitId: unit.id, title: "Evaluating", order: 2 },
              { unitId: unit.id, title: "Creating", order: 3 },
            ]).returning();

            // Lesson 1
            let challenges = await db.insert(schema.challenges).values([
              {
                lessonId: lessons[0].id,
                type: "SELECT",
                question: "Which activity best represents the \"Analyzing\" level of Bloom's Taxonomy?",
                order: 1,
              },
               {
                lessonId: lessons[0].id,
                type: "SELECT",
                question: "What is the key difference between 'Analyzing' and 'Applying'?",
                order: 2,
              },
              {
                lessonId: lessons[0].id,
                type: "SELECT",
                question: "A student who can distinguish between fact and opinion in a text is operating at which level?",
                order: 3,
              },
            ]).returning();
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[0].id, correct: false, text: "Listing the main characters in a story." },
              { challengeId: challenges[0].id, correct: true, text: "Identifying the author's bias in a text." },
              { challengeId: challenges[0].id, correct: false, text: "Writing a summary of an article." },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[1].id, correct: true, text: "Analyzing involves breaking down information, while applying involves using it." },
              { challengeId: challenges[1].id, correct: false, text: "Applying is a higher-order skill than analyzing." },
              { challengeId: challenges[1].id, correct: false, text: "They are essentially the same skill." },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[2].id, correct: false, text: "Understanding" },
              { challengeId: challenges[2].id, correct: true, text: "Analyzing" },
              { challengeId: challenges[2].id, correct: false, text: "Evaluating" },
            ]);

            // Lesson 2
            challenges = await db.insert(schema.challenges).values([
              {
                lessonId: lessons[1].id,
                type: "SELECT",
                question: "When a student is asked to judge the credibility of a source, they are operating at which level?",
                order: 1,
              },
              {
                lessonId: lessons[1].id,
                type: "SELECT",
                question: "Which of the following is an example of an 'Evaluating' activity?",
                order: 2,
              },
              {
                lessonId: lessons[1].id,
                type: "SELECT",
                question: "What distinguishes 'Analyzing' from 'Evaluating'?",
                order: 3,
              },
            ]).returning();
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[0].id, correct: false, text: "Applying" },
              { challengeId: challenges[0].id, correct: false, text: "Analyzing" },
              { challengeId: challenges[0].id, correct: true, text: "Evaluating" },
            ]);
             await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[1].id, correct: true, text: "Critiquing a peer's essay" },
              { challengeId: challenges[1].id, correct: false, text: "Summarizing the main points of an article" },
              { challengeId: challenges[1].id, correct: false, text: "Creating a new story" },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[2].id, correct: true, text: "Analyzing involves breaking down information, while evaluating involves making judgments." },
              { challengeId: challenges[2].id, correct: false, text: "Evaluating is a lower-order skill than analyzing." },
              { challengeId: challenges[2].id, correct: false, text: "They are essentially the same skill." },
            ]);

            // Lesson 3
            challenges = await db.insert(schema.challenges).values([
              {
                lessonId: lessons[2].id,
                type: "SELECT",
                question: "Which of the following assignments requires students to use the \"Creating\" level of Bloom's Taxonomy?",
                order: 1,
              },
               {
                lessonId: lessons[2].id,
                type: "SELECT",
                question: "What is the highest level of cognitive skill in the revised Bloom's Taxonomy?",
                order: 2,
              },
               {
                lessonId: lessons[2].id,
                type: "SELECT",
                question: "Which verb is most associated with the 'Creating' level?",
                order: 3,
              },
            ]).returning();
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[0].id, correct: false, text: "Answering multiple-choice questions about a historical event." },
              { challengeId: challenges[0].id, correct: true, text: "Designing a new product to solve a real-world problem." },
              { challengeId: challenges[0].id, correct: false, text: "Following a set of instructions to build a model." },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[1].id, correct: true, text: "Creating" },
              { challengeId: challenges[1].id, correct: false, text: "Evaluating" },
              { challengeId: challenges[1].id, correct: false, text: "Analyzing" },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[2].id, correct: true, text: "Design" },
              { challengeId: challenges[2].id, correct: false, text: "Critique" },
              { challengeId: challenges[2].id, correct: false, text: "List" },
            ]);
          }

          // Unit 4
          if (unit.order === 4) {
            const lessons = await db.insert(schema.lessons).values([
              { unitId: unit.id, title: "Writing Learning Objectives", order: 1 },
              { unitId: unit.id, title: "Designing Assessments", order: 2 },
              { unitId: unit.id, title: "Differentiated Instruction", order: 3 },
            ]).returning();

            // Lesson 1
            let challenges = await db.insert(schema.challenges).values([
              {
                lessonId: lessons[0].id,
                type: "SELECT",
                question: "Which of the following is a well-written learning objective at the \"Applying\" level?",
                order: 1,
              },
              {
                lessonId: lessons[0].id,
                type: "SELECT",
                question: "Why is it important to use action verbs when writing learning objectives?",
                order: 2,
              },
              {
                lessonId: lessons[0].id,
                type: "SELECT",
                question: "A learning objective should be:",
                order: 3,
              },
            ]).returning();
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[0].id, correct: false, text: "Students will be able to list the steps of the scientific method." },
              { challengeId: challenges[0].id, correct: true, text: "Students will be able to use the scientific method to conduct a simple experiment." },
              { challengeId: challenges[0].id, correct: false, text: "Students will appreciate the scientific method." },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[1].id, correct: true, text: "They describe observable and measurable behaviors." },
              { challengeId: challenges[1].id, correct: false, text: "They make the objective sound more academic." },
              { challengeId: challenges[1].id, correct: false, text: "They are easier for students to understand." },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[2].id, correct: false, text: "Vague and open-ended." },
              { challengeId: challenges[2].id, correct: true, text: "Specific, measurable, achievable, relevant, and time-bound (SMART)." },
              { challengeId: challenges[2].id, correct: false, text: "Focused on teacher activities rather than student learning." },
            ]);

            // Lesson 2
            challenges = await db.insert(schema.challenges).values([
              {
                lessonId: lessons[1].id,
                type: "SELECT",
                question: "A teacher wants to create an assessment that targets higher-order thinking skills. Which of the following would be most appropriate?",
                order: 1,
              },
              {
                lessonId: lessons[1].id,
                type: "SELECT",
                question: "What is the purpose of formative assessment?",
                order: 2,
              },
              {
                lessonId: lessons[1].id,
                type: "SELECT",
                question: "What is a key principle of good assessment design?",
                order: 3,
              },
            ]).returning();
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[0].id, correct: false, text: "A true/false quiz." },
              { challengeId: challenges[0].id, correct: true, text: "A project that requires students to design and build a solution to a problem." },
              { challengeId: challenges[0].id, correct: false, text: "A matching exercise with vocabulary words and definitions." },
            ]);
             await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[1].id, correct: true, text: "To monitor student learning and provide feedback." },
              { challengeId: challenges[1].id, correct: false, text: "To grade students at the end of a unit." },
              { challengeId: challenges[1].id, correct: false, text: "To compare students to each other." },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[2].id, correct: false, text: "It should be as difficult as possible." },
              { challengeId: challenges[2].id, correct: true, text: "It should align with the learning objectives." },
              { challengeId: challenges[2].id, correct: false, text: "It should be a surprise to the students." },
            ]);

            // Lesson 3
            challenges = await db.insert(schema.challenges).values([
              {
                lessonId: lessons[2].id,
                type: "SELECT",
                question: "How can Bloom's Taxonomy be used to support differentiated instruction?",
                order: 1,
              },
              {
                lessonId: lessons[2].id,
                type: "SELECT",
                question: "Which of the following is an example of differentiating instruction based on student interest?",
                order: 2,
              },
              {
                lessonId: lessons[2].id,
                type: "SELECT",
                question: "What is the main goal of differentiated instruction?",
                order: 3,
              },
            ]).returning();
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[0].id, correct: false, text: "By giving all students the same task, regardless of their ability." },
              { challengeId: challenges[0].id, correct: true, text: "By creating a variety of tasks at different cognitive levels to meet the needs of all learners." },
              { challengeId: challenges[0].id, correct: false, text: "By focusing only on lower-order thinking skills." },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[1].id, correct: true, text: "Allowing students to choose their own research topic." },
              { challengeId: challenges[1].id, correct: false, text: "Giving all students the same homework assignment." },
              { challengeId: challenges[1].id, correct: false, text: "Using the same teaching method for all students." },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[2].id, correct: false, text: "To make sure all students get the same grade." },
              { challengeId: challenges[2].id, correct: true, text: "To meet the diverse needs of all learners." },
              { challengeId: challenges[2].id, correct: false, text: "To save time on lesson planning." },
            ]);
          }
        }
      }

      // Course 6: Semaphore
      if (course.title === "Semaphore") {
        const units = await db.insert(schema.units).values([
          { courseId: course.id, title: "Unit 1: Basics of Semaphore", description: "Understand flags, positions, and posture.", order: 1 },
          { courseId: course.id, title: "Unit 2: Encoding Letters", description: "Map positions to letters A–Z.", order: 2 },
          { courseId: course.id, title: "Unit 3: Numbers & Procedure", description: "Numbers, attention, and correction.", order: 3 },
        ]).returning();

        for (const unit of units) {
          if (unit.order === 1) {
            const lessons = await db.insert(schema.lessons).values([
              { unitId: unit.id, title: "What is Semaphore?", order: 1 },
              { unitId: unit.id, title: "Flag Positions & Safety", order: 2 },
            ]).returning();

            let challenges = await db.insert(schema.challenges).values([
              { lessonId: lessons[0].id, type: "SELECT", question: "Semaphore primarily uses which items for signaling?", order: 1 },
              { lessonId: lessons[0].id, type: "SELECT", question: "How many distinct flag positions represent the alphabet?", order: 2 },
              { lessonId: lessons[1].id, type: "SELECT", question: "Which is a key safety practice in semaphore messaging?", order: 3 },
            ]).returning();
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[0].id, correct: true, text: "Handheld flags" },
              { challengeId: challenges[0].id, correct: false, text: "Whistles" },
              { challengeId: challenges[0].id, correct: false, text: "Signal mirrors" },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[1].id, correct: true, text: "Eight principal positions" },
              { challengeId: challenges[1].id, correct: false, text: "Three positions" },
              { challengeId: challenges[1].id, correct: false, text: "Twenty positions" },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[2].id, correct: true, text: "Maintain clear line of sight with receiver" },
              { challengeId: challenges[2].id, correct: false, text: "Wave flags rapidly to increase visibility" },
              { challengeId: challenges[2].id, correct: false, text: "Use any color flags available" },
            ]);
          }

          if (unit.order === 2) {
            const lessons = await db.insert(schema.lessons).values([
              { unitId: unit.id, title: "Letters A–M", order: 1 },
              { unitId: unit.id, title: "Letters N–Z", order: 2 },
            ]).returning();

            let challenges = await db.insert(schema.challenges).values([
              { lessonId: lessons[0].id, type: "SELECT", question: "Which position represents the letter 'A'?", order: 1 },
              { lessonId: lessons[0].id, type: "SELECT", question: "Which letter uses flags at 12 and 3 o'clock?", order: 2 },
              { lessonId: lessons[1].id, type: "SELECT", question: "The letter 'Z' corresponds to which flag position?", order: 3 },
            ]).returning();
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[0].id, correct: true, text: "Right up, left down (approx. 12 & 6)" },
              { challengeId: challenges[0].id, correct: false, text: "Both horizontal (3 & 9)" },
              { challengeId: challenges[0].id, correct: false, text: "Both down (5 & 7)" },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[1].id, correct: true, text: "C" },
              { challengeId: challenges[1].id, correct: false, text: "F" },
              { challengeId: challenges[1].id, correct: false, text: "L" },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[2].id, correct: true, text: "Right 1 o'clock, left 7 o'clock" },
              { challengeId: challenges[2].id, correct: false, text: "Both up (12 & 12)" },
              { challengeId: challenges[2].id, correct: false, text: "Right 9, left 3" },
            ]);
          }

          if (unit.order === 3) {
            const lessons = await db.insert(schema.lessons).values([
              { unitId: unit.id, title: "Numbers", order: 1 },
              { unitId: unit.id, title: "Attention & Correction", order: 2 },
            ]).returning();

            let challenges = await db.insert(schema.challenges).values([
              { lessonId: lessons[0].id, type: "SELECT", question: "How are numbers commonly conveyed in semaphore?", order: 1 },
              { lessonId: lessons[1].id, type: "SELECT", question: "What gesture indicates 'Attention' before sending a message?", order: 2 },
              { lessonId: lessons[1].id, type: "SELECT", question: "How do you signal a correction?", order: 3 },
            ]).returning();
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[0].id, correct: true, text: "By using 'Numerals' indicator then letters" },
              { challengeId: challenges[0].id, correct: false, text: "Distinct flag colors" },
              { challengeId: challenges[0].id, correct: false, text: "Rapid double waves" },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[1].id, correct: true, text: "Hold flags crossed in front" },
              { challengeId: challenges[1].id, correct: false, text: "Wave both flags above head" },
              { challengeId: challenges[1].id, correct: false, text: "Hold one flag vertically" },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[2].id, correct: true, text: "Repeat last few characters then proceed" },
              { challengeId: challenges[2].id, correct: false, text: "Drop flags to the ground" },
              { challengeId: challenges[2].id, correct: false, text: "Spin in place with flags" },
            ]);
          }
        }
      }

      // Course 7: Flashing (Morse Code)
      if (course.title === "Flashing (Morse Code)") {
        const units = await db.insert(schema.units).values([
          { courseId: course.id, title: "Unit 1: Morse Basics", description: "Dots, dashes, spacing, and rhythm.", order: 1 },
          { courseId: course.id, title: "Unit 2: Letters & Numbers", description: "Common letter/number codes.", order: 2 },
          { courseId: course.id, title: "Unit 3: Prosigns & Practice", description: "CQ, SOS, and message flow.", order: 3 },
        ]).returning();

        for (const unit of units) {
          if (unit.order === 1) {
            const lessons = await db.insert(schema.lessons).values([
              { unitId: unit.id, title: "What is Morse?", order: 1 },
              { unitId: unit.id, title: "Timing & Cadence", order: 2 },
            ]).returning();

            let challenges = await db.insert(schema.challenges).values([
              { lessonId: lessons[0].id, type: "SELECT", question: "A dot and a dash differ in:", order: 1 },
              { lessonId: lessons[0].id, type: "SELECT", question: "What separates letters in Morse?", order: 2 },
              { lessonId: lessons[1].id, type: "SELECT", question: "Which describes correct timing?", order: 3 },
            ]).returning();
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[0].id, correct: true, text: "Duration (dash is three units)" },
              { challengeId: challenges[0].id, correct: false, text: "Pitch (dash is higher)" },
              { challengeId: challenges[0].id, correct: false, text: "Brightness (dash is brighter)" },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[1].id, correct: true, text: "Short silence (three units)" },
              { challengeId: challenges[1].id, correct: false, text: "Long silence (seven units)" },
              { challengeId: challenges[1].id, correct: false, text: "No silence required" },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[2].id, correct: true, text: "Dot=1, dash=3, intra-letter gap=1" },
              { challengeId: challenges[2].id, correct: false, text: "Dot=3, dash=1, intra-letter gap=3" },
              { challengeId: challenges[2].id, correct: false, text: "Dot=2, dash=2, intra-letter gap=2" },
            ]);
          }

          if (unit.order === 2) {
            const lessons = await db.insert(schema.lessons).values([
              { unitId: unit.id, title: "Common Letters", order: 1 },
              { unitId: unit.id, title: "Numbers 0–9", order: 2 },
            ]).returning();

            let challenges = await db.insert(schema.challenges).values([
              { lessonId: lessons[0].id, type: "SELECT", question: "Which is 'E' in Morse?", order: 1 },
              { lessonId: lessons[0].id, type: "SELECT", question: "Which is 'S' in Morse?", order: 2 },
              { lessonId: lessons[1].id, type: "SELECT", question: "Which is '0' in Morse?", order: 3 },
            ]).returning();
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[0].id, correct: true, text: "." },
              { challengeId: challenges[0].id, correct: false, text: "-" },
              { challengeId: challenges[0].id, correct: false, text: "..." },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[1].id, correct: true, text: "..." },
              { challengeId: challenges[1].id, correct: false, text: "-.." },
              { challengeId: challenges[1].id, correct: false, text: ".-." },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[2].id, correct: true, text: "-----" },
              { challengeId: challenges[2].id, correct: false, text: ".----" },
              { challengeId: challenges[2].id, correct: false, text: "----." },
            ]);
          }

          if (unit.order === 3) {
            const lessons = await db.insert(schema.lessons).values([
              { unitId: unit.id, title: "Prosigns", order: 1 },
              { unitId: unit.id, title: "Practice Messages", order: 2 },
            ]).returning();

            let challenges = await db.insert(schema.challenges).values([
              { lessonId: lessons[0].id, type: "SELECT", question: "SOS corresponds to:", order: 1 },
              { lessonId: lessons[0].id, type: "SELECT", question: "'CQ' is used to:", order: 2 },
              { lessonId: lessons[1].id, type: "SELECT", question: "Which is a good practice message?", order: 3 },
            ]).returning();
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[0].id, correct: true, text: "... --- ..." },
              { challengeId: challenges[0].id, correct: false, text: "--- ... ---" },
              { challengeId: challenges[0].id, correct: false, text: ".-. ... .-." },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[1].id, correct: true, text: "Call any station" },
              { challengeId: challenges[1].id, correct: false, text: "Cease transmission" },
              { challengeId: challenges[1].id, correct: false, text: "Confirm quality" },
            ]);
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenges[2].id, correct: true, text: "TEST TEST" },
              { challengeId: challenges[2].id, correct: false, text: "ZQX JKV" },
              { challengeId: challenges[2].id, correct: false, text: "No spacing at all" },
            ]);
          }
        }
      }

      // Course 2: Learning Theories
      if (course.title === "Learning Theories") {
        const theoriesUnits = await db.insert(schema.units).values([
          { courseId: course.id, title: "Unit 1: Behaviorism", description: "Learning as a response to stimuli.", order: 1 },
          { courseId: course.id, title: "Unit 2: Cognitivism", description: "The mind as an information processor.", order: 2 },
          { courseId: course.id, title: "Unit 3: Constructivism", description: "Learners constructing knowledge.", order: 3 },
        ]).returning();

        for (const unit of theoriesUnits) {
          if (unit.order === 1) {
            const lesson = await db.insert(schema.lessons).values({ 
              unitId: unit.id, 
              title: "Classical & Operant Conditioning", 
              order: 1 
            }).returning();
            
            const challenges = await db.insert(schema.challenges).values([
              { lessonId: lesson[0].id, type: "SELECT", question: "Who is most associated with operant conditioning?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT", question: "What is positive reinforcement?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT", question: "Who conducted the famous 'Little Albert' experiment?", order: 3 },
            ]).returning();

            for (const challenge of challenges) {
              if (challenge.order === 1) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "B.F. Skinner" },
                  { challengeId: challenge.id, correct: false, text: "Ivan Pavlov" },
                  { challengeId: challenge.id, correct: false, text: "John Watson" },
                ]);
              }
              if (challenge.order === 2) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Adding something pleasant to increase behavior" },
                  { challengeId: challenge.id, correct: false, text: "Removing something unpleasant to decrease behavior" },
                  { challengeId: challenge.id, correct: false, text: "Adding something unpleasant to decrease behavior" },
                ]);
              }
              if (challenge.order === 3) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "John Watson" },
                  { challengeId: challenge.id, correct: false, text: "B.F. Skinner" },
                  { challengeId: challenge.id, correct: false, text: "Ivan Pavlov" },
                ]);
              }
            }
          }
          
          if (unit.order === 2) {
            const lesson = await db.insert(schema.lessons).values({ 
              unitId: unit.id, 
              title: "Information Processing Model", 
              order: 1 
            }).returning();
            
            const challenges = await db.insert(schema.challenges).values([
              { lessonId: lesson[0].id, type: "SELECT", question: "What is 'chunking' in cognitive psychology?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT", question: "Which component of memory has unlimited capacity?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT", question: "What is the duration of short-term memory?", order: 3 },
            ]).returning();

            for (const challenge of challenges) {
              if (challenge.order === 1) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Grouping information into meaningful units" },
                  { challengeId: challenge.id, correct: false, text: "Forgetting information over time" },
                  { challengeId: challenge.id, correct: false, text: "A method of reinforcement" },
                ]);
              }
              if (challenge.order === 2) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Long-term memory" },
                  { challengeId: challenge.id, correct: false, text: "Short-term memory" },
                  { challengeId: challenge.id, correct: false, text: "Sensory memory" },
                ]);
              }
              if (challenge.order === 3) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "15-30 seconds" },
                  { challengeId: challenge.id, correct: false, text: "1-2 minutes" },
                  { challengeId: challenge.id, correct: false, text: "5-10 minutes" },
                ]);
              }
            }
          }
          
          if (unit.order === 3) {
            const lesson = await db.insert(schema.lessons).values({ 
              unitId: unit.id, 
              title: "Piaget's Stages", 
              order: 1 
            }).returning();
            
            const challenges = await db.insert(schema.challenges).values([
              { lessonId: lesson[0].id, type: "SELECT", question: "In which stage does abstract thought typically develop?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT", question: "What is 'scaffolding' in Vygotsky's theory?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT", question: "At what age does the preoperational stage typically begin?", order: 3 },
            ]).returning();

            for (const challenge of challenges) {
              if (challenge.order === 1) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Formal Operational" },
                  { challengeId: challenge.id, correct: false, text: "Sensorimotor" },
                  { challengeId: challenge.id, correct: false, text: "Concrete Operational" },
                ]);
              }
              if (challenge.order === 2) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Temporary support to help learners achieve goals" },
                  { challengeId: challenge.id, correct: false, text: "A type of reinforcement schedule" },
                  { challengeId: challenge.id, correct: false, text: "The process of forgetting information" },
                ]);
              }
              if (challenge.order === 3) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "2 years old" },
                  { challengeId: challenge.id, correct: false, text: "4 years old" },
                  { challengeId: challenge.id, correct: false, text: "6 years old" },
                ]);
              }
            }
          }
        }
      }

      // Course 3: Andragogy
      if (course.title === "Andragogy") {
        const andragogyUnits = await db.insert(schema.units).values([
          { courseId: course.id, title: "Unit 1: Core Principles", description: "Understanding the adult learner.", order: 1 },
          { courseId: course.id, title: "Unit 2: Learner's Experience", description: "The role of experience in learning.", order: 2 },
          { courseId: course.id, title: "Unit 3: Motivation to Learn", description: "What drives adult learners.", order: 3 },
        ]).returning();

        for (const unit of andragogyUnits) {
          if (unit.order === 1) {
            const lesson = await db.insert(schema.lessons).values({ 
              unitId: unit.id, 
              title: "Knowles' Assumptions", 
              order: 1 
            }).returning();
            
            const challenges = await db.insert(schema.challenges).values([
              { lessonId: lesson[0].id, type: "SELECT", question: "Which is a key assumption of Andragogy?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT", question: "Who is considered the father of Andragogy?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT", question: "What does 'andragogy' literally mean?", order: 3 },
            ]).returning();

            for (const challenge of challenges) {
              if (challenge.order === 1) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Adults are self-directed" },
                  { challengeId: challenge.id, correct: false, text: "Adults prefer rote memorization" },
                  { challengeId: challenge.id, correct: false, text: "Adults are motivated primarily by external rewards" },
                ]);
              }
              if (challenge.order === 2) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Malcolm Knowles" },
                  { challengeId: challenge.id, correct: false, text: "John Dewey" },
                  { challengeId: challenge.id, correct: false, text: "Paulo Freire" },
                ]);
              }
              if (challenge.order === 3) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Man-leading" },
                  { challengeId: challenge.id, correct: false, text: "Adult-teaching" },
                  { challengeId: challenge.id, correct: false, text: "Self-learning" },
                ]);
              }
            }
          }
          
          if (unit.order === 2) {
            const lesson = await db.insert(schema.lessons).values({ 
              unitId: unit.id, 
              title: "Leveraging Experience", 
              order: 1 
            }).returning();
            
            const challenges = await db.insert(schema.challenges).values([
              { lessonId: lesson[0].id, type: "SELECT", question: "How should an instructor use the experience of adult learners?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT", question: "What can be a barrier when adults have extensive experience?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT", question: "Which teaching method best utilizes adult experience?", order: 3 },
            ]).returning();

            for (const challenge of challenges) {
              if (challenge.order === 1) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "As a rich resource for learning" },
                  { challengeId: challenge.id, correct: false, text: "As something to be ignored" },
                  { challengeId: challenge.id, correct: false, text: "As a barrier to new knowledge" },
                ]);
              }
              if (challenge.order === 2) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Resistance to new ideas" },
                  { challengeId: challenge.id, correct: false, text: "Lack of motivation" },
                  { challengeId: challenge.id, correct: false, text: "Poor memory retention" },
                ]);
              }
              if (challenge.order === 3) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Case studies and problem-solving" },
                  { challengeId: challenge.id, correct: false, text: "Lectures and note-taking" },
                  { challengeId: challenge.id, correct: false, text: "Memorization and repetition" },
                ]);
              }
            }
          }
          
          if (unit.order === 3) {
            const lesson = await db.insert(schema.lessons).values({ 
              unitId: unit.id, 
              title: "Internal vs. External Motivation", 
              order: 1 
            }).returning();
            
            const challenges = await db.insert(schema.challenges).values([
              { lessonId: lesson[0].id, type: "SELECT", question: "Which is an example of internal motivation for an adult learner?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT", question: "What typically motivates adults more than children?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT", question: "When are adults most ready to learn?", order: 3 },
            ]).returning();

            for (const challenge of challenges) {
              if (challenge.order === 1) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "A desire for increased job satisfaction" },
                  { challengeId: challenge.id, correct: false, text: "A requirement from their employer" },
                  { challengeId: challenge.id, correct: false, text: "A potential salary increase" },
                ]);
              }
              if (challenge.order === 2) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Internal motivation" },
                  { challengeId: challenge.id, correct: false, text: "External rewards" },
                  { challengeId: challenge.id, correct: false, text: "Peer pressure" },
                ]);
              }
              if (challenge.order === 3) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "When they need to solve a real-life problem" },
                  { challengeId: challenge.id, correct: false, text: "When they have free time" },
                  { challengeId: challenge.id, correct: false, text: "When they are required to attend training" },
                ]);
              }
            }
          }
        }
      }

      // Course 4: Systematic Approach to Training (SAT)
      if (course.title === "Systematic Approach to Training (SAT)") {
        const satUnits = await db.insert(schema.units).values([
          { courseId: course.id, title: "Unit 1: The ADDIE Model", description: "The core framework of SAT.", order: 1 },
          { courseId: course.id, title: "Unit 2: Needs Analysis", description: "The 'Analysis' phase.", order: 2 },
          { courseId: course.id, title: "Unit 3: Evaluation", description: "The 'Evaluation' phase.", order: 3 },
        ]).returning();

        for (const unit of satUnits) {
          if (unit.order === 1) {
            const lesson = await db.insert(schema.lessons).values({ 
              unitId: unit.id, 
              title: "Overview of ADDIE", 
              order: 1 
            }).returning();
            
            const challenges = await db.insert(schema.challenges).values([
              { lessonId: lesson[0].id, type: "SELECT", question: "What does the 'D' in ADDIE stand for?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT", question: "Which phase comes before 'Implementation' in ADDIE?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT", question: "What is the main characteristic of the ADDIE model?", order: 3 },
            ]).returning();

            for (const challenge of challenges) {
              if (challenge.order === 1) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Design" },
                  { challengeId: challenge.id, correct: false, text: "Develop" },
                  { challengeId: challenge.id, correct: false, text: "Deploy" },
                ]);
              }
              if (challenge.order === 2) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Development" },
                  { challengeId: challenge.id, correct: false, text: "Analysis" },
                  { challengeId: challenge.id, correct: false, text: "Evaluation" },
                ]);
              }
              if (challenge.order === 3) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "It's systematic and iterative" },
                  { challengeId: challenge.id, correct: false, text: "It's only used for online training" },
                  { challengeId: challenge.id, correct: false, text: "It's primarily for children" },
                ]);
              }
            }
          }
          
          if (unit.order === 2) {
            const lesson = await db.insert(schema.lessons).values({ 
              unitId: unit.id, 
              title: "Identifying Training Gaps", 
              order: 1 
            }).returning();
            
            const challenges = await db.insert(schema.challenges).values([
              { lessonId: lesson[0].id, type: "SELECT", question: "What is the primary goal of a needs analysis?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT", question: "Which is NOT a type of needs analysis?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT", question: "What should you do if the needs analysis reveals no performance gap?", order: 3 },
            ]).returning();

            for (const challenge of challenges) {
              if (challenge.order === 1) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "To determine if training is the right solution" },
                  { challengeId: challenge.id, correct: false, text: "To design the training materials" },
                  { challengeId: challenge.id, correct: false, text: "To implement the training program" },
                ]);
              }
              if (challenge.order === 2) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Budget analysis" },
                  { challengeId: challenge.id, correct: false, text: "Organizational analysis" },
                  { challengeId: challenge.id, correct: false, text: "Task analysis" },
                ]);
              }
              if (challenge.order === 3) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Do not proceed with training" },
                  { challengeId: challenge.id, correct: false, text: "Design training anyway" },
                  { challengeId: challenge.id, correct: false, text: "Skip to the evaluation phase" },
                ]);
              }
            }
          }
          
          if (unit.order === 3) {
            const lesson = await db.insert(schema.lessons).values({ 
              unitId: unit.id, 
              title: "Kirkpatrick's Four Levels", 
              order: 1 
            }).returning();
            
            const challenges = await db.insert(schema.challenges).values([
              { lessonId: lesson[0].id, type: "SELECT", question: "Which level of Kirkpatrick's model measures the impact on the business?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT", question: "What does Level 2 (Learning) evaluate?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT", question: "Which level is the most difficult to measure?", order: 3 },
            ]).returning();

            for (const challenge of challenges) {
              if (challenge.order === 1) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Level 4: Results" },
                  { challengeId: challenge.id, correct: false, text: "Level 1: Reaction" },
                  { challengeId: challenge.id, correct: false, text: "Level 2: Learning" },
                ]);
              }
              if (challenge.order === 2) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Knowledge and skills acquired" },
                  { challengeId: challenge.id, correct: false, text: "Participant satisfaction" },
                  { challengeId: challenge.id, correct: false, text: "Business impact" },
                ]);
              }
              if (challenge.order === 3) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Level 4: Results" },
                  { challengeId: challenge.id, correct: false, text: "Level 1: Reaction" },
                  { challengeId: challenge.id, correct: false, text: "Level 3: Behavior" },
                ]);
              }
            }
          }
        }
      }

      // Course 5: Domains of Learning
      if (course.title === "Domains of Learning") {
        const domainsUnits = await db.insert(schema.units).values([
          { courseId: course.id, title: "Unit 1: The Cognitive Domain", description: "Thinking and intellectual skills.", order: 1 },
          { courseId: course.id, title: "Unit 2: The Affective Domain", description: "Feelings, values, and attitudes.", order: 2 },
          { courseId: course.id, title: "Unit 3: The Psychomotor Domain", description: "Physical skills and coordination.", order: 3 },
        ]).returning();

        for (const unit of domainsUnits) {
          if (unit.order === 1) {
            const lesson = await db.insert(schema.lessons).values({ 
              unitId: unit.id, 
              title: "Levels of Cognition", 
              order: 1 
            }).returning();
            
            const challenges = await db.insert(schema.challenges).values([
              { lessonId: lesson[0].id, type: "SELECT", question: "Designing a new product falls into which cognitive level?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT", question: "How many levels are in the revised cognitive domain?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT", question: "Which is the foundation level of the cognitive domain?", order: 3 },
            ]).returning();

            for (const challenge of challenges) {
              if (challenge.order === 1) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Creating" },
                  { challengeId: challenge.id, correct: false, text: "Analyzing" },
                  { challengeId: challenge.id, correct: false, text: "Remembering" },
                ]);
              }
              if (challenge.order === 2) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Six" },
                  { challengeId: challenge.id, correct: false, text: "Five" },
                  { challengeId: challenge.id, correct: false, text: "Seven" },
                ]);
              }
              if (challenge.order === 3) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Remembering" },
                  { challengeId: challenge.id, correct: false, text: "Understanding" },
                  { challengeId: challenge.id, correct: false, text: "Applying" },
                ]);
              }
            }
          }
          
          if (unit.order === 2) {
            const lesson = await db.insert(schema.lessons).values({ 
              unitId: unit.id, 
              title: "Levels of Affect", 
              order: 1 
            }).returning();
            
            const challenges = await db.insert(schema.challenges).values([
              { lessonId: lesson[0].id, type: "SELECT", question: "Willingly participating in a group discussion shows which level of the affective domain?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT", question: "What is the highest level of the affective domain?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT", question: "Which level involves being aware of or attending to something?", order: 3 },
            ]).returning();

            for (const challenge of challenges) {
              if (challenge.order === 1) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Responding" },
                  { challengeId: challenge.id, correct: false, text: "Receiving" },
                  { challengeId: challenge.id, correct: false, text: "Valuing" },
                ]);
              }
              if (challenge.order === 2) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Characterization" },
                  { challengeId: challenge.id, correct: false, text: "Organization" },
                  { challengeId: challenge.id, correct: false, text: "Valuing" },
                ]);
              }
              if (challenge.order === 3) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Receiving" },
                  { challengeId: challenge.id, correct: false, text: "Responding" },
                  { challengeId: challenge.id, correct: false, text: "Valuing" },
                ]);
              }
            }
          }
          
          if (unit.order === 3) {
            const lesson = await db.insert(schema.lessons).values({ 
              unitId: unit.id, 
              title: "Levels of Physical Skill", 
              order: 1 
            }).returning();
            
            const challenges = await db.insert(schema.challenges).values([
              { lessonId: lesson[0].id, type: "SELECT", question: "A pianist performing a complex piece from memory is at which psychomotor level?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT", question: "What is the first level of the psychomotor domain?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT", question: "Which level involves creating new movement patterns?", order: 3 },
            ]).returning();

            for (const challenge of challenges) {
              if (challenge.order === 1) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Origination" },
                  { challengeId: challenge.id, correct: false, text: "Imitation" },
                  { challengeId: challenge.id, correct: false, text: "Precision" },
                ]);
              }
              if (challenge.order === 2) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Perception" },
                  { challengeId: challenge.id, correct: false, text: "Imitation" },
                  { challengeId: challenge.id, correct: false, text: "Set" },
                ]);
              }
              if (challenge.order === 3) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Origination" },
                  { challengeId: challenge.id, correct: false, text: "Adaptation" },
                  { challengeId: challenge.id, correct: false, text: "Articulation" },
                ]);
              }
            }
          }
        }
      }
    }
    
    console.log("Database seeded successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

void main();