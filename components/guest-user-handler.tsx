"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@clerk/nextjs";

import { createGuestUser, getGuestUser, setGuestUser } from "@/lib/guest-user";

import { GuestCourseSelection } from "./guest-course-selection";

export const GuestUserHandler = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, userId } = useAuth();
  const [guestUser, setGuestUserState] = useState<ReturnType<typeof getGuestUser>>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !isLoaded) return;

    // If user is authenticated, proceed normally
    if (userId) return;

    // Handle guest user
    const existingGuestUser = getGuestUser();
    
    if (!existingGuestUser) {
      // Create new guest user
      const newGuestUser = createGuestUser();
      setGuestUser(newGuestUser);
      setGuestUserState(newGuestUser);
    } else {
      setGuestUserState(existingGuestUser);
    }

    // Listen for guest user updates
    const handleGuestUserUpdate = () => {
      const updatedGuestUser = getGuestUser();
      console.log("[GUEST HANDLER] Event received, updating guest user:", updatedGuestUser?.id, "activeCourse:", updatedGuestUser?.activeCourseId);
      setGuestUserState(updatedGuestUser);
    };

    window.addEventListener("guest-user-updated", handleGuestUserUpdate);

    return () => {
      window.removeEventListener("guest-user-updated", handleGuestUserUpdate);
    };
  }, [isClient, isLoaded, userId]);

  // Show loading while checking auth
  if (!isClient || !isLoaded) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#a259ff]"></div>
      </div>
    );
  }

  // If authenticated user, render children normally
  if (userId) {
    return <>{children}</>;
  }

  // If guest user without active course, show course selection
  if (guestUser && !guestUser.activeCourseId) {
    console.log("[GUEST HANDLER] Showing course selection for guest:", guestUser.id);
    return <GuestCourseSelection />;
  }

  // If guest user with active course, render children
  if (guestUser && guestUser.activeCourseId) {
    console.log("[GUEST HANDLER] Rendering children for guest with course:", guestUser.activeCourseId);
    return <>{children}</>;
  }

  // Fallback loading state
  return (
    <div className="flex h-full items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#a259ff]"></div>
    </div>
  );
};
