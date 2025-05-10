
"use client";

import type { Habit, HabitLog, ActivityEntry, HabitSymbolName } from '@/types';
import { DEFAULT_HABITS, MAX_HABITS } from '@/lib/constants';
import { calculateStreak, generateId, formatDate } from '@/lib/utils';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface HabitContextType {
  habits: Habit[];
  logs: HabitLog[];
  addHabit: (newHabitData: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (updatedHabit: Habit) => void;
  deleteHabit: (habitId: string) => void;
  getHabitById: (habitId: string) => Habit | undefined;
  logActivity: (habitId: string, date: string, comment?: string) => ActivityEntry;
  deleteActivityEntry: (habitId: string, date: string, entryId: string) => void;
  updateActivityEntryComment: (habitId: string, date: string, entryId: string, newComment: string) => void;
  getLogForDay: (habitId: string, date: string) => HabitLog | undefined;
  getActivitiesForDay: (habitId: string, date: string) => ActivityEntry[];
  getStreakCount: (habitId: string) => number;
  isLoading: boolean;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider = ({ children }: { children: ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedHabits = localStorage.getItem('habits');
      const storedLogs = localStorage.getItem('logs');
      if (storedHabits) {
        setHabits(JSON.parse(storedHabits));
      } else {
        setHabits(DEFAULT_HABITS); // Initialize with default if nothing in storage
      }
      if (storedLogs) {
        setLogs(JSON.parse(storedLogs));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setHabits(DEFAULT_HABITS); // Fallback to defaults on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) { // Only save if initial load is complete
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('logs', JSON.stringify(logs));
    }
  }, [logs, isLoading]);

  const addHabit = useCallback((newHabitData: Omit<Habit, 'id' | 'createdAt'>) => {
    if (habits.length >= MAX_HABITS) {
      alert(`You can only track up to ${MAX_HABITS} habits.`);
      return;
    }
    const newHabit: Habit = {
      ...newHabitData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setHabits(prev => [...prev, newHabit]);
  }, [habits.length]);

  const updateHabit = useCallback((updatedHabit: Habit) => {
    setHabits(prev => prev.map(h => h.id === updatedHabit.id ? updatedHabit : h));
  }, []);

  const deleteHabit = useCallback((habitId: string) => {
    setHabits(prevHabits => prevHabits.filter(h => h.id !== habitId));
    setLogs(prevLogs => prevLogs.filter(log => log.habitId !== habitId)); // Also remove all associated logs
  }, []);
  
  const getHabitById = useCallback((habitId: string) => {
    return habits.find(h => h.id === habitId);
  }, [habits]);

  const logActivity = useCallback((habitId: string, date: string, comment?: string): ActivityEntry => {
    const newActivityEntry: ActivityEntry = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      comment: comment,
    };

    setLogs(prevLogs => {
      const logId = `${habitId}-${date}`;
      const existingLogIndex = prevLogs.findIndex(log => log.id === logId);
      if (existingLogIndex > -1) {
        const updatedLogs = [...prevLogs];
        const existingLog = updatedLogs[existingLogIndex];
        updatedLogs[existingLogIndex] = {
          ...existingLog,
          activities: [...existingLog.activities, newActivityEntry],
        };
        return updatedLogs;
      } else {
        const newLog: HabitLog = {
          id: logId,
          habitId,
          date,
          activities: [newActivityEntry],
        };
        return [...prevLogs, newLog];
      }
    });
    return newActivityEntry;
  }, []);

  const deleteActivityEntry = useCallback((habitId: string, date: string, entryId: string) => {
    setLogs(prevLogs => {
      const logId = `${habitId}-${date}`;
      // First, update the activities array for the targeted log
      const logsWithActivityRemoved = prevLogs.map(log => {
        if (log.id === logId) { // Check if this is the log for the specified habit and date
          return {
            ...log,
            activities: log.activities.filter(activity => activity.id !== entryId),
          };
        }
        return log;
      });

      // Then, filter out any logs for THIS habit (habitId) that are now empty.
      // This ensures that if the log for 'date' becomes empty, it's removed.
      // It also cleans up any other pre-existing empty logs for this specific habit.
      return logsWithActivityRemoved.filter(log => {
        if (log.habitId === habitId && log.activities.length === 0) {
          return false; // Remove this log if it's for the target habit and now has no activities
        }
        return true; // Keep all other logs
      });
    });
  }, []);
  
  const updateActivityEntryComment = useCallback((habitId: string, date: string, entryId: string, newComment: string) => {
    setLogs(prevLogs => {
      const logId = `${habitId}-${date}`;
      return prevLogs.map(log => {
        if (log.id === logId) {
          return {
            ...log,
            activities: log.activities.map(activity => 
              activity.id === entryId ? { ...activity, comment: newComment } : activity
            ),
          };
        }
        return log;
      });
    });
  }, []);

  const getLogForDay = useCallback((habitId: string, date: string): HabitLog | undefined => {
    const logId = `${habitId}-${date}`;
    return logs.find(log => log.id === logId);
  }, [logs]);

  const getActivitiesForDay = useCallback((habitId: string, date: string): ActivityEntry[] => {
    const log = getLogForDay(habitId, date);
    return log ? log.activities : [];
  }, [getLogForDay]);
  
  const getStreakCount = useCallback((habitId: string): number => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return 0;
    return calculateStreak(habit, logs);
  }, [habits, logs]);


  return (
    <HabitContext.Provider value={{
      habits,
      logs,
      addHabit,
      updateHabit,
      deleteHabit,
      getHabitById,
      logActivity,
      deleteActivityEntry,
      updateActivityEntryComment,
      getLogForDay,
      getActivitiesForDay,
      getStreakCount,
      isLoading,
    }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};

