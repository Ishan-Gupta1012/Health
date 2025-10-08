import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HeroBackground } from '@/components/hero-background';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative w-full py-24 md:py-32 lg:py-40">
      <HeroBackground />
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            HealthNest
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Your Unified Smart Health Assistant
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Smart health tracking, doctor finder, medicine reminders & record sharing — all in one place.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
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
