
"use client";
import React, { useState, useEffect } from 'react';
import type { Habit, ActivityEntry } from '@/types';
import { useHabits } from '@/contexts/HabitContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import LucideIcon from '@/components/icons/LucideIcon';
import ActivityEntryItem from './ActivityEntryItem';
import { formatDate } from '@/lib/utils';
import { PlusCircle } from 'lucide-react';

interface ActivityLogDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  habit: Habit | undefined;
  date: string; // YYYY-MM-DD
}

const ActivityLogDialog: React.FC<ActivityLogDialogProps> = ({ isOpen, onOpenChange, habit, date }) => {
  const { getActivitiesForDay, logActivity } = useHabits();
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (isOpen && habit) {
      setActivities(getActivitiesForDay(habit.id, date));
    } else {
      // Reset when closed or habit is undefined
      setActivities([]);
      setNewComment('');
    }
  }, [isOpen, habit, date, getActivitiesForDay]);

  if (!habit) return null;

  const handleAddActivity = () => {
    logActivity(habit.id, date, newComment.trim() || undefined);
    setNewComment(''); // Clear comment field after adding
    // activities state will update via useEffect or by re-calling getActivitiesForDay if context updates immediately
    // For instant UI update:
    setActivities(getActivitiesForDay(habit.id, date)); 
  };
  
  const handleDialogClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <div
              className="p-1.5 rounded-md flex items-center justify-center w-7 h-7 mr-2"
              style={{ backgroundColor: habit.color }}
            >
              <LucideIcon name={habit.symbol} size={16} className="text-white" />
            </div>
            Log for {habit.name}
          </DialogTitle>
          <DialogDescription>
            On {formatDate(date, 'EEEE, MMMM d, yyyy')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-hidden pr-1 -mr-1"> {/* Wrapper for ScrollArea */}
          <ScrollArea className="h-full"> {/* Make ScrollArea take available height */}
            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {habit.isNegative ? "No occurrences logged for this day." : "No activities logged yet."}
              </p>
            ) : (
              <div className="space-y-2 pr-3">
                {activities.map((entry) => (
                  <ActivityEntryItem
                    key={entry.id}
                    habitId={habit.id}
                    date={date}
                    entry={entry}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
        
        <div className="mt-auto pt-4 border-t"> {/* Ensure this section is at the bottom */}
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment (optional)..."
            rows={2}
            className="mb-3 text-sm"
          />
          <Button onClick={handleAddActivity} className="w-full">
            <PlusCircle className="h-4 w-4 mr-2" />
            {habit.isNegative ? 'Log Occurrence' : 'Log Activity'}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default ActivityLogDialog;
