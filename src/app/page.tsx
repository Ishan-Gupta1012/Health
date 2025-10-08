import { FeaturesSection } from '@/components/features-section';
import { AboutSection } from '@/components/about-section';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';

export default function Home() {
  return (
    <BackgroundGradientAnimation>
      <div className="flex min-h-screen flex-col">
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
    </BackgroundGradientAnimation>
  );
}
