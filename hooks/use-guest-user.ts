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
  }, []);

  const updateUser = (updates: Partial<Omit<GuestUser, 'id' | 'isGuest'>>) => {
    const updatedUser = updateGuestUser(updates);
    if (updatedUser) {
      setGuestUserState(updatedUser);
    }
    return updatedUser;
  };

  const setUser = (user: GuestUser) => {
    setGuestUser(user);
    setGuestUserState(user);
  };

  return {
    guestUser,
    isLoaded,
    updateUser,
    setUser,
  };
};
