"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createGuestUser, setGuestUser } from "@/lib/guest-user";

interface GuestDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuestDisclaimerModal = ({
  isOpen,
  onClose,
}: GuestDisclaimerModalProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleContinueAsGuest = () => {
    setIsLoading(true);
    
    // Create and store guest user
    const guestUser = createGuestUser();
    setGuestUser(guestUser);
    
    // Close modal and redirect to courses
    onClose();
    router.push("/courses");
  };

  const handleSignUp = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
              ⚠️
            </div>
            Continue as Guest?
          </DialogTitle>
          <DialogDescription>
            You&apos;re about to continue without creating an account. Here&apos;s what this means:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span className="text-gray-700 dark:text-gray-300">Your progress will <strong className="text-red-600 dark:text-red-400">not be saved permanently</strong></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span className="text-gray-700 dark:text-gray-300">You'll lose all progress if you close the browser</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span className="text-gray-700 dark:text-gray-300">No access to leaderboards or achievements</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span className="text-gray-700 dark:text-gray-300">Limited features compared to registered users</span>
            </div>
          </div>

          <div className="bg-[#a259ff]/10 p-3 rounded-lg">
            <div className="text-sm text-[#a259ff] font-medium">
              💡 <strong>Recommendation:</strong> Create a free account to save your progress and unlock all features!
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleSignUp}
            variant="neonPurple"
            className="w-full neon-purple-glow"
          >
            Create Free Account
          </Button>
          
          <Button
            onClick={handleContinueAsGuest}
            variant="ghost"
            className="w-full text-[#a259ff]"
            disabled={isLoading}
          >
            {isLoading ? "Starting..." : "Continue as Guest Anyway"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
