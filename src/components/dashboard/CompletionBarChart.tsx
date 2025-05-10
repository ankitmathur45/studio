
"use client"

import type { ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

interface CompletionBarChartProps {
  data: Array<{ dateLabel: string; count: number }>;
  title: string;
  description: string;
  chartConfig: ChartConfig;
  isLoading?: boolean;
  noDataMessage?: string;
}

const CompletionBarChart: React.FC<CompletionBarChartProps> = ({
  data,
  title,
  description,
  chartConfig,
  isLoading = false,
  noDataMessage = "No data available for this period."
}) => {

  if (isLoading) {
    return (
      <Card className="shadow-md w-full">
        <CardHeader>
          <Skeleton className="h-6 w-3/5 mb-1" />
          <Skeleton className="h-4 w-4/5" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" /> {/* Adjusted skeleton height */}
        </CardContent>
      </Card>
    );
  }

  const chartDataKey = Object.keys(chartConfig)[0] || "count"; // Use the first key in chartConfig or default to "count"

  if (!data || data.length === 0) {
    return (
      <Card className="shadow-md w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[200px]"> {/* Adjusted message height */}
          <p className="text-muted-foreground">{noDataMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full"> {/* Reduced min-h from 250px */}
          <BarChart accessibilityLayer data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="dateLabel"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 10)} // Shorten if too long, adjust as needed
            />
            <YAxis allowDecimals={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey={chartDataKey} fill={`var(--color-${chartDataKey})`} radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CompletionBarChart;
