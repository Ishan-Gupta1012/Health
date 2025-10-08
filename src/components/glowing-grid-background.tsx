"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export function GlowingGridBackground() {
  const id = useId();

  return (
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden bg-[hsl(var(--background))]">
      {/* Radial gradient for the center glow */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.15)_0%,transparent_40%)]" />

      {/* The SVG grid */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 z-10 h-full w-full grid-glow-animation"
      >
        <defs>
          <pattern
            id={id}
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M.5 40V.5H40"
              fill="none"
              stroke="hsl(var(--primary) / 0.5)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
