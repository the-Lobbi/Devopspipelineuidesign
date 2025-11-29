# Golden Armada - AI Agent Fleet Platform

**Quick Start:** Python 3.11 + Node.js 20 + Docker/K8s orchestration for Claude/GPT/Gemini/Ollama agents.

---

## MANDATORY ORCHESTRATION PROTOCOL

**CRITICAL: All tasks MUST follow this protocol. No exceptions.**

### Agent Orchestration Requirements

| Requirement | Value |
|-------------|-------|
| **Minimum Sub-Agents** | 3-5 per task |
| **Maximum Sub-Agents** | 13 per task |
| **Mandatory Pattern** | Explore → Plan → Code → Test → Fix → Document |
| **Context Persistence** | REQUIRED across all phases |

### Execution Phases (ALWAYS FOLLOW)

```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: EXPLORE (2+ agents)                                   │
│  ├── researcher: Analyze requirements & codebase                │
│  ├── code-analyzer: Review existing patterns                    │
│  └── system-architect: Identify dependencies                    │
├─────────────────────────────────────────────────────────────────┤
│  PHASE 2: PLAN (1-2 agents)                                     │
│  ├── planner: Break down tasks, create TODO list                │
│  └── system-architect: Design solution architecture             │
├─────────────────────────────────────────────────────────────────┤
│  PHASE 3: CODE (2-4 agents based on scope)                      │
│  ├── coder: Implement primary features                          │
│  ├── [language]-specialist: Language-specific expertise         │
│  ├── backend-dev OR frontend-dev: Layer-specific work           │
│  └── database-specialist: Data layer changes                    │
├─────────────────────────────────────────────────────────────────┤
│  PHASE 4: TEST (2-3 agents)                                     │
│  ├── tester: Unit tests + integration tests                     │
│  ├── security-auditor: Security validation                      │
│  └── e2e-tester: End-to-end verification                        │
├─────────────────────────────────────────────────────────────────┤
│  PHASE 5: FIX (1-2 agents, iterate until passing)               │
│  ├── debugger: Fix identified issues                            │
│  └── tester: Verify fixes                                       │
├─────────────────────────────────────────────────────────────────┤
│  PHASE 6: DOCUMENT (1-2 agents)                                 │
│  ├── docs-writer: Update documentation                          │
│  └── reviewer: Final review                                     │
└─────────────────────────────────────────────────────────────────┘
```

### Next Steps Tracking

**ALWAYS maintain a "Next Steps" context block:**

```markdown
## Current Context
- Phase: [EXPLORE|PLAN|CODE|TEST|FIX|DOCUMENT]
- Active Agents: [list]
- Completed: [summary]
- Pending: [todo items]

## Next Steps
1. [Immediate next action]
2. [Following action]
3. [Subsequent action]

## Context to Preserve
- [Key decisions made]
- [Important file locations]
- [Dependencies identified]
- [Issues to address]
```

---

## Resource Discovery (Lazy-Loaded)

**Registry:** `.claude/registry/` - All resources loaded dynamically via indexes.

### Registry Structure

| Index File | Contents |
|------------|----------|
| `agents.index.json` | 67 agents with metadata, keywords, capabilities |
| `skills.index.json` | 25 skills with triggers and dependencies |
| `mcps.index.json` | 8 MCP servers with tools and activation rules |
| `tools.index.json` | Built-in tools and custom tool registry |
| `workflows.index.json` | 10 workflows with agent configurations |
| `search/keywords.json` | Unified keyword → resource mapping |
| `activation/unified.activation.json` | Context-aware activation rules |

### Quick Lookup

| Need | Check |
|------|-------|
| Agent by keyword | `registry/search/keywords.json` |
| MCP by capability | `registry/mcps.index.json` |
| Skill activation | `registry/skills.index.json` |
| Workflow patterns | `registry/workflows.index.json` |
| Tool groups | `registry/tools.index.json` |

---

## MCP Servers (Model Context Protocol)

### Built-in MCPs (Always Available)

