import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import db from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { asyncHandler, handleApiError } from "@/lib/errors";
import { securityLogger } from "@/lib/logger";
import { checkRateLimit, rateLimiters } from "@/lib/rate-limit";
import { challengeOptionSchema } from "@/lib/validation";

export const GET = async (req: NextRequest) => {
  try {
    // Admin authorization
    await requireAdmin();

    // Rate limiting
    const rateLimitResult = await checkRateLimit(req, rateLimiters.admin);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    // Fetch data
    const data = await db.query.challengeOptions.findMany();

    // Log admin action
    securityLogger.logAdminAction(
      "admin", // In real implementation, get from auth
      "CHALLENGE_OPTIONS_READ",
      `count:${data.length}`
    );

    return NextResponse.json(data);
  } catch (error) {
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown error"),
      "challenge-options-get"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    // Admin authorization
    await requireAdmin();

    // Rate limiting
    const rateLimitResult = await checkRateLimit(req, rateLimiters.admin);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validation = challengeOptionSchema.safeParse(body);
    
    if (!validation.success) {
      securityLogger.logValidationError(
        body,
        validation.error.errors.map(err => `${err.path.join(".")}: ${err.message}`),
        "challenge-options-create"
      );
      
      return NextResponse.json(
        { 
          error: "Invalid input", 
          details: validation.error.errors.map(err => `${err.path.join(".")}: ${err.message}`)
        }, 
        { status: 400 }
      );
    }

    // Create challenge option
    const data = await db
      .insert(challengeOptions)
      .values(validation.data)
      .returning();

    // Log admin action
    securityLogger.logAdminAction(
      "admin", // In real implementation, get from auth
      "CHALLENGE_OPTION_CREATED",
      `id:${data[0].id}`
    );

    return NextResponse.json(data[0]);
  } catch (error) {
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown error"),
      "challenge-options-post"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
