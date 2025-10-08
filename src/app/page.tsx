import { FeaturesSection } from '@/components/features-section';
import { AboutSection } from '@/components/about-section';
import { Footer } from '@/components/footer';
import CyberneticGridShader from '@/components/cybernetic-grid-shader';
import { Header } from '@/components/header';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <CyberneticGridShader />
        <div className="relative z-10 flex h-screen flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-6xl">
                Your Unified Smart Health Assistant
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
                Smart health tracking, doctor finder, medicine reminders & record sharing — all in one place.
            </p>
        </div>
        <FeaturesSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
