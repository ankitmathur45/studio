"use client";
import React, { useState, useMemo } from 'react';
import { useHabits } from '@/contexts/HabitContext';
import type { Habit } from '@/types';
import { getWeekDates, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LucideIcon from '@/components/icons/LucideIcon';
import DayCell from './DayCell';
import ActivityLogDialog from './ActivityLogDialog';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const WeeklyView: React.FC = () => {
  const { habits, getActivitiesForDay, getStreakCount, isLoading } = useHabits();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedHabit, setSelectedHabit] = useState<Habit | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);

  const handlePrevWeek = () => {
    setCurrentDate(prev => new Date(prev.setDate(prev.getDate() - 7)));
  };

  const handleNextWeek = () => {
    setCurrentDate(prev => new Date(prev.setDate(prev.getDate() + 7)));
  };

  const handleCellClick = (habit: Habit, date: string) => {
    setSelectedHabit(habit);
    setSelectedDate(date);
    setIsActivityLogOpen(true);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4 w-full"> {/* Added w-full */}
        <div className="animate-pulse bg-muted h-12 w-full rounded-md"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-muted h-20 w-full rounded-md"></div>
        ))}
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <Card className="shadow-lg w-full"> {/* Added w-full */}
        <CardHeader>
          <CardTitle>Welcome to {process.env.NEXT_PUBLIC_APP_NAME || "Habitual"}!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            You haven't added any habits yet. Get started by managing your habits.
          </p>
          {/* Tip: Add a button here to open ManageHabitsDialog if it's easily accessible via context/props */}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg w-full"> {/* Added w-full */}
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={handlePrevWeek} aria-label="Previous week">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold text-center">
              {formatDate(weekDates[0], 'MMM d')} - {formatDate(weekDates[6], 'MMM d, yyyy')}
            </h2>
            <Button variant="outline" size="icon" onClick={handleNextWeek} aria-label="Next week">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <div className="min-w-[700px] md:min-w-full"> {/* Ensure horizontal scroll on small screens */}
              {/* Header Row: Habit Name + Days of Week */}
              <div className="grid grid-cols-[180px_repeat(7,1fr)] border-b bg-muted/50 sticky top-0 z-10">
                <div className="p-3 font-semibold text-sm text-muted-foreground">Habit</div>
                {weekDates.map(date => (
                  <div key={formatDate(date)} className="p-3 text-center font-semibold text-sm text-muted-foreground border-l">
                    <div>{formatDate(date, 'E')}</div>
                    <div className="text-xs">{formatDate(date, 'd')}</div>
                  </div>
                ))}
              </div>

              {/* Habit Rows */}
              {habits.map(habit => (
                <div key={habit.id} className="grid grid-cols-[180px_repeat(7,1fr)] items-center border-b last:border-b-0">
                  <div className="p-3 flex items-center space-x-2 overflow-hidden">
                    <div
                      className="p-1.5 rounded-md flex items-center justify-center w-7 h-7 shrink-0"
                      style={{ backgroundColor: habit.color }}
                    >
                      <LucideIcon name={habit.symbol} size={16} className="text-white" />
                    </div>
                    <div className="truncate">
                      <p className="font-medium text-sm text-foreground truncate" title={habit.name}>{habit.name}</p>
                      <p className="text-xs text-muted-foreground">Streak: {getStreakCount(habit.id)}</p>
                    </div>
                  </div>
                  {weekDates.map(date => {
                    const dateString = formatDate(date);
                    const activities = getActivitiesForDay(habit.id, dateString);
                    return (
                      <DayCell
                        key={`${habit.id}-${dateString}`}
                        habit={habit}
                        date={dateString}
                        activities={activities}
                        onCellClick={() => handleCellClick(habit, dateString)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      <ActivityLogDialog
        isOpen={isActivityLogOpen}
        onOpenChange={setIsActivityLogOpen}
        habit={selectedHabit}
        date={selectedDate}
      />
    </div>
  );
};

export default WeeklyView;
