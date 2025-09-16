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
                type: "SELECT" as const,
                question: "What is the primary purpose of Bloom's Taxonomy in education?",
                order: 1,
              },
              {
                lessonId: lessons[0].id,
                type: "SELECT" as const,
                question: "Who led the team of educational psychologists that developed the taxonomy?",
                order: 2,
              },
              {
                lessonId: lessons[0].id,
                type: "SELECT" as const,
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
                type: "SELECT" as const,
                question: "In the revised version of Bloom's Taxonomy, which is the highest level of cognitive skill?",
                order: 1,
              },
              {
                lessonId: lessons[1].id,
                type: "SELECT" as const,
                question: "What is the primary difference between the original and revised taxonomy?",
                order: 2,
              },
              {
                lessonId: lessons[1].id,
                type: "SELECT" as const,
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
                type: "SELECT" as const,
                question: "The cognitive domain of Bloom's Taxonomy deals with:",
                order: 1,
              },
              {
                lessonId: lessons[2].id,
                type: "SELECT" as const,
                question: "Which of these is a lower-order thinking skill in the cognitive domain?",
                order: 2,
              },
              {
                lessonId: lessons[2].id,
                type: "SELECT" as const,
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
                type: "SELECT" as const,
                question: "A teacher wants to assess a student's ability to show empathy. Which domain of Bloom's Taxonomy would this fall under?",
                order: 1,
              },
              {
                lessonId: lessons[3].id,
                type: "SELECT" as const,
                question: "The psychomotor domain focuses on:",
                order: 2,
              },
              {
                lessonId: lessons[3].id,
                type: "SELECT" as const,
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
                type: "SELECT" as const,
                question: "Which of the following is an example of a \"Remembering\" level activity?",
                order: 1,
              },
               {
                lessonId: lessons[0].id,
                type: "SELECT" as const,
                question: "Which verb is most associated with the 'Remembering' level?",
                order: 2,
              },
              {
                lessonId: lessons[0].id,
                type: "SELECT" as const,
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
                type: "SELECT" as const,
                question: "A student who can explain a scientific concept in their own words is demonstrating which level of Bloom's Taxonomy?",
                order: 1,
              },
              {
                lessonId: lessons[1].id,
                type: "SELECT" as const,
                question: "Which of the following is NOT an example of 'Understanding'?",
                order: 2,
              },
              {
                lessonId: lessons[1].id,
                type: "SELECT" as const,
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
                type: "SELECT" as const,
                question: "\"Use the formula for calculating the area of a circle to solve the following problems.\" This is an example of an instruction at which level?",
                order: 1,
              },
              {
                lessonId: lessons[2].id,
                type: "SELECT" as const,
                question: "Which of the following activities best represents the 'Applying' level?",
                order: 2,
              },
              {
                lessonId: lessons[2].id,
                type: "SELECT" as const,
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
                type: "SELECT" as const,
                question: "Which activity best represents the \"Analyzing\" level of Bloom's Taxonomy?",
                order: 1,
              },
               {
                lessonId: lessons[0].id,
                type: "SELECT" as const,
                question: "What is the key difference between 'Analyzing' and 'Applying'?",
                order: 2,
              },
              {
                lessonId: lessons[0].id,
                type: "SELECT" as const,
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
                type: "SELECT" as const,
                question: "When a student is asked to judge the credibility of a source, they are operating at which level?",
                order: 1,
              },
              {
                lessonId: lessons[1].id,
                type: "SELECT" as const,
                question: "Which of the following is an example of an 'Evaluating' activity?",
                order: 2,
              },
              {
                lessonId: lessons[1].id,
                type: "SELECT" as const,
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
                type: "SELECT" as const,
                question: "Which of the following assignments requires students to use the \"Creating\" level of Bloom's Taxonomy?",
                order: 1,
              },
               {
                lessonId: lessons[2].id,
                type: "SELECT" as const,
                question: "What is the highest level of cognitive skill in the revised Bloom's Taxonomy?",
                order: 2,
              },
               {
                lessonId: lessons[2].id,
                type: "SELECT" as const,
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
                type: "SELECT" as const,
                question: "Which of the following is a well-written learning objective at the \"Applying\" level?",
                order: 1,
              },
              {
                lessonId: lessons[0].id,
                type: "SELECT" as const,
                question: "Why is it important to use action verbs when writing learning objectives?",
                order: 2,
              },
              {
                lessonId: lessons[0].id,
                type: "SELECT" as const,
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
                type: "SELECT" as const,
                question: "A teacher wants to create an assessment that targets higher-order thinking skills. Which of the following would be most appropriate?",
                order: 1,
              },
              {
                lessonId: lessons[1].id,
                type: "SELECT" as const,
                question: "What is the purpose of formative assessment?",
                order: 2,
              },
              {
                lessonId: lessons[1].id,
                type: "SELECT" as const,
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
                type: "SELECT" as const,
                question: "How can Bloom's Taxonomy be used to support differentiated instruction?",
                order: 1,
              },
              {
                lessonId: lessons[2].id,
                type: "SELECT" as const,
                question: "Which of the following is an example of differentiating instruction based on student interest?",
                order: 2,
              },
              {
                lessonId: lessons[2].id,
                type: "SELECT" as const,
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
        const semaphoreUnitsDefinition = [
          {
            order: 1,
            title: "Unit 1: Signal Foundations",
            description: "Perfect posture, timing, and readability before spelling letters.",
            lessons: [
              {
                order: 1,
                title: "Flashcard Setup & Posture",
                challenges: [
                  {
                    order: 1,
                    question: "Which glowing flashcard stance keeps the neon border centered before signaling?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Feet hip-width, shoulders square, elbows relaxed, flags resting in a low V hugging the torso.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Feet together, elbows locked straight, flags pressed against the thighs.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ One foot lunging forward with both arms lifted overhead like a Y.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Shoulders rolled inward while wrists cross in front of the chest.",
                      },
                    ],
                  },
                  {
                    order: 2,
                    question: "When the flashcard flips to the ready face, how should your wrists frame the staffs?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Wrists stay stacked over forearms, thumbs forward, gripping the lower third so the cloth drapes cleanly.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Knuckles twist inward with palms facing the sky.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Hands choke the midpoint of each staff causing the flags to droop outward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Palms rotate up and elbows clamp tight against the ribs.",
                      },
                    ],
                  },
                  {
                    order: 3,
                    question: "What resting flag position frames the glowing badge just before your first letter?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Both flags cross low in front creating a subtle V halo over the logo.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Flags extend straight out at shoulder height making a horizontal line.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Right flag points high while the left flag stays low.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Both flags hide behind your back to keep the canvas clear.",
                      },
                    ],
                  },
                  {
                    order: 4,
                    question: "Which visual treatment keeps semaphore cloth legible against SANKALP's UI gradient?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Soft charcoal backdrop with neon purple rim light tracing each flag edge.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Pure white background with no shadow separation at all.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Busy sunset photo layered directly behind the card.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Deep black void with zero glow on the fabric.",
                      },
                    ],
                  },
                  {
                    order: 5,
                    question: "Which breathing rhythm anchors fluid, game-like transitions between letters?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Inhale for two counts to lift, exhale for two counts into the target angle.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Hold your breath through the entire word for maximum tension.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Quick inhale and exhale on every half count to move faster than the beat.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Breathe randomly whenever it feels comfortable.",
                      },
                    ],
                  },
                ],
              },
              {
                order: 2,
                title: "Clockface Orientation",
                challenges: [
                  {
                    order: 1,
                    question: "Which orientation forms the 12 & 6 column used in crisp D-style signals?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Right flag locks straight up at 12 o'clock; left flag anchors straight down at 6 creating a luminous vertical line.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Right flag sweeps toward 2 o'clock while left lifts to 10 creating an open V.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Both flags drop to 6 o'clock building an inverted Y.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag arcs to 11 while right extends to 3, forming an offset L.",
                      },
                    ],
                  },
                  {
                    order: 2,
                    question: "Which orientation paints the glowing 3 & 9 crossbar seen in R signals?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left and right flags extend straight out at shoulder height, a neon cross from 9 to 3.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Right flag reaches 12 while left stays at 6, stacking vertically.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Right flag angles to 1 and left to 7 creating a narrow diagonal.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Both flags tuck behind the body to reset quietly.",
                      },
                    ],
                  },
                  {
                    order: 3,
                    question: "Which orientation nails the 1 & 7 diagonal used for letters like C?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Right flag angles forward to 1 o'clock above the shoulder; left flag drops to 7 o'clock beside the leg.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Right flag extends to 3 while left sweeps across the torso.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag lifts to 11 and right dives to 5 completing a mirrored slash.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Both flags float at 45 degrees above the shoulders.",
                      },
                    ],
                  },
                  {
                    order: 4,
                    question: "Which orientation shows the mirrored 11 & 5 sweep that powers E-style flashes?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag arcs to 11 o'clock above the head while right flag leans down-forward to 5 o'clock.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Right flag climbs to 12 and left retreats to 6 creating a column.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Both flags extend outward at 9 and 3 for a horizontal shelf.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag drops to 7 while right rises to 1 making a tight diagonal.",
                      },
                    ],
                  },
                  {
                    order: 5,
                    question: "Which orientation sets the 2 & 8 mirrored lean used for quick bridging beats?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Right flag floats to 2 o'clock just above the shoulder while left flag sweeps to 8 across the body.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Right flag settles at 4 while left matches at 10 for a low arc.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Both flags slide down to 6 preparing for a rest break.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag climbs to 11 and right flares to 3 for a capital L shape.",
                      },
                    ],
                  },
                ],
              },
              {
                order: 3,
                title: "Signal Flow & Beat",
                challenges: [
                  {
                    order: 1,
                    question: "Where should the flags reset between letters to keep the flashcard animation smooth?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Return to the waist-level low V on a silent beat before launching the next position.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Freeze the previous letter for three extra counts before moving again.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Swing both flags in a full circle before the next cue.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Drop the flags completely to your sides before each new symbol.",
                      },
                    ],
                  },
                  {
                    order: 2,
                    question: "Which timing recipe keeps letters readable at Duolingo-like pace?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Two-count groove: count one to travel, count two to hold before the flip animation.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Sprint through four letters on a single count to feel fast.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Hold every shape for five counts regardless of tempo.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Switch counts randomly so the motion feels improvised.",
                      },
                    ],
                  },
                  {
                    order: 3,
                    question: "How should your gaze support the learner while the card is face-up?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Keep eyes level with the viewer, nod subtly when the hold beat begins.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Look straight down at the floor until the card flips.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Alternate between ceiling and floor each letter to create movement.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Close your eyes so the glow takes focus.",
                      },
                    ],
                  },
                  {
                    order: 4,
                    question: "Which micro-movement prevents the neon edges from jittering when you land on a letter?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Ease into the final angle, pause for half a beat, then lock the elbows softly.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Snap into the angle as hard as possible so the flags stop instantly.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Keep swinging past the target and bounce back on every beat.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Drop the flags to the ground to remove any jitter.",
                      },
                    ],
                  },
                  {
                    order: 5,
                    question: "What recovery keeps the card stylish if you wobble mid-letter?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Flow back to the low V reset, breathe for a half count, then replay the letter cleanly.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Spin in a full circle to hide the mistake before continuing.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Freeze and wait for the audience to guess what happened.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Toss the flags aside and restart the entire lesson.",
                      },
                    ],
                  },
                ],
              },
              {
                order: 4,
                title: "Corrections & Audience Focus",
                challenges: [
                  {
                    order: 1,
                    question: "Which flashcard signals Attention before you send a message?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Both flags lift vertical at 12 o'clock forming a glowing exclamation.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Both flags drop straight to 6 creating a resting V.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag sweeps across the chest while right points outward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Flags extend horizontally at 9 and 3 with no vertical lift.",
                      },
                    ],
                  },
                  {
                    order: 2,
                    question: "Which flashcard means Message Received in this course?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Both flags extend horizontally at 9 and 3 o'clock confirming the packet.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Both flags shoot to 12 o'clock for another call.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag crosses the torso while right arcs high like an X.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Flags rest low in front without movement.",
                      },
                    ],
                  },
                  {
                    order: 3,
                    question: "Which flashcard asks the sender Are you receiving signals?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag crosses low at 8 while right flag stands tall at 12, a questioning tilt.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Both flags swing low together to 6 o'clock.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Right flag points outward at 3 while left stays vertical at 12.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag lifts to 11 and right drops to 5 making an E shape.",
                      },
                    ],
                  },
                  {
                    order: 4,
                    question: "Which flashcard calls Move Down to adjust the receiver's focus?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Both flags point straight down at 6 o'clock, neon edges framing the footer.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Both flags shoot upward to 12 o'clock.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag reaches 9 while right reaches 3 making a cross.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Right flag dips to 5 while left lifts to 11 creating a diagonal.",
                      },
                    ],
                  },
                  {
                    order: 5,
                    question: "Which flashcard escalates to Medical Assistance in maritime drills?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag sweeps low to 7 o'clock while right crosses overhead toward 1 creating a glowing X.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Both flags extend outward at 9 and 3 with no cross.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Flags rest low in front pointing straight down.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag reaches 11 and right drops to 5 for an E-like motion.",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            order: 2,
            title: "Unit 2: Letter Studio A–T",
            description: "Learn neon flashcards for letters and practice smooth recognition combos.",
            lessons: [
              {
                order: 1,
                title: "Vowel Spotlight A–E",
                challenges: [
                  {
                    order: 1,
                    question: "Tap the luminous flashcard that spells the letter A.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag vertical down at 6; right flag diagonally down forward toward 5.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical down while right flag lifts straight up to 12.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag sweeps across the torso as right flag angles high forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag extends horizontal at 9 while right flag angles high forward to 1.",
                      },
                    ],
                  },
                  {
                    order: 2,
                    question: "Tap the flashcard shape for the letter B.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag vertical down at 6; right flag extends horizontal at 3.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical down; right flag vertical up to 12.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag crosses low while right flag angles high forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag horizontal at 9 while right flag angles high forward to 1.",
                      },
                    ],
                  },
                  {
                    order: 3,
                    question: "Choose the flashcard for the letter C.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag vertical down; right flag angles high forward to 1 o'clock.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Right flag angles high while left flag mirrors upward creating an X.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Both flags extend straight across for a horizontal bar.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Right flag drops low at 5 while left flag rises to 11.",
                      },
                    ],
                  },
                  {
                    order: 4,
                    question: "Select the neon flashcard for the letter D.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag vertical down at 6; right flag vertical up to 12.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag angles high forward while right stays vertical down.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical up and right flag vertical down (mirrored).",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag horizontal at 9 while right flag angles down forward to 5.",
                      },
                    ],
                  },
                  {
                    order: 5,
                    question: "Which flashcard shows the letter E?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag angles high forward to 11; right flag drops down-forward to 5.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag horizontal out while right flag angles high across the body.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag angles down across the torso while right flag rises vertical at 12.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Both flags angle high forward to form a wide V.",
                      },
                    ],
                  },
                ],
              },
              {
                order: 2,
                title: "Edge Moves F–J",
                challenges: [
                  {
                    order: 1,
                    question: "Spot the flashcard that signals the letter F.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag extends horizontal at 9; right flag drops to 6.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical down while right flag sweeps to 5.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag angles up across the body while right flag angles down forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical up and right flag horizontal out.",
                      },
                    ],
                  },
                  {
                    order: 2,
                    question: "Spot the flashcard that signals the letter G.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag drops diagonal forward to 7; right flag rests vertical down at 6.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag horizontal out while right flag rises vertical up.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical down while right flag angles high to 1.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag angles high across the body while right flag extends horizontal at 3.",
                      },
                    ],
                  },
                  {
                    order: 3,
                    question: "Choose the flashcard for the letter H.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag drapes across the body toward 8; right flag extends horizontal at 3.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical up while right flag angles down forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag horizontal and right flag angles down forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag angles high forward while right flag vertical down.",
                      },
                    ],
                  },
                  {
                    order: 4,
                    question: "Tap the flashcard for the letter I.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag crosses low across the torso; right flag stands vertical up at 12.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag horizontal out while right flag angles high forward to 1.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical down while right flag horizontal out.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag angles high across the body while right flag angles down forward.",
                      },
                    ],
                  },
                  {
                    order: 5,
                    question: "Select the flashcard that signals the letter J.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag extends horizontal at 9; right flag stands vertical up at 12.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag angles high forward while right flag extends horizontal out.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical up while right flag angles down across the body.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag drops to 7 while right flag angles high forward to 1.",
                      },
                    ],
                  },
                ],
              },
              {
                order: 3,
                title: "Cross Bars K–O",
                challenges: [
                  {
                    order: 1,
                    question: "Pick the flashcard for the letter K.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag vertical up at 12; right flag angles down forward to 5.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag horizontal out while right flag vertical down.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag crosses low while right flag stands vertical up.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical down while right flag angles high across the body.",
                      },
                    ],
                  },
                  {
                    order: 2,
                    question: "Pick the flashcard for the letter L.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag angles high forward to 11; right flag angles down forward to 5.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical up while right flag horizontal out.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag horizontal out while right flag angles high across the body.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag drapes across the torso while right flag extends horizontal at 3.",
                      },
                    ],
                  },
                  {
                    order: 3,
                    question: "Which card represents the letter M?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag horizontal at 9; right flag angles down forward to 5.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical down while right flag vertical up.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag angles high across the body while right flag angles high forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical up while right flag angles down forward.",
                      },
                    ],
                  },
                  {
                    order: 4,
                    question: "Choose the flashcard for the letter N.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Both flags drop on diagonal lines toward 7 and 5, the low grounded stance.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag horizontal out while right flag vertical up.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical up while right flag horizontal out.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag angles high forward while right flag vertical down.",
                      },
                    ],
                  },
                  {
                    order: 5,
                    question: "Choose the flashcard for the letter O.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag sweeps across the body high toward 11; right flag extends horizontal at 3.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical down while right flag angles down forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag horizontal while right flag angles down across the body.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag angles down forward while right flag stands vertical up.",
                      },
                    ],
                  },
                ],
              },
              {
                order: 4,
                title: "Diagonal Stories P–T",
                challenges: [
                  {
                    order: 1,
                    question: "Identify the flashcard for the letter P.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag vertical up at 12; right flag horizontal at 3.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag horizontal while right flag angles high forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag angles high forward while right flag horizontal out.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical down while right flag vertical up.",
                      },
                    ],
                  },
                  {
                    order: 2,
                    question: "Identify the flashcard for the letter Q.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag angles high forward toward 11; right flag horizontal at 3.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical up while right flag angles high forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag horizontal while right flag vertical down.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag angles down across the body while right flag vertical up.",
                      },
                    ],
                  },
                  {
                    order: 3,
                    question: "Identify the flashcard for the letter R.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Both flags extend horizontal at 9 and 3 creating a bright crossbar.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical up while right flag vertical down.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag angles high forward while right flag angles down forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical down while right flag angles high across the body.",
                      },
                    ],
                  },
                  {
                    order: 4,
                    question: "Identify the flashcard for the letter S.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag drops diagonal forward to 7 while right flag extends horizontal at 3.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag horizontal while right flag angles high forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical up while right flag horizontal out.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag angles high across the body while right flag vertical up.",
                      },
                    ],
                  },
                  {
                    order: 5,
                    question: "Identify the flashcard for the letter T.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag vertical up at 12; right flag angles high forward to 1.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag horizontal while right flag vertical up.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag angles down across the body while right flag angles down forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical down while right flag horizontal out.",
                      },
                    ],
                  },
                ],
              },
              {
                order: 5,
                title: "Word Builder Mix",
                challenges: [
                  {
                    order: 1,
                    question: "Your word card shows 'ME'. Which flashcard should flip first?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Letter M stance — left flag horizontal at 9, right flag diagonal down to 5.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter E stance — left flag high forward, right flag low forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter A stance — left flag vertical down, right flag diagonal down forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter R stance — both flags horizontal at 9 and 3.",
                      },
                    ],
                  },
                  {
                    order: 2,
                    question: "The drill card spells 'TAG'. Which opening flashcard is correct?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Letter T stance — left flag vertical up, right flag high forward at 1.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter G stance — left flag low diagonal, right flag vertical down.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter A stance — left flag vertical down, right flag diagonal down forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter E stance — left flag high forward, right flag low forward.",
                      },
                    ],
                  },
                  {
                    order: 3,
                    question: "You are asked to flash 'RIP'. Which first letter posture fits?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Letter R stance — both flags horizontal at 9 and 3.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter I stance — left flag across low, right vertical up.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter P stance — left flag vertical up, right horizontal.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter N stance — both flags diagonal down.",
                      },
                    ],
                  },
                  {
                    order: 4,
                    question: "Complete the mini word 'SUN'. What is the opening flashcard?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Letter S stance — left flag diagonal down to 7, right flag horizontal at 3.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter U stance — left flag vertical up, right flag diagonal down across the body.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter N stance — both flags diagonal down.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter T stance — left flag vertical up, right flag high forward.",
                      },
                    ],
                  },
                  {
                    order: 5,
                    question: "Flash the word 'BOLT'. Which card should appear first?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Letter B stance — left flag vertical down, right flag horizontal out.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter O stance — left flag across high, right horizontal out.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter L stance — left flag high forward, right flag low forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter T stance — left flag vertical up, right high forward.",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            order: 3,
            title: "Unit 3: Signals U–Z & Control",
            description: "Finish the alphabet, master numerals, and rehearse control signals like attention and corrections.",
            lessons: [
              {
                order: 1,
                title: "Upper Sweep U–Y",
                challenges: [
                  {
                    order: 1,
                    question: "Choose the flashcard that spells the letter U.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag vertical up at 12; right flag angles down across the body toward 8.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag extends horizontal while right flag angles high forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag angles down forward while right flag horizontal out.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Both flags drop diagonally toward the knees.",
                      },
                    ],
                  },
                  {
                    order: 2,
                    question: "Choose the flashcard for the letter V.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag diagonal down to 7 while right flag rises vertical up at 12.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag extends horizontal while right flag horizontal out.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical down while right flag horizontal out.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag crosses high across the body while right flag angles high forward.",
                      },
                    ],
                  },
                  {
                    order: 3,
                    question: "Choose the flashcard for the letter W.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag horizontal out at 9; right flag angles high across the body toward 1.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical up while right flag horizontal out.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag drapes across the torso while right flag horizontal out.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Both flags drop diagonally toward 7 and 5.",
                      },
                    ],
                  },
                  {
                    order: 4,
                    question: "Choose the flashcard for the letter X.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag drops diagonal forward to 7 while right flag crosses overhead toward 1.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical up while right flag angles high forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag horizontal while right flag horizontal.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Right flag angles down forward while left flag vertical up.",
                      },
                    ],
                  },
                  {
                    order: 5,
                    question: "Choose the flashcard for the letter Y.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag horizontal at 9; right flag angles high forward to 1 creating a yes-check shape.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag drops diagonal while right flag mirrors low.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical up while right flag vertical down.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag crosses the torso while right flag extends horizontal out.",
                      },
                    ],
                  },
                ],
              },
              {
                order: 2,
                title: "Zenith Letter Z & Numeral Call",
                challenges: [
                  {
                    order: 1,
                    question: "Select the flashcard for the letter Z.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Right flag angles high to 1 while left flag mirrors down across the body toward 7.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Right flag vertical up while left flag vertical down.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Both flags horizontal at 9 and 3.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical up while right flag horizontal out.",
                      },
                    ],
                  },
                  {
                    order: 2,
                    question: "Which flashcard kicks off the Numerals convert sign?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Both flags cross overhead in a small circle before dropping to the numeral stance (use T, then rest).",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Immediately hold both flags horizontal without any pre-signal.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Toss flags upward and catch them before counting.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Point at the viewer and mouth the word 'numbers'.",
                      },
                    ],
                  },
                  {
                    order: 3,
                    question: "Which numeral matches the letter-like shape A / 1?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Numeral 1 — left flag vertical down, right flag diagonal down forward (same as A).",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Numeral 4 — left flag vertical down, right flag vertical up.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Numeral 8 — left flag across body, right flag horizontal.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Numeral 0 — left flag horizontal, right flag vertical up.",
                      },
                    ],
                  },
                  {
                    order: 4,
                    question: "Which numeral uses the same flashcard as letter B?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Numeral 2 — left flag vertical down, right flag horizontal out.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Numeral 3 — left flag vertical down, right flag high to 1.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Numeral 6 — left flag horizontal out, right flag vertical down.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Numeral 9 — left flag across the body, right flag vertical up.",
                      },
                    ],
                  },
                  {
                    order: 5,
                    question: "Which numeral card mirrors the letter J?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Numeral 0 — left flag horizontal at 9; right flag vertical up at 12.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Numeral 5 — left flag high forward, right flag low forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Numeral 7 — left flag low diagonal, right flag vertical down.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Numeral 8 — left flag across torso, right flag horizontal.",
                      },
                    ],
                  },
                ],
              },
              {
                order: 3,
                title: "Numbers Five to Nine",
                challenges: [
                  {
                    order: 1,
                    question: "Match the numeral 5 to its flashcard pose.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag angles high forward to 11; right flag sinks to 5 just like letter E.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag horizontal while right flag horizontal out.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical down while right flag vertical up.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag drapes across the torso while right flag horizontal out.",
                      },
                    ],
                  },
                  {
                    order: 2,
                    question: "Match the numeral 6 to its flashcard pose.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag horizontal at 9; right flag vertical down at 6 mirroring the letter F.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical up while right flag horizontal out.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag horizontal while right flag vertical up.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Both flags angle high forming a V.",
                      },
                    ],
                  },
                  {
                    order: 3,
                    question: "Match the numeral 7 to its flashcard pose.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag diagonal down toward 7; right flag vertical down at 6 (letter G shape).",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical up while right flag diagonal down forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag horizontal while right flag vertical up.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Both flags horizontal forming a bar.",
                      },
                    ],
                  },
                  {
                    order: 4,
                    question: "Match the numeral 8 to its flashcard pose.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag drapes across the torso toward 8; right flag horizontal at 3 — identical to letter H.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical up while right flag diagonal down forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag horizontal while right flag diagonal up across the body.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag diagonal down across while right flag vertical up.",
                      },
                    ],
                  },
                  {
                    order: 5,
                    question: "Match the numeral 9 to its flashcard pose.",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag drapes across the torso toward 8 while right flag stands vertical up at 12.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag horizontal while right flag diagonal down forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag vertical down while right flag horizontal out.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Both flags extend horizontal like the letter R.",
                      },
                    ],
                  },
                ],
              },
              {
                order: 4,
                title: "Control Signals & Prosigns",
                challenges: [
                  {
                    order: 1,
                    question: "Which flashcard sequence equals the Error signal used to correct a letter?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Start with both flags horizontal at 9 and 3, then sweep down to repeat the letter as the card flips.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Raise both flags to 12 and hold for five counts.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Drop the flags to the ground before starting again.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Spin the card 360 degrees with no flag motion.",
                      },
                    ],
                  },
                  {
                    order: 2,
                    question: "Which flashcard combo communicates Ready to Receive?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Lift both flags to 12 like Attention, then nod into the low V reset.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Keep both flags horizontal for three counts without moving.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Flash left flag only while right stays at rest.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Cross flags behind the back then return to front.",
                      },
                    ],
                  },
                  {
                    order: 3,
                    question: "Which flashcard delivers Man Overboard in maritime drills?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Left flag sweeps high across the body toward 11 while right flag extends horizontal at 3.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Both flags vertical up like Attention.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Both flags drop vertical down toward 6.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Right flag angles high forward while left flag vertical up.",
                      },
                    ],
                  },
                  {
                    order: 4,
                    question: "Which flashcard signals Proceeding in this direction?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Both flags raise to 12, adding a subtle lean toward the travel direction.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag horizontal while right flag vertical down.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Left flag drapes across the torso while right flag horizontal.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Both flags swing low at 6 for two counts.",
                      },
                    ],
                  },
                  {
                    order: 5,
                    question: "Which flashcard sequence cancels a transmission cleanly?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Flash the Error horizontal hold, drop to rest, then replay Attention to restart.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Toss both flags into the air and walk away from the card.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Hold any random letter until the viewer stops watching.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Stomp each foot twice before returning to posture.",
                      },
                    ],
                  },
                ],
              },
              {
                order: 5,
                title: "Endgame Drills",
                challenges: [
                  {
                    order: 1,
                    question: "Combo Drill: Which flashcard starts the call 'SOS'?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Letter S stance — left flag diagonal down to 7, right flag horizontal at 3.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter O stance — left flag across high, right horizontal out.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter C stance — left flag vertical down, right flag high to 1.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter T stance — left flag vertical up, right flag high forward.",
                      },
                    ],
                  },
                  {
                    order: 2,
                    question: "Combo Drill: Which flashcard begins the prosign 'AA' (All Personnel Found)?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Letter L stance repeated — left flag high to 11, right flag low to 5.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter A stance repeated — left flag vertical down, right flag low forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter R stance repeated — both flags horizontal.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter V stance repeated — left flag low diagonal, right vertical up.",
                      },
                    ],
                  },
                  {
                    order: 3,
                    question: "Combo Drill: To broadcast 'MEDIC', which flashcard fires first?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Letter M stance — left flag horizontal at 9, right flag diagonal down to 5.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter E stance — left flag high forward, right flag low forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter D stance — left flag vertical down, right flag vertical up.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter I stance — left flag across low, right flag vertical up.",
                      },
                    ],
                  },
                  {
                    order: 4,
                    question: "Combo Drill: Starting 'GO', which card leads?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Letter G stance — left flag diagonal down, right flag vertical down.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter O stance — left flag across high, right horizontal.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter T stance — left flag vertical up, right high forward.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Letter P stance — left flag vertical up, right horizontal.",
                      },
                    ],
                  },
                  {
                    order: 5,
                    question: "Combo Drill: For the cancel prosign (Error then Attention), what is the first flashcard?",
                    options: [
                      {
                        correct: true,
                        text: "Front ▸ Error lead — both flags horizontal before dropping to reset.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Attention — both flags vertical up immediately.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Rest — both flags pointing straight down.",
                      },
                      {
                        correct: false,
                        text: "Front ▸ Medical — left flag low diagonal, right flag high cross.",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ];

        const insertedUnits = await db
          .insert(schema.units)
          .values(
            semaphoreUnitsDefinition.map((unit) => ({
              courseId: course.id,
              title: unit.title,
              description: unit.description,
              order: unit.order,
            }))
          )
          .returning();

        for (const unit of insertedUnits) {
          const unitDefinition = semaphoreUnitsDefinition.find(
            (definition) => definition.order === unit.order
          );

          if (!unitDefinition) continue;

          const insertedLessons = await db
            .insert(schema.lessons)
            .values(
              unitDefinition.lessons.map((lesson) => ({
                unitId: unit.id,
                title: lesson.title,
                order: lesson.order,
              }))
            )
            .returning();

          for (const lesson of insertedLessons) {
            const lessonDefinition = unitDefinition.lessons.find(
              (definition) => definition.order === lesson.order
            );

            if (!lessonDefinition) continue;

            const insertedChallenges = await db
              .insert(schema.challenges)
              .values(
                lessonDefinition.challenges.map((challenge) => ({
                  lessonId: lesson.id,
                  type: "SELECT" as const,
                  question: challenge.question,
                  order: challenge.order,
                }))
              )
              .returning();

            for (const challenge of insertedChallenges) {
              const challengeDefinition = lessonDefinition.challenges.find(
                (definition) => definition.order === challenge.order
              );

              if (!challengeDefinition) continue;

              await db.insert(schema.challengeOptions).values(
                challengeDefinition.options.map((option) => ({
                  challengeId: challenge.id,
                  text: option.text,
                  correct: option.correct,
                }))
              );
            }
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
              { lessonId: lessons[0].id, type: "SELECT" as const, question: "A dot and a dash differ in:", order: 1 },
              { lessonId: lessons[0].id, type: "SELECT" as const, question: "What separates letters in Morse?", order: 2 },
              { lessonId: lessons[1].id, type: "SELECT" as const, question: "Which describes correct timing?", order: 3 },
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
              { lessonId: lessons[0].id, type: "SELECT" as const, question: "Which is 'E' in Morse?", order: 1 },
              { lessonId: lessons[0].id, type: "SELECT" as const, question: "Which is 'S' in Morse?", order: 2 },
              { lessonId: lessons[1].id, type: "SELECT" as const, question: "Which is '0' in Morse?", order: 3 },
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
              { lessonId: lessons[0].id, type: "SELECT" as const, question: "SOS corresponds to:", order: 1 },
              { lessonId: lessons[0].id, type: "SELECT" as const, question: "'CQ' is used to:", order: 2 },
              { lessonId: lessons[1].id, type: "SELECT" as const, question: "Which is a good practice message?", order: 3 },
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
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "Who is most associated with operant conditioning?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "What is positive reinforcement?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "Who conducted the famous 'Little Albert' experiment?", order: 3 },
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
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "What is 'chunking' in cognitive psychology?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "Which component of memory has unlimited capacity?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "What is the duration of short-term memory?", order: 3 },
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
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "In which stage does abstract thought typically develop?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "What is 'scaffolding' in Vygotsky's theory?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "At what age does the preoperational stage typically begin?", order: 3 },
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
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "Which is a key assumption of Andragogy?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "Who is considered the father of Andragogy?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "What does 'andragogy' literally mean?", order: 3 },
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
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "How should an instructor use the experience of adult learners?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "What can be a barrier when adults have extensive experience?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "Which teaching method best utilizes adult experience?", order: 3 },
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
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "Which is an example of internal motivation for an adult learner?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "What typically motivates adults more than children?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "When are adults most ready to learn?", order: 3 },
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
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "What does the 'D' in ADDIE stand for?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "Which phase comes before 'Implementation' in ADDIE?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "What is the main characteristic of the ADDIE model?", order: 3 },
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
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "What is the primary goal of a needs analysis?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "Which is NOT a type of needs analysis?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "What should you do if the needs analysis reveals no performance gap?", order: 3 },
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
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "Which level of Kirkpatrick's model measures the impact on the business?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "What does Level 2 (Learning) evaluate?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "Which level is the most difficult to measure?", order: 3 },
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
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "Designing a new product falls into which cognitive level?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "How many levels are in the revised cognitive domain?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "Which is the foundation level of the cognitive domain?", order: 3 },
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
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "Willingly participating in a group discussion shows which level of the affective domain?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "What is the highest level of the affective domain?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "Which level involves being aware of or attending to something?", order: 3 },
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
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "A pianist performing a complex piece from memory is at which psychomotor level?", order: 1 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "What is the first level of the psychomotor domain?", order: 2 },
              { lessonId: lesson[0].id, type: "SELECT" as const, question: "Which level involves creating new movement patterns?", order: 3 },
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
