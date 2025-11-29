#!/usr/bin/env node

/**
 * Repository → Obsidian Vault Sync
 *
 * Analyzes repository structure and updates Obsidian vault documentation
 * with current component architecture, dependencies, and structure.
 *
 * Usage: node sync-repo-to-vault.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const VAULT_PATH = 'C:\\Users\\MarkusAhling\\obsidian';
const REPO_PATH = process.cwd();
const VAULT_DOC_PATH = path.join(VAULT_PATH, 'Repositories', 'the-Lobbi', 'Devopspipelineuidesign.md');
const PACKAGE_JSON_PATH = path.join(REPO_PATH, 'package.json');

/**
 * Analyze repository structure
 */
function analyzeRepository() {
  console.log('🔍 Analyzing repository structure...');

  const analysis = {
    dependencies: {},
    structure: {},
    stats: {}
  };

  // Read package.json
  if (fs.existsSync(PACKAGE_JSON_PATH)) {
    const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
    analysis.dependencies = {
      name: packageJson.name,
      version: packageJson.version,
      dependencies: packageJson.dependencies || {},
      devDependencies: packageJson.devDependencies || {}
    };
  }

  // Count components
  const srcPath = path.join(REPO_PATH, 'src');
  if (fs.existsSync(srcPath)) {
    analysis.structure = analyzeDirectory(srcPath);
  }

  // Git stats
  try {
    const lastCommit = execSync('git log -1 --format=%ci', { cwd: REPO_PATH }).toString().trim();
    const lastCommitDate = lastCommit.split(' ')[0];
    analysis.stats.lastUpdated = lastCommitDate;

    const openIssues = execSync('git ls-remote --heads origin | wc -l', { cwd: REPO_PATH }).toString().trim();
    analysis.stats.branches = parseInt(openIssues) || 0;
  } catch (error) {
    console.warn('⚠️  Could not retrieve git stats:', error.message);
  }

  return analysis;
}

/**
 * Recursively analyze directory structure
 */
function analyzeDirectory(dirPath) {
  const stats = {
    totalFiles: 0,
    totalComponents: 0,
    directories: {}
  };

  function walk(currentPath, relativePath = '') {
    const items = fs.readdirSync(currentPath);

    items.forEach(item => {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !item.startsWith('.')) {
        const newRelative = relativePath ? `${relativePath}/${item}` : item;
        stats.directories[newRelative] = 0;
        walk(fullPath, newRelative);
      } else if (stat.isFile()) {
        stats.totalFiles++;
        if (item.endsWith('.tsx') || item.endsWith('.jsx')) {
          stats.totalComponents++;
          if (relativePath) {
            stats.directories[relativePath] = (stats.directories[relativePath] || 0) + 1;
          }
        }
      }
    });
  }

  walk(dirPath);
  return stats;
}

/**
 * Update vault frontmatter
 */
function updateVaultFrontmatter(existingContent, analysis) {
  const today = new Date().toISOString().split('T')[0];

  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = existingContent.match(frontmatterRegex);

  if (!match) {
    console.warn('⚠️  No frontmatter found in vault document');
    return existingContent;
  }

  const frontmatter = match[1];
  let updatedFrontmatter = frontmatter;

  // Update fields
  updatedFrontmatter = updatedFrontmatter.replace(/^updated:.*$/m, `updated: ${today}`);
  updatedFrontmatter = updatedFrontmatter.replace(/^last_updated:.*$/m, `last_updated: ${analysis.stats.lastUpdated || today}`);
  updatedFrontmatter = updatedFrontmatter.replace(/^last_scanned:.*$/m, `last_scanned: ${today}`);

  // Update doc_status to complete if it was partial
  if (updatedFrontmatter.includes('doc_status: partial')) {
    updatedFrontmatter = updatedFrontmatter.replace(/^doc_status:.*$/m, 'doc_status: complete');
  }

  return existingContent.replace(frontmatterRegex, `---\n${updatedFrontmatter}\n---`);
}

/**
 * Update stats in vault content
 */
function updateVaultStats(content, analysis) {
  let updated = content;

  // Update component counts in content if present
  const componentCountRegex = /(\d+)\+ components/gi;
  if (analysis.structure.totalComponents > 0) {
    updated = updated.replace(componentCountRegex, `${analysis.structure.totalComponents}+ components`);
  }

  // Update last updated date in footer
  const today = new Date().toISOString().split('T')[0];
  updated = updated.replace(/\*\*Last Updated\*\*:.*$/m, `**Last Updated**: ${today}`);

  return updated;
}

/**
 * Main sync function
 */
function syncRepoToVault() {
  try {
    console.log('🔄 Starting Repository → Vault sync...\n');

    // Analyze repository
    const analysis = analyzeRepository();

    console.log(`📊 Repository Analysis:`);
    console.log(`   Total Files: ${analysis.structure.totalFiles}`);
    console.log(`   Components: ${analysis.structure.totalComponents}`);
    console.log(`   Dependencies: ${Object.keys(analysis.dependencies.dependencies || {}).length}`);
    console.log();

    // Check if vault documentation exists
    if (!fs.existsSync(VAULT_DOC_PATH)) {
      console.error(`❌ Vault documentation not found at: ${VAULT_DOC_PATH}`);
      console.log('   Run vault-to-repo sync first to create initial documentation');
      process.exit(1);
    }

    // Read existing vault documentation
    console.log(`📖 Reading vault documentation from: ${VAULT_DOC_PATH}`);
    let vaultContent = fs.readFileSync(VAULT_DOC_PATH, 'utf8');

    // Update frontmatter
    console.log('🔧 Updating vault frontmatter...');
    vaultContent = updateVaultFrontmatter(vaultContent, analysis);

    // Update stats in content
    console.log('📈 Updating statistics...');
    vaultContent = updateVaultStats(vaultContent, analysis);

    // Write updated content back to vault
    console.log(`📝 Writing updated documentation to vault...`);
    fs.writeFileSync(VAULT_DOC_PATH, vaultContent, 'utf8');

    console.log('\n✅ Sync completed successfully!');
    console.log(`   Components analyzed: ${analysis.structure.totalComponents}`);
    console.log(`   Vault documentation updated\n`);

  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  syncRepoToVault();
}

module.exports = { syncRepoToVault };
