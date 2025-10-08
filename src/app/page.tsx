import { Header } from '@/components/header';
import { FeaturesSection } from '@/components/features-section';
import { AboutSection } from '@/components/about-section';
import { Footer } from '@/components/footer';
import { HeroBackground } from '@/components/hero-background';
import { Button } from '@/components/ui/button';
import { Stethoscope } from 'lucide-react';
import Link from 'next/link';

function HeroSection() {
  return (
    <section className="relative w-full py-24 md:py-32 lg:py-48 text-center overflow-hidden">
      <HeroBackground />
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Stethoscope className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium tracking-wide">
                HealthNest
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tighter">
              <span className="block">Your Unified</span>
              <span className="block gradient-text">Smart Health Assistant</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
              Smart health tracking, doctor finder, medicine reminders & record sharing — all in one place.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="#features">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                 <Link href="#about">Learn More</Link>
              </Button>
            </div>
        </div>
      </div>
    </section>
  );
}


export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
