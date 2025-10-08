'use client';

import dynamic from 'next/dynamic';

export const DnaBackgroundDynamic = dynamic(
  () => import('./dna-background').then((mod) => mod.DnaBackground),
  {
    ssr: false,
  }
);
