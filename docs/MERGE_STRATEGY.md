# 🔀 Merge Strategy Analyzer

A comprehensive system for analyzing GitHub pull requests and recommending optimal merge strategies based on repository context, PR characteristics, and historical patterns.

## Overview

This system helps repository maintainers make informed decisions about how to merge pull requests by analyzing:

- **PR Characteristics**: Size, complexity, conflicts, and draft status
- **Repository Patterns**: Historical merge preferences and average PR sizes  
- **Risk Assessment**: Potential integration issues and required prerequisites
- **Timeline Estimation**: Expected time for different merge strategies

## Features

### 🔍 Automated Analysis
- Analyzes all active PRs in a repository
- Evaluates merge conflicts and resolvability
- Assesses PR size and complexity metrics
- Reviews commit structure and change patterns

### 🎯 Smart Recommendations
- **Merge Commit**: For feature branches and context preservation
- **Squash Merge**: For clean history and small changes
- **Manual Resolution**: For conflicted PRs requiring intervention
- **Rebase**: For linear history preferences (future enhancement)

### 📊 Risk Assessment
- Identifies potential integration challenges
- Highlights prerequisite actions needed
- Estimates timeline for completion
- Warns about high-risk changes

### 📈 Repository Insights
- Historical merge pattern analysis
- Average PR size metrics
- Conflict frequency tracking
- Team preference identification

## Installation

```bash
# Install dependencies
npm install @octokit/rest tsx --save-dev

# Add scripts to package.json (already included)
npm run merge-analysis    # Run demo analysis
npm run merge-strategy    # CLI tool (requires GitHub token)
```

## Usage

### Quick Demo Analysis
```bash
npm run merge-analysis
```

### CLI Tool (with GitHub API)
```bash
# Set up GitHub token
export GITHUB_TOKEN=your_github_token

# Analyze entire repository
npm run merge-strategy analyze

# Get recommendation for specific PR
npm run merge-strategy recommend --pr 32

# Analyze different repository
npm run merge-strategy analyze --owner otheruser --repo otherrepo
```

### Programmatic Usage
```typescript
import { MergeStrategyAnalyzer } from './libs/mergeStrategy';

const analyzer = new MergeStrategyAnalyzer(githubToken, 'owner', 'repo');

// Analyze single PR
const prAnalysis = await analyzer.analyzePullRequest(32);
const recommendation = await analyzer.recommendMergeStrategy(prAnalysis);

// Full repository analysis
const repoAnalysis = await analyzer.analyzeRepository();
const summary = analyzer.generateMergeStrategySummary(repoAnalysis);
```

## Strategy Decision Matrix

| PR Characteristics | Recommended Strategy | Reasoning |
|-------------------|---------------------|-----------|
| < 100 lines, ≤3 commits | **SQUASH** | Clean history, simple changes |
| 100-1000 lines, feature work | **MERGE** | Preserve context and commit structure |
| > 1000 lines, many commits | **SQUASH** | Simplify history, reduce noise |
| Has conflicts | **MANUAL** | Requires human intervention |
| Draft status | **HOLD** | Wait for completion |
| Security/hotfix | **SQUASH** | Clean production history |
| Dependencies | **SQUASH** | Minimize commit noise |

## Current Repository Analysis

Based on the most recent analysis:

### Active PRs Status

#### 🚨 **PR #32 (Dev)** - URGENT
- **Status**: Has merge conflicts (dirty state)
- **Strategy**: Manual resolution required
- **Timeline**: 1-2 hours
- **Action**: Resolve conflicts before any merges

#### ✅ **PR #27 (Dependencies)** - READY  
- **Status**: Clean, ready to merge
- **Strategy**: Squash merge
- **Timeline**: 5-10 minutes
- **Action**: Can merge immediately

#### 📝 **PR #30 (Security)** - IN REVIEW
- **Status**: Draft, awaiting review completion
- **Strategy**: Merge commit (preserve security context)
- **Timeline**: 15-30 minutes after review
- **Action**: Complete review process first

### Immediate Action Plan

1. **Priority 1**: Resolve PR #32 conflicts (blocks other work)
2. **Priority 2**: Merge PR #27 dependencies (low risk)
3. **Priority 3**: Complete review and merge PR #30 (security critical)

**Total estimated time**: 2-4 hours for conflicts + 45 minutes for clean merges

## Implementation Details

### Core Components

#### `MergeStrategyAnalyzer` Class
- **GitHub API Integration**: Uses Octokit for repository data
- **Conflict Detection**: Analyzes mergeable states and conflicts
- **Pattern Recognition**: Learns from repository history
- **Risk Assessment**: Evaluates integration complexity

#### Key Algorithms
- **Size Classification**: Lines changed vs complexity thresholds
- **Conflict Analysis**: Mergeable state evaluation
- **History Pattern**: Previous merge strategy preferences
- **Timeline Estimation**: Based on change complexity

### Configuration Options
```typescript
interface MergeStrategyConfig {
  smallPRThreshold: number;    // Default: 100 lines
  largePRThreshold: number;    // Default: 1000 lines
  maxCommitsForSquash: number; // Default: 3
  preferSquashForDrafts: boolean; // Default: true
}
```

## Benefits

### For Repository Maintainers
- **Consistent Decisions**: Standardized merge strategy selection
- **Risk Reduction**: Early identification of problematic merges  
- **Time Savings**: Automated analysis instead of manual evaluation
- **Team Alignment**: Shared understanding of merge preferences

### For Development Teams
- **Clear Guidelines**: Understand expected merge strategies
- **Faster Reviews**: Reduced back-and-forth on merge decisions
- **Quality Assurance**: Systematic risk assessment
- **Historical Insights**: Learn from past merge patterns

## Future Enhancements

- **GitHub Actions Integration**: Automated analysis on PR creation
- **Slack/Teams Notifications**: Alert team about merge recommendations
- **Advanced Conflict Resolution**: Suggested resolution strategies
- **Machine Learning**: Learn team preferences over time
- **Performance Metrics**: Track merge success rates by strategy

## Example Output

```markdown
# Merge Strategy Analysis Report

## Repository Overview
- **Preferred Strategy**: merge
- **Average PR Size**: 295 lines
- **Active PRs**: 3

## Active PR Recommendations

### PR #32: Dev
- **Recommended Strategy**: MANUAL
- **Confidence**: 90%
- **Timeline**: 1-2 hours for conflict resolution

**Reasoning**:
- PR has merge conflicts that require manual resolution

**Risks**:
- ⚠️ Manual conflict resolution may introduce errors

### PR #27: Dependencies Update
- **Recommended Strategy**: SQUASH
- **Confidence**: 90%
- **Timeline**: 5-10 minutes

**Reasoning**:
- Small PR with few commits - ideal for squashing
```

## Contributing

1. **Add New Strategy Types**: Extend the strategy enum and decision logic
2. **Improve Risk Detection**: Add more sophisticated conflict analysis
3. **Enhanced Timeline Estimation**: Factor in team velocity and complexity
4. **Integration Features**: GitHub Actions, webhooks, notifications

## License

This merge strategy analyzer is part of the Spotify Clone project and follows the same MIT license terms.