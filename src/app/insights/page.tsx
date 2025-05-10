
import InsightsGenerator from '@/components/insights/InsightsGenerator';

export default function InsightsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Your Insights</h1>
      <InsightsGenerator />
    </div>
  );
}
