"use client";

import { cn } from "@/lib/utils";

export function LoadingStethoscope({ className }: { className?: string }) {
  return (
    <div className={cn("flex justify-center items-center", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-pulse-glow"
      >
        <path d="M4 18a2 2 0 0 0-2 2v2" />
        <path d="M22 18a2 2 0 0 1-2 2v2" />
        <path d="M18 10a4 4 0 0 0-4-4h-4a4 4 0 0 0-4 4v0" />
        <path d="M18 10v0a2 2 0 1 1-4 0v-4" />
        <path d="M14 10v0a2 2 0 1 0-4 0v-4" />
        <circle cx="12" cy="18" r="4" />
        <path d="M12 14v-2" />
      </svg>
    </div>
  );
}
