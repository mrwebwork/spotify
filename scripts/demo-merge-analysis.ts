import { 
  MergeStrategyAnalyzer, 
  analyzeCurrentPRs, 
  recommendPRMergeStrategy 
} from '../libs/mergeStrategy';

// Mock GitHub data based on our earlier API calls
const mockPRData = {
  pr32: {
    id: 32,
    title: "Dev",
    state: "open" as const,
    mergeable_state: "dirty",
    mergeable: false,
    rebaseable: false,
    additions: 1300,
    deletions: 831,
    changed_files: 16,
    commits: 8,
    draft: true,
    base_ref: "main",
    head_ref: "dev",
  },
  pr30: {
    id: 30,
    title: "[Security] Replace Insufficient HTML Tag Removal Regex with Robust XSS Sanitization",
    state: "open" as const,
    mergeable_state: "clean",
    mergeable: true,
    rebaseable: true,
    additions: 200,
    deletions: 50,
    changed_files: 5,
    commits: 3,
    draft: true,
    base_ref: "dev",
    head_ref: "copilot/fix-29",
  },
  pr27: {
    id: 27,
    title: "Bump next from 14.2.28 to 14.2.30 in the npm_and_yarn group across 1 directory",
    state: "open" as const,
    mergeable_state: "clean",
    mergeable: true,
    rebaseable: true,
    additions: 5,
    deletions: 5,
    changed_files: 1,
    commits: 1,
    draft: false,
    base_ref: "main",
    head_ref: "dependabot/npm_and_yarn/npm_and_yarn-3bd7c2c787",
  },
  pr28_merged: {
    id: 28,
    title: "Security and Code Quality Improvements: Fix Vulnerabilities, Remove TypeScript Suppressions, Enhance Input Validation, and Implement Production Logger",
    state: "closed" as const,
    mergeable_state: "clean",
    mergeable: true,
    rebaseable: true,
    additions: 192,
    deletions: 103,
    changed_files: 10,
    commits: 7,
    draft: false,
    base_ref: "dev",
    head_ref: "copilot/fix-418a7b03-2c0c-4b8f-81e9-40033c4b5846",
  }
};

/**
 * Demo function to showcase merge strategy analysis without requiring GitHub token
 */
export async function demonstrateMergeStrategyAnalysis() {
  console.log('🔀 Merge Strategy Analysis Demo\n');
  console.log('=====================================\n');

  // Create analyzer instance (without GitHub token for demo)
  const analyzer = new MergeStrategyAnalyzer('', 'mrwebwork', 'spotify');

  // Analyze each PR
  const recommendations = [];

  for (const [key, prData] of Object.entries(mockPRData)) {
    if (prData.state === 'closed') continue; // Skip closed PRs

    console.log(`## PR #${prData.id}: ${prData.title}\n`);
    
    const recommendation = await analyzer.recommendMergeStrategy(prData);
    recommendations.push({ pr: prData, recommendation });

    console.log(`**Recommended Strategy**: ${recommendation.strategy.toUpperCase()}`);
    console.log(`**Confidence**: ${recommendation.confidence}%`);
    console.log(`**Timeline**: ${recommendation.timeline_estimate}\n`);

    if (recommendation.prerequisites && recommendation.prerequisites.length > 0) {
      console.log('**Prerequisites**:');
      recommendation.prerequisites.forEach(prereq => console.log(`- ${prereq}`));
      console.log('');
    }

    console.log('**Reasoning**:');
    recommendation.reasoning.forEach(reason => console.log(`- ${reason}`));

    if (recommendation.risks.length > 0) {
      console.log('\n**Risks**:');
      recommendation.risks.forEach(risk => console.log(`- ⚠️ ${risk}`));
    }

    console.log('\n**PR Details**:');
    console.log(`- Mergeable: ${prData.mergeable}`);
    console.log(`- Mergeable State: ${prData.mergeable_state}`);
    console.log(`- Changes: +${prData.additions}/-${prData.deletions}`);
    console.log(`- Files: ${prData.changed_files}`);
    console.log(`- Commits: ${prData.commits}`);
    console.log(`- Draft: ${prData.draft}`);

    console.log('\n---\n');
  }

  // Generate summary
  console.log('## 📋 Summary and Recommendations\n');

  const conflictedPRs = recommendations.filter(r => r.recommendation.strategy === 'manual');
  const readyPRs = recommendations.filter(r => 
    r.pr.mergeable && !r.pr.draft && r.pr.mergeable_state === 'clean'
  );

  if (conflictedPRs.length > 0) {
    console.log('### 🚨 Priority Actions (Merge Conflicts)\n');
    conflictedPRs.forEach(r => {
      console.log(`**PR #${r.pr.id}**: ${r.pr.title}`);
      console.log(`- Status: Has merge conflicts (${r.pr.mergeable_state})`);
      console.log(`- Action: ${r.recommendation.prerequisites?.join(', ') || 'Manual conflict resolution'}`);
      console.log(`- Timeline: ${r.recommendation.timeline_estimate}\n`);
    });
  }

  if (readyPRs.length > 0) {
    console.log('### ✅ Ready to Merge\n');
    readyPRs.forEach(r => {
      console.log(`**PR #${r.pr.id}**: ${r.pr.title}`);
      console.log(`- Recommended: **${r.recommendation.strategy.toUpperCase()}** merge`);
      console.log(`- Confidence: ${r.recommendation.confidence}%`);
      console.log(`- Timeline: ${r.recommendation.timeline_estimate}\n`);
    });
  }

  console.log('### 📋 General Merge Strategy Guidelines\n');
  console.log('Based on the analysis of current PRs:\n');
  console.log('1. **Small changes (< 100 lines)**: Use squash merge for clean history');
  console.log('2. **Medium changes (100-1000 lines)**: Use merge commit to preserve context');
  console.log('3. **Large changes (> 1000 lines)**: Consider breaking down or use merge commit');
  console.log('4. **Security fixes**: Use squash merge for clean production history');
  console.log('5. **Draft PRs**: Complete review process before merging');
  console.log('6. **Dependency updates**: Use squash merge for cleaner history\n');

  console.log('### 🎯 Immediate Action Plan\n');
  console.log('1. **PR #32 (Dev)**: Resolve merge conflicts first - this blocks other merges');
  console.log('2. **PR #30 (Security)**: Mark as ready for review, then squash merge');
  console.log('3. **PR #27 (Dependencies)**: Ready for squash merge immediately');
  console.log('\n**Estimated total time**: 2-4 hours for conflict resolution + 30 minutes for clean merges');
}

// Export for use in other files
export { mockPRData };

// Run demo if this file is executed directly
if (require.main === module) {
  demonstrateMergeStrategyAnalysis().catch(console.error);
}