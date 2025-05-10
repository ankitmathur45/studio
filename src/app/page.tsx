
import WeeklyView from '@/components/tracking/WeeklyView';
import HabitDashboard from '@/components/dashboard/HabitDashboard';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Habit Overview</h1>
      <WeeklyView />
      <HabitDashboard />
    </div>
  );
}
