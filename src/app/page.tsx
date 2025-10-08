'use client';

import { FeaturesSection } from '@/components/features-section';
import { AboutSection } from '@/components/about-section';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { SmoothScroll } from '@/components/smooth-scroll';

export default function Home() {
  return (
    <>
      <Header />
      <SmoothScroll>
        <div data-scroll-section>
          <div className="relative z-10 flex h-screen flex-col items-center justify-center text-center px-4" data-bgcolor="#f5f5f5" data-textcolor="#111827">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl" style={{ zIndex: 2, lineHeight: 1.2 }}>
              Your Unified Smart Health Assistant
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl mt-4">
              Smart health tracking, doctor finder, medicine reminders & record sharing — all in one place.
            </p>
            <div className="flex gap-4 mt-8">
              <Button size="lg" asChild>
                <a href="#features" data-scroll-to>Get Started</a>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/20">
                Learn More
              </Button>
            </div>
          </div>
        </div>
        <div data-scroll-section data-bgcolor="#3CB371" data-textcolor="#ffffff">
          <FeaturesSection />
        </div>
        <div data-scroll-section data-bgcolor="#87CEEB" data-textcolor="#111827">
          <AboutSection />
        </div>
        <div data-scroll-section data-bgcolor="#1c1c1e" data-textcolor="#ffffff">
          <Footer />
        </div>
      </SmoothScroll>
    </>
  );
}
