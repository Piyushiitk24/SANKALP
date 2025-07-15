import { z } from "zod";

// Challenge validation schema
export const challengeSchema = z.object({
  question: z.string()
    .min(1, "Question is required")
    .max(1000, "Question must be less than 1000 characters")
    .refine(
      (val) => !val.includes("<script>") && !val.includes("javascript:"),
      "Question contains invalid content"
    ),
  type: z.enum(["SELECT", "ASSIST"], {
    errorMap: () => ({ message: "Type must be SELECT or ASSIST" }),
  }),
  order: z.number()
    .int("Order must be an integer")
    .min(0, "Order must be non-negative"),
  lessonId: z.number()
    .int("Lesson ID must be an integer")
    .positive("Lesson ID must be positive"),
});

// Challenge option validation schema
export const challengeOptionSchema = z.object({
  text: z.string()
    .min(1, "Option text is required")
    .max(500, "Option text must be less than 500 characters")
    .refine(
      (val) => !val.includes("<script>") && !val.includes("javascript:"),
      "Option text contains invalid content"
    ),
  correct: z.boolean(),
  challengeId: z.number()
    .int("Challenge ID must be an integer")
    .positive("Challenge ID must be positive"),
  imageSrc: z.string()
    .url("Image source must be a valid URL")
    .optional()
    .nullable(),
  audioSrc: z.string()
    .url("Audio source must be a valid URL")
    .optional()
    .nullable(),
});

// Course validation schema
export const courseSchema = z.object({
  title: z.string()
    .min(1, "Course title is required")
    .max(200, "Course title must be less than 200 characters"),
  imageSrc: z.string()
    .url("Image source must be a valid URL"),
});

// Unit validation schema
export const unitSchema = z.object({
  title: z.string()
    .min(1, "Unit title is required")
    .max(200, "Unit title must be less than 200 characters"),
  description: z.string()
    .min(1, "Unit description is required")
    .max(500, "Unit description must be less than 500 characters"),
  courseId: z.number()
    .int("Course ID must be an integer")
    .positive("Course ID must be positive"),
  order: z.number()
    .int("Order must be an integer")
    .min(0, "Order must be non-negative"),
});

// Lesson validation schema
export const lessonSchema = z.object({
  title: z.string()
    .min(1, "Lesson title is required")
    .max(200, "Lesson title must be less than 200 characters"),
  unitId: z.number()
    .int("Unit ID must be an integer")
    .positive("Unit ID must be positive"),
  order: z.number()
    .int("Order must be an integer")
    .min(0, "Order must be non-negative"),
});

// Generic ID validation
export const idSchema = z.object({
  id: z.string()
    .regex(/^[0-9]+$/, "ID must be a valid number")
    .transform(Number)
    .refine(val => val > 0, "ID must be positive"),
});

// Pagination validation
export const paginationSchema = z.object({
  page: z.number()
    .int("Page must be an integer")
    .min(1, "Page must be at least 1")
    .max(1000, "Page must be less than 1000")
    .default(1),
  limit: z.number()
    .int("Limit must be an integer")
    .min(1, "Limit must be at least 1")
    .max(100, "Limit must be less than 100")
    .default(20),
});

// Search validation
export const searchSchema = z.object({
  q: z.string()
    .min(1, "Search query is required")
    .max(100, "Search query must be less than 100 characters")
    .refine(
      (val) => !/[<>'"&;]/.test(val),
      "Search query contains invalid characters"
    ),
});

// User input sanitization
export const sanitizeString = (input: string): string => {
  return input
    .replace(/[<>]/g, "") // Remove HTML brackets
    .replace(/['"]/g, "") // Remove quotes
    .replace(/javascript:/gi, "") // Remove javascript protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
};

// Validate file uploads
export const fileUploadSchema = z.object({
  filename: z.string()
    .min(1, "Filename is required")
    .max(255, "Filename too long")
    .refine(
      (val) => !/[<>:"/\\|?*]/.test(val),
      "Filename contains invalid characters"
    ),
  mimetype: z.string()
    .refine(
      (val) => ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'audio/mpeg', 'audio/wav'].includes(val),
      "Unsupported file type"
    ),
  size: z.number()
    .max(10 * 1024 * 1024, "File size must be less than 10MB"),
});

// Email validation
export const emailSchema = z.string()
  .email("Invalid email format")
  .max(254, "Email too long");

// URL validation
export const urlSchema = z.string()
  .url("Invalid URL format")
  .refine(
    (val) => ['http:', 'https:'].includes(new URL(val).protocol),
    "URL must use HTTP or HTTPS protocol"
  );

// Validation middleware for API routes
export const validateRequest = <T>(schema: z.ZodSchema<T>) => {
  return (data: unknown): { success: true; data: T } | { success: false; error: string } => {
    try {
      const validatedData = schema.parse(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors
          .map(err => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        return { success: false, error: errorMessage };
      }
      return { success: false, error: "Validation failed" };
    }
  };
};
