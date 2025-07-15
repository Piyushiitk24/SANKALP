import winston from 'winston';

// Enhanced security logger with structured logging
class SecurityLogger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.colorize({ all: true })
      ),
      defaultMeta: { 
        service: 'sankalp-security',
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      },
      transports: [
        new winston.transports.File({ 
          filename: 'logs/error.log', 
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 10,
          tailable: true
        }),
        new winston.transports.File({ 
          filename: 'logs/security.log',
          level: 'warn',
          maxsize: 5242880, // 5MB
          maxFiles: 10,
          tailable: true
        }),
        new winston.transports.File({ 
          filename: 'logs/combined.log',
          maxsize: 5242880, // 5MB
          maxFiles: 10,
          tailable: true
        })
      ],
    });

    // Add console transport for development
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        format: winston.format.simple()
      }));
    }
  }

  /**
   * Log admin actions for security monitoring
   */
  logAdminAction(userId: string, action: string, details?: string) {
    this.logger.warn('Admin Action', {
      type: 'ADMIN_ACTION',
      userId,
      action,
      details,
      timestamp: new Date().toISOString(),
      severity: 'medium'
    });
  }

  /**
   * Log suspicious activities
   */
  logSuspiciousActivity(userId: string | null, activity: string, metadata?: any) {
    this.logger.warn('Suspicious Activity', {
      type: 'SUSPICIOUS_ACTIVITY',
      userId: userId || 'anonymous',
      activity,
      metadata,
      timestamp: new Date().toISOString(),
      severity: 'high',
      requiresReview: true
    });
  }

  /**
   * Log security errors
   */
  logSecurityError(error: Error, context: string, metadata?: any) {
    this.logger.error('Security Error', {
      type: 'SECURITY_ERROR',
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      context,
      metadata,
      timestamp: new Date().toISOString(),
      severity: 'high',
      requiresImmediate: true
    });
  }

  /**
   * Log authentication events
   */
  logAuthEvent(userId: string, event: string, success: boolean, metadata?: any) {
    this.logger.info('Authentication Event', {
      type: 'AUTH_EVENT',
      userId,
      event,
      success,
      metadata,
      timestamp: new Date().toISOString(),
      severity: success ? 'low' : 'medium'
    });
  }

  /**
   * Log rate limiting events
   */
  logRateLimit(identifier: string, limit: number, current: number, metadata?: any) {
    this.logger.warn('Rate Limit', {
      type: 'RATE_LIMIT',
      identifier,
      limit,
      current,
      exceeded: current > limit,
      metadata,
      timestamp: new Date().toISOString(),
      severity: current > limit ? 'high' : 'medium'
    });
  }

  /**
   * Log validation errors
   */
  logValidationError(input: any, errors: string[], context: string) {
    this.logger.warn('Validation Error', {
      type: 'VALIDATION_ERROR',
      input: this.sanitizeForLogging(input),
      errors,
      context,
      timestamp: new Date().toISOString(),
      severity: 'medium'
    });
  }

  /**
   * Log general errors with context
   */
  logError(error: Error, context: string, metadata?: any) {
    this.logger.error('Application Error', {
      type: 'APPLICATION_ERROR',
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      context,
      metadata,
      timestamp: new Date().toISOString(),
      severity: 'medium'
    });
  }

  /**
   * Log failed authentication attempts
   */
  logFailedAuth(userId: string | null, ip: string, userAgent: string) {
    this.logger.warn('Failed authentication attempt', {
      type: 'FAILED_AUTH',
      userId,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
      severity: 'high'
    });
  }

  /**
   * Sanitize sensitive data for logging
   */
  private sanitizeForLogging(data: any): any {
    if (typeof data === 'string') {
      // Remove potential sensitive patterns
      return data.replace(/password|token|secret|key/gi, '[REDACTED]');
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (/password|token|secret|key|email/i.test(key)) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitizeForLogging(value);
        }
      }
      return sanitized;
    }
    
    return data;
  }
}

// Export singleton instance
export const securityLogger = new SecurityLogger();

// Export default for backward compatibility
export default securityLogger;
