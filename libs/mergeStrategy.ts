import { Octokit } from '@octokit/rest';

// Types for merge strategy analysis
export interface PullRequestAnalysis {
  id: number;
  title: string;
  state: 'open' | 'closed' | 'merged';
  mergeable_state: string;
  mergeable: boolean | null;
  rebaseable: boolean | null;
  additions: number;
  deletions: number;
  changed_files: number;
  commits: number;
  draft: boolean;
  base_ref: string;
  head_ref: string;
  conflicts?: string[];
}

export interface MergeStrategyRecommendation {
  strategy: 'merge' | 'squash' | 'rebase' | 'manual';
  confidence: number; // 0-100
  reasoning: string[];
  risks: string[];
  prerequisites?: string[];
  timeline_estimate?: string;
}

export interface RepositoryMergeAnalysis {
  latest_merged_pr?: PullRequestAnalysis;
  active_prs: PullRequestAnalysis[];
  merge_patterns: {
    preferred_strategy: string;
    average_pr_size: number;
    conflict_frequency: number;
  };
  recommendations: {
    [prNumber: number]: MergeStrategyRecommendation;
  };
}

export class MergeStrategyAnalyzer {
  private octokit: Octokit;
  private owner: string;
  private repo: string;

  constructor(githubToken: string, owner: string, repo: string) {
    this.octokit = new Octokit({ auth: githubToken });
    this.owner = owner;
    this.repo = repo;
  }

  /**
   * Analyzes a pull request and determines its merge characteristics
   */
  async analyzePullRequest(prNumber: number): Promise<PullRequestAnalysis> {
    try {
      const { data: pr } = await this.octokit.rest.pulls.get({
        owner: this.owner,
        repo: this.repo,
        pull_number: prNumber,
      });

      return {
        id: pr.id,
        title: pr.title,
        state: pr.state as 'open' | 'closed',
        mergeable_state: pr.mergeable_state || 'unknown',
        mergeable: pr.mergeable,
        rebaseable: pr.rebaseable,
        additions: pr.additions || 0,
        deletions: pr.deletions || 0,
        changed_files: pr.changed_files || 0,
        commits: pr.commits || 0,
        draft: pr.draft || false,
        base_ref: pr.base.ref,
        head_ref: pr.head.ref,
      };
    } catch (error) {
      throw new Error(`Failed to analyze PR #${prNumber}: ${error}`);
    }
  }

  /**
   * Determines the best merge strategy for a given PR
   */
  async recommendMergeStrategy(prAnalysis: PullRequestAnalysis): Promise<MergeStrategyRecommendation> {
    const reasoning: string[] = [];
    const risks: string[] = [];
    const prerequisites: string[] = [];
    let strategy: 'merge' | 'squash' | 'rebase' | 'manual' = 'merge';
    let confidence = 70; // Default confidence

    // Analyze mergeable state
    if (!prAnalysis.mergeable || prAnalysis.mergeable_state === 'dirty') {
      strategy = 'manual';
      confidence = 90;
      reasoning.push('PR has merge conflicts that require manual resolution');
      prerequisites.push('Resolve merge conflicts first');
      risks.push('Manual conflict resolution may introduce errors');
      
      return {
        strategy,
        confidence,
        reasoning,
        risks,
        prerequisites,
        timeline_estimate: '1-2 hours for conflict resolution'
      };
    }

    // Analyze PR size and complexity
    const totalChanges = prAnalysis.additions + prAnalysis.deletions;
    const changeRatio = prAnalysis.deletions / Math.max(prAnalysis.additions, 1);

    if (totalChanges > 1000) {
      reasoning.push('Large PR with significant changes');
      if (prAnalysis.commits > 10) {
        strategy = 'squash';
        confidence = 85;
        reasoning.push('Multiple commits benefit from squashing for clean history');
      } else {
        strategy = 'merge';
        confidence = 75;
        reasoning.push('Preserve individual commit context for large changes');
      }
      risks.push('Large changes increase integration risk');
    } else if (totalChanges < 100 && prAnalysis.commits <= 3) {
      strategy = 'squash';
      confidence = 90;
      reasoning.push('Small PR with few commits - ideal for squashing');
    } else {
      strategy = 'merge';
      confidence = 80;
      reasoning.push('Medium-sized PR - standard merge preserves history');
    }

    // Check for high deletion ratio (potential refactoring)
    if (changeRatio > 0.7) {
      risks.push('High deletion ratio suggests major refactoring');
      reasoning.push('Consider thorough testing due to significant code removal');
    }

    // Draft PR considerations
    if (prAnalysis.draft) {
      confidence -= 20;
      risks.push('PR is still in draft state');
      prerequisites.push('Mark PR as ready for review');
    }

    // File count considerations
    if (prAnalysis.changed_files > 20) {
      risks.push('Many files changed - increased integration complexity');
      reasoning.push('Consider breaking into smaller PRs if possible');
    }

    return {
      strategy,
      confidence,
      reasoning,
      risks,
      prerequisites,
      timeline_estimate: this.estimateTimeline(strategy, totalChanges)
    };
  }

