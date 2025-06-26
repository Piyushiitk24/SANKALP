"use client";

import { useTransition } from "react";

import Image from "next/image";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

import { refillHearts } from "@/actions/user-progress";
import { createStripeUrl } from "@/actions/user-subscription";
import { Button } from "@/components/ui/button";
import { MAX_HEARTS, POINTS_TO_REFILL } from "@/constants";
import { useGuestUser } from "@/hooks/use-guest-user";
import { refillGuestHearts } from "@/lib/guest-progress";

type ItemsProps = {
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

export const Items = ({
  hearts,
  points,
  hasActiveSubscription,
}: ItemsProps) => {
  const { user } = useUser();
  const { guestUser, updateUser } = useGuestUser();
  const [pending, startTransition] = useTransition();

  const onRefillHearts = () => {
    if (pending || hearts === MAX_HEARTS || points < POINTS_TO_REFILL) return;

    if (user) {
      // Authenticated user - use server action
      startTransition(() => {
        refillHearts().catch(() => toast.error("Something went wrong."));
      });
    } else if (guestUser) {
      // Guest user - handle client-side
      const result = refillGuestHearts();
      if (result.success) {
        updateUser({ 
          hearts: result.hearts || MAX_HEARTS,
          points: guestUser.points - POINTS_TO_REFILL 
        });
        toast.success("Hearts refilled!");
      } else {
        toast.error("Unable to refill hearts.");
      }
    }
  };

  const onUpgrade = () => {
    if (!user) {
      toast.error("Please sign up to access premium features!");
      return;
    }

    toast.loading("Redirecting to checkout...");
    startTransition(() => {
      createStripeUrl()
        .then((response) => {
          if (response.data) window.location.href = response.data;
        })
        .catch(() => toast.error("Something went wrong."));
    });
  };

  return (
    <ul className="w-full">
      <div className="flex w-full items-center gap-x-4 border-t-2 p-4">
        <Image src="/heart.svg" alt="Heart" height={60} width={60} />

        <div className="flex-1">
          <p className="text-base font-bold text-neutral-700 lg:text-xl">
            Refill hearts
          </p>
        </div>

        <Button
          onClick={onRefillHearts}
          disabled={
            pending || hearts === MAX_HEARTS || points < POINTS_TO_REFILL
          }
          aria-disabled={
            pending || hearts === MAX_HEARTS || points < POINTS_TO_REFILL
          }
        >
          {hearts === MAX_HEARTS ? (
            "full"
          ) : (
            <div className="flex items-center">
              <Image src="/points.svg" alt="Points" height={20} width={20} />

              <p>{POINTS_TO_REFILL}</p>
            </div>
          )}
        </Button>
      </div>

      <div className="flex w-full items-center gap-x-4 border-t-2 p-4 pt-8">
        <Image src="/unlimited.svg" alt="Unlimited" height={60} width={60} />

        <div className="flex-1">
          <p className="text-base font-bold text-neutral-700 lg:text-xl">
            Unlimited hearts
          </p>
          {!user && (
            <p className="text-sm text-muted-foreground">
              Sign up required
            </p>
          )}
        </div>

        <Button onClick={onUpgrade} disabled={pending} aria-disabled={pending}>
          {!user ? "Sign up" : hasActiveSubscription ? "settings" : "upgrade"}
        </Button>
      </div>
    </ul>
  );
};
