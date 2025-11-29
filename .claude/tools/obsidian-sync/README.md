# Obsidian ↔ Repository Bidirectional Sync

Automated synchronization system between the Devopspipelineuidesign repository and the Obsidian documentation vault.

## Overview

This sync system maintains documentation consistency between two sources of truth:

1. **Obsidian Vault**: `C:\Users\MarkusAhling\obsidian\Repositories\the-Lobbi\Devopspipelineuidesign.md`
2. **Repository README**: `README.md` in the repository root

## Sync Scripts

### 1. Repository → Vault (`sync-repo-to-vault.js`)

**Purpose**: Updates vault documentation with current repository state

**What it updates**:
- Frontmatter metadata (updated, last_updated, last_scanned dates)
- Component counts and statistics
- Documentation status (partial → complete)
- Git repository stats

**Usage**:
```bash
node .claude/tools/obsidian-sync/sync-repo-to-vault.js
```

**When to run**:
- After adding/removing components
- After significant structural changes
- Before committing major updates

### 2. Vault → Repository (`sync-vault-to-repo.js`)

**Purpose**: Updates repository README from vault documentation

**What it updates**:
- Complete README.md content
- Technology stack information
- Component architecture details
- Project structure documentation

**Transformations**:
- Removes vault-specific frontmatter
- Converts wikilinks to markdown links
- Removes Dataview queries
- Adds repository-specific header with badges
- Filters vault-only sections (Quick Reference, See Also, etc.)

**Usage**:
```bash
node .claude/tools/obsidian-sync/sync-vault-to-repo.js
```

**When to run**:
- After updating vault documentation
- Before publishing repository updates
- When README needs refreshing

### 3. Bidirectional Sync (`bidirectional-sync.js`)

**Purpose**: Performs complete two-way sync

**Flow**:
1. **Phase 1**: Repository → Vault (update stats/metadata)
2. **Phase 2**: Vault → Repository (update README)

**Usage**:
```bash
# Full bidirectional sync
node .claude/tools/obsidian-sync/bidirectional-sync.js

# Vault → Repo only
node .claude/tools/obsidian-sync/bidirectional-sync.js --vault-only

# Repo → Vault only
node .claude/tools/obsidian-sync/bidirectional-sync.js --repo-only
```

**When to run**:
- Daily/weekly maintenance
- Before major releases
- After documentation updates
- As part of CI/CD pipeline

## Integration Options

### Manual Execution

Run scripts manually when needed:

```bash
cd c:\Users\MarkusAhling\dev\Devopspipelineuidesign
node .claude/tools/obsidian-sync/bidirectional-sync.js
```

### npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "sync:vault": "node .claude/tools/obsidian-sync/sync-vault-to-repo.js",
    "sync:repo": "node .claude/tools/obsidian-sync/sync-repo-to-vault.js",
    "sync:bidirectional": "node .claude/tools/obsidian-sync/bidirectional-sync.js"
  }
}
```

Then run:
```bash
npm run sync:bidirectional
```

### Git Pre-commit Hook

Automatically sync before commits:

**.git/hooks/pre-commit**:
```bash
#!/bin/sh
node .claude/tools/obsidian-sync/bidirectional-sync.js
git add README.md
```

Make executable:
```bash
chmod +x .git/hooks/pre-commit
```

### Scheduled Automation (Windows Task Scheduler)

1. Create batch file `sync-docs.bat`:
```batch
@echo off
cd c:\Users\MarkusAhling\dev\Devopspipelineuidesign
node .claude/tools/obsidian-sync/bidirectional-sync.js
```

2. Schedule in Task Scheduler:
   - Trigger: Daily at specific time
   - Action: Run `sync-docs.bat`

### CI/CD Integration (GitHub Actions)

**.github/workflows/sync-docs.yml**:
```yaml
name: Sync Documentation

