"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import { refillHeartsFromVideo } from "@/actions/user-progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { useGuestUser } from "@/hooks/use-guest-user";
import { refillGuestHearts } from "@/lib/guest-progress";
import { MAX_HEARTS, DEMO_MODE } from "@/constants";

export const HeartsModal = () => {
  const router = useRouter();
  const { user } = useUser();
  const { guestUser, updateUser } = useGuestUser();
  const [isClient, setIsClient] = useState(false);
  const { isOpen, close, onHeartsRefilled, showVideoOnOpen } = useHeartsModal();
  const [showVideo, setShowVideo] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);
  const [isRefilling, setIsRefilling] = useState(false);

  useEffect(() => setIsClient(true), []);

  // Auto-show video when opened with video flag (for demo mode from shop)
  useEffect(() => {
    if (showVideoOnOpen && isOpen) {
      setShowVideo(true);
    }
  }, [showVideoOnOpen, isOpen]);

  const onClick = () => {
    close();
    // In demo mode, don't redirect to shop since paid options are hidden
    if (DEMO_MODE.HIDE_PAID_HEART_OPTIONS) {
      return;
    }
    
    if (user) {
      router.push("/shop");
    } else {
      // For guests, redirect to sign up
      router.push("/sign-up");
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (e.currentTarget.currentTime >= 30 && !videoWatched) {
      setVideoWatched(true);
    }
  };

  const handleRefill = async () => {
    try {
      setIsRefilling(true);
      
      if (user) {
        // Authenticated user - use server action
        await refillHeartsFromVideo();
      } else if (guestUser) {
        // Guest user - handle client-side
        const result = refillGuestHearts();
        if (result.success) {
          updateUser({ hearts: result.hearts || MAX_HEARTS });
        }
      }
      
      setShowVideo(false);
      
      // Call the callback to update hearts in the quiz component
      if (onHeartsRefilled) {
        onHeartsRefilled();
      }
      
      close();
      // Refresh the page data to update hearts display
      router.refresh();
    } catch (error) {
      console.error("Failed to refill hearts:", error);
      // You could add a toast notification here if needed
    } finally {
      setIsRefilling(false);
      setShowVideo(false);
      setVideoWatched(false);
    }
  };

  const handleRefillClick = () => {
    void handleRefill();
  };

  if (!isClient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mb-5 flex w-full items-center justify-center">
            <Image
              src="/mascot_bad.svg"
              alt="Mascot Bad"
              height={80}
              width={80}
            />
          </div>

          <DialogTitle className="text-center text-2xl font-bold">
            You ran out of hearts!
          </DialogTitle>

          <DialogDescription className="text-center text-base">
            {DEMO_MODE.HIDE_PAID_HEART_OPTIONS 
              ? "Watch a short video to refill your hearts for free!"
              : user 
                ? "Get Pro for unlimited hearts, purchase them in the store, or watch a short video to refill them for free."
                : "Sign up to get Pro for unlimited hearts, or watch a short video to refill them for free."
            }
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mb-4">
          <div className="flex w-full flex-col gap-y-4">
            {/* Hide paid option in demo mode */}
            {!DEMO_MODE.HIDE_PAID_HEART_OPTIONS && (
              <Button
                variant="primary"
                className="w-full"
                size="lg"
                onClick={onClick}
              >
                {user ? "Get unlimited hearts" : "Sign up for unlimited hearts"}
              </Button>
            )}

            <Button
              variant="primaryOutline"
              className="w-full"
              size="lg"
              onClick={close}
            >
              No thanks
            </Button>

            <Button
              variant="secondary"
              className="w-full"
              size="lg"
              onClick={() => setShowVideo(true)}
            >
              Watch a video to refill hearts
            </Button>
          </div>

          {showVideo && (
            <div className="mt-4 flex flex-col items-center">
              <video
                width={320}
                height={180}
                controls
                onTimeUpdate={handleTimeUpdate}
              >
                <source src="/bt.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <Button
                className="mt-4"
                onClick={handleRefillClick}
                disabled={!videoWatched || isRefilling}
              >
                {isRefilling 
                  ? "Refilling hearts..." 
                  : videoWatched 
                    ? "Refill Hearts" 
                    : "Watch 30 seconds to refill"
                }
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
