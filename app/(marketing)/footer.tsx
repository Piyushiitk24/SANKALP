import Image from "next/image";

import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <div className="hidden h-20 w-full border-t-2 border-border bg-background p-2 lg:block">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-evenly gap-x-2 px-4 sm:px-6 lg:px-8">
        <Button
          size="lg"
          variant="ghost"
          className="w-full cursor-default flex justify-center items-center gap-2 text-xs lg:text-sm"
        >
          <Image
            src="/lt.png"
            alt="Learning Theories"
            height={28}
            width={35}
            className="h-auto rounded-md flex-shrink-0"
          />
          <span className="truncate">Learning Theories</span>
        </Button>

        <Button
          size="lg"
          variant="ghost"
          className="w-full cursor-default flex justify-center items-center gap-2 text-xs lg:text-sm"
        >
          <Image
            src="/bt.png"
            alt="Bloom's Taxonomy"
            height={28}
            width={35}
            className="h-auto rounded-md flex-shrink-0"
          />
          <span className="truncate">Bloom&apos;s Taxonomy</span>
        </Button>

        <Button
          size="lg"
          variant="ghost"
          className="w-full cursor-default flex justify-center items-center gap-2 text-xs lg:text-sm"
        >
          <Image
            src="/ag.png"
            alt="Andragogy"
            height={28}
            width={35}
            className="h-auto rounded-md flex-shrink-0"
          />
          <span className="truncate">Andragogy</span>
        </Button>

        <Button
          size="lg"
          variant="ghost"
          className="w-full cursor-default flex justify-center items-center gap-2 text-xs lg:text-sm"
        >
          <Image
            src="/st.png"
            alt="Systematic Approach to Training (SAT)"
            height={28}
            width={35}
            className="h-auto rounded-md flex-shrink-0"
          />
          <span className="truncate">Systematic Approach to Training (SAT)</span>
        </Button>

        <Button
          size="lg"
          variant="ghost"
          className="w-full cursor-default flex justify-center items-center gap-2 text-xs lg:text-sm"
        >
          <Image
            src="/dl.png"
            alt="Domains of Learning"
            height={28}
            width={35}
            className="h-auto rounded-md flex-shrink-0"
          />
          <span className="truncate">Domains of Learning</span>
        </Button>
      </div>
    </div>
  );
};
