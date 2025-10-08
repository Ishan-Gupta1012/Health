import { Header } from '@/components/header';
import { HeroGeometric } from '@/components/hero-geometric';
import { FeaturesSection } from '@/components/features-section';
import { AboutSection } from '@/components/about-section';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroGeometric 
          badge="HealthNest"
          title1="Your Unified"
          title2="Smart Health Assistant"
        />
        <FeaturesSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
