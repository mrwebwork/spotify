'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';

// Mock data for demonstration (in real app, this would come from API)
const mockAnalysis = {
  activePRs: [
    {
      id: 32,
      title: "Dev",
      strategy: "MANUAL",
      confidence: 90,
      timeline: "1-2 hours",
      status: "conflicted",
      changes: { additions: 1300, deletions: 831 },
      priority: "urgent"
    },
    {
      id: 30,
      title: "Security: XSS Sanitization",
      strategy: "MERGE",
      confidence: 60,
      timeline: "15-30 minutes",
      status: "draft",
      changes: { additions: 200, deletions: 50 },
      priority: "high"
    },
    {
      id: 27,
      title: "Bump Next.js dependencies",
      strategy: "SQUASH",
      confidence: 90,
      timeline: "5-10 minutes",
      status: "ready",
      changes: { additions: 5, deletions: 5 },
      priority: "low"
    }
  ]
};

export const MergeStrategyDashboard = () => {
  const [analysis, setAnalysis] = useState(mockAnalysis);
  const [loading, setLoading] = useState(false);

  const refreshAnalysis = async () => {
    setLoading(true);
    // In a real app, this would call the merge strategy API
    setTimeout(() => {
      setLoading(false);
      // Simulate updated analysis
      setAnalysis(mockAnalysis);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'conflicted': return 'bg-red-100 text-red-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return '🚨';
      case 'high': return '⚡';
      case 'low': return '📋';
      default: return '📄';
    }
  };

  const getStrategyColor = (strategy: string) => {
    switch (strategy) {
      case 'MANUAL': return 'bg-red-500';
      case 'SQUASH': return 'bg-blue-500';
      case 'MERGE': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 bg-neutral-900 text-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          🔀 Merge Strategy Dashboard
        </h2>
        <Button 
          onClick={refreshAnalysis}
          disabled={loading}
          className="bg-green-600 hover:bg-green-500"
        >
          {loading ? '🔄 Analyzing...' : '🔍 Refresh Analysis'}
        </Button>
      </div>

      <div className="grid gap-4">
        {analysis.activePRs.map((pr) => (
          <div key={pr.id} className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getPriorityIcon(pr.priority)}</span>
                <div>
                  <h3 className="font-semibold text-lg">PR #{pr.id}: {pr.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pr.status)}`}>
                      {pr.status.toUpperCase()}
                    </span>
                    <span className="text-neutral-400 text-sm">
                      +{pr.changes.additions}/-{pr.changes.deletions} lines
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`inline-block px-3 py-1 rounded-full text-white font-bold ${getStrategyColor(pr.strategy)}`}>
                  {pr.strategy}
                </div>
                <div className="text-sm text-neutral-400 mt-1">
                  {pr.confidence}% confidence
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-neutral-300">
                  ⏱️ Timeline: {pr.timeline}
                </span>
                {pr.status === 'conflicted' && (
                  <span className="text-sm text-red-400">
                    ⚠️ Merge conflicts detected
                  </span>
                )}
                {pr.status === 'draft' && (
                  <span className="text-sm text-yellow-400">
                    📝 Awaiting review completion
                  </span>
                )}
                {pr.status === 'ready' && (
                  <span className="text-sm text-green-400">
                    ✅ Ready to merge
                  </span>
                )}
              </div>

              {pr.status === 'ready' && (
                <Button 
                  className={`${getStrategyColor(pr.strategy)} px-4 py-1 text-sm`}
                  onClick={() => {
                    // In a real app, this would trigger the actual merge
                    alert(`Would execute ${pr.strategy} merge for PR #${pr.id}`);
                  }}
                >
                  {pr.strategy} Merge
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          📋 Action Plan Summary
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-red-400">🚨 Priority 1:</span>
            <span>Resolve PR #32 conflicts (blocks other merges)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400">⚡ Priority 2:</span>
            <span>Complete PR #30 review process</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✅ Priority 3:</span>
            <span>Merge PR #27 dependencies (ready now)</span>
          </div>
          <div className="mt-3 p-2 bg-neutral-700 rounded text-neutral-300">
            <strong>Estimated total time:</strong> 2-4 hours for conflicts + 45 minutes for clean merges
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-neutral-400">
        💡 <strong>Tip:</strong> This dashboard analyzes your repository&apos;s PRs and recommends the best merge strategy 
        based on size, complexity, conflicts, and historical patterns.
      </div>
    </div>
  );
};

export default MergeStrategyDashboard;