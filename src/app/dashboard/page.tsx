
import StatsPlaceholder from '@/components/dashboard/StatsPlaceholder';

export default function DashboardPage() {
  return (
    <> {/* Simplified to fragment, container is handled by AppLayout */}
      <h1 className="text-3xl font-bold mb-8 text-foreground">Your Dashboard</h1>
      <StatsPlaceholder />
    </>
  );
}