  /**
   * Analyzes recent merge patterns to understand repository preferences
   */
  async analyzeRecentMergePatterns(): Promise<{
    preferred_strategy: string;
    average_pr_size: number;
    conflict_frequency: number;
  }> {
    try {
      // Get recent merged PRs
      const { data: recentPRs } = await this.octokit.rest.pulls.list({
        owner: this.owner,
        repo: this.repo,
        state: 'closed',
        per_page: 20,
        sort: 'updated',
        direction: 'desc'
      });

      const mergedPRs = recentPRs.filter(pr => pr.merged_at);
      
      if (mergedPRs.length === 0) {
        return {
          preferred_strategy: 'merge',
          average_pr_size: 0,
          conflict_frequency: 0
        };
      }

      const totalChanges = mergedPRs.reduce((sum, pr) => 
        sum + (pr.additions || 0) + (pr.deletions || 0), 0);
      
      const averageSize = totalChanges / mergedPRs.length;

      // Analyze merge commits vs squash commits by looking at commit messages
      let mergeCommits = 0;
      let squashCommits = 0;

      for (const pr of mergedPRs.slice(0, 10)) {
        if (pr.merge_commit_sha) {
          try {
            const { data: commit } = await this.octokit.rest.git.getCommit({
              owner: this.owner,
              repo: this.repo,
              commit_sha: pr.merge_commit_sha
            });
            
            if (commit.message.includes('Merge pull request')) {
              mergeCommits++;
            } else {
              squashCommits++;
            }
          } catch (error) {
            // Skip if can't access commit
            continue;
          }
        }
      }

      const preferredStrategy = mergeCommits >= squashCommits ? 'merge' : 'squash';

      return {
        preferred_strategy: preferredStrategy,
        average_pr_size: Math.round(averageSize),
        conflict_frequency: 0.1 // Estimated - would need more analysis
      };
    } catch (error) {
      return {
        preferred_strategy: 'merge',
        average_pr_size: 200,
        conflict_frequency: 0.1
      };
    }
  }

  /**
   * Provides a comprehensive analysis of repository merge strategy
   */
  async analyzeRepository(): Promise<RepositoryMergeAnalysis> {
    try {
      // Get active PRs
      const { data: openPRs } = await this.octokit.rest.pulls.list({
        owner: this.owner,
        repo: this.repo,
        state: 'open',
        per_page: 10
      });

      // Get latest merged PR
      const { data: recentPRs } = await this.octokit.rest.pulls.list({
        owner: this.owner,
        repo: this.repo,
        state: 'closed',
        per_page: 1,
        sort: 'updated',
        direction: 'desc'
      });

      const latestMerged = recentPRs.find(pr => pr.merged_at);

      // Analyze each active PR
      const activePRAnalyses: PullRequestAnalysis[] = [];
      const recommendations: { [prNumber: number]: MergeStrategyRecommendation } = {};

      for (const pr of openPRs) {
        try {
          const analysis = await this.analyzePullRequest(pr.number);
          activePRAnalyses.push(analysis);
          
          const recommendation = await this.recommendMergeStrategy(analysis);
          recommendations[pr.number] = recommendation;
        } catch (error) {
          console.error(`Error analyzing PR #${pr.number}:`, error);
        }
      }

      // Analyze merge patterns
      const mergePatterns = await this.analyzeRecentMergePatterns();

      let latestMergedAnalysis;
      if (latestMerged) {
        try {
          latestMergedAnalysis = await this.analyzePullRequest(latestMerged.number);
        } catch (error) {
          console.error('Error analyzing latest merged PR:', error);
        }
      }

      return {
        latest_merged_pr: latestMergedAnalysis,
        active_prs: activePRAnalyses,
        merge_patterns: mergePatterns,
        recommendations
      };
    } catch (error) {
      throw new Error(`Failed to analyze repository: ${error}`);
    }
  }

