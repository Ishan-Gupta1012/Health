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
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <SmoothScroll>
        <div data-scroll-section>
           <div className="relative flex h-screen flex-col items-center justify-center text-center px-4">
            <div className="relative z-10">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl text-gray-800" style={{ zIndex: 2, lineHeight: 1.2 }}>
                Your Unified Smart Health Assistant
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-800 md:text-xl mt-4">
                Smart health tracking, doctor finder, medicine reminders & record sharing — all in one place.
              </p>
              <div className="flex gap-4 mt-8 justify-center">
                <Button size="lg" asChild className="neon-shadow-primary-hover">
                  <a href="#home" data-scroll-to>Get Started</a>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/20">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div data-scroll-section>
          <FeaturesSection />
        </div>
        <div data-scroll-section>
          <AboutSection />
        </div>
        <div data-scroll-section>
          <Footer />
        </div>
      </SmoothScroll>
    </>
  );
}