| MCP | Purpose | Key Tools |
|-----|---------|-----------|
| **supabase** | Database, migrations, types | `execute_sql`, `apply_migration`, `generate_typescript_types`, `deploy_edge_function` |
| **vercel** | Deployment, projects, domains | `deploy_to_vercel`, `list_projects`, `get_deployment_build_logs` |
| **github** | Git, PRs, issues, repos | `create_pull_request`, `list_issues`, `push_files` |
| **upstash** | Redis cache, QStash queues | `redis_database_run_redis_commands`, `qstash_publish_message` |
| **playwright** | Browser automation, E2E testing | `browser_snapshot`, `browser_click`, `browser_take_screenshot` |
| **context7** | Library documentation lookup | `resolve-library-id`, `get-library-docs` |
| **ide** | VS Code diagnostics, Jupyter | `getDiagnostics`, `executeCode` |
| **obsidian** | Documentation vault, templates, ADRs | `list_files_in_vault`, `get_file_contents`, `simple_search`, `complex_search`, `append_content`, `patch_content` |

### MCP Tool Shortcuts

```bash
db        → mcp__supabase__execute_sql
migrate   → mcp__supabase__apply_migration
types     → mcp__supabase__generate_typescript_types
tables    → mcp__supabase__list_tables
deploy    → mcp__vercel__deploy_to_vercel
snapshot  → mcp__playwright__browser_snapshot
docs      → mcp__context7__get-library-docs
vault        → mcp__obsidian__list_files_in_vault
vault-read   → mcp__obsidian__get_file_contents
vault-search → mcp__obsidian__simple_search
vault-add    → mcp__obsidian__append_content
```

### Context7 Integration (MANDATORY)

**Always use Context7 for:**
- Library/API documentation lookups
- Code generation with latest syntax
- Configuration and setup guidance
- Framework-specific patterns

```
1. Resolve library: mcp__context7__resolve-library-id
2. Fetch docs: mcp__context7__get-library-docs with topic
```

---

## Agent Categories

| Category | Agents | Primary Use |
|----------|--------|-------------|
| **core** | coder, researcher, tester, reviewer, planner, debugger | Foundational development |
| **devops** | cicd-engineer, k8s-deployer, docker-builder, sre-engineer | Infrastructure/deployment |
| **development** | backend-dev, system-architect, api-designer, database-specialist | Backend architecture |
| **frontend** | react-specialist, nextjs-specialist, ui-designer, accessibility-expert | UI development |
| **languages** | python-specialist, typescript-specialist, go-specialist, rust-specialist | Language expertise |
| **security** | security-auditor, penetration-tester, compliance-checker, secrets-manager | Security |
| **data-ai** | ml-engineer, data-engineer, rag-specialist, llm-engineer | AI/ML development |
| **atlassian** | jira-specialist, confluence-specialist, scrum-master, product-owner | Project management |
| **testing** | qa-engineer, e2e-tester, load-tester, contract-tester | Quality assurance |
| **documentation** | docs-writer, api-documenter, runbook-writer | Technical writing |

---

## Workflows

### Development Workflows

| Workflow | Agents | Trigger |
|----------|--------|---------|
| `feature-development` | planner, coder, tester, reviewer, docs-writer | "implement feature", "build" |
| `code-review` | reviewer, security-auditor, performance-engineer | "review", "check PR" |
| `ci-cd-workflow` | reviewer, tester, security-auditor, docker-builder, k8s-deployer | "deploy", "release" |
| `incident-response` | incident-responder, debugger, observability, sre-engineer | "incident", "outage" |

### Project Management Workflows

| Workflow | Agents | Trigger |
|----------|--------|---------|
| `sprint-management` | scrum-master, product-owner, sprint-analyst | "sprint plan" |
| `scrum-ceremonies` | scrum-master, agile-coach | "standup", "retro" |
| `atlassian-integration` | jira-specialist, confluence-specialist | "sync jira" |

### Documentation Workflows

| Workflow | Agents | Trigger |
|----------|--------|---------|
| `documentation-lifecycle` | docs-writer, researcher, reviewer | "document repo", "create docs", "update documentation" |
| `adr-workflow` | system-architect, docs-writer | "architecture decision", "create adr", "document decision" |
| `repository-documentation` | docs-writer, code-analyzer | "document repo", "update repo docs", "repository documentation" |

