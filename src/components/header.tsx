import Link from 'next/link';
import { Stethoscope, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full bg-transparent">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Stethoscope className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">HealthNest</span>
        </Link>
        <nav className="hidden md:flex flex-1 items-center justify-center space-x-8 text-sm font-medium">
          <Link href="/#features" data-scroll-to className="transition-colors hover:text-primary">Features</Link>
          <Link href="/#about" data-scroll-to className="transition-colors hover:text-primary">About</Link>
          <Link href="/#contact" data-scroll-to className="transition-colors hover:text-primary">Contact</Link>
        </nav>
        <div className="flex items-center justify-end space-x-4 ml-auto">
          <Button variant="ghost" className="hidden md:inline-flex">Sign In</Button>
          <Button className="hidden md:inline-flex">Get Started</Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="grid gap-4 py-6">
                <Link href="/" className="flex items-center space-x-2">
                   <Stethoscope className="h-6 w-6 text-primary" />
                  <span className="font-bold">HealthNest</span>
                </Link>
                <nav className="grid gap-2">
                  <Link href="/#features" data-scroll-to className="text-muted-foreground hover:text-foreground">Features</Link>
                  <Link href="/#about" data-scroll-to className="text-muted-foreground hover:text-foreground">About</Link>
                  <Link href="/#contact" data-scroll-to className="text-muted-foreground hover:text-foreground">Contact</Link>
                </nav>
                 <div className="flex flex-col gap-2">
                    <Button>Get Started</Button>
                    <Button variant="ghost">Sign In</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
