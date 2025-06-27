"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { XIcon } from "lucide-react";
import Link from "next/link";

type BannerProps = {
  hide: boolean;
  setHide: Dispatch<SetStateAction<boolean>>;
};

const BANNER_KEY = "hide-gamification-quiz-banner";

const Banner = ({ hide, setHide }: BannerProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const hideBanner = localStorage.getItem(BANNER_KEY);

    if (hideBanner) return;

    setHide(false);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBannerClose = () => {
    setHide(true);
    localStorage.setItem(BANNER_KEY, "1");
  };

  if (hide || isScrolled) return null;

  return (
    <div
      id="sticky-banner"
      className="fixed left-0 top-0 z-50 block w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-lg">🧪</span>
            <div className="text-sm">
              <span className="font-semibold">Testing Phase:</span> This project is currently in testing.{" "}
              <span className="hidden sm:inline">
                If you find bugs, please{" "}
                <Link
                  href="https://github.com/Piyushiitk24/SANKALP/issues/new"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-white underline hover:no-underline"
                >
                  report them
                </Link>
                . Only Module 1 has questions currently.{" "}
                <Link
                  href="https://github.com/Piyushiitk24"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-white underline hover:no-underline"
                >
                  Contact admin
                </Link>
                {" "}to contribute courses, modules, units, lessons, or challenges!
              </span>
              <span className="sm:hidden">
                Found bugs?{" "}
                <Link
                  href="https://github.com/Piyushiitk24/SANKALP/issues/new"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-white underline hover:no-underline"
                >
                  Report
                </Link>
                {" "}•{" "}
                <Link
                  href="https://github.com/Piyushiitk24"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-white underline hover:no-underline"
                >
                  Contribute
                </Link>
              </span>
            </div>
          </div>
          
          <button
            data-dismiss-target="#sticky-banner"
            onClick={handleBannerClose}
            type="button"
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            <XIcon className="size-4" strokeWidth={3} />
            <span className="sr-only">Close banner</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
