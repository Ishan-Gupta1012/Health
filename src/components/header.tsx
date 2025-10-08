import Link from 'next/link';
import { Stethoscope, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Stethoscope className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block">HealthNest</span>
        </Link>
        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link href="#features" className="text-muted-foreground transition-colors hover:text-foreground">Features</Link>
          <Link href="#about" className="text-muted-foreground transition-colors hover:text-foreground">About</Link>
          <Link href="#contact" className="text-muted-foreground transition-colors hover:text-foreground">Contact</Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          <Button variant="ghost">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
          <Button>Get Started</Button>
        </div>
      </div>
    </header>
  );
}
