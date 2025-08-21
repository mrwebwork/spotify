import { Header } from '@/components/Header';
import { MergeStrategyDashboard } from '@/components/MergeStrategyDashboard';

export default function MergeStrategyPage() {
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header className="from-bg-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">
            🔀 Merge Strategy Analyzer
          </h1>
          <p className="text-neutral-400 text-sm max-w-2xl">
            Intelligent analysis of repository pull requests with automated merge strategy recommendations 
            based on size, complexity, conflicts, and historical patterns.
          </p>
        </div>
      </Header>
      
      <div className="mt-2 px-6">
        <MergeStrategyDashboard />
      </div>
    </div>
  );
}