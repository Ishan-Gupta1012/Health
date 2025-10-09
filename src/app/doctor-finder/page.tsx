
'use client';

import { Header } from "@/components/header";

export default function DoctorFinderPage() {
  return (
    <div className="relative min-h-screen w-full">
      <Header />
      <div className="flex items-center justify-center min-h-screen px-4 py-24">
        <div className="w-full max-w-4xl glass-card rounded-2xl">
          <div className="p-8 md:p-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Doctor Finder
            </h1>
            <p className="text-lg text-gray-700">
              This feature is coming soon. Stay tuned!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
