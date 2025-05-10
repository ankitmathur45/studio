
import StatsPlaceholder from '@/components/dashboard/StatsPlaceholder';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Your Dashboard</h1>
      <StatsPlaceholder />
    </div>
  );
}
