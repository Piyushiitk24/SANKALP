import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { securityLogger } from "./logger";

export interface SessionInfo {
  userId: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  isValid: boolean;
}

export class SessionManager {
  private static readonly MAX_SESSION_AGE = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly SUSPICIOUS_PATTERNS = [
    /bot|crawler|spider|scraper/i,
    /curl|wget|python|java|perl/i,
    /nikto|sqlmap|nmap|burp/i,
  ];

  /**
   * Validates the current session and returns session info
   */
  static async validateSession(request: NextRequest): Promise<SessionInfo | null> {
    try {
      const { userId, sessionId } = await auth();
      
      if (!userId || !sessionId) {
        return null;
      }

      const ipAddress = this.getClientIP(request);
      const userAgent = request.headers.get("user-agent") || "";
      
      // Check for suspicious user agents
      if (this.isSuspiciousUserAgent(userAgent)) {
        securityLogger.logSuspiciousActivity(
          userId,
          "SUSPICIOUS_USER_AGENT",
          { userAgent, ipAddress }
        );
        return null;
      }

      // Check for rapid IP changes (session hijacking detection)
      if (this.detectSuspiciousIPChange(userId, ipAddress)) {
        securityLogger.logSuspiciousActivity(
          userId,
          "SUSPICIOUS_IP_CHANGE",
          { ipAddress, userAgent }
        );
        return null;
      }

      const sessionInfo: SessionInfo = {
        userId,
        sessionId,
        ipAddress,
        userAgent,
        timestamp: new Date(),
        isValid: true,
      };

      // Log session activity
      securityLogger.logAdminAction(userId, "SESSION_VALIDATED", `ip:${ipAddress}`);
      
      return sessionInfo;

    } catch (error) {
      securityLogger.logError(
        error instanceof Error ? error : new Error("Session validation failed"),
        "session-validation"
      );
      return null;
    }
  }

  /**
   * Checks if a user agent is suspicious
   */
  private static isSuspiciousUserAgent(userAgent: string): boolean {
    if (!userAgent || userAgent.length < 10) return true;
    
    return this.SUSPICIOUS_PATTERNS.some(pattern => pattern.test(userAgent));
  }

  /**
   * Detects suspicious IP address changes
   */
  private static detectSuspiciousIPChange(userId: string, currentIP: string): boolean {
    // In a real implementation, you would:
    // 1. Store user's recent IP addresses in a cache/database
    // 2. Check if the current IP is from a different country/region
    // 3. Check if the change happened too quickly
    
    // For now, just log the IP for monitoring
    securityLogger.logAdminAction(userId, "IP_CHECK", `current:${currentIP}`);
    return false;
  }

  /**
   * Extracts client IP address from request
   */
  private static getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for");
    const realIP = request.headers.get("x-real-ip");
    const clientIP = request.headers.get("x-client-ip");
    
    if (forwarded) {
      return forwarded.split(",")[0].trim();
    }
    
    if (realIP) {
      return realIP;
    }
    
    if (clientIP) {
      return clientIP;
    }
    
    return "unknown";
  }

  /**
   * Creates a secure session response with security headers
   */
  static createSecureResponse(response: NextResponse, sessionInfo: SessionInfo): NextResponse {
    // Set security headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    
    // Set session-specific headers
    response.headers.set("X-Session-ID", sessionInfo.sessionId);
    response.headers.set("X-Request-ID", crypto.randomUUID());
    
    return response;
  }

  /**
   * Validates session for API routes
   */
  static async validateAPISession(request: NextRequest): Promise<{
    isValid: boolean;
    session?: SessionInfo;
    error?: string;
  }> {
    const session = await this.validateSession(request);
    
    if (!session) {
      return {
        isValid: false,
        error: "Invalid or expired session"
      };
    }

    // Additional API-specific validations
    const apiKey = request.headers.get("x-api-key");
    if (apiKey && !this.validateAPIKey(apiKey)) {
      securityLogger.logSuspiciousActivity(
        session.userId,
        "INVALID_API_KEY",
        { apiKey: apiKey.substring(0, 8) + "..." }
      );
      return {
        isValid: false,
        error: "Invalid API key"
      };
    }

    return {
      isValid: true,
      session
    };
  }

  /**
   * Validates API key (if used)
   */
  private static validateAPIKey(apiKey: string): boolean {
    // In a real implementation, validate against stored API keys
    // For now, just check format
    return /^[a-zA-Z0-9]{32,}$/.test(apiKey);
  }

  /**
   * Creates a session timeout response
   */
  static createTimeoutResponse(): NextResponse {
    return NextResponse.json(
      { error: "Session expired", code: "SESSION_TIMEOUT" },
      { status: 401 }
    );
  }

  /**
   * Creates an unauthorized response
   */
  static createUnauthorizedResponse(reason: string = "Unauthorized"): NextResponse {
    return NextResponse.json(
      { error: reason, code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  /**
   * Logs session activity for security monitoring
   */
  static logSessionActivity(session: SessionInfo, activity: string, details?: any) {
    securityLogger.logAdminAction(
      session.userId,
      "SESSION_ACTIVITY",
      `${activity}:${details || ""}`
    );
  }

  /**
   * Checks for concurrent session limits
   */
  static checkConcurrentSessions(userId: string, maxSessions: number = 5): boolean {
    // In a real implementation, you would:
    // 1. Store active sessions in Redis/database
    // 2. Count active sessions for the user
    // 3. Invalidate oldest sessions if limit exceeded
    
    securityLogger.logAdminAction(userId, "CONCURRENT_SESSION_CHECK", `max:${maxSessions}`);
    return true; // Allow for now
  }

  /**
   * Invalidates a session
   */
  static invalidateSession(sessionId: string, reason: string): void {
    // In a real implementation, you would:
    // 1. Remove session from active sessions store
    // 2. Add session to blacklist
    // 3. Notify user of session termination
    
    securityLogger.logAdminAction("system", "SESSION_INVALIDATED", `${sessionId}:${reason}`);
  }
}

// Middleware helper for session validation
export async function requireValidSession(request: NextRequest): Promise<SessionInfo | NextResponse> {
  const session = await SessionManager.validateSession(request);
  
  if (!session) {
    return SessionManager.createUnauthorizedResponse("Session required");
  }
  
  return session;
}

// Admin session validation
export async function requireAdminSession(request: NextRequest): Promise<SessionInfo | NextResponse> {
  const session = await SessionManager.validateSession(request);
  
  if (!session) {
    return SessionManager.createUnauthorizedResponse("Admin session required");
  }
  
  // Additional admin checks would go here
  // For now, just validate the session exists
  
  return session;
}
