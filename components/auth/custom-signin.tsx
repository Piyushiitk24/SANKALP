"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const CustomSignIn = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <SignIn 
        appearance={{
          variables: {
            colorPrimary: "#a259ff",
          },
        }}
      />
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Don&apos;t want to sign up?</span>
        <Button variant="ghost" className="h-auto p-0 text-[#a259ff] underline" asChild>
          <Link href="/learn">Continue as Guest</Link>
        </Button>
      </div>
    </div>
  );
};
