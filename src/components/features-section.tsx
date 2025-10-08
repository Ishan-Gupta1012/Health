import { Stethoscope, UserSearch, Pill, Share2 } from 'lucide-react';
import { FeatureCard } from './feature-card';
import { Button } from './ui/button';
import { PrescriptionUpload } from './prescription-upload';
import Link from 'next/link';

export function FeaturesSection() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            A Suite of Smart Health Tools
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl/relaxed">
            From checking your symptoms to managing your health records, HealthNest has you covered.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2">
            <SymptomCheckerCard />
            <DoctorFinderCard />
            <MedicineRemindersCard />
            <MedicalRecordSharingCard />
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
            <Button asChild variant="outline" className="w-full mt-auto bg-white/30 hover:bg-white/50 text-foreground">
              <Link href="/symptom-checker">Check Symptoms Now</Link>
            </Button>
        </FeatureCard>
    );
}

function MedicineRemindersCard() {
    return (
        <FeatureCard
            icon={<Pill className="h-8 w-8" />}
            title="Medicine Reminders"
            description="Upload a prescription to automatically detect medicines and set reminders. Get links to buy them online."
        >
            <PrescriptionUpload />
        </FeatureCard>
    );
}

function DoctorFinderCard() {
    return (
        <FeatureCard
            icon={<UserSearch className="h-8 w-8" />}
            title="Nearby Doctor Finder"
            description="Find verified doctors and specialists near you. Filter by specialty, distance, and patient reviews."
        >
            <Button variant="outline" className="w-full mt-auto bg-white/30 hover:bg-white/50 text-foreground">Find a Doctor</Button>
        </FeatureCard>
    );
}

function MedicalRecordSharingCard() {
    return (
        <FeatureCard
            icon={<Share2 className="h-8 w-8" />}
            title="Medical Record Sharing"
            description="Securely upload, store, and share your medical records with healthcare providers in just a few clicks."
        >
            <Button variant="outline" className="w-full mt-auto bg-white/30 hover:bg-white/50 text-foreground">Share Records</Button>
        </FeatureCard>
    );
}
