import { FeaturesSection } from '@/components/features-section';
import { AboutSection } from '@/components/about-section';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-transparent">
      <div className="flex flex-1 flex-col z-10">
        <Header />
        <main className="flex-1">
          <div className="relative z-10 flex h-screen flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold tracking-tighter text-gray-800 sm:text-6xl">
              Your Unified Smart Health Assistant
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl mt-4">
              Smart health tracking, doctor finder, medicine reminders & record sharing — all in one place.
            </p>
          </div>
          <FeaturesSection />
          <AboutSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
