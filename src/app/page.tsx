import { FeaturesSection } from '@/components/features-section';
import { AboutSection } from '@/components/about-section';
import { Footer } from '@/components/footer';
import { HeroWave } from '@/components/hero-wave';


export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <HeroWave 
          title="Your Unified Smart Health Assistant"
          subtitle="Smart health tracking, doctor finder, medicine reminders & record sharing — all in one place."
          placeholder="e.g., Check my symptoms for a headache and fever..."
          buttonText="Ask"
        />
        <FeaturesSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}