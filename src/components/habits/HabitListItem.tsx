
"use client";
import type { Habit } from '@/types';
import LucideIcon from '@/components/icons/LucideIcon';
import { Button } from '@/components/ui/button';
import { Edit3, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HabitListItemProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

const HabitListItem: React.FC<HabitListItemProps> = ({ habit, onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-3 border-b rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex items-center space-x-3">
        <div
          className="p-2 rounded-md flex items-center justify-center w-10 h-10"
          style={{ backgroundColor: habit.color }}
        >
          <LucideIcon name={habit.symbol} size={20} className="text-white" />
        </div>
        <div>
          <p className="font-medium text-foreground">{habit.name}</p>
          {habit.isNegative && (
            <Badge variant="destructive" className="mt-1 text-xs">Negative</Badge>
          )}
        </div>
      </div>
      <div className="space-x-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(habit)} aria-label={`Edit ${habit.name}`}>
          <Edit3 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(habit.id)} aria-label={`Delete ${habit.name}`}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
};

export default HabitListItem;