#### Obsidian Vault Structure

**Vault Path:** `C:\Users\MarkusAhling\obsidian`

| Path | Purpose |
|------|---------|
| `Repositories/{org}/{repo}.md` | Repository documentation with metadata |
| `Repositories/{org}/{repo}/Decisions/` | Architecture Decision Records |
| `Projects/{project}/` | Project plans and documentation |
| `Research/` | Technical research and discoveries |
| `Templates/` | Documentation templates |
| `System/` | Documentation standards and conventions |

#### Template Documentation

**Repository README Template** (`Templates/Repository-README.md`):
```yaml
---
title: {repo_name}
created: {date}
updated: {date}
repo_name: {repo_name}
repo_url: https://github.com/{org}/{repo_name}
org: {org}
language: {primary_language}
repo_type: service|ui|infrastructure|library|tool|agent|documentation
visibility: public|private
doc_status: pending|partial|complete
tags:
  - type/reference
  - status/active
  - org/{org}
  - tech/{technology}
---
```

**ADR Template** (`Templates/ADR.md`):
```yaml
---
title: ADR-NNNN: {Decision Title}
adr_number: NNNN
status: proposed|accepted|deprecated|superseded
date: {YYYY-MM-DD}
tags:
  - type/adr
  - repo/{repo}
---
```

#### Obsidian MCP Tools

| Tool | Purpose | Example |
|------|---------|---------|
| `list_files_in_vault` | Get vault structure | List all repo docs |
| `list_files_in_dir` | List folder contents | List ADRs for repo |
| `get_file_contents` | Read document | Read repo README |
| `simple_search` | Text search | Find all mentions of "authentication" |
| `complex_search` | JsonLogic queries | Find active repos needing docs |
| `append_content` | Add to document | Add new section to README |
| `patch_content` | Insert at location | Update frontmatter field |
| `get_periodic_note` | Get daily/weekly notes | Retrieve sprint notes |
| `batch_get_file_contents` | Read multiple files | Get all ADRs for analysis |

#### Automation Patterns

**Repository Documentation Workflow:**
1. **Discover:** Use `list_files_in_vault` to check if repo docs exist
2. **Template:** If new, use `Templates/Repository-README.md` template
3. **Populate:** Fill in metadata (org, language, repo_type, etc.)
4. **Cross-reference:** Add wikilinks to related projects/technologies
5. **Verify:** Ensure frontmatter is complete and tags are correct

**ADR Workflow:**
1. **Context:** Gather decision context from codebase analysis
2. **Number:** Use `list_files_in_dir` to get next ADR number (sequential)
3. **Draft:** Create ADR using `Templates/ADR.md` template
4. **Content:** Document context, decision, alternatives, consequences
5. **Review:** Get system-architect approval before marking "accepted"