  private estimateTimeline(strategy: string, changes: number): string {
    switch (strategy) {
      case 'squash':
        return changes > 500 ? '15-30 minutes' : '5-10 minutes';
      case 'rebase':
        return changes > 500 ? '30-60 minutes' : '10-20 minutes';
      case 'manual':
        return '1-4 hours depending on conflict complexity';
      default:
        return changes > 500 ? '10-20 minutes' : '5-10 minutes';
    }
  }

  /**
   * Generates a human-readable summary of merge strategy recommendations
   */
  generateMergeStrategySummary(analysis: RepositoryMergeAnalysis): string {
    let summary = '# Merge Strategy Analysis Report\n\n';
    
    // Repository overview
    summary += '## Repository Overview\n';
    summary += `- **Preferred Strategy**: ${analysis.merge_patterns.preferred_strategy}\n`;
    summary += `- **Average PR Size**: ${analysis.merge_patterns.average_pr_size} lines\n`;
    summary += `- **Active PRs**: ${analysis.active_prs.length}\n\n`;

    // Latest merged PR context
    if (analysis.latest_merged_pr) {
      const latest = analysis.latest_merged_pr;
      summary += '## Latest Merged PR Context\n';
      summary += `- **PR #${latest.id}**: ${latest.title}\n`;
      summary += `- **Size**: ${latest.additions + latest.deletions} lines changed\n`;
      summary += `- **Files**: ${latest.changed_files} files modified\n\n`;
    }

    // Active PR recommendations
    summary += '## Active PR Recommendations\n\n';
    
    for (const pr of analysis.active_prs) {
      const rec = analysis.recommendations[pr.id];
      if (!rec) continue;

      summary += `### PR #${pr.id}: ${pr.title}\n`;
      summary += `- **Recommended Strategy**: ${rec.strategy.toUpperCase()}\n`;
      summary += `- **Confidence**: ${rec.confidence}%\n`;
      summary += `- **Timeline**: ${rec.timeline_estimate}\n`;
      
      if (rec.prerequisites && rec.prerequisites.length > 0) {
        summary += `- **Prerequisites**: ${rec.prerequisites.join(', ')}\n`;
      }
      
      summary += '\n**Reasoning**:\n';
      rec.reasoning.forEach(reason => {
        summary += `- ${reason}\n`;
      });
      
      if (rec.risks.length > 0) {
        summary += '\n**Risks**:\n';
        rec.risks.forEach(risk => {
          summary += `- ⚠️ ${risk}\n`;
        });
      }
      
      summary += '\n---\n\n';
    }

    // General recommendations
    summary += '## General Recommendations\n\n';
    
    const conflictedPRs = analysis.active_prs.filter(pr => 
      !pr.mergeable || pr.mergeable_state === 'dirty'
    );
    
    if (conflictedPRs.length > 0) {
      summary += '### 🚨 Priority Actions\n';
      summary += `${conflictedPRs.length} PR(s) have merge conflicts requiring immediate attention:\n`;
      conflictedPRs.forEach(pr => {
        summary += `- PR #${pr.id}: ${pr.title}\n`;
      });
      summary += '\n';
    }

    const readyPRs = analysis.active_prs.filter(pr => 
      pr.mergeable && !pr.draft && pr.mergeable_state === 'clean'
    );
    
    if (readyPRs.length > 0) {
      summary += '### ✅ Ready to Merge\n';
      readyPRs.forEach(pr => {
        const rec = analysis.recommendations[pr.id];
        summary += `- PR #${pr.id}: **${rec?.strategy.toUpperCase()}** merge recommended\n`;
      });
      summary += '\n';
    }

    summary += '### 📋 Merge Strategy Guidelines\n';
    summary += `- **Small PRs (< 100 lines)**: Prefer squash merge for clean history\n`;
    summary += `- **Medium PRs (100-1000 lines)**: Use merge commit to preserve context\n`;
    summary += `- **Large PRs (> 1000 lines)**: Consider breaking down or use merge commit\n`;
    summary += `- **Hotfixes**: Use squash merge for clean production history\n`;
    summary += `- **Feature branches**: Use merge commit to maintain feature context\n\n`;

    return summary;
  }
}

// Export utility functions for direct use
export async function analyzeCurrentPRs(githubToken: string, owner: string, repo: string) {
  const analyzer = new MergeStrategyAnalyzer(githubToken, owner, repo);
  return await analyzer.analyzeRepository();
}

export async function recommendPRMergeStrategy(
  githubToken: string, 
  owner: string, 
  repo: string, 
  prNumber: number
) {
  const analyzer = new MergeStrategyAnalyzer(githubToken, owner, repo);
  const prAnalysis = await analyzer.analyzePullRequest(prNumber);
  return await analyzer.recommendMergeStrategy(prAnalysis);
}