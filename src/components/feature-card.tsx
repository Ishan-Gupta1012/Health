import type { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
}

export function FeatureCard({ icon, title, description, children }: FeatureCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 glass-card">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
        <div className="rounded-lg bg-primary/10 p-3 text-primary">
          {icon}
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between pt-0">
        <CardDescription className="mb-4">{description}</CardDescription>
        {children}
      </CardContent>
    </Card>
  );
}