on:
  push:
    paths:
      - 'src/**'
      - 'package.json'
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Run bidirectional sync
        run: node .claude/tools/obsidian-sync/bidirectional-sync.js
      - name: Commit changes
        run: |
          git config user.name "Documentation Bot"
          git config user.email "bot@the-lobbi.com"
          git add README.md
          git commit -m "docs: sync vault documentation" || echo "No changes"
          git push
```

## Architecture

### Data Flow

```
┌─────────────────────┐
│  Repository Source  │
│                     │
│  - package.json     │
│  - src/ structure   │
│  - git history      │
└──────────┬──────────┘
           │
           │ sync-repo-to-vault.js
           ▼
┌─────────────────────────────┐
│   Obsidian Vault Doc        │
│                             │
│  - Frontmatter metadata     │
│  - Component architecture   │
│  - Tech stack details       │
│  - Wikilinks to other docs  │
│  - Dataview queries         │
└──────────┬──────────────────┘
           │
           │ sync-vault-to-repo.js
           ▼
┌─────────────────────┐
│   Repository README │
│                     │
│  - Public-facing    │
│  - GitHub badges    │
│  - Standard links   │
│  - Clean markdown   │
└─────────────────────┘
```

### Sync Strategy

1. **Repository is Source of Truth** for:
   - Code structure
   - Dependencies (package.json)
   - Component counts
   - Git history/stats

2. **Vault is Source of Truth** for:
   - Detailed documentation prose
   - Architecture decisions
   - Integration guides
   - Cross-references to other projects

3. **Bidirectional** ensures:
   - Vault has latest structural info
   - Repository has latest documentation

## Conflict Resolution

### Vault Updated, Code Changed
- Run `sync-repo-to-vault.js` first to update stats
- Then `sync-vault-to-repo.js` to propagate docs

### Code Updated, Vault Modified
- Run `bidirectional-sync.js` for full two-way sync

### Manual Edits to Both
1. Choose which is authoritative for that change
2. Manually merge if needed
3. Run appropriate sync script

## Monitoring

### Success Indicators
- ✅ Sync scripts exit with code 0
- ✅ README.md updated timestamp matches run time
- ✅ Vault frontmatter `last_scanned` is current
- ✅ Component counts match actual structure

### Failure Handling
- Scripts exit with code 1 on error
- Error messages logged to console
- No partial updates (atomic writes)

## Troubleshooting

### "Vault documentation not found"
- Ensure Obsidian vault exists at configured path
- Check that vault folder structure matches expected layout
- Verify `Repositories/the-Lobbi/Devopspipelineuidesign.md` exists

### "Cannot read package.json"
- Run from repository root directory
- Verify package.json exists and is valid JSON

### "Git command failed"
- Ensure repository is a git repo (`git init` if needed)
- Check that git is installed and in PATH

### Sync produces incorrect results
- Review vault content for unexpected formatting
- Check that all markdown is properly formatted
- Verify frontmatter YAML is valid

## Best Practices

1. **Sync frequently**: Run bidirectional sync daily or after major changes
2. **Version control**: Commit both README and sync scripts together
3. **Test locally**: Run sync before pushing to ensure no errors
4. **Document changes**: Update vault documentation, let sync propagate
5. **Review diffs**: Check git diff after sync to validate changes

## Maintenance

### Adding New Sections
1. Add to vault documentation first
2. Run `sync-vault-to-repo.js`
3. Review README output

### Excluding Vault Sections from README
Edit `sync-vault-to-repo.js` `extractReadmeContent()` function:

```javascript
// Skip new vault-only section
if (line.includes('## Vault Only Section')) {
  while (i < lines.length && !lines[i].startsWith('##')) {
    i++;
  }
  i--;
  continue;
}
```

### Customizing Transformations
Modify the transformation logic in respective sync scripts:
- `parseVaultDoc()`: Frontmatter parsing
- `extractReadmeContent()`: Content transformation
- `updateVaultFrontmatter()`: Metadata updates

---

**Last Updated**: 2025-11-29
**Maintained By**: the-Lobbi DevOps team
