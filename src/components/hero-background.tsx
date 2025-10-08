"use client";
import { useEffect, useState } from 'react';

export function HeroBackground() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_10%,hsl(var(--primary)/0.1),transparent_40%)]" />
      <div className="absolute bottom-0 left-0 right-0 top-auto h-3/4 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute left-1/2 top-1/2 -z-20 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />
    </div>
  );
}
