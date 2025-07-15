import { NextRequest, NextResponse } from "next/server";

// Custom error classes for better error handling
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errorCode?: string;

  constructor(message: string, statusCode: number = 500, errorCode?: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errorCode = errorCode;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND_ERROR');
    this.name = 'NotFoundError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR');
    this.name = 'DatabaseError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
  }
}

// Error handler for API routes
export const handleApiError = (error: any): { message: string; statusCode: number; errorCode?: string } => {
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      errorCode: error.errorCode,
    };
  }

  // Handle database errors
  if (error.code === '23505') { // Unique constraint violation
    return {
      message: 'Resource already exists',
      statusCode: 409,
      errorCode: 'DUPLICATE_RESOURCE',
    };
  }

  if (error.code === '23503') { // Foreign key constraint violation
    return {
      message: 'Invalid reference to related resource',
      statusCode: 400,
      errorCode: 'INVALID_REFERENCE',
    };
  }

  // Handle validation errors from Zod
  if (error.name === 'ZodError') {
    return {
      message: 'Invalid input data',
      statusCode: 400,
      errorCode: 'VALIDATION_ERROR',
    };
  }

  // Default error response
  return {
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message || 'Internal server error',
    statusCode: 500,
    errorCode: 'INTERNAL_ERROR',
  };
};

// Async error wrapper for API routes
export const asyncHandler = (fn: (req: NextRequest) => Promise<NextResponse>) => {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      return await fn(req);
    } catch (error) {
      const { message, statusCode } = handleApiError(error);
      
      // Log the error
      console.error('API Error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        path: req.url,
        method: req.method,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { 
          error: message,
          ...(process.env.NODE_ENV === 'development' && { 
            stack: error instanceof Error ? error.stack : undefined 
          })
        },
        { status: statusCode }
      );
    }
  };
};

// Enhanced admin check with proper error handling
export const requireAdmin = (userId: string | null): void => {
  if (!userId) {
    throw new AuthenticationError('Authentication required');
  }

  const adminIds = process.env.CLERK_ADMIN_IDS?.split(', ') || [];
  if (!adminIds.includes(userId)) {
    throw new AuthorizationError('Admin access required');
  }
};
