import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { AnimatedGridPattern } from '@/components/animated-grid-pattern';

export const metadata: Metadata = {
  title: 'HealthNest – Your Unified Smart Health Assistant',
  description: 'Smart health tracking, doctor finder, medicine reminders & record sharing — all in one place.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AnimatedGridPattern
          width={40}
          height={40}
          numSquares={50}
          maxOpacity={0.3}
          duration={3}
          className="[mask-image:radial-gradient(ellipse_at_center,white,transparent_100%)]"
        />
        <main className="relative z-10">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
