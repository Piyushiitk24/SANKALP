import { neon } from "@neondatabase/serverless";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";
import { allCourses } from "@/content/courses";

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

const DEFAULT_OPTION_AUDIO = "/audio/option-select.wav";

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
      .values(
        allCourses.map((course) => ({
          title: course.title,
          imageSrc: course.imageSrc,
        }))
      )
      .returning();

    const courseDefinitions = new Map(allCourses.map((course) => [course.title, course]));

    for (const course of courses) {
      const definition = courseDefinitions.get(course.title);
      if (!definition) continue;

      const insertedUnits = await db
        .insert(schema.units)
        .values(
          definition.units.map((unit) => ({
            courseId: course.id,
            title: unit.title,
            description: unit.description,
            order: unit.order,
          }))
        )
        .returning();

      for (const unit of insertedUnits) {
        const unitDefinition = definition.units.find((candidate) => candidate.order === unit.order);
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
          const lessonDefinition = unitDefinition.lessons.find((candidate) => candidate.order === lesson.order);
          if (!lessonDefinition) continue;

          const insertedChallenges = await db
            .insert(schema.challenges)
            .values(
              lessonDefinition.challenges.map((challenge) => ({
                lessonId: lesson.id,
                type: challenge.type ?? 'SELECT',
                question: challenge.question,
                order: challenge.order,
              }))
            )
            .returning();

          for (const challenge of insertedChallenges) {
            const challengeDefinition = lessonDefinition.challenges.find((candidate) => candidate.order === challenge.order);
            if (!challengeDefinition) continue;

            await db.insert(schema.challengeOptions).values(
                challengeDefinition.options.map((option) => ({
                  challengeId: challenge.id,
                  text: option.text,
                  correct: option.correct,
                  imageSrc: option.imageSrc ?? null,
                  audioSrc: option.audioSrc ?? DEFAULT_OPTION_AUDIO,
                }))
              );
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
