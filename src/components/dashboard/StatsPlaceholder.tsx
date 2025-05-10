"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const StatsPlaceholder = () => {
  return (
    <Card className="shadow-lg w-full"> {/* Added w-full */}
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="mr-2 h-6 w-6 text-primary" />
          Habit Statistics
        </CardTitle>
        <CardDescription>
          Detailed statistics for your habits will be displayed here. This feature is currently under development.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
        <BarChart3 className="h-24 w-24 text-muted-foreground/50 mb-4" />
        <p className="text-lg font-semibold text-muted-foreground">Dashboard Coming Soon!</p>
        <p className="text-sm text-muted-foreground">
          Check back later for weekly, monthly, quarterly, and annual stats.
        </p>
      </CardContent>
    </Card>
  );
};

export default StatsPlaceholder;