**Research Documentation:**
1. **Capture:** Document discoveries in `Research/{topic}/`
2. **Tag:** Use tags for discoverability (#tech, #pattern, #library)
3. **Link:** Connect to relevant repos and projects via wikilinks
4. **Update:** Keep research current as patterns evolve

#### Mandatory Documentation Protocol (PHASE 6)

After completing any significant work, the **docs-writer** agent MUST:

1. **Update Repository Documentation:**
   - Path: `Repositories/{org}/{repo}.md`
   - Update `updated` frontmatter field
   - Document new features/changes in content
   - Update status tags if applicable

2. **Create ADRs (if architectural changes):**
   - Path: `Repositories/{org}/{repo}/Decisions/NNNN-title.md`
   - Sequential numbering (0001, 0002, etc.)
   - Include context, decision, alternatives, consequences
   - Mark status as "accepted" after review

3. **Log Research Insights:**
   - Path: `Research/{topic}/{note}.md`
   - Document patterns, libraries, techniques discovered
   - Cross-reference to implementations

4. **Update Project Documentation:**
   - Path: `Projects/{project}/README.md`
   - Track progress, milestones, outcomes
   - Link to related repos and research

5. **Validate Quality Standards:**
   - All docs have complete frontmatter
   - Proper tags for discoverability
   - Wikilinks to related content
   - Templates used consistently
   - Vault synced (if using Git sync)

#### Integration with Orchestration Phases

**PHASE 1: EXPLORE**
- Use `simple_search` to find existing documentation
- Use `batch_get_file_contents` to review related docs
- Check for existing ADRs on similar topics

**PHASE 2: PLAN**
- Reference `Templates/` for documentation structure
- Check `System/Conventions.md` for standards
- Plan documentation updates alongside code changes

**PHASE 6: DOCUMENT**
- **docs-writer** executes mandatory documentation protocol
- **reviewer** verifies completeness via validation checklist
- Update vault with all changes before marking complete

#### JsonLogic Query Examples

**Find all active repositories:**
```json
{
  "and": [
    {"==": [{"var": "fileClass"}, "repository"]},
    {"in": ["status/active", {"var": "tags"}]}
  ]
}
```

**Find ADRs for specific repo:**
```json
{
  "and": [
    {"in": ["type/adr", {"var": "tags"}]},
    {"in": ["repo/your-repo", {"var": "tags"}]}
  ]
}
```

**Find docs needing updates (>90 days old):**
```json
{
  "and": [
    {"==": [{"var": "doc_status"}, "partial"]},
    {"<": [{"var": "updated"}, "2024-09-01"]}
  ]
}
```

#### Documentation Quality Standards

1. **Frontmatter Required:** All docs MUST have complete YAML frontmatter
2. **Tagging Convention:** Use consistent tags (org/, tech/, type/, status/)
3. **Wikilinks:** Connect related content via [[wikilink]] syntax
4. **Templates:** Always use official templates from `Templates/`
5. **Vault Sync:** Ensure changes are committed to vault Git repo

---

## Skills (Auto-Activated)

### Infrastructure
- `kubernetes`, `helm`, `docker`, `terraform`

### Development
- `flask-api`, `fastapi`, `graphql`, `rest-api`, `git-workflows`, `testing`, `debugging`

### Frontend
- `react`, `nextjs`

### Data
- `database`, `redis`, `vector-db`

### Cloud
- `aws`, `gcp`

### Security
- `authentication`

### Project Management
- `jira`, `confluence`, `scrum`, `kanban`

---

## Commands

### Core Commands

| Command | Purpose |
|---------|---------|
| `/deploy` | Deploy to K8s/Vercel |
| `/test` | Run tests + coverage |
| `/review` | Code review |
| `/create-agent` | Create new agent |
| `/project-status` | Health dashboard |

### Atlassian Commands

| Command | Purpose |
|---------|---------|
| `/jira-create` | Create Jira issue |
| `/jira-status` | Check issue status |
| `/sprint-plan` | Plan sprint |
| `/standup` | Run daily standup |
| `/retro` | Run retrospective |

### DevOps Commands

| Command | Purpose |
|---------|---------|
| `/build-agent` | Build Docker image |
| `/rollback` | Rollback deployment |
| `/logs` | View logs |
| `/scale` | Scale services |

---

## Orchestration Patterns

| Pattern | Coordinator | When to Use |
|---------|-------------|-------------|
| **Hierarchical** | `hierarchical-coordinator` | Complex multi-phase work requiring strict coordination |
| **Mesh** | `mesh-coordinator` | Parallel research/analysis tasks |
| **Adaptive** | `adaptive-coordinator` | Mixed workloads with varying complexity |
| **Pipeline** | Sequential stages | Well-defined linear processes |

### Example Orchestration

```python
Task("Implement user authentication", "hierarchical-coordinator")
# Automatically orchestrates:
# 1. researcher → Analyze auth requirements
# 2. system-architect → Design auth flow
# 3. planner → Break into tasks
# 4. coder → Implement auth
# 5. security-auditor → Security review
# 6. tester → Write/run tests
# 7. docs-writer → Update documentation
```

---

## Environment Setup

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | Claude agents |
| `OPENAI_API_KEY` | GPT agents |
| `GOOGLE_API_KEY` | Gemini agents |
| `JIRA_API_TOKEN` | Jira integration |
| `SUPABASE_*` | Supabase MCP |
| `VERCEL_*` | Vercel MCP |
| `UPSTASH_*` | Upstash MCP |
| `OBSIDIAN_VAULT_PATH` | Path to Obsidian vault |

**Security:** Never commit secrets. Use K8s secrets or env vars.

---

## Quick CLI

```bash
# Deploy
docker build -f deployment/docker/claude/Dockerfile -t golden-armada/claude-agent .
helm upgrade --install golden-armada ./deployment/helm/golden-armada -n agents

# Debug
kubectl logs -n agents -l app=claude-agent -f

# Orchestration status
.claude/orchestration/cli.sh status
```

---

## Orchestration System

**Location:** `.claude/orchestration/`

### Features
- Agent tracking and state management
- Activity logging with timestamps
- Checkpoint creation and restoration
- Resource locks for parallel coordination
- Inter-agent messaging
- Task queue management

### CLI Commands

```bash
.claude/orchestration/cli.sh status    # Current status
.claude/orchestration/cli.sh logs      # View activity logs
.claude/orchestration/cli.sh locks     # View resource locks
.claude/orchestration/cli.sh messages  # View messages
.claude/orchestration/cli.sh cleanup   # Clean up stale resources
```

### Parallel Coordination Protocol

1. **Acquire locks** before shared resource access
2. **Broadcast intentions** before major changes
3. **Create checkpoints** at milestones
4. **Release locks** as soon as possible

---

## Directory Structure

```
.claude/
├── CLAUDE.md                              # This guide
├── config.json                            # Main configuration
├── settings.json                          # User settings
├── registry/
│   ├── agents.index.json                  # Agent metadata (67 agents)
│   ├── skills.index.json                  # Skill definitions (25 skills)
│   ├── mcps.index.json                    # MCP server registry (8 servers)
│   ├── tools.index.json                   # Tool registry
│   ├── workflows.index.json               # Workflow definitions
│   ├── search/
│   │   └── keywords.json                  # Keyword → resource mapping
│   └── activation/
│       ├── skills.activation.json         # Skill activation rules
│       └── unified.activation.json        # Unified activation system
├── commands/                              # Slash commands
├── orchestration/                         # Coordination system
│   ├── orchestrator.py
│   ├── PROTOCOL.md
│   ├── cli.sh
│   └── db/
├── skills/                                # Skill definitions (SKILL.md format)
├── workflows/                             # Multi-agent workflows
├── prompts/                               # Reusable prompts
├── templates/                             # File templates
├── tools/                                 # Custom tools
├── mcp/                                   # MCP server configs
└── hooks/                                 # Automation hooks

deployment/
├── docker/                                # Dockerfiles
└── helm/                                  # Helm charts

obsidian/  (C:\Users\MarkusAhling\obsidian)
├── Repositories/                      # Repository documentation
├── Projects/                          # Project plans
├── Research/                          # Technical research
├── Templates/                         # Documentation templates
└── System/                            # Documentation standards
```

---

## Context Efficiency Principles

1. **Registry-First:** All metadata in JSON indexes
2. **Lazy Loading:** Resources loaded on-demand
3. **Minimal Surface:** Only essential files loaded
4. **Zero Bloat:** No duplicate docs
5. **Unified Activation:** Single system for all resource types

---

## Key Reminders

### ALWAYS:
- Use 3-5 minimum sub-agents per task (max 13)
- Follow Explore → Plan → Code → Test → Fix → Document
- Track "Next Steps" for context continuity
- Use Context7 for library documentation
- Verify work before marking complete

### NEVER:
- Start coding without exploration and planning
- Skip testing phase
- Declare "done" without running tests
- Ignore failing tests
- Lose context between phases

### Lookup Strategy:
1. Check registry index for keyword/category
2. Use appropriate MCP for external services
3. Activate skills based on file context
4. Select workflow for complex multi-agent tasks

---

## Model Assignment

| Model | Use For |
|-------|---------|
| **opus** | Strategic planning, complex architecture |
| **sonnet** | Development, analysis, coordination |
| **haiku** | Documentation, simple tasks, fast operations |

---

**Optimized for:** Maximum orchestration, comprehensive coverage, zero context loss, measurable outcomes.
