
'use client';

import { Stethoscope, UserSearch, Pill, Share2 } from 'lucide-react';
import { FeatureCard } from './feature-card';
import { Button } from './ui/button';
import { PrescriptionUpload } from './prescription-upload';
import Link from 'next/link';
import { useUser } from '@/firebase';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function FeaturesSection() {
  const { user, isUserLoading } = useUser();

  const renderProtectedButton = (label: string, feature: string) => {
    const isEnabled = !isUserLoading && !!user;

    const button = (
      <Button variant="outline" className="w-full mt-auto bg-white/30 hover:bg-white/50 text-foreground neon-shadow-primary-hover" disabled={!isEnabled}>
        {label}
      </Button>
    );

    if (isEnabled) {
      return button;
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full mt-auto">{button}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Please sign in to use the {feature} feature.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            A Suite of Smart Health Tools
          </h2>
          <p className="mt-4 text-inherit md:text-xl/relaxed">
            From checking your symptoms to managing your health records, HealthNest has you covered.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2">
          <SymptomCheckerCard />
          <FeatureCard
            icon={<UserSearch className="h-8 w-8" />}
            title="Doctor Finder"
            description="Find verified doctors and specialists near you. Filter by specialty, distance, and patient reviews."
          >
            {renderProtectedButton('Find a Doctor', 'Doctor Finder')}
          </FeatureCard>
          <FeatureCard
            icon={<Pill className="h-8 w-8" />}
            title="Medicine Reminders"
            description="Upload a prescription to automatically detect medicines and set reminders. Get links to buy them online."
          >
            {user ? <PrescriptionUpload /> : renderProtectedButton('Upload Prescription', 'Medicine Reminders')}
          </FeatureCard>
          <FeatureCard
            icon={<Share2 className="h-8 w-8" />}
            title="Medical Record Sharing"
            description="Securely upload, store, and share your medical records with healthcare providers in just a few clicks."
          >
            {renderProtectedButton('Share Records', 'Medical Record Sharing')}
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}

function SymptomCheckerCard() {
    return (
        <FeatureCard
            icon={<Stethoscope className="h-8 w-8" />}
            title="Symptom Checker"
            description="Enter your symptoms and get AI-powered insights on possible causes. Not a substitute for professional medical advice."
        >
            <Button asChild variant="outline" className="w-full mt-auto bg-white/30 hover:bg-white/50 text-foreground neon-shadow-primary-hover">
              <Link href="/symptom-checker">Check Symptoms Now</Link>
            </Button>
        </FeatureCard>
    );
}
