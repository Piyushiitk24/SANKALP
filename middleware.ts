import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/", 
    "/api/webhooks/stripe",
    "/api/public/courses",
    "/api/public/(.*)",
    "/learn",
    "/courses", 
    "/lesson",
    "/lesson/(.*)",
    "/leaderboard",
    "/quests",
    "/shop"
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
