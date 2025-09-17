import { useId } from "react";

import { cn } from "@/lib/utils";
import type { SemaphorePose } from "@/lib/semaphore-visuals";

type PoseVariant = "default" | "active" | "correct" | "wrong";

type SemaphorePoseFigureProps = {
  pose: SemaphorePose;
  variant?: PoseVariant;
  className?: string;
};

const VARIANT_COLORS: Record<
  PoseVariant,
  {
    background: string;
    backgroundAccent: string;
    accent: string;
    accentSoft: string;
    figure: string;
    glow: string;
  }
> = {
  default: {
    background: "#161529",
    backgroundAccent: "#23193f",
    accent: "#a259ff",
    accentSoft: "#c084fc",
    figure: "#f9f7ff",
    glow: "rgba(162, 89, 255, 0.45)",
  },
  active: {
    background: "#1d1640",
    backgroundAccent: "#301f5a",
    accent: "#c084fc",
    accentSoft: "#e9d5ff",
    figure: "#f7f2ff",
    glow: "rgba(192, 132, 252, 0.55)",
  },
  correct: {
    background: "#133222",
    backgroundAccent: "#0e4a2f",
    accent: "#22c55e",
    accentSoft: "#86efac",
    figure: "#ecfdf5",
    glow: "rgba(34, 197, 94, 0.55)",
  },
  wrong: {
    background: "#34121b",
    backgroundAccent: "#551520",
    accent: "#ef4444",
    accentSoft: "#fca5a5",
    figure: "#fee2e2",
    glow: "rgba(239, 68, 68, 0.55)",
  },
};

const polarPoint = (
  originX: number,
  originY: number,
  angleDegrees: number,
  length: number
) => {
  const radians = (angleDegrees * Math.PI) / 180;
  return {
    x: originX + Math.cos(radians) * length,
    y: originY + Math.sin(radians) * length,
  };
};

export const SemaphorePoseFigure = ({
  pose,
  variant = "default",
  className,
}: SemaphorePoseFigureProps) => {
  const gradientId = `${useId()}-gradient`;
  const glowId = `${useId()}-glow`;
  const colors = VARIANT_COLORS[variant];

  const frame = {
    width: 120,
    height: 120,
    padding: 10,
    cornerRadius: 20,
  } as const;

  const centerX = frame.width / 2;
  const shoulderY = 48;
  const hipY = 86;

  const leftAnchorX = centerX - 14;
  const rightAnchorX = centerX + 14;

  const armLength = 36;
  const flagLength = 16;

  const leftHand = polarPoint(leftAnchorX, shoulderY, pose.leftAngle, armLength);
  const rightHand = polarPoint(rightAnchorX, shoulderY, pose.rightAngle, armLength);

  const leftFlagTip = polarPoint(
    leftAnchorX,
    shoulderY,
    pose.leftAngle,
    armLength + flagLength
  );
  const rightFlagTip = polarPoint(
    rightAnchorX,
    shoulderY,
    pose.rightAngle,
    armLength + flagLength
  );

  return (
    <svg
      viewBox={`0 0 ${frame.width} ${frame.height}`}
      role="presentation"
      aria-hidden
      focusable={false}
      className={cn("h-full w-full", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.background} />
          <stop offset="100%" stopColor={colors.backgroundAccent} />
        </linearGradient>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="6"
            floodColor={colors.glow}
          />
        </filter>
      </defs>

      <rect
        x={frame.padding}
        y={frame.padding}
        width={frame.width - frame.padding * 2}
        height={frame.height - frame.padding * 2}
        rx={frame.cornerRadius}
        fill={`url(#${gradientId})`}
        stroke={colors.accentSoft}
        strokeWidth={1.5}
        filter={`url(#${glowId})`}
      />

      <line
        x1={frame.padding + 14}
        y1={hipY + 18}
        x2={frame.width - frame.padding - 14}
        y2={hipY + 18}
        stroke="rgba(148, 163, 184, 0.15)"
        strokeWidth={3}
        strokeLinecap="round"
      />

      <circle
        cx={centerX}
        cy={shoulderY - 20}
        r={9}
        fill={colors.figure}
        stroke={colors.accentSoft}
        strokeWidth={1.5}
      />
      <line
        x1={centerX}
        y1={shoulderY - 10}
        x2={centerX}
        y2={hipY}
        stroke={colors.figure}
        strokeWidth={6}
        strokeLinecap="round"
      />
      <line
        x1={centerX}
        y1={hipY}
        x2={centerX - 10}
        y2={hipY + 18}
        stroke={colors.figure}
        strokeWidth={6}
        strokeLinecap="round"
      />
      <line
        x1={centerX}
        y1={hipY}
        x2={centerX + 10}
        y2={hipY + 18}
        stroke={colors.figure}
        strokeWidth={6}
        strokeLinecap="round"
      />

      <line
        x1={leftAnchorX}
        y1={shoulderY}
        x2={leftHand.x}
        y2={leftHand.y}
        stroke={colors.figure}
        strokeWidth={6}
        strokeLinecap="round"
      />
      <line
        x1={rightAnchorX}
        y1={shoulderY}
        x2={rightHand.x}
        y2={rightHand.y}
        stroke={colors.figure}
        strokeWidth={6}
        strokeLinecap="round"
      />

      <line
        x1={leftHand.x}
        y1={leftHand.y}
        x2={leftFlagTip.x}
        y2={leftFlagTip.y}
        stroke={colors.accent}
        strokeWidth={8}
        strokeLinecap="round"
        filter={`url(#${glowId})`}
      />
      <line
        x1={rightHand.x}
        y1={rightHand.y}
        x2={rightFlagTip.x}
        y2={rightFlagTip.y}
        stroke={colors.accent}
        strokeWidth={8}
        strokeLinecap="round"
        filter={`url(#${glowId})`}
      />

      <circle
        cx={leftFlagTip.x}
        cy={leftFlagTip.y}
        r={4.5}
        fill={colors.accentSoft}
      />
      <circle
        cx={rightFlagTip.x}
        cy={rightFlagTip.y}
        r={4.5}
        fill={colors.accentSoft}
      />
    </svg>
  );
};
