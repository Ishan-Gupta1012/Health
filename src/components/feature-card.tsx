import type { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}

export function FeatureCard({ icon, title, description, children, className }: FeatureCardProps) {
  return (
    <Card className={cn("group flex h-full flex-col overflow-hidden transition-all hover:-translate-y-1 glass-card neon-shadow-dark-hover", className)}>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
        <div className="rounded-lg bg-primary/10 p-3 text-primary transition-shadow group-hover:shadow-[0_0_15px_hsl(var(--primary)/0.8)]">
          {icon}
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between pt-0">
        <CardDescription className="mb-4 text-card-foreground">{description}</CardDescription>
        {children}
      </CardContent>
    </Card>
  );
}
