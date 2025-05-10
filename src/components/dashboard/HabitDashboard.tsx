
"use client";

import React, { useState, useMemo } from 'react';
import { useHabits } from '@/contexts/HabitContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from './StatCard';
import CompletionBarChart from './CompletionBarChart';
import { calculatePeriodStats, aggregateDailyCountsToWeekly, aggregateDailyCountsToMonthly, type PeriodStats, type HabitCompletionRate } from '@/lib/statsCalculators';
import { 
  getWeekDates, getMonthDates, getQuarterDates, getYearDates, 
  formatDateISO, formatDateReadable, 
  getWeekDateRange, getMonthDateRange, getQuarterDateRange, getYearDateRange
} from '@/lib/utils';
import { ChevronLeft, ChevronRight, CalendarDays, TrendingUp, CheckCircle, ListChecks, Target } from 'lucide-react';
import type { ChartConfig } from "@/components/ui/chart";
import LucideIcon from '@/components/icons/LucideIcon';
import { ScrollArea } from '@/components/ui/scroll-area';

const chartConfigBase = {
  completions: {
    label: "Successful Days",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;


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

  const weeklyStats = useMemo(() => calculatePeriodStats(habits, logs, weeklyDates, "This Week", (d) => formatDateReadable(d, 'EEE')), [habits, logs, weeklyDates]);
  const monthlyStats = useMemo(() => calculatePeriodStats(habits, logs, monthlyDates, "This Month", (d) => formatDateReadable(d, 'd')), [habits, logs, monthlyDates]);
  const quarterlyStats = useMemo(() => calculatePeriodStats(habits, logs, quarterlyDates, "This Quarter"), [habits, logs, quarterlyDates]);
  const annualStats = useMemo(() => calculatePeriodStats(habits, logs, annualDates, "This Year"), [habits, logs, annualDates]);

  const isLoading = isHabitContextLoading;

  const renderPeriodStats = (stats: PeriodStats, periodType: "weekly" | "monthly" | "quarterly" | "annually") => {
    let chartData = stats.dailyActivityCounts;
    let chartTitle = "Daily Successes";
    let chartDescription = `Number of habits successfully completed/avoided each day for ${stats.periodLabel.toLowerCase()}.`;

    if (periodType === "monthly" && stats.dailyActivityCounts) {
        chartData = aggregateDailyCountsToWeekly(stats.dailyActivityCounts, monthlyDates[0]);
        chartTitle = "Weekly Success Aggregates";
        chartDescription = `Aggregated successful habit days per week for ${stats.periodLabel.toLowerCase()}.`;
    } else if ((periodType === "quarterly" || periodType === "annually") && stats.dailyActivityCounts) {
        chartData = aggregateDailyCountsToMonthly(stats.dailyActivityCounts, periodType === "quarterly" ? quarterlyDates[0] : annualDates[0]);
        chartTitle = "Monthly Success Aggregates";
        chartDescription = `Aggregated successful habit days per month for ${stats.periodLabel.toLowerCase()}.`;
    }
    
    if (isLoading) {
      return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => <StatCard key={i} title="" value="" isLoading={true} />)}
          <div className="col-span-1 sm:col-span-2">
            <CompletionBarChart data={[]} title="" description="" chartConfig={chartConfigBase} isLoading={true} />
          </div>
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
              Add some habits via "Manage Habits" in the sidebar to see your statistics.
            </p>
          </CardContent>
        </Card>
      );
    }
    
    if (stats.totalPossibleHabitDays === 0 && habits.length > 0) {
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


    return (
      <div className="space-y-4"> {/* Reduced space-y from 6 to 4 */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2"> {/* Updated grid for StatCards */}
          <StatCard title="Overall Completion" value={`${stats.overallCompletionRate.toFixed(1)}%`} description={stats.periodLabel} icon={TrendingUp} isLoading={isLoading}/>
          <StatCard title="Habits Tracked" value={stats.totalHabitsTracked} description="Active habits this period" icon={Target} isLoading={isLoading} />
          <StatCard title="Successful Days" value={stats.totalSuccessfulHabitDays} description="Total successful habit days" icon={CheckCircle} isLoading={isLoading}/>
          <StatCard title="Possible Days" value={stats.totalPossibleHabitDays} description="Total trackable habit days" icon={CalendarDays} isLoading={isLoading}/>
        </div>

        {chartData && chartData.length > 0 && (
          <CompletionBarChart
            data={chartData}
            title={chartTitle}
            description={chartDescription}
            chartConfig={chartConfigBase}
            isLoading={isLoading}
          />
        )}
        
        {stats.habitCompletionRates.length > 0 && (
            <Card className="shadow-md w-full">
                <CardHeader>
                    <CardTitle className="flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary"/>Habit Breakdown</CardTitle>
                    <CardDescription>Completion rates for each habit {stats.periodLabel.toLowerCase()}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[240px]"> {/* Reduced height from 300px */}
                        <ul className="space-y-3 pr-3">
                            {stats.habitCompletionRates.map(hr => (
                                <li key={hr.habitId} className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-muted/50">
                                    <div className="flex items-center space-x-3">
                                        <div
                                        className="p-1.5 rounded-md flex items-center justify-center w-7 h-7"
                                        style={{ backgroundColor: hr.color }}
                                        >
                                        <LucideIcon name={hr.symbol} size={16} className="text-white" />
                                        </div>
                                        <span className="font-medium text-sm text-foreground">{hr.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-semibold text-sm text-primary">{hr.rate.toFixed(1)}%</span>
                                        <p className="text-xs text-muted-foreground">{hr.successfulDays}/{hr.totalDaysInPeriod} days</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </ScrollArea>
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
    <div className="space-y-4"> {/* Reduced space-y from 6 to 4 */}
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
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4"> {/* Reduced mb-6 to mb-4 */}
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
          <TabsTrigger value="annually">Annually</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly">
          {renderPeriodStats(weeklyStats, "weekly")}
        </TabsContent>
        <TabsContent value="monthly">
          {renderPeriodStats(monthlyStats, "monthly")}
        </TabsContent>
        <TabsContent value="quarterly">
          {renderPeriodStats(quarterlyStats, "quarterly")}
        </TabsContent>
        <TabsContent value="annually">
          {renderPeriodStats(annualStats, "annually")}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HabitDashboard;
