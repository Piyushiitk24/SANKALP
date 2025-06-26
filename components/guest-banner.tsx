"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { X, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useGuestUser } from "@/hooks/use-guest-user";

export const GuestBanner = () => {
  const { user, isLoaded: userLoaded } = useUser();
  const { guestUser, isLoaded: guestLoaded } = useGuestUser();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (!userLoaded || !guestLoaded) return;
    
    // Show banner only for guest users and if not dismissed
    if (!user && guestUser && !isDismissed) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [user, guestUser, userLoaded, guestLoaded, isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  const handleSignUp = () => {
    window.location.href = "/sign-up";
  };

  if (!isVisible) return null;

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-semibold">Guest Mode:</span> Your progress won&apos;t be saved.{" "}
              <span className="hidden sm:inline">
                Sign up to save progress, access leaderboards, and unlock premium features!
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSignUp}
              size="sm"
              variant="secondary"
              className="text-xs bg-white text-orange-600 hover:bg-gray-100"
            >
              Sign Up
            </Button>
            <Button
              onClick={handleDismiss}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
