#!/usr/bin/env node

/**
 * Obsidian Vault → Repository Sync
 *
 * Syncs documentation from Obsidian vault to repository README.md
 * This ensures the repository README stays up-to-date with vault documentation.
 *
 * Usage: node sync-vault-to-repo.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const VAULT_PATH = 'C:\\Users\\MarkusAhling\\obsidian';
const REPO_PATH = process.cwd();
const VAULT_DOC_PATH = path.join(VAULT_PATH, 'Repositories', 'the-Lobbi', 'Devopspipelineuidesign.md');
const REPO_README_PATH = path.join(REPO_PATH, 'README.md');

/**
 * Parse frontmatter and content from vault markdown file
 */
function parseVaultDoc(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: null, content };
  }

  const frontmatter = {};
  const frontmatterLines = match[1].split('\n');

  frontmatterLines.forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      frontmatter[key.trim()] = valueParts.join(':').trim();
    }
  });

  return { frontmatter, content: match[2] };
}

/**
 * Extract relevant sections from vault content for README
 */
function extractReadmeContent(vaultContent, frontmatter) {
  const lines = vaultContent.split('\n');
  let readmeContent = [];
  let inRelevantSection = false;
  let skipDataview = false;

  // Add header with badges
  readmeContent.push('# DevOps Pipeline UI Design\n');
  readmeContent.push('**A comprehensive React-based web application for DevOps pipeline management, monitoring, and agent orchestration.**\n');
  readmeContent.push('[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)');
  readmeContent.push('[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev/)');
  readmeContent.push('[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)\n');
  readmeContent.push('> **Original Design**: [Figma - DevOps Pipeline UI Design](https://www.figma.com/design/F4bjLgYllxrlBcnh3CIlvU/DevOps-Pipeline-UI-Design)\n');
  readmeContent.push('---\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip frontmatter section header
    if (line.startsWith('# Devopspipelineuidesign')) continue;

    // Skip Quick Reference table (vault-specific)
    if (line.includes('## Quick Reference')) {
      while (i < lines.length && !lines[i].startsWith('##')) {
        i++;
      }
      i--; // Back up one line to process next section
      continue;
    }

    // Skip Related Repositories (Dataview query)
    if (line.includes('## Related Repositories')) {
      skipDataview = true;
    }

    if (skipDataview && line.startsWith('```')) {
      skipDataview = !skipDataview;
      continue;
    }

    if (skipDataview) continue;

    // Skip Documentation Tasks
    if (line.includes('## Documentation Tasks')) {
      while (i < lines.length && !lines[i].startsWith('##')) {
        i++;
      }
      i--;
      continue;
    }

    // Skip See Also section (vault-specific wikilinks)
    if (line.includes('## See Also')) {
      while (i < lines.length && lines[i].trim()) {
        i++;
      }
      continue;
    }

    // Convert wikilinks to regular markdown links (if any slip through)
    let processedLine = line.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '[$2]($1)');
    processedLine = processedLine.replace(/\[\[([^\]]+)\]\]/g, '[$1]($1)');

    readmeContent.push(processedLine);
  }

  // Add footer
  readmeContent.push('\n---\n');
  readmeContent.push(`**Last Updated**: ${new Date().toISOString().split('T')[0]}`);
  readmeContent.push('**Maintained By**: the-Lobbi team');
  readmeContent.push('**Repository**: [github.com/the-Lobbi/Devopspipelineuidesign](https://github.com/the-Lobbi/Devopspipelineuidesign)');

  return readmeContent.join('\n');
}

/**
 * Main sync function
 */
function syncVaultToRepo() {
  try {
    console.log('🔄 Starting Vault → Repository sync...\n');

    // Check if vault documentation exists
    if (!fs.existsSync(VAULT_DOC_PATH)) {
      console.error(`❌ Vault documentation not found at: ${VAULT_DOC_PATH}`);
      process.exit(1);
    }

    // Read vault documentation
    console.log(`📖 Reading vault documentation from: ${VAULT_DOC_PATH}`);
    const vaultContent = fs.readFileSync(VAULT_DOC_PATH, 'utf8');
    const { frontmatter, content } = parseVaultDoc(vaultContent);

    // Extract and transform content for README
    console.log('🔧 Transforming content for README...');
    const readmeContent = extractReadmeContent(content, frontmatter);

    // Write to repository README
    console.log(`📝 Writing README to: ${REPO_README_PATH}`);
    fs.writeFileSync(REPO_README_PATH, readmeContent, 'utf8');

    console.log('\n✅ Sync completed successfully!');
    console.log(`   Updated: ${frontmatter?.updated || 'N/A'}`);
    console.log(`   Status: ${frontmatter?.doc_status || 'N/A'}\n`);

  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  syncVaultToRepo();
}

module.exports = { syncVaultToRepo };
