"use client";
import { useState } from "react";

import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

import Banner from "./banner";

export const Header = () => {
  const { isSignedIn } = useAuth();
  const [hideBanner, setHideBanner] = useState(false);

  return (
    <>
      <Banner hide={hideBanner} setHide={setHideBanner} />

      <header
        className={cn(
          "h-20 w-full border-b-2 border-border bg-background",
          !hideBanner ? "mt-20 sm:mt-16 lg:mt-10" : "mt-0"
        )}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-x-3 pb-7 pt-8">
            <Image src="/mascotnew.svg" alt="Mascot" height={40} width={40} />
            <div className="flex flex-col">
              <h1 className="text-2xl font-extrabold tracking-wide text-neon-purple-glow">
                SANKALP<sup className="text-xs">®</sup>
              </h1>
              <p className="text-[10px] text-gray-500 leading-tight -mt-1">
                Study of Advanced Novel Knowledge And Learning Practices
              </p>
            </div>
          </Link>

          <div className="flex gap-x-3">
            <ClerkLoading>
              <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
            </ClerkLoading>
            <ClerkLoaded>
              <SignedIn>
                <UserButton 
                  afterSignOutUrl="/" 
                  appearance={{
                    variables: {
                      colorPrimary: "#a259ff",
                    },
                    elements: {
                      userButtonPopoverCard: {
                        boxShadow: "0 10px 15px -3px rgba(162, 89, 255, 0.1), 0 4px 6px -2px rgba(162, 89, 255, 0.05)",
                      },
                    },
                  }}
                />
              </SignedIn>

              <SignedOut>
                <SignInButton
                  mode="modal"
                  fallbackRedirectUrl="/learn"
                  signUpFallbackRedirectUrl="/learn"
                >
                  <Button
                    size="lg"
                    variant="ghost"
                    className="text-[#a259ff]"
                  >
                    Login
                  </Button>
                </SignInButton>
              </SignedOut>

              <ThemeToggle variant="simple" className="mr-2" />

              <Link
                href="https://github.com/Piyushiitk24"
                target="_blank"
                rel="noreferrer noopener"
                className={isSignedIn ? "pt-1.5" : "pt-3"}
              >
                <Image
                  src="/github.svg"
                  alt="Source Code"
                  height={20}
                  width={20}
                />
              </Link>
            </ClerkLoaded>
          </div>
        </div>
      </header>
    </>
  );
};
