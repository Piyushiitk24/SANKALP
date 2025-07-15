import { auth } from "@clerk/nextjs/server";
import { securityLogger } from "./logger";
import { AuthenticationError, AuthorizationError } from "./errors";

export const getIsAdmin = async (): Promise<boolean> => {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return false;
    }

    const adminIds = process.env.CLERK_ADMIN_IDS?.split(", ") || [];
    
    if (adminIds.length === 0) {
      securityLogger.logError(new Error("No admin IDs configured"), "getIsAdmin");
      return false;
    }

    const isAdmin = adminIds.includes(userId);
    
    if (!isAdmin) {
      securityLogger.logSuspiciousActivity(
        userId,
        "ADMIN_ACCESS_ATTEMPT",
        { path: "admin_check" }
      );
    }

    return isAdmin;
  } catch (error) {
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown error in getIsAdmin"),
      "getIsAdmin"
    );
    return false;
  }
};

export const requireAdmin = async (): Promise<string> => {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new AuthenticationError("Authentication required for admin access");
    }

    const adminIds = process.env.CLERK_ADMIN_IDS?.split(", ") || [];
    
    if (adminIds.length === 0) {
      securityLogger.logError(new Error("No admin IDs configured"), "requireAdmin");
      throw new AuthorizationError("Admin access not configured");
    }

    if (!adminIds.includes(userId)) {
      securityLogger.logSuspiciousActivity(
        userId,
        "UNAUTHORIZED_ADMIN_ACCESS",
        { timestamp: new Date().toISOString() }
      );
      throw new AuthorizationError("Admin access required");
    }

    return userId;
  } catch (error) {
    if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
      throw error;
    }
    
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown error in requireAdmin"),
      "requireAdmin"
    );
    throw new AuthorizationError("Admin access verification failed");
  }
};

export const logAdminAction = async (action: string, resource: string, details?: any): Promise<void> => {
  try {
    const { userId } = await auth();
    
    if (userId) {
      securityLogger.logAdminAction(userId, action, resource);
      
      // Additional detailed logging for sensitive actions
      if (["DELETE", "UPDATE", "CREATE"].includes(action)) {
        console.log(`Admin Action: ${action} on ${resource}`, {
          userId,
          details,
          timestamp: new Date().toISOString(),
        });
      }
    }
  } catch (error) {
    securityLogger.logError(
      error instanceof Error ? error : new Error("Unknown error in logAdminAction"),
      "logAdminAction"
    );
  }
};
