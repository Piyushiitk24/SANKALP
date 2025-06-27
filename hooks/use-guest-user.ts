"use client";

import { useState, useEffect } from "react";
import { GuestUser, getGuestUser, setGuestUser, updateGuestUser } from "@/lib/guest-user";

export const useGuestUser = () => {
  const [guestUser, setGuestUserState] = useState<GuestUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const user = getGuestUser();
    setGuestUserState(user);
    setIsLoaded(true);

    // Listen for localStorage changes from other tabs/components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "sankalp_guest_user") {
        const updatedUser = e.newValue ? JSON.parse(e.newValue) : null;
        setGuestUserState(updatedUser);
      }
    };

    // Listen for custom events from the same tab
    const handleGuestUserUpdate = () => {
      const user = getGuestUser();
      setGuestUserState(user);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("guest-user-updated", handleGuestUserUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("guest-user-updated", handleGuestUserUpdate);
    };
  }, []);

  const updateUser = (updates: Partial<Omit<GuestUser, 'id' | 'isGuest'>>) => {
    const updatedUser = updateGuestUser(updates);
    if (updatedUser) {
      setGuestUserState(updatedUser);
      // Dispatch custom event to notify other components in the same tab
      window.dispatchEvent(new CustomEvent("guest-user-updated"));
    }
    return updatedUser;
  };

  const setUser = (user: GuestUser) => {
    setGuestUser(user);
    setGuestUserState(user);
    // Dispatch custom event to notify other components in the same tab
    window.dispatchEvent(new CustomEvent("guest-user-updated"));
  };

  return {
    guestUser,
    isLoaded,
    updateUser,
    setUser,
  };
};
