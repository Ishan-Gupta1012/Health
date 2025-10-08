"use client";

import dynamic from 'next/dynamic'

export const HealthNestBackgroundDynamic = dynamic(
  () => import('./healthnest-background').then((mod) => mod.HealthNestBackground),
  { ssr: false }
)
