"use client"; // Required for useState and event handlers

import React, { useState } from 'react'; // Import useState
import WeeklyView from '@/components/tracking/WeeklyView';
import HabitDashboard from '@/components/dashboard/HabitDashboard';
import ManageHabitsDialog from '@/components/habits/ManageHabitsDialog'; // Import Dialog
import { Button } from '@/components/ui/button'; // Import Button
import { Settings } from 'lucide-react'; // Import Icon for the button

export default function HomePage() {
  const [isManageHabitsOpen, setIsManageHabitsOpen] = useState(false); // State for dialog

  return (
    // This div ensures its children (header and the grid) use the available height properly.
    // h-full ensures it takes height from parent in AppLayout.
    // flex flex-col ensures children are stacked and flex-grow works.
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h1 className="text-3xl font-bold text-foreground">Habit Overview</h1>
        <Button onClick={() => setIsManageHabitsOpen(true)} variant="outline" className="shadow-sm">
          <Settings className="mr-2 h-5 w-5" /> Manage Habits
        </Button>
      </div>
      
      {/* This grid should take the remaining space due to flex-grow and hide overflow */}
      <div className="grid md:grid-cols-2 gap-4 flex-grow overflow-hidden">
        {/* Column 1: WeeklyView */}
        {/* overflow-y-auto will add scrollbar if WeeklyView card is taller than available space in this column */}
        <div className="overflow-y-auto no-scrollbar p-0.5"> {/* p-0.5 for slight spacing if scrollbar appears (even if hidden) */}
          <WeeklyView />
        </div>
        {/* Column 2: HabitDashboard */}
        <div className="overflow-y-auto no-scrollbar p-0.5">
          <HabitDashboard />
        </div>
      </div>
      <ManageHabitsDialog isOpen={isManageHabitsOpen} onOpenChange={setIsManageHabitsOpen} />
    </div>
  );
}
