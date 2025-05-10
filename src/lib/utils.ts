import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { 
  format, 
  addDays, 
  subDays,
  startOfWeek, 
  endOfWeek,
  startOfMonth, 
  endOfMonth,
  startOfQuarter, 
  endOfQuarter,
  startOfYear, 
  endOfYear,
  eachDayOfInterval, 
  isSameDay,
  differenceInCalendarDays,
  getDaysInMonth
} from 'date-fns';
import type { Habit, HabitLog } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateISO(date: Date | string): string {
  return format(new Date(date), 'yyyy-MM-dd');
}

export function formatDateReadable(date: Date | string, dateFormat: string = 'MMM d, yyyy'): string {
  return format(new Date(date), dateFormat);
}


// Week functions
export function getWeekDates(currentDate: Date = new Date()): Date[] {
  const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday as start of week
  return eachDayOfInterval({ start, end: addDays(start, 6) });
}
export function getWeekDateRange(date: Date = new Date()): { start: Date; end: Date } {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return { start, end };
}

// Month functions
export function getMonthDates(currentDate: Date = new Date()): Date[] {
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  return eachDayOfInterval({ start, end });
}
export function getMonthDateRange(date: Date = new Date()): { start: Date; end: Date } {
  return { start: startOfMonth(date), end: endOfMonth(date) };
}
export function getDaysInSpecificMonth(date: Date = new Date()): number {
  return getDaysInMonth(date);
}


// Quarter functions
export function getQuarterDates(currentDate: Date = new Date()): Date[] {
  const start = startOfQuarter(currentDate);
  const end = endOfQuarter(currentDate);
  return eachDayOfInterval({ start, end });
}
export function getQuarterDateRange(date: Date = new Date()): { start: Date; end: Date } {
  return { start: startOfQuarter(date), end: endOfQuarter(date) };
}

// Year functions
export function getYearDates(currentDate: Date = new Date()): Date[] {
  const start = startOfYear(currentDate);
  const end = endOfYear(currentDate);
  return eachDayOfInterval({ start, end });
}
export function getYearDateRange(date: Date = new Date()): { start: Date; end: Date } {
  return { start: startOfYear(date), end: endOfYear(date) };
}


export function calculateStreak(habit: Habit, logs: HabitLog[], today: Date = new Date()): number {
  let streak = 0;
  
  // Filter logs for the specific habit and sort them by date descending.
  const habitLogs = logs
    .filter(log => log.habitId === habit.id && new Date(log.date) <= today) // Only consider logs up to today
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Create a set of dates where the habit was logged for quick lookup
  const loggedDates = new Set(habitLogs.filter(log => log.activities.length > 0).map(log => formatDateISO(new Date(log.date))));
  
  // Check from today backwards
  for (let i = 0; i < 365 * 2; i++) { // Limit check to 2 years for performance
    const dateToCheck = subDays(today, i);
    const dateString = formatDateISO(dateToCheck);

    if (habit.isNegative) {
      // For negative habits, streak increases if NO activity is logged
      if (!loggedDates.has(dateString)) {
        streak++;
      } else {
        // If there is an activity, streak breaks
        break;
      }
    } else {
      // For positive habits, streak increases if an activity IS logged
      if (loggedDates.has(dateString)) {
        streak++;
      } else {
         // If no activity, streak breaks
        break;
      }
    }
  }
  return streak;
}

export function generateId(): string {
  return crypto.randomUUID();
}

// Alias for the old formatDate function if it's used elsewhere with default yyyy-MM-dd
export function formatDate(date: Date | string, dateFormat: string = 'yyyy-MM-dd'): string {
  return format(new Date(date), dateFormat);
}
