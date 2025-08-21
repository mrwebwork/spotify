#!/usr/bin/env node

import { MergeStrategyAnalyzer } from '../libs/mergeStrategy';
import * as fs from 'fs';
import * as path from 'path';

// Simple argument parsing
function parseArgs(args: string[]): {
  command?: string;
  prNumber?: number;
  owner?: string;
  repo?: string;
  token?: string;
  help?: boolean;
} {
  const parsed: any = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    } else if (arg === '--pr') {
      parsed.prNumber = parseInt(args[++i]);
    } else if (arg === '--owner') {
      parsed.owner = args[++i];
    } else if (arg === '--repo') {
      parsed.repo = args[++i];
    } else if (arg === '--token') {
      parsed.token = args[++i];
    } else if (!parsed.command) {
      parsed.command = arg;
    }
  }
  
  return parsed;
}

function showHelp() {
  console.log(`
🔀 Merge Strategy Analyzer

USAGE:
  merge-strategy <command> [options]

COMMANDS:
  analyze           Analyze all active PRs in the repository
  recommend         Get recommendation for a specific PR
  help              Show this help message

OPTIONS:
  --owner <owner>   GitHub repository owner (default: from git remote)
  --repo <repo>     GitHub repository name (default: from git remote)
  --pr <number>     PR number for recommendation command
  --token <token>   GitHub token (default: from GITHUB_TOKEN env var)

EXAMPLES:
  merge-strategy analyze
  merge-strategy recommend --pr 32
  merge-strategy analyze --owner mrwebwork --repo spotify

ENVIRONMENT:
  GITHUB_TOKEN      GitHub personal access token for API access
  `);
}

async function getRepoInfo(): Promise<{ owner: string; repo: string } | null> {
  try {
    const { execSync } = require('child_process');
    const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    
    // Parse GitHub URL
    const match = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
    if (match) {
      return {
        owner: match[1],
        repo: match[2]
      };
    }
  } catch (error) {
    // Ignore errors
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  if (options.help || !options.command) {
    showHelp();
    return;
  }

  // Get repository info
  const repoInfo = await getRepoInfo();
  const owner = options.owner || repoInfo?.owner;
  const repo = options.repo || repoInfo?.repo;
  const token = options.token || process.env.GITHUB_TOKEN;

  if (!owner || !repo) {
    console.error('❌ Error: Could not determine repository owner/name. Please specify --owner and --repo');
    process.exit(1);
  }

  if (!token) {
    console.error('❌ Error: GitHub token required. Set GITHUB_TOKEN environment variable or use --token');
    process.exit(1);
  }

  const analyzer = new MergeStrategyAnalyzer(token, owner, repo);

  try {
    switch (options.command) {
      case 'analyze': {
        console.log('🔍 Analyzing repository merge strategy...\n');
        const analysis = await analyzer.analyzeRepository();
        const summary = analyzer.generateMergeStrategySummary(analysis);
        console.log(summary);
        
        // Save detailed analysis to file
        const outputFile = 'merge-analysis.json';
        fs.writeFileSync(outputFile, JSON.stringify(analysis, null, 2));
        console.log(`📄 Detailed analysis saved to ${outputFile}`);
        break;
      }

      case 'recommend': {
        if (!options.prNumber) {
          console.error('❌ Error: PR number required for recommend command. Use --pr <number>');
          process.exit(1);
        }

        console.log(`🔍 Analyzing PR #${options.prNumber}...\n`);
        
        const prAnalysis = await analyzer.analyzePullRequest(options.prNumber);
        const recommendation = await analyzer.recommendMergeStrategy(prAnalysis);

        console.log(`## PR #${options.prNumber}: ${prAnalysis.title}\n`);
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

        console.log('\n---\n');
        console.log('**PR Details**:');
        console.log(`- State: ${prAnalysis.state}`);
        console.log(`- Mergeable: ${prAnalysis.mergeable}`);
        console.log(`- Mergeable State: ${prAnalysis.mergeable_state}`);
        console.log(`- Changes: +${prAnalysis.additions}/-${prAnalysis.deletions}`);
        console.log(`- Files: ${prAnalysis.changed_files}`);
        console.log(`- Commits: ${prAnalysis.commits}`);
        break;
      }

      default:
        console.error(`❌ Error: Unknown command '${options.command}'`);
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { main };