import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define admin routes
const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Basic security checks
  const userAgent = req.headers.get("user-agent") || "";
  
  // Block suspicious user agents
  const suspiciousAgents = [
    "sqlmap",
    "nikto",
    "dirb", 
    "dirbuster",
    "nmap",
    "masscan"
  ];
  
  if (suspiciousAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  // Check for path traversal attempts
  if (req.nextUrl.pathname.includes("../") || req.nextUrl.pathname.includes("..\\")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }
  
  // Admin route protection
  if (isAdminRoute(req)) {
    const { userId } = await auth();
    const adminIds = process.env.CLERK_ADMIN_IDS?.split(", ") || [];
    
    if (!userId || !adminIds.includes(userId)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", 
    "/(api|trpc)(.*)",
  ],
};
