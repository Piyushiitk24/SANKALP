import Image from "next/image";

import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <div className="hidden h-20 w-full border-t-2 border-slate-200 p-2 lg:block">
      <div className="mx-auto flex h-full max-w-screen-lg items-center justify-evenly gap-x-2">
        <Button
          size="lg"
          variant="ghost"
          className="w-full cursor-default flex justify-center"
        >
          <Image
            src="/lt.png"
            alt="Learning Theories"
            height={32}
            width={40}
            className="mr-4 h-auto rounded-md"
          />
          Learning Theories
        </Button>

        <Button
          size="lg"
          variant="ghost"
          className="w-full cursor-default flex justify-center"
        >
          <Image
            src="/bt.png"
            alt="Bloom's Taxonomy"
            height={32}
            width={40}
            className="mr-4 h-auto rounded-md"
          />
          Bloom&apos;s Taxonomy
        </Button>

        <Button
          size="lg"
          variant="ghost"
          className="w-full cursor-default flex justify-center"
        >
          <Image
            src="/ag.png"
            alt="Andragogy"
            height={32}
            width={40}
            className="mr-4 h-auto rounded-md"
          />
          Andragogy
        </Button>

        <Button
          size="lg"
          variant="ghost"
          className="w-full cursor-default flex justify-center"
        >
          <Image
            src="/st.png"
            alt="Systematic Approach to Training (SAT)"
            height={32}
            width={40}
            className="mr-4 h-auto rounded-md"
          />
          Systematic Approach to Training (SAT)
        </Button>

        <Button
          size="lg"
          variant="ghost"
          className="w-full cursor-default flex justify-center"
        >
          <Image
            src="/dl.png"
            alt="Domains of Learning"
            height={32}
            width={40}
            className="mr-4 h-auto rounded-md"
          />
          Domains of Learning
        </Button>
      </div>
    </div>
  );
};
