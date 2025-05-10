import type { LucideIcon } from 'lucide-react';

// Using string for icon names to be stored, actual component resolved dynamically
export type HabitSymbolName = string;

export interface Habit {
  id: string;
  name: string;
  color: string; // hex color string
  symbol: HabitSymbolName;
  isNegative: boolean;
  createdAt: string; // ISO date string
}

export interface ActivityEntry {
  id: string; // unique id for this specific activity instance
  timestamp: string; // ISO date string of when it was logged
  comment?: string;
}

export interface HabitLog {
  // Composite ID: `${habitId}-${date}`
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  activities: ActivityEntry[]; // Array of activities for this habit on this day
}

// For AI Insights
export interface HabitDataForAI {
  name: string;
  isNegative: boolean;
  activities: {
    date: string; // YYYY-MM-DD
    count: number;
    comment?: string;
  }[];
  streak: number;
}
