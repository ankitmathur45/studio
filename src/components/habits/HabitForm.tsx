
"use client";
import React, { useState, useEffect } from 'react';
import type { Habit, HabitSymbolName } from '@/types';
import { useHabits } from '@/contexts/HabitContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import ColorPicker from './ColorPicker';
import IconPicker from './IconPicker';
import { PREDEFINED_COLORS, HABIT_ICON_LIST } from '@/lib/constants';

interface HabitFormProps {
  habitToEdit?: Habit;
  onSave: () => void; // Callback to close dialog or refresh list
  onCancel: () => void;
}

const HabitForm: React.FC<HabitFormProps> = ({ habitToEdit, onSave, onCancel }) => {
  const { addHabit, updateHabit } = useHabits();
  const [name, setName] = useState('');
  const [color, setColor] = useState(PREDEFINED_COLORS[0]);
  const [symbol, setSymbol] = useState<HabitSymbolName>(HABIT_ICON_LIST[0].name);
  const [isNegative, setIsNegative] = useState(false);

  useEffect(() => {
    if (habitToEdit) {
      setName(habitToEdit.name);
      setColor(habitToEdit.color);
      setSymbol(habitToEdit.symbol);
      setIsNegative(habitToEdit.isNegative);
    } else {
      // Reset for new habit form
      setName('');
      setColor(PREDEFINED_COLORS[Math.floor(Math.random() * PREDEFINED_COLORS.length)]);
      setSymbol(HABIT_ICON_LIST[Math.floor(Math.random() * HABIT_ICON_LIST.length)].name);
      setIsNegative(false);
    }
  }, [habitToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Habit name cannot be empty.');
      return;
    }

    const habitData = { name, color, symbol, isNegative };
    if (habitToEdit) {
      updateHabit({ ...habitToEdit, ...habitData });
    } else {
      addHabit(habitData);
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      <div>
        <Label htmlFor="habitName">Habit Name</Label>
        <Input
          id="habitName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Drink Water, Read a Book"
          required
          className="mt-1"
        />
      </div>

      <ColorPicker selectedColor={color} onSelectColor={setColor} />
      <IconPicker selectedIcon={symbol} onSelectIcon={setSymbol} />

      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <div className="space-y-0.5">
          <Label htmlFor="isNegative" className="text-base">
            Negative Habit
          </Label>
          <p className="text-sm text-muted-foreground">
            Is this a habit you want to avoid or stop?
          </p>
        </div>
        <Switch
          id="isNegative"
          checked={isNegative}
          onCheckedChange={setIsNegative}
          aria-label="Is negative habit"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {habitToEdit ? 'Save Changes' : 'Add Habit'}
        </Button>
      </div>
    </form>
  );
};

export default HabitForm;
