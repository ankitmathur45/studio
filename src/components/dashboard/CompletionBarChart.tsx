"use client"

import type { ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
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
  data: Array<any & { fill?: string }>; // Data items can have a 'fill' property for individual bar colors
  title: string;
  description: string;
  chartConfig: ChartConfig;
  xAxisDataKey: string; // Key for X-axis labels from data objects
  yAxisDataKey: string; // Key for Y-axis values (bar height) from data objects
  isLoading?: boolean;
  noDataMessage?: string;
  tooltipValueFormatter?: (value: any, name: string, item: any, index: number, payloadEntry: any, config: ChartConfig) => React.ReactNode;
  yAxisTickFormatter?: (value: any) => string;
}

const CompletionBarChart: React.FC<CompletionBarChartProps> = ({
  data,
  title,
  description,
  chartConfig,
  xAxisDataKey,
  yAxisDataKey,
  isLoading = false,
  noDataMessage = "No data available for this period.",
  tooltipValueFormatter,
  yAxisTickFormatter,
}) => {

  if (isLoading) {
    return (
      <Card className="shadow-md w-full">
        <CardHeader>
          <Skeleton className="h-6 w-3/5 mb-1" />
          <Skeleton className="h-4 w-4/5" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="shadow-md w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[200px]">
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
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey={xAxisDataKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => typeof value === 'string' ? value.slice(0, 10) : value} // Shorten if too long, adjust as needed
            />
            <YAxis allowDecimals={false} tickFormatter={yAxisTickFormatter} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent 
                  indicator="dashed" 
                  formatter={tooltipValueFormatter ? (v, n, i, idx, p) => tooltipValueFormatter(v, n, i, idx, p, chartConfig) : undefined}
                  nameKey={yAxisDataKey} // Ensures the name in tooltip refers to the yAxisDataKey
                  labelKey={xAxisDataKey} // Ensures the label in tooltip (main title) uses habit name
                />
              }
            />
            <Bar dataKey={yAxisDataKey} radius={4}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill || chartConfig[yAxisDataKey as keyof ChartConfig]?.color || "hsl(var(--primary))"} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CompletionBarChart;
