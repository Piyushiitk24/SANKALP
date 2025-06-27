import { useCallback } from "react";

import Image from "next/image";
import { useAudio, useKey } from "react-use";
import { CheckCircle, XCircle, Volume2 } from "lucide-react";

import { challenges } from "@/db/schema";
import { cn } from "@/lib/utils";

type CardProps = {
  id: number;
  text: string;
  imageSrc: string | null;
  audioSrc: string | null;
  shortcut: string;
  selected?: boolean;
  onClick: () => void;
  status?: "correct" | "wrong" | "none";
  disabled?: boolean;
  type: (typeof challenges.$inferSelect)["type"];
};

export const Card = ({
  text,
  imageSrc,
  audioSrc,
  shortcut,
  selected,
  onClick,
  status,
  disabled,
  type,
}: CardProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [audio, _, controls] = useAudio({ src: audioSrc || "" });

  const handleClick = useCallback(() => {
    if (disabled) return;

    void controls.play();
    onClick();
  }, [disabled, onClick, controls]);

  useKey(shortcut, handleClick, {}, [handleClick]);

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl border-2 cursor-pointer transition-all duration-300 ease-out",
        "bg-white shadow-lg hover:shadow-xl hover:-translate-y-1",
        "border-gray-200 hover:border-gray-300",
        // Selected states
        selected && !status && "border-blue-400 bg-blue-50 shadow-blue-200/50",
        selected && status === "correct" && "border-emerald-400 bg-emerald-50 shadow-emerald-200/50 hover:border-emerald-500",
        selected && status === "wrong" && "border-red-400 bg-red-50 shadow-red-200/50 hover:border-red-500",
        // Disabled state
        disabled && "pointer-events-none opacity-60 hover:translate-y-0 hover:shadow-lg",
        // Type-specific sizing
        type === "ASSIST" && "min-h-[80px]",
        type === "SELECT" && "min-h-[100px]"
      )}
    >
      {audio}
      
      {/* Decorative gradient background */}
      <div className={cn(
        "absolute inset-0 opacity-0 transition-opacity duration-300",
        "bg-gradient-to-br from-blue-500/5 to-purple-500/5",
        selected && !status && "opacity-100",
        selected && status === "correct" && "from-emerald-500/10 to-teal-500/10 opacity-100",
        selected && status === "wrong" && "from-red-500/10 to-pink-500/10 opacity-100"
      )} />

      {/* Content container */}
      <div className="relative p-4 lg:p-6">
        {/* Image section */}
        {imageSrc && (
          <div className="relative mb-4 mx-auto aspect-square max-h-[80px] w-fit lg:max-h-[120px]">
            <div className="relative overflow-hidden rounded-xl bg-gray-100 p-2">
              <Image 
                src={imageSrc} 
                fill 
                alt={text}
                className="object-contain"
              />
            </div>
          </div>
        )}

        {/* Text and controls section */}
        <div className={cn(
          "flex items-center gap-3",
          type === "ASSIST" && "flex-row-reverse justify-between"
        )}>
          {/* Main text */}
          <div className="flex-1">
            <p className={cn(
              "text-sm lg:text-base font-medium leading-relaxed transition-colors duration-200",
              "text-gray-700",
              selected && !status && "text-blue-700",
              selected && status === "correct" && "text-emerald-700",
              selected && status === "wrong" && "text-red-700"
            )}>
              {text}
            </p>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Audio button */}
            {audioSrc && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  void controls.play();
                }}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200",
                  "bg-gray-100 hover:bg-gray-200 text-gray-600",
                  selected && !status && "bg-blue-100 hover:bg-blue-200 text-blue-600",
                  selected && status === "correct" && "bg-emerald-100 hover:bg-emerald-200 text-emerald-600",
                  selected && status === "wrong" && "bg-red-100 hover:bg-red-200 text-red-600"
                )}
              >
                <Volume2 className="h-4 w-4" />
              </button>
            )}

            {/* Status icon or shortcut */}
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200",
              "bg-gray-100 border-2 border-gray-200",
              // Unselected state
              !selected && "text-gray-500 text-sm font-semibold hover:bg-gray-200",
              // Selected state
              selected && !status && "bg-blue-100 border-blue-300 text-blue-600 text-sm font-semibold",
              // Correct state
              selected && status === "correct" && "bg-emerald-100 border-emerald-300 text-emerald-600",
              // Wrong state  
              selected && status === "wrong" && "bg-red-100 border-red-300 text-red-600"
            )}>
              {selected && status === "correct" ? (
                <CheckCircle className="h-5 w-5" />
              ) : selected && status === "wrong" ? (
                <XCircle className="h-5 w-5" />
              ) : (
                <span className="text-xs font-bold">{shortcut}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Animated border effect */}
      <div className={cn(
        "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none",
        "ring-2 ring-inset",
        selected && !status && "opacity-100 ring-blue-400/30",
        selected && status === "correct" && "opacity-100 ring-emerald-400/40",
        selected && status === "wrong" && "opacity-100 ring-red-400/40"
      )} />
    </div>
  );
};
