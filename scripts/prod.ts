import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database");

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
      ])
      .returning();

    // For each course, insert units
    for (const course of courses) {
      if (course.title !== "Bloom's Taxonomy") continue;

      // Unit 1: Remembering
      const unit1 = await db.insert(schema.units).values({
        courseId: course.id,
        title: "Unit 1: Remembering",
        description: "Learn the basics of recalling facts and concepts.",
        order: 1,
      }).returning();

      const lesson1 = await db.insert(schema.lessons).values({
        unitId: unit1[0].id,
        title: "Foundations of Recall",
        order: 1,
      }).returning();

      const challenges1 = await db.insert(schema.challenges).values([
        { lessonId: lesson1[0].id, type: "SELECT", question: "What is the primary purpose of Bloom's Taxonomy?", order: 1 },
        { lessonId: lesson1[0].id, type: "SELECT", question: "Which verb is most associated with the 'Remembering' level?", order: 2 },
        { lessonId: lesson1[0].id, type: "SELECT", question: "The 'Remembering' level primarily focuses on...", order: 3 },
        { lessonId: lesson1[0].id, type: "SELECT", question: "What is the level that comes immediately after 'Remembering'?", order: 4 },
        { lessonId: lesson1[0].id, type: "SELECT", question: "Which question type best assesses the 'Remembering' level?", order: 5 },
      ]).returning();

      for (const challenge of challenges1) {
        if (challenge.order === 1) {
          await db.insert(schema.challengeOptions).values([
            { challengeId: challenge.id, correct: true, text: "To classify learning objectives."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            { challengeId: challenge.id, correct: false, text: "To rank students by intelligence."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            { challengeId: challenge.id, correct: false, text: "To provide classroom management techniques."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
          ]);
        }
        if (challenge.order === 2) {
          await db.insert(schema.challengeOptions).values([
            { challengeId: challenge.id, correct: true, text: "Define"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            { challengeId: challenge.id, correct: false, text: "Analyze"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            { challengeId: challenge.id, correct: false, text: "Create"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
          ]);
        }
        if (challenge.order === 3) {
          await db.insert(schema.challengeOptions).values([
            { challengeId: challenge.id, correct: true, text: "Recalling previously learned information."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            { challengeId: challenge.id, correct: false, text: "Justifying a decision or course of action."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            { challengeId: challenge.id, correct: false, text: "Generating new ideas or products."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
          ]);
        }
        if (challenge.order === 4) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "Understanding"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Applying"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "It is the highest level."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
        if (challenge.order === 5) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "Who developed the original taxonomy?"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "What is your opinion on this theory?"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "How would you improve this model?"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
      }

      // Unit 2: Understanding
      const unit2 = await db.insert(schema.units).values({
        courseId: course.id,
        title: "Unit 2: Understanding",
        description: "Learn to explain ideas and concepts.",
        order: 2,
      }).returning();

      const lesson2 = await db.insert(schema.lessons).values({
        unitId: unit2[0].id,
        title: "Explaining Concepts",
        order: 1,
      }).returning();
      
      const challenges2 = await db.insert(schema.challenges).values([
        { lessonId: lesson2[0].id, type: "SELECT", question: "Which activity demonstrates 'Understanding'?", order: 1 },
        { lessonId: lesson2[0].id, type: "SELECT", question: "A student who can 'paraphrase' a text is at which level?", order: 2 },
        { lessonId: lesson2[0].id, type: "SELECT", question: "To 'classify' a set of objects requires which level of thinking?", order: 3 },
        { lessonId: lesson2[0].id, type: "SELECT", question: "What is the key difference between 'Remembering' and 'Understanding'?", order: 4 },
        { lessonId: lesson2[0].id, type: "SELECT", question: "Which of these is NOT a verb for the 'Understanding' level?", order: 5 },
      ]).returning();

      for (const challenge of challenges2) {
        if (challenge.order === 1) {
          await db.insert(schema.challengeOptions).values([
            { challengeId: challenge.id, correct: true, text: "Summarizing the main idea of a chapter."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            { challengeId: challenge.id, correct: false, text: "Listing the capitals of Europe."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            { challengeId: challenge.id, correct: false, text: "Designing a new experiment."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
          ]);
        }
        if (challenge.order === 2) {
          await db.insert(schema.challengeOptions).values([
            { challengeId: challenge.id, correct: true, text: "Understanding"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            { challengeId: challenge.id, correct: false, text: "Remembering"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            { challengeId: challenge.id, correct: false, text: "Applying"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
          ]);
        }
        if (challenge.order === 3) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "Understanding"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Remembering"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Evaluating"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
        if (challenge.order === 4) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "Understanding involves explaining, while remembering is about recall."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Remembering is a higher level of thinking."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "There is no difference."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
        if (challenge.order === 5) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "List"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Explain"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Summarize"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
      }
      
       // Unit 3: Applying
       const unit3 = await db.insert(schema.units).values({
        courseId: course.id,
        title: "Unit 3: Applying",
        description: "Use information in new situations.",
        order: 3,
      }).returning();

      const lesson3 = await db.insert(schema.lessons).values({
        unitId: unit3[0].id,
        title: "Practical Application",
        order: 1,
      }).returning();
      
      const challenges3 = await db.insert(schema.challenges).values([
        { lessonId: lesson3[0].id, type: "SELECT", question: "Which task requires 'Applying'?", order: 1 },
        { lessonId: lesson3[0].id, type: "SELECT", question: "If a student uses a formula to solve a math problem, they are at what level?", order: 2 },
        { lessonId: lesson3[0].id, type: "SELECT", question: "Which verb is associated with 'Applying'?", order: 3 },
        { lessonId: lesson3[0].id, type: "SELECT", question: "What is a prerequisite for the 'Applying' level?", order: 4 },
        { lessonId: lesson3[0].id, type: "SELECT", question: "Which of the following is an example of 'Applying'?", order: 5 },
      ]).returning();

      for (const challenge of challenges3) {
        if (challenge.order === 1) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "Using a known procedure to solve a problem."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Recalling a historical date."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Critiquing a piece of art."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
        if (challenge.order === 2) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "Applying"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Analyzing"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Understanding"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
        if (challenge.order === 3) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "Implement"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Define"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Critique"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
        if (challenge.order === 4) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "Understanding the information."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "The ability to create new ideas."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "No prerequisites are needed."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
        if (challenge.order === 5) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "Solving a physics problem with a given formula."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Memorizing the periodic table."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Writing a review of a movie."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
      }

      // Unit 4: Analyzing
      const unit4 = await db.insert(schema.units).values({
        courseId: course.id,
        title: "Unit 4: Analyzing",
        description: "Draw connections among ideas.",
        order: 4,
      }).returning();
      
      const lesson4 = await db.insert(schema.lessons).values({
        unitId: unit4[0].id,
        title: "Breaking Down Information",
        order: 1,
      }).returning();

      const challenges4 = await db.insert(schema.challenges).values([
        { lessonId: lesson4[0].id, type: "SELECT", question: "Which activity best represents 'Analyzing'?", order: 1 },
        { lessonId: lesson4[0].id, type: "SELECT", question: "When a student compares and contrasts two historical events, they are operating at which level?", order: 2 },
        { lessonId: lesson4[0].id, type: "SELECT", question: "What does 'Analyzing' primarily involve?", order: 3 },
        { lessonId: lesson4[0].id, type: "SELECT", question: "Which verb is NOT associated with 'Analyzing'?", order: 4 },
        { lessonId: lesson4[0].id, type: "SELECT", question: "Distinguishing between fact and opinion falls under which level?", order: 5 },
      ]).returning();

      for (const challenge of challenges4) {
        if (challenge.order === 1) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "Identifying the underlying assumptions in an argument."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Recalling the names of all 50 states."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Following a recipe to bake a cake."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
        if (challenge.order === 2) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "Analyzing"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Applying"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Understanding"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
        if (challenge.order === 3) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "Breaking information into component parts to explore relationships."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Stating a definition."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Producing a new and original work."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
        if (challenge.order === 4) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "List"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Differentiate"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Compare"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
        if (challenge.order === 5) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "Analyzing"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Evaluating"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Applying"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
      }

      // Unit 5: Evaluating
      const unit5 = await db.insert(schema.units).values({
        courseId: course.id,
        title: "Unit 5: Evaluating",
        description: "Justify a stand or decision.",
        order: 5,
      }).returning();
      
      const lesson5 = await db.insert(schema.lessons).values({
        unitId: unit5[0].id,
        title: "Making Judgments",
        order: 1,
      }).returning();

      const challenges5 = await db.insert(schema.challenges).values([
        { lessonId: lesson5[0].id, type: "SELECT", question: "'Evaluating' is best described as...", order: 1 },
        { lessonId: lesson5[0].id, type: "SELECT", question: "Which of the following demonstrates 'Evaluating'?", order: 2 },
        { lessonId: lesson5[0].id, type: "SELECT", question: "Which verb is most appropriate for an 'Evaluating' task?", order: 3 },
        { lessonId: lesson5[0].id, type: "SELECT", question: "What is a key component of the 'Evaluating' level?", order: 4 },
        { lessonId: lesson5[0].id, type: "SELECT", question: "The level just below 'Evaluating' is...", order: 5 },
      ]).returning();

      for (const challenge of challenges5) {
        if (challenge.order === 1) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "Making judgments based on criteria and standards."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Recalling facts and figures."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Creating a new product."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
        if (challenge.order === 2) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "Writing a critique of a research paper."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Summarizing a book."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Listing the main characters in a play."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
        if (challenge.order === 3) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "Justify"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Identify"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Summarize"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
        if (challenge.order === 4) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "Using criteria to support a judgment."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Memorizing information."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Following instructions."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
        if (challenge.order === 5) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "Analyzing"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Creating"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Applying"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
      }

      // Unit 6: Creating
      const unit6 = await db.insert(schema.units).values({
        courseId: course.id,
        title: "Unit 6: Creating",
        description: "Produce new or original work.",
        order: 6,
      }).returning();
      
      const lesson6 = await db.insert(schema.lessons).values({
        unitId: unit6[0].id,
        title: "Original Production",
        order: 1,
      }).returning();

      const challenges6 = await db.insert(schema.challenges).values([
        { lessonId: lesson6[0].id, type: "SELECT", question: "What is the highest level of Bloom's Taxonomy?", order: 1 },
        { lessonId: lesson6[0].id, type: "SELECT", question: "Which activity represents the 'Creating' level?", order: 2 },
        { lessonId: lesson6[0].id, type: "SELECT", question: "The 'Creating' level requires students to...", order: 3 },
        { lessonId: lesson6[0].id, type: "SELECT", question: "Which verb is most closely associated with 'Creating'?", order: 4 },
        { lessonId: lesson6[0].id, type: "SELECT", question: "To reach the 'Creating' level, a student must have mastered which other levels?", order: 5 },
      ]).returning();

      for (const challenge of challenges6) {
        if (challenge.order === 1) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "Creating"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Evaluating"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Remembering"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
        if (challenge.order === 2) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "Designing a new building."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Explaining a scientific theory."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Reciting a poem."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
        if (challenge.order === 3) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "Generate new ideas, products, or ways of viewing things."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Recall information accurately."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Critique the work of others."/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
        if (challenge.order === 4) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "Design"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Analyze"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Recall"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
        }
        if (challenge.order === 5) {
            await db.insert(schema.challengeOptions).values([
              { challengeId: challenge.id, correct: true, text: "All the other levels"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Only Remembering and Understanding"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
              { challengeId: challenge.id, correct: false, text: "Only Evaluating"/*, imageSrc: "/path/to/image.svg", audioSrc: "/path/to/audio.mp3"*/ },
            ]);
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