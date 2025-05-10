"use client";

import React, { useState, useMemo } from 'react';
import type { ChartConfig } from "@/components/ui/chart";
import { useHabits } from '@/contexts/HabitContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CompletionBarChart from './CompletionBarChart';
import { calculatePeriodStats, type PeriodStats } from '@/lib/statsCalculators';
import { 
  getWeekDates, getMonthDates, getQuarterDates, getYearDates, 
  formatDateReadable, 
  getWeekDateRange, getMonthDateRange, getQuarterDateRange, getYearDateRange
} from '@/lib/utils';
import { ChevronLeft, ChevronRight, ListChecks } from 'lucide-react';

const HabitDashboard: React.FC = () => {
  const { habits, logs, isLoading: isHabitContextLoading } = useHabits();
  const [currentDateFocus, setCurrentDateFocus] = useState(new Date());
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "quarterly" | "annually">("weekly");

  const handlePrevPeriod = () => {
    setCurrentDateFocus(prev => {
      switch (activeTab) {
        case 'weekly': return new Date(prev.setDate(prev.getDate() - 7));
        case 'monthly': return new Date(prev.setMonth(prev.getMonth() - 1));
        case 'quarterly': return new Date(prev.setMonth(prev.getMonth() - 3));
        case 'annually': return new Date(prev.setFullYear(prev.getFullYear() - 1));
        default: return prev;
      }
    });
  };

  const handleNextPeriod = () => {
    setCurrentDateFocus(prev => {
      switch (activeTab) {
        case 'weekly': return new Date(prev.setDate(prev.getDate() + 7));
        case 'monthly': return new Date(prev.setMonth(prev.getMonth() + 1));
        case 'quarterly': return new Date(prev.setMonth(prev.getMonth() + 3));
        case 'annually': return new Date(prev.setFullYear(prev.getFullYear() + 1));
        default: return prev;
      }
    });
  };
  
  const weeklyDates = useMemo(() => getWeekDates(currentDateFocus), [currentDateFocus]);
  const monthlyDates = useMemo(() => getMonthDates(currentDateFocus), [currentDateFocus]);
  const quarterlyDates = useMemo(() => getQuarterDates(currentDateFocus), [currentDateFocus]);
  const annualDates = useMemo(() => getYearDates(currentDateFocus), [currentDateFocus]);

  const weeklyStats = useMemo(() => calculatePeriodStats(habits, logs, weeklyDates, "This Week"), [habits, logs, weeklyDates]);
  const monthlyStats = useMemo(() => calculatePeriodStats(habits, logs, monthlyDates, "This Month"), [habits, logs, monthlyDates]);
  const quarterlyStats = useMemo(() => calculatePeriodStats(habits, logs, quarterlyDates, "This Quarter"), [habits, logs, quarterlyDates]);
  const annualStats = useMemo(() => calculatePeriodStats(habits, logs, annualDates, "This Year"), [habits, logs, annualDates]);

  const isLoading = isHabitContextLoading;

  const habitPerformanceChartConfig = useMemo(() => {
    // This config is primarily for the 'count' dataKey, which represents the completion rate.
    // Individual bar colors are handled by the 'fill' property in the data itself.
    return {
      count: { 
        label: "Completion", // Used in tooltip if formatter doesn't override
      }
    } satisfies ChartConfig;
  }, []);

  const habitPerformanceTooltipFormatter = (value: number, nameKey: string, item: any, index: number, payloadEntry: any, config: ChartConfig) => {
    // payloadEntry is the data object for the bar: { dateLabel (habit name), count (rate), fill (color), successfulDays, totalDaysInPeriod }
    const seriesConfig = config[nameKey as keyof typeof config]; // config for "count" series
    
    return (
      <div className="w-full text-sm p-1">
        <div className="font-semibold mb-1">{payloadEntry.dateLabel}</div> {/* Habit Name */}
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-muted-foreground">{seriesConfig?.label || 'Rate'}:</span>
          <span className="font-bold">{value}%</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progress:</span>
          <span className="font-bold">{payloadEntry.successfulDays} / {payloadEntry.totalDaysInPeriod} days</span>
        </div>
      </div>
    );
  };


  const renderPeriodStats = (stats: PeriodStats) => {
    if (isLoading) {
      return (
        <div className="space-y-4">
           <CompletionBarChart 
            data={[]} 
            title="" 
            description="" 
            chartConfig={{}} 
            xAxisDataKey="name"
            yAxisDataKey="rate"
            isLoading={true} />
        </div>
      );
    }

    if (habits.length === 0) {
      return (
        <Card className="shadow-lg w-full mt-4">
          <CardHeader>
            <CardTitle>No Habits Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Add some habits via "Manage Habits" to see your statistics.
            </p>
          </CardContent>
        </Card>
      );
    }
    
    if (stats.totalPossibleHabitDays === 0 && habits.length > 0 && stats.habitCompletionRates.length === 0) {
         return (
            <Card className="shadow-lg w-full mt-4">
            <CardHeader>
                <CardTitle>No Activity Logged</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                No activity has been logged for your habits in this period. Track your progress to see statistics here.
                </p>
            </CardContent>
            </Card>
        );
    }

    const habitBreakdownChartData = stats.habitCompletionRates.map(hr => ({
      dateLabel: hr.name, // X-axis: Habit name
      count: parseFloat(hr.rate.toFixed(1)), // Y-axis: Completion rate
      fill: hr.color, // Bar color
      successfulDays: hr.successfulDays,
      totalDaysInPeriod: hr.totalDaysInPeriod,
    }));

    return (
      <div className="space-y-4">
        {habitBreakdownChartData.length > 0 ? (
          <CompletionBarChart
            data={habitBreakdownChartData}
            title="Habit Performance"
            description={`Completion rates for each habit ${stats.periodLabel.toLowerCase()}.`}
            chartConfig={habitPerformanceChartConfig}
            xAxisDataKey="dateLabel"
            yAxisDataKey="count"
            tooltipValueFormatter={habitPerformanceTooltipFormatter}
            yAxisTickFormatter={(value) => `${value}%`}
            isLoading={isLoading}
          />
        ) : (
             <Card className="shadow-lg w-full mt-4">
                <CardHeader className="items-center">
                    <ListChecks className="h-10 w-10 text-primary mb-2" />
                    <CardTitle>Habit Performance</CardTitle>
                    <CardDescription>No habit data to display for this period.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center">
                    Track your habits to see their performance breakdown here.
                    </p>
                </CardContent>
            </Card>
        )}
      </div>
    );
  };
  
  const getCurrentPeriodLabel = () => {
    const { start, end } = 
      activeTab === 'weekly' ? getWeekDateRange(currentDateFocus) :
      activeTab === 'monthly' ? getMonthDateRange(currentDateFocus) :
      activeTab === 'quarterly' ? getQuarterDateRange(currentDateFocus) :
      getYearDateRange(currentDateFocus);

    if (activeTab === 'weekly') return `${formatDateReadable(start, 'MMM d')} - ${formatDateReadable(end, 'MMM d, yyyy')}`;
    if (activeTab === 'monthly') return formatDateReadable(start, 'MMMM yyyy');
    if (activeTab === 'quarterly') {
        const quarter = Math.floor(start.getMonth() / 3) + 1;
        return `Q${quarter} ${formatDateReadable(start, 'yyyy')}`;
    }
    if (activeTab === 'annually') return formatDateReadable(start, 'yyyy');
    return '';
  };

  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={handlePrevPeriod} aria-label={`Previous ${activeTab.slice(0,-2)}`}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold text-center text-foreground">
              {getCurrentPeriodLabel()}
            </h2>
            <Button variant="outline" size="icon" onClick={handleNextPeriod} aria-label={`Next ${activeTab.slice(0,-2)}`}>
              <ChevronRight className="h-4 w-4" />
            </Button>
        </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
          <TabsTrigger value="annually">Annually</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly">
          {renderPeriodStats(weeklyStats)}
        </TabsContent>
        <TabsContent value="monthly">
          {renderPeriodStats(monthlyStats)}
        </TabsContent>
        <TabsContent value="quarterly">
          {renderPeriodStats(quarterlyStats)}
        </TabsContent>
        <TabsContent value="annually">
          {renderPeriodStats(annualStats)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HabitDashboard;
