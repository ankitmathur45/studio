
"use client";
import type { LucideProps } from 'lucide-react';
import type { ElementType } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ElementType<LucideProps>; // Lucide icon component
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon: Icon, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card className="shadow-md w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-6 w-3/5" /> 
          {Icon && <Skeleton className="h-6 w-6 rounded-sm" />}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-4/5 mb-1" />
          {description && <Skeleton className="h-4 w-full" />}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-md w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground pt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
