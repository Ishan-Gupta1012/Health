import Link from 'next/link';
import { Stethoscope, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

export function Footer() {
    return (
        <footer id="contact" className="w-full bg-transparent py-12 md:py-24 lg:py-32">
            <div className="container grid max-w-6xl grid-cols-1 gap-12 px-4 md:grid-cols-2 md:px-6">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                         <Stethoscope className="h-8 w-8 text-primary" />
                        <span className="text-2xl font-bold">HealthNest</span>
                    </div>
                    <p className="text-muted-foreground max-w-sm">
                        Your unified smart health assistant. Simplifying healthcare for a better, healthier life.
                    </p>
                    <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" asChild>
                           <Link href="#" aria-label="Instagram">
                                <Instagram className="h-5 w-5" />
                           </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                             <Link href="#" aria-label="LinkedIn">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="#" aria-label="X / Twitter">
                                <Twitter className="h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Get in Touch</h3>
                    <p className="text-muted-foreground">Have a question or feedback? We'd love to hear from you.</p>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Your Name" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="Your Email" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" placeholder="Your Message" />
                        </div>
                        <Button type="submit" className="w-full">Send Message</Button>
                    </form>
                </div>
            </div>
             <div className="container mt-12 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} HealthNest. All rights reserved.
            </div>
        </footer>
    );
}
