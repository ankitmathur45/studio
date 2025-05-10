
"use client";
import React from 'react';
import type { Habit, ActivityEntry } from '@/types';
import { useHabits } from '@/contexts/HabitContext';
import { Button } from '@/components/ui/button';
import LucideIcon from '@/components/icons/LucideIcon';
import { CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DayCellProps {
  habit: Habit;
  date: string; // YYYY-MM-DD
  activities: ActivityEntry[];
  onCellClick: () => void; // To open ActivityLogDialog
}

const DayCell: React.FC<DayCellProps> = ({ habit, date, activities, onCellClick }) => {
  const { logActivity } = useHabits();
  const activityCount = activities.length;
  const hasComment = activities.some(act => act.comment && act.comment.trim() !== '');

  const handleQuickLog = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening dialog if quick logging
    logActivity(habit.id, date);
    // Note: The parent component (WeeklyView) will re-fetch activities, causing this cell to update.
  };

  const cellContent = () => {
    if (habit.isNegative) {
      if (activityCount > 0) {
        return (
          <div className="flex flex-col items-center justify-center text-destructive">
            <XCircle size={20} />
            {activityCount > 1 && <span className="text-xs mt-0.5">x{activityCount}</span>}
          </div>
        );
      }
      return <span className="text-muted-foreground/50 text-lg">-</span>; // Placeholder for empty negative day
    } else {
      if (activityCount > 0) {
        return (
          <div className="flex flex-col items-center justify-center text-green-600 dark:text-green-500">
            <CheckCircle size={20} />
             {activityCount > 1 && <span className="text-xs mt-0.5">x{activityCount}</span>}
          </div>
        );
      }
       // Button for quick log for positive habits
      return (
        <Button 
            variant="ghost" 
            size="icon" 
            className="h-full w-full opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary" 
            onClick={handleQuickLog}
            aria-label={`Log ${habit.name}`}
        >
          <CheckCircle size={20} />
        </Button>
      );
    }
  };

  return (
    <div
      onClick={onCellClick}
      className={cn(
        "group relative flex items-center justify-center h-12 w-full border-l border-t cursor-pointer transition-colors",
        "hover:bg-muted/80 dark:hover:bg-muted/50",
        // Highlight if done
        !habit.isNegative && activityCount > 0 && "bg-green-50 dark:bg-green-900/30",
        habit.isNegative && activityCount > 0 && "bg-red-50 dark:bg-red-900/30",
      )}
      role="button"
      tabIndex={0}
      aria-label={`Log for ${habit.name} on ${date}`}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onCellClick()}
    >
      {cellContent()}
      {hasComment && (
        <MessageSquare size={12} className="absolute bottom-1 right-1 text-muted-foreground opacity-70" />
      )}
    </div>
  );
};

export default DayCell;
