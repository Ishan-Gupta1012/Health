"use client";

import { useEffect, useState } from "react";

export function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 60; // Animate over 60 frames
    const animation_duration = 1500; // 1.5 seconds

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = Math.round(value * progress);

      if (frame === totalFrames) {
        setCount(value);
        clearInterval(counter);
        return;
      }
      
      setCount(currentCount);
    }, animation_duration / totalFrames);

    return () => clearInterval(counter);
  }, [value]);

  return <span>{count}</span>;
}
