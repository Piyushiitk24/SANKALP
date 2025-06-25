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
      
      // --- COMMENTED OUT: Original Bloom's Taxonomy Content ---
      /*
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

      // ... rest of original Bloom's content ...
      */

      // --- NEW COURSE CONTENT ---

      // Course 1: Bloom's Taxonomy
      if (course.title === "Bloom's Taxonomy") {
        const bloomsUnits = await db.insert(schema.units).values([
          { courseId: course.id, title: "Unit 1: Introduction", description: "Fundamentals of Bloom's Taxonomy.", order: 1 },
          { courseId: course.id, title: "Unit 2: The Cognitive Domain (Revised)", description: "Exploring the levels of thinking.", order: 2 },
          { courseId: course.id, title: "Unit 3: Practical Application", description: "Using the taxonomy in teaching.", order: 3 },
        ]).returning();

        for (const unit of bloomsUnits) {
          if (unit.order === 1) {
            const lesson1 = await db.insert(schema.lessons).values({ 
              unitId: unit.id, 
              title: "History and Purpose", 
              order: 1 
            }).returning();
            
            const challenges1 = await db.insert(schema.challenges).values([
              { lessonId: lesson1[0].id, type: "SELECT", question: "Who led the committee of educators that developed the original taxonomy?", order: 1 },
              { lessonId: lesson1[0].id, type: "SELECT", question: "What year was the original Bloom's Taxonomy published?", order: 2 },
              { lessonId: lesson1[0].id, type: "SELECT", question: "What was the primary purpose of developing Bloom's Taxonomy?", order: 3 },
            ]).returning();

            for (const challenge of challenges1) {
              if (challenge.order === 1) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Benjamin Bloom" },
                  { challengeId: challenge.id, correct: false, text: "B.F. Skinner" },
                  { challengeId: challenge.id, correct: false, text: "Jean Piaget" },
                ]);
              }
              if (challenge.order === 2) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "1956" },
                  { challengeId: challenge.id, correct: false, text: "1962" },
                  { challengeId: challenge.id, correct: false, text: "1948" },
                ]);
              }
              if (challenge.order === 3) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "To classify learning objectives" },
                  { challengeId: challenge.id, correct: false, text: "To rank students by intelligence" },
                  { challengeId: challenge.id, correct: false, text: "To provide classroom management techniques" },
                ]);
              }
            }
          }
          
          if (unit.order === 2) {
            const lesson2 = await db.insert(schema.lessons).values({ 
              unitId: unit.id, 
              title: "Remembering & Understanding", 
              order: 1 
            }).returning();
            
            const challenges2 = await db.insert(schema.challenges).values([
              { lessonId: lesson2[0].id, type: "SELECT", question: "Which level involves explaining ideas or concepts?", order: 1 },
              { lessonId: lesson2[0].id, type: "SELECT", question: "What is the lowest level of the cognitive domain?", order: 2 },
              { lessonId: lesson2[0].id, type: "SELECT", question: "Which verb is associated with the 'Understanding' level?", order: 3 },
            ]).returning();

            for (const challenge of challenges2) {
              if (challenge.order === 1) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Understanding" },
                  { challengeId: challenge.id, correct: false, text: "Remembering" },
                  { challengeId: challenge.id, correct: false, text: "Applying" },
                ]);
              }
              if (challenge.order === 2) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Remembering" },
                  { challengeId: challenge.id, correct: false, text: "Understanding" },
                  { challengeId: challenge.id, correct: false, text: "Applying" },
                ]);
              }
              if (challenge.order === 3) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Explain" },
                  { challengeId: challenge.id, correct: false, text: "List" },
                  { challengeId: challenge.id, correct: false, text: "Create" },
                ]);
              }
            }
          }
          
          if (unit.order === 3) {
            const lesson3 = await db.insert(schema.lessons).values({ 
              unitId: unit.id, 
              title: "Writing Objectives", 
              order: 1 
            }).returning();
            
            const challenges3 = await db.insert(schema.challenges).values([
              { lessonId: lesson3[0].id, type: "SELECT", question: "Which verb is best for an 'Evaluating' level objective?", order: 1 },
              { lessonId: lesson3[0].id, type: "SELECT", question: "What is the highest level of the revised taxonomy?", order: 2 },
              { lessonId: lesson3[0].id, type: "SELECT", question: "Which level involves using knowledge in new situations?", order: 3 },
            ]).returning();

            for (const challenge of challenges3) {
              if (challenge.order === 1) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Critique" },
                  { challengeId: challenge.id, correct: false, text: "List" },
                  { challengeId: challenge.id, correct: false, text: "Build" },
                ]);
              }
              if (challenge.order === 2) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Creating" },
                  { challengeId: challenge.id, correct: false, text: "Evaluating" },
                  { challengeId: challenge.id, correct: false, text: "Analyzing" },
                ]);
              }
              if (challenge.order === 3) {
                await db.insert(schema.challengeOptions).values([
                  { challengeId: challenge.id, correct: true, text: "Applying" },
                  { challengeId: challenge.id, correct: false, text: "Remembering" },
                  { challengeId: challenge.id, correct: false, text: "Understanding" },
                ]);
              }
            }
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