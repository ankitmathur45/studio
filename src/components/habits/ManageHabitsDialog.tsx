
"use client";
import React, { useState } from 'react';
import { useHabits } from '@/contexts/HabitContext';
import type { Habit } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import HabitForm from './HabitForm';
import HabitListItem from './HabitListItem';
import { PlusCircle, Settings } from 'lucide-react';
import { MAX_HABITS } from '@/lib/constants';

interface ManageHabitsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ManageHabitsDialog: React.FC<ManageHabitsDialogProps> = ({ isOpen, onOpenChange }) => {
  const { habits, deleteHabit, isLoading } = useHabits();
  const [showForm, setShowForm] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<Habit | undefined>(undefined);

  const handleAddNew = () => {
    if (habits.length >= MAX_HABITS) {
      alert(`You have reached the maximum of ${MAX_HABITS} habits.`);
      return;
    }
    setHabitToEdit(undefined);
    setShowForm(true);
  };

  const handleEdit = (habit: Habit) => {
    setHabitToEdit(habit);
    setShowForm(true);
  };

  const handleDelete = (habitId: string) => {
    if (window.confirm('Are you sure you want to delete this habit and all its logs?')) {
      deleteHabit(habitId);
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setHabitToEdit(undefined);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setHabitToEdit(undefined);
  };

  const handleDialogClose = () => {
    onOpenChange(false);
    // Delay hiding form to prevent abrupt UI change during dialog close animation
    setTimeout(() => {
      setShowForm(false);
      setHabitToEdit(undefined);
    }, 300);
  };


  if (isLoading) {
    return (
       <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Settings className="w-5 h-5"/> Manage Habits</DialogTitle>
            <DialogDescription>Loading your habits...</DialogDescription>
          </DialogHeader>
          <div className="p-6 text-center">Loading...</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[525px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5"/> {showForm ? (habitToEdit ? 'Edit Habit' : 'Add New Habit') : 'Manage Habits'}
          </DialogTitle>
          {!showForm && (
            <DialogDescription>
              Add, edit, or remove your habits. You can track up to {MAX_HABITS} habits.
            </DialogDescription>
          )}
        </DialogHeader>

        {showForm ? (
          <HabitForm
            habitToEdit={habitToEdit}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        ) : (
          <>
            <ScrollArea className="flex-grow pr-2 -mr-2"> {/* Adjust padding for scrollbar */}
              {habits.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No habits yet. Add your first one!</p>
              ) : (
                <div className="space-y-2">
                  {habits.map((habit) => (
                    <HabitListItem
                      key={habit.id}
                      habit={habit}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
            <DialogFooter className="pt-4 mt-auto">
              <Button onClick={handleAddNew} disabled={habits.length >= MAX_HABITS}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Habit
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ManageHabitsDialog;
