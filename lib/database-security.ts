import { eq, and, or, isNull, isNotNull, SQL } from "drizzle-orm";
import { securityLogger } from "@/lib/logger";
import { z } from "zod";

// SQL injection prevention utilities
export class DatabaseSecurity {
  /**
   * Validates SQL query parameters to prevent injection attacks
   */
  static validateQueryParams(params: Record<string, any>): boolean {
    const suspiciousPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /('|"|;|--|\/\*|\*\/|xp_|sp_)/i,
      /(<script|javascript:|vbscript:|onload|onerror)/i,
    ];

    for (const [key, value] of Object.entries(params)) {
      if (typeof value === 'string') {
        for (const pattern of suspiciousPatterns) {
          if (pattern.test(value)) {
            securityLogger.logSuspiciousActivity(
              null,
              "SQL_INJECTION_ATTEMPT",
              { key, value, pattern: pattern.toString() }
            );
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   * Sanitizes string input for database queries
   */
  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/['"]/g, '') // Remove quotes
      .replace(/[;-]/g, '') // Remove SQL terminators
      .replace(/--/g, '') // Remove SQL comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove SQL comments
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .trim();
  }

  /**
   * Validates database connection parameters
   */
  static validateConnectionParams(): boolean {
    const requiredEnvVars = [
      'DATABASE_URL',
      'DB_HOST',
      'DB_USER',
      'DB_PASSWORD',
      'DB_NAME'
    ];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        securityLogger.logError(
          new Error(`Missing required database environment variable: ${envVar}`),
          "database-security"
        );
        return false;
      }
    }

    // Check for secure connection
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('sslmode=require')) {
      securityLogger.logError(
        new Error("Database connection not using SSL"),
        "database-security"
      );
      return false;
    }

    return true;
  }

  /**
   * Logs database access for security monitoring
   */
  static logDatabaseAccess(userId: string | null, operation: string, table: string, details?: any) {
    securityLogger.logAdminAction(
      userId || "anonymous",
      "DATABASE_ACCESS",
      `${operation}:${table}`
    );
  }

  /**
   * Validates pagination parameters
   */
  static validatePaginationParams(params: { page?: number; limit?: number }): {
    page: number;
    limit: number;
    offset: number;
  } {
    const pageSchema = z.object({
      page: z.number().int().positive().max(1000).default(1),
      limit: z.number().int().positive().max(100).default(20),
    });

    const validated = pageSchema.parse({
      page: params.page || 1,
      limit: params.limit || 20,
    });

    return {
      page: validated.page,
      limit: validated.limit,
      offset: (validated.page - 1) * validated.limit,
    };
  }

  /**
   * Creates secure WHERE clause for user-specific queries
   */
  static createUserWhereClause(userId: string, baseCondition?: SQL): SQL | undefined {
    const userCondition = eq(userId as any, userId); // This would be table-specific
    return baseCondition ? and(baseCondition, userCondition) : userCondition;
  }

  /**
   * Validates and sanitizes search queries
   */
  static sanitizeSearchQuery(query: string): string {
    if (!query || typeof query !== 'string') return '';
    
    // Remove potentially dangerous characters
    const sanitized = query
      .replace(/[<>'"&]/g, '') // Remove HTML/XML chars
      .replace(/[;-]/g, '') // Remove SQL terminators
      .replace(/--/g, '') // Remove SQL comments
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Limit length
    return sanitized.substring(0, 100);
  }

  /**
   * Rate limiting for database operations
   */
  static checkDatabaseRateLimit(userId: string, operation: string): boolean {
    // This would integrate with your rate limiting system
    // For now, just log the operation
    securityLogger.logAdminAction(userId, "DATABASE_RATE_CHECK", operation);
    return true; // Allow for now
  }

  /**
   * Validates foreign key references
   */
  static validateForeignKeys(data: Record<string, any>): boolean {
    const foreignKeyPattern = /^[a-zA-Z0-9_-]+$/;
    
    for (const [key, value] of Object.entries(data)) {
      if (key.endsWith('Id') && value && typeof value === 'string') {
        if (!foreignKeyPattern.test(value)) {
          securityLogger.logSuspiciousActivity(
            null,
            "INVALID_FOREIGN_KEY",
            { key, value }
          );
          return false;
        }
      }
    }
    return true;
  }
}

// Database operation wrapper with security logging
export function secureDbOperation<T>(
  operation: () => Promise<T>,
  userId: string | null,
  operationType: string,
  table: string
): Promise<T> {
  const execute = async (): Promise<T> => {
    try {
      DatabaseSecurity.logDatabaseAccess(userId, operationType, table);
      const result = await operation();
      return result;
    } catch (error) {
      securityLogger.logError(
        error instanceof Error ? error : new Error("Database operation failed"),
        "database-operation"
      );
      throw error;
    }
  };
  
  return execute();
}
