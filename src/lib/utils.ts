import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, addDays, startOfWeek, eachDayOfInterval, subDays, isSameDay, differenceInCalendarDays } from 'date-fns';
import type { Habit, HabitLog } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, dateFormat: string = 'yyyy-MM-dd'): string {
  return format(new Date(date), dateFormat);
}

export function getWeekDates(currentDate: Date = new Date()): Date[] {
  const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday as start of week
  return eachDayOfInterval({ start, end: addDays(start, 6) });
}

export function calculateStreak(habit: Habit, logs: HabitLog[], today: Date = new Date()): number {
  let streak = 0;
  let currentDate = today;

  // Sort logs by date descending to easily find the latest relevant logs
  const sortedLogs = logs
    .filter(log => log.habitId === habit.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  for (let i = 0; i < 365 * 2; i++) { // Check up to 2 years back for performance
    const dateToCheck = subDays(currentDate, i);
    const dateString = formatDate(dateToCheck);
    
    const logForDay = sortedLogs.find(log => log.date === dateString);

    if (habit.isNegative) {
      // For negative habits, streak increases if NO activity is logged
      if (!logForDay || logForDay.activities.length === 0) {
        streak++;
      } else {
        // If there is an activity, and we are looking at today or past days, streak breaks
        // Unless it's a future date, which shouldn't happen with this loop logic
        break;
      }
    } else {
      // For positive habits, streak increases if an activity IS logged
      if (logForDay && logForDay.activities.length > 0) {
        streak++;
      } else {
         // If no activity, and we are looking at today or past days, streak breaks
        break;
      }
    }
  }
  return streak;
}

export function generateId(): string {
  return crypto.randomUUID();
}
