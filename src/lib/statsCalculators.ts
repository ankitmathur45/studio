
import type { Habit, HabitLog, HabitSymbolName, ActivityEntry } from '@/types';
import { formatDateISO } from './utils';
import { differenceInCalendarDays } from 'date-fns';

export interface HabitCompletionRate {
  habitId: string;
  name: string;
  color: string;
  symbol: HabitSymbolName;
  rate: number; // 0-100
  successfulDays: number;
  totalDaysInPeriod: number;
}

export interface DailyActivityCount {
  dateLabel: string; // e.g., 'Mon', 'Week 1'
  count: number; // Number of successfully completed habits
}

export interface PeriodStats {
  overallCompletionRate: number;
  habitCompletionRates: HabitCompletionRate[];
  dailyActivityCounts?: DailyActivityCount[]; // For charts, specific to period type
  periodLabel: string;
  totalHabitsTracked: number;
  totalSuccessfulHabitDays: number;
  totalPossibleHabitDays: number;
}

export function calculatePeriodStats(
  habits: Habit[],
  logs: HabitLog[],
  periodDates: Date[],
  periodLabel: string,
  dailyChartLabelFormat?: (date: Date) => string
): PeriodStats {
  if (habits.length === 0 || periodDates.length === 0) {
    return {
      overallCompletionRate: 0,
      habitCompletionRates: [],
      dailyActivityCounts: dailyChartLabelFormat ? periodDates.map(d => ({dateLabel: dailyChartLabelFormat(d), count: 0})) : undefined,
      periodLabel,
      totalHabitsTracked: habits.length,
      totalSuccessfulHabitDays: 0,
      totalPossibleHabitDays: 0,
    };
  }

  const logsByHabitIdAndDate: Record<string, Record<string, ActivityEntry[]>> = {};
  logs.forEach(log => {
    if (!logsByHabitIdAndDate[log.habitId]) {
      logsByHabitIdAndDate[log.habitId] = {};
    }
    logsByHabitIdAndDate[log.habitId][log.date] = log.activities;
  });

  let totalSuccessfulHabitDays = 0;
  const totalPossibleHabitDays = habits.length * periodDates.length;

  const habitCompletionRates: HabitCompletionRate[] = habits.map(habit => {
    let successfulDays = 0;
    for (const date of periodDates) {
      const dateStr = formatDateISO(date);
      const activities = logsByHabitIdAndDate[habit.id]?.[dateStr] || [];
      
      if (habit.isNegative) {
        if (activities.length === 0) {
          successfulDays++;
        }
      } else {
        if (activities.length > 0) {
          successfulDays++;
        }
      }
    }
    totalSuccessfulHabitDays += successfulDays;
    return {
      habitId: habit.id,
      name: habit.name,
      color: habit.color,
      symbol: habit.symbol,
      rate: periodDates.length > 0 ? (successfulDays / periodDates.length) * 100 : 0,
      successfulDays,
      totalDaysInPeriod: periodDates.length,
    };
  });

  const overallCompletionRate = totalPossibleHabitDays > 0 
    ? (totalSuccessfulHabitDays / totalPossibleHabitDays) * 100 
    : 0;

  let dailyActivityCounts: DailyActivityCount[] | undefined = undefined;
  if (dailyChartLabelFormat) {
    dailyActivityCounts = periodDates.map(date => {
      let successfulHabitsOnDate = 0;
      const dateStr = formatDateISO(date);
      habits.forEach(habit => {
        const activities = logsByHabitIdAndDate[habit.id]?.[dateStr] || [];
        if (habit.isNegative) {
          if (activities.length === 0) successfulHabitsOnDate++;
        } else {
          if (activities.length > 0) successfulHabitsOnDate++;
        }
      });
      return {
        dateLabel: dailyChartLabelFormat(date),
        count: successfulHabitsOnDate,
      };
    });
  }
  
  // If chart data needs aggregation (e.g. monthly chart showing weekly summaries)
  // This basic implementation gives daily counts for the provided periodDates
  // For a monthly chart showing weekly totals, periodDates would be days of month,
  // and dailyChartLabelFormat would give day labels. Aggregation to weeks would be separate.

  return {
    overallCompletionRate,
    habitCompletionRates,
    dailyActivityCounts,
    periodLabel,
    totalHabitsTracked: habits.length,
    totalSuccessfulHabitDays,
    totalPossibleHabitDays,
  };
}

// Example for aggregating daily counts into weekly for a monthly chart
export function aggregateDailyCountsToWeekly(dailyCounts: DailyActivityCount[], monthStartDate: Date): DailyActivityCount[] {
    if (!dailyCounts || dailyCounts.length === 0) return [];
    
    const weeklyAggregates: Record<string, number> = {};
    let weekCounter = 1;
    let daysInCurrentWeek = 0;

    dailyCounts.forEach((daily, index) => {
        const weekLabel = `Week ${weekCounter}`;
        if (!weeklyAggregates[weekLabel]) {
            weeklyAggregates[weekLabel] = 0;
        }
        weeklyAggregates[weekLabel] += daily.count;
        daysInCurrentWeek++;
        if (daysInCurrentWeek === 7 && index < dailyCounts.length -1) { // Check if not the last item
            weekCounter++;
            daysInCurrentWeek = 0;
        }
    });
    
    return Object.entries(weeklyAggregates).map(([dateLabel, count]) => ({ dateLabel, count }));
}

// Example for aggregating daily counts into monthly for a quarterly/annual chart
export function aggregateDailyCountsToMonthly(dailyCounts: DailyActivityCount[], periodStartDate: Date): DailyActivityCount[] {
    if (!dailyCounts || dailyCounts.length === 0) return [];

    const monthlyAggregates: Record<string, { count: number, monthIndex: number }> = {};
    
    let currentMonth = new Date(periodStartDate).getMonth();
    let monthLabel = formatDateISO(periodStartDate).substring(0, 7); // YYYY-MM

    dailyCounts.forEach((daily, index) => {
        // This assumes dailyCounts are chronologically ordered and dateLabel maps to a day.
        // For simplicity, we'll use the daily.dateLabel if it's already 'MMM' or similar.
        // A more robust way would be to pass original dates alongside dailyCounts.
        // Here, we will assume daily.dateLabel corresponds to dates in order.
        // This is a simplification: in real scenario, map daily.dateLabel back to actual dates.
        const dateOfDataPoint = addDays(periodStartDate, index); // Approximation
        const dataMonth = dateOfDataPoint.getMonth();
        const dataMonthLabel = format(dateOfDataPoint, 'MMM');

        if (dataMonth !== currentMonth && index > 0) {
            currentMonth = dataMonth;
            monthLabel = format(dateOfDataPoint, 'MMM');
        }
        
        if (!monthlyAggregates[dataMonthLabel]) {
            monthlyAggregates[dataMonthLabel] = { count: 0, monthIndex: dataMonth };
        }
        monthlyAggregates[dataMonthLabel].count += daily.count;
    });

    return Object.entries(monthlyAggregates)
        .sort(([, a], [, b]) => a.monthIndex - b.monthIndex) // Sort by month index
        .map(([dateLabel, data]) => ({ dateLabel, count: data.count }));
}
