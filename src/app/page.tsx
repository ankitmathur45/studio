
import WeeklyView from '@/components/tracking/WeeklyView';
import HabitDashboard from '@/components/dashboard/HabitDashboard';

export default function HomePage() {
  return (
    // This div ensures its children (h1 and the grid) use the available height properly.
    // h-full ensures it takes height from parent in AppLayout.
    // flex flex-col ensures children are stacked and flex-grow works.
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-bold text-foreground mb-4 shrink-0">Habit Overview</h1>
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
    </div>
  );
}
