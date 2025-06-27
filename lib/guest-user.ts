import { MAX_HEARTS } from "@/constants";

export type GuestUser = {
  id: string;
  userName: string;
  userImageSrc: string;
  activeCourseId: number | null;
  activeCourse?: {
    id: number;
    title: string;
    imageSrc: string;
  } | null;
  hearts: number;
  points: number;
  isGuest: true;
};

export const GUEST_USER_KEY = "sankalp_guest_user";

export const createGuestUser = (): GuestUser => {
  const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  return {
    id: guestId,
    userName: "Guest User",
    userImageSrc: "/mascotnew.svg",
    activeCourseId: null,
    hearts: MAX_HEARTS,
    points: 0,
    isGuest: true,
  };
};

export const getGuestUser = (): GuestUser | null => {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = localStorage.getItem(GUEST_USER_KEY);
    if (!stored) return null;
    
    return JSON.parse(stored) as GuestUser;
  } catch {
    return null;
  }
};

export const setGuestUser = (user: GuestUser): void => {
  if (typeof window === "undefined") return;
  
  localStorage.setItem(GUEST_USER_KEY, JSON.stringify(user));
  // Dispatch custom event to notify components of the change
  window.dispatchEvent(new CustomEvent("guest-user-updated"));
};

export const clearGuestUser = (): void => {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem(GUEST_USER_KEY);
  // Dispatch custom event to notify components of the change
  window.dispatchEvent(new CustomEvent("guest-user-updated"));
};

export const updateGuestUser = (updates: Partial<Omit<GuestUser, 'id' | 'isGuest'>>): GuestUser | null => {
  const currentUser = getGuestUser();
  if (!currentUser) {
    // If no guest user exists, create one with the updates
    const newUser = { ...createGuestUser(), ...updates };
    setGuestUser(newUser);
    return newUser;
  }
  
  const updatedUser = { ...currentUser, ...updates };
  setGuestUser(updatedUser);
  return updatedUser;
};
