import Image from "next/image";

import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <div className="w-full border-t-2 border-border bg-background p-2">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-center gap-x-1 sm:gap-x-2 px-2 sm:px-4 lg:px-8">
        <Button
          size="sm"
          variant="ghost"
          className="flex-1 cursor-default flex justify-center items-center gap-1 text-xs lg:text-sm min-w-0"
        >
          <Image
            src="/lt.png"
            alt="Learning Theories"
            height={20}
            width={25}
            className="h-auto rounded-md flex-shrink-0"
          />
          <span className="truncate">Learning Theories</span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="flex-1 cursor-default flex justify-center items-center gap-1 text-xs lg:text-sm min-w-0"
        >
          <Image
            src="/bt.png"
            alt="Bloom's Taxonomy"
            height={20}
            width={25}
            className="h-auto rounded-md flex-shrink-0"
          />
          <span className="truncate">Bloom&apos;s Taxonomy</span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="flex-1 cursor-default flex justify-center items-center gap-1 text-xs lg:text-sm min-w-0"
        >
          <Image
            src="/ag.png"
            alt="Andragogy"
            height={20}
            width={25}
            className="h-auto rounded-md flex-shrink-0"
          />
          <span className="truncate">Andragogy</span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="flex-1 cursor-default flex justify-center items-center gap-1 text-xs lg:text-sm min-w-0"
        >
          <Image
            src="/st.png"
            alt="Systematic Approach to Training (SAT)"
            height={20}
            width={25}
            className="h-auto rounded-md flex-shrink-0"
          />
          <span className="truncate hidden sm:inline">Systematic Approach to Training (SAT)</span>
          <span className="truncate sm:hidden">SAT</span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="flex-1 cursor-default flex justify-center items-center gap-1 text-xs lg:text-sm min-w-0"
        >
          <Image
            src="/dl.png"
            alt="Domains of Learning"
            height={20}
            width={25}
            className="h-auto rounded-md flex-shrink-0"
          />
          <span className="truncate hidden sm:inline">Domains of Learning</span>
          <span className="truncate sm:hidden">Domains</span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="flex-1 cursor-default flex justify-center items-center gap-1 text-xs lg:text-sm min-w-0"
        >
          <Image
            src="/semaphore.svg"
            alt="Semaphore"
            height={20}
            width={25}
            className="h-auto rounded-md flex-shrink-0"
          />
          <span className="truncate">Semaphore</span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="flex-1 cursor-default flex justify-center items-center gap-1 text-xs lg:text-sm min-w-0"
        >
          <Image
            src="/flashing.svg"
            alt="Flashing (Morse Code)"
            height={20}
            width={25}
            className="h-auto rounded-md flex-shrink-0"
          />
          <span className="truncate hidden sm:inline">Flashing (Morse Code)</span>
          <span className="truncate sm:hidden">Flashing</span>
        </Button>
      </div>
    </div>
  );
};
