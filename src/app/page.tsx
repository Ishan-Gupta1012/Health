import { FeaturesSection } from '@/components/features-section';
import { AboutSection } from '@/components/about-section';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="flex flex-1 flex-col z-10">
        <Header />
        <main className="flex-1">
          <div className="relative z-10 flex h-screen flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl font-bold tracking-tighter text-gray-800 sm:text-6xl">
              Your Unified Smart Health Assistant
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl mt-4">
              Smart health tracking, doctor finder, medicine reminders & record sharing — all in one place.
            </p>
             <div className="flex gap-4 mt-8">
                <Button size="lg" asChild>
                    <Link href="#features">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/20">
                    Learn More
                </Button>
            </div>
          </div>
          <FeaturesSection />
          <AboutSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
