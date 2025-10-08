import { FeaturesSection } from '@/components/features-section';
import { AboutSection } from '@/components/about-section';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { cn } from '@/lib/utils';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-transparent">
      <AnimatedGridPattern
        className={cn(
          '[--color-1:theme(colors.cyan.100)] [--color-2:theme(colors.purple.100)] [--color-3:theme(colors.rose.100)]',
          'absolute inset-0 -z-10 h-full w-full',
          'mix-blend-normal',
          'skew-y-12',
          'fill-[--color-1] stroke-[--color-1]',
          'faded-edge'
        )}
        numSquares={50}
        maxOpacity={0.5}
        duration={3}
        repeatDelay={1}
      />
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
