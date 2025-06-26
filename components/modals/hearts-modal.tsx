"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { refillHearts } from "@/actions/user-progress";
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

export const HeartsModal = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { isOpen, close } = useHeartsModal();
  const [showVideo, setShowVideo] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);

  useEffect(() => setIsClient(true), []);

  const onClick = () => {
    close();
    router.push("/store");
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (e.currentTarget.currentTime >= 30 && !videoWatched) {
      setVideoWatched(true);
    }
  };

  const handleRefill = () => {
    void refillHearts();
    setShowVideo(false);
    close();
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
            Get Pro for unlimited hearts, or purchase them in the store.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mb-4">
          <div className="flex w-full flex-col gap-y-4">
            <Button
              variant="primary"
              className="w-full"
              size="lg"
              onClick={onClick}
            >
              Get unlimited hearts
            </Button>

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
                onClick={handleRefill}
                disabled={!videoWatched}
              >
                {videoWatched ? "Refill Hearts" : "Watch 30 seconds to refill"}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
