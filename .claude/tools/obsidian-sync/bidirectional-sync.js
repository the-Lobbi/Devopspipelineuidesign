#!/usr/bin/env node

/**
 * Bidirectional Obsidian ↔ Repository Sync
 *
 * Performs complete bidirectional sync between Obsidian vault and repository.
 *
 * Flow:
 * 1. Repo → Vault: Update vault with latest repository structure/stats
 * 2. Vault → Repo: Update repository README from vault documentation
 *
 * Usage: node bidirectional-sync.js [--vault-only|--repo-only]
 */

const { syncVaultToRepo } = require('./sync-vault-to-repo');
const { syncRepoToVault } = require('./sync-repo-to-vault');

const args = process.argv.slice(2);
const vaultOnly = args.includes('--vault-only');
const repoOnly = args.includes('--repo-only');

async function bidirectionalSync() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Obsidian ↔ Repository Bidirectional Sync');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    if (!repoOnly) {
      console.log('━━━ Phase 1: Repository → Vault ━━━\n');
      syncRepoToVault();
      console.log();
    }

    if (!vaultOnly) {
      console.log('━━━ Phase 2: Vault → Repository ━━━\n');
      syncVaultToRepo();
      console.log();
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log('✨ Bidirectional sync completed successfully!');
    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ Bidirectional sync failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  bidirectionalSync();
}

module.exports = { bidirectionalSync };
