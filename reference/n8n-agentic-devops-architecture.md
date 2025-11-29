# n8n Agentic DevOps Pipeline Architecture

## Jira Epic → GitHub PR → Confluence Documentation

**Integration Target:** Golden Armada (The Lobbi)  
**Platform:** n8n with MCP Integration  
**Document Status:** Implementation Ready

---

## Architecture Overview

This n8n implementation orchestrates the complete agentic DevOps workflow through multiple interconnected workflows that handle the 10-step epic-to-production pipeline.

### Workflow Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Epic Intake Workflow (Webhook Trigger)                  │
│    ↓ Validates epic structure, triggers planning           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Planning Orchestration Workflow                         │
│    ↓ Claude analyzes, generates stories/subtasks           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Execution Pipeline Workflow                             │
│    ↓ Code generation, testing, linting, commits            │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. PR & Documentation Workflow                             │
│    ↓ Creates PR, generates docs, publishes to Confluence   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Jira Update & Notification Workflow                     │
│    ↓ Links PR, docs, transitions status, notifies team     │
└─────────────────────────────────────────────────────────────┘
```

---

## Workflow 1: Epic Intake & Validation

**Trigger:** Jira Webhook (Epic labeled 'agentic-ready')  
**Purpose:** Validate epic structure and initiate planning

### Node Configuration

```json
{
  "name": "Epic Intake Pipeline",
  "nodes": [
    {
      "name": "Jira Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "jira-epic-intake",
        "httpMethod": "POST",
        "responseMode": "lastNode"
      }
    },
    {
      "name": "Validate Epic Structure",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// Validate epic has required fields\nconst epic = $input.item.json;\nconst required = ['key', 'summary', 'description', 'acceptanceCriteria'];\n\nfor (const field of required) {\n  if (!epic.fields[field]) {\n    throw new Error(`Missing required field: ${field}`);\n  }\n}\n\n// Check for 'agentic-ready' label\nconst labels = epic.fields.labels || [];\nif (!labels.includes('agentic-ready')) {\n  throw new Error('Epic missing agentic-ready label');\n}\n\nreturn {\n  epicKey: epic.key,\n  summary: epic.fields.summary,\n  description: epic.fields.description,\n  acceptanceCriteria: epic.fields.acceptanceCriteria,\n  targetRepo: epic.fields.customfield_10050, // Custom field for repo\n  validated: true\n};"
      }
    },
    {
      "name": "Store in PostgreSQL",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "operation": "insert",
        "table": "workflows",
        "columns": {
          "jira_epic_key": "={{ $json.epicKey }}",
          "jira_epic_data": "={{ $json }}",
          "status": "queued_for_planning",
          "created_at": "={{ $now }}"
        }
      }
    },
    {
      "name": "Trigger Planning Workflow",
      "type": "n8n-nodes-base.executeWorkflow",
      "parameters": {
        "workflowId": "{{ $env.PLANNING_WORKFLOW_ID }}",
        "source": {
          "workflowId": "{{ $workflow.id }}",
          "epicKey": "={{ $json.epicKey }}"
        }
      }
    },
    {
      "name": "Post Jira Comment",
      "type": "n8n-nodes-base.jira",
      "parameters": {
        "resource": "issue",
        "operation": "addComment",
        "issueKey": "={{ $('Validate Epic Structure').item.json.epicKey }}",
        "comment": "✅ Epic validated and queued for AI planning. Workflow ID: {{ $workflow.id }}"
      }
    }
  ],
  "connections": {
    "Jira Webhook": { "main": [[{ "node": "Validate Epic Structure" }]] },
    "Validate Epic Structure": { "main": [[{ "node": "Store in PostgreSQL" }]] },
    "Store in PostgreSQL": { "main": [[{ "node": "Trigger Planning Workflow" }, { "node": "Post Jira Comment" }]] }
  }
}
```

---

## Workflow 2: AI Planning Orchestration

**Trigger:** Called by Epic Intake Workflow  
**Purpose:** Use Claude to analyze epic and generate implementation plan

### Node Configuration

```json
{
  "name": "Planning Orchestration",
  "nodes": [
    {
      "name": "Workflow Trigger",
      "type": "n8n-nodes-base.executeWorkflowTrigger"
    },
    {
      "name": "Load Epic Data",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "operation": "select",
        "table": "workflows",
        "where": {
          "jira_epic_key": "={{ $json.epicKey }}"
        }
      }
    },
    {
      "name": "Analyze Repository",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "GET",
        "url": "https://api.github.com/repos/{{ $json.targetRepo }}/contents",
        "authentication": "headerAuth",
        "headerAuth": {
          "name": "Authorization",
          "value": "Bearer {{ $env.GITHUB_TOKEN }}"
        }
      }
    },
    {
      "name": "Claude Planning Agent",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "parameters": {
        "agent": "conversationalAgent",
        "model": "anthropic",
        "modelName": "claude-opus-4-20250514",
        "systemMessage": "You are a DevOps Planning Agent. Analyze the Jira epic and repository structure to create a detailed implementation plan.\n\nGenerate:\n1. User Stories with acceptance criteria\n2. Subtasks with implementation guidance\n3. File-level change recommendations\n4. Test requirements\n\nReturn as structured JSON.",
        "prompt": "Epic: {{ $('Load Epic Data').item.json.jira_epic_data.summary }}\n\nDescription: {{ $('Load Epic Data').item.json.jira_epic_data.description }}\n\nAcceptance Criteria:\n{{ $('Load Epic Data').item.json.jira_epic_data.acceptanceCriteria }}\n\nRepository Structure:\n{{ $('Analyze Repository').item.json }}\n\nGenerate implementation plan."
      }
    },
    {
      "name": "Parse Planning Output",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// Extract structured plan from Claude response\nconst response = $input.item.json.output;\nconst plan = JSON.parse(response);\n\nreturn {\n  epicKey: $('Load Epic Data').item.json.jira_epic_key,\n  stories: plan.stories,\n  subtasks: plan.subtasks,\n  testRequirements: plan.testRequirements,\n  estimatedComplexity: plan.estimatedComplexity\n};"
      }
    },
    {
      "name": "Create Jira Stories",
      "type": "n8n-nodes-base.jira",
      "parameters": {
        "resource": "issue",
        "operation": "create",
        "batchSize": 10,
        "project": "{{ $('Load Epic Data').item.json.jira_epic_data.project }}",
        "issueType": "Story",
        "summary": "={{ $json.stories.map(s => s.summary) }}",
        "description": "={{ $json.stories.map(s => s.description) }}",
        "parent": "={{ $('Load Epic Data').item.json.jira_epic_key }}"
      }
    },
    {
      "name": "Create Jira Subtasks",
      "type": "n8n-nodes-base.jira",
      "parameters": {
        "resource": "issue",
        "operation": "create",
        "batchSize": 20,
        "issueType": "Subtask",
        "summary": "={{ $json.subtasks.map(s => s.summary) }}",
        "description": "={{ $json.subtasks.map(s => s.implementation_guidance) }}",
        "parent": "={{ $json.subtasks.map(s => s.parent_story_key) }}"
      }
    },
    {
      "name": "Update Workflow Status",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "operation": "update",
        "table": "workflows",
        "where": {
          "jira_epic_key": "={{ $('Load Epic Data').item.json.jira_epic_key }}"
        },
        "set": {
          "status": "planning_review",
          "planning_data": "={{ $('Parse Planning Output').item.json }}"
        }
      }
    },
    {
      "name": "Notify Planning Complete",
      "type": "n8n-nodes-base.jira",
      "parameters": {
        "resource": "issue",
        "operation": "addComment",
        "issueKey": "={{ $('Load Epic Data').item.json.jira_epic_key }}",
        "comment": "🤖 AI Planning Complete\n\n**Generated:**\n- {{ $('Parse Planning Output').item.json.stories.length }} User Stories\n- {{ $('Parse Planning Output').item.json.subtasks.length }} Subtasks\n\n**Status:** Ready for human review. Transition to 'Ready for Execution' when approved."
      }
    }
  ]
}
```

---

## Workflow 3: Execution Pipeline

**Trigger:** Manual trigger or Jira status change to 'Ready for Execution'  
**Purpose:** Autonomous code generation, testing, and commits

### Node Configuration

```json
{
  "name": "Execution Pipeline",
  "nodes": [
    {
      "name": "Execution Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "execute-epic",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Load Epic & Plan",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "operation": "select",
        "table": "workflows",
        "where": {
          "jira_epic_key": "={{ $json.epicKey }}"
        }
      }
    },
    {
      "name": "Create GitHub Branch",
      "type": "n8n-nodes-base.github",
      "parameters": {
        "resource": "branch",
        "operation": "create",
        "owner": "the-lobbi",
        "repository": "={{ $json.targetRepo }}",
        "branch": "epic/{{ $('Load Epic & Plan').item.json.jira_epic_key }}",
        "ref": "refs/heads/{{ $json.baseBranch || 'main' }}"
      }
    },
    {
      "name": "Update Epic Status - In Progress",
      "type": "n8n-nodes-base.jira",
      "parameters": {
        "resource": "issue",
        "operation": "transition",
        "issueKey": "={{ $('Load Epic & Plan').item.json.jira_epic_key }}",
        "transition": "In Progress"
      }
    },
    {
      "name": "Process Subtasks Loop",
      "type": "n8n-nodes-base.splitInBatches",
      "parameters": {
        "batchSize": 1,
        "options": {
          "reset": false
        }
      }
    },
    {
      "name": "Claude Execution Agent",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "parameters": {
        "agent": "conversationalAgent",
        "model": "anthropic",
        "modelName": "claude-sonnet-4-20250514",
        "systemMessage": "You are a DevOps Execution Agent. Implement the subtask based on the specification.\n\nYou have access to:\n- GitHub repository (clone, read, modify files)\n- Test runner\n- Linter\n\nFollow TDD: write tests first, implement code, ensure tests pass.\n\nReturn structured JSON with:\n- files_changed: []\n- tests_added: []\n- tests_passed: boolean\n- commit_message: string",
        "prompt": "Subtask: {{ $json.subtask.summary }}\n\nImplementation Guidance:\n{{ $json.subtask.implementation_guidance }}\n\nRepository: {{ $('Load Epic & Plan').item.json.targetRepo }}\nBranch: epic/{{ $('Load Epic & Plan').item.json.jira_epic_key }}\n\nImplement this subtask following TDD principles."
      }
    },
    {
      "name": "Run Tests",
      "type": "n8n-nodes-base.executeCommand",
      "parameters": {
        "command": "cd /tmp/{{ $('Load Epic & Plan').item.json.targetRepo }} && npm test"
      }
    },
    {
      "name": "Run Linters",
      "type": "n8n-nodes-base.executeCommand",
      "parameters": {
        "command": "cd /tmp/{{ $('Load Epic & Plan').item.json.targetRepo }} && npm run lint"
      }
    },
    {
      "name": "Git Commit",
      "type": "n8n-nodes-base.executeCommand",
      "parameters": {
        "command": "cd /tmp/{{ $('Load Epic & Plan').item.json.targetRepo }} && git add . && git commit -m '{{ $('Claude Execution Agent').item.json.commit_message }}' && git push origin epic/{{ $('Load Epic & Plan').item.json.jira_epic_key }}"
      }
    },
    {
      "name": "Update Subtask Status",
      "type": "n8n-nodes-base.jira",
      "parameters": {
        "resource": "issue",
        "operation": "transition",
        "issueKey": "={{ $json.subtask.key }}",
        "transition": "Done"
      }
    },
    {
      "name": "Check All Subtasks Complete",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// Check if all subtasks are done\nconst subtasks = $('Load Epic & Plan').item.json.planning_data.subtasks;\nconst allComplete = subtasks.every(s => s.status === 'Done');\n\nif (allComplete) {\n  return [{ json: { ready_for_pr: true } }];\n} else {\n  return [{ json: { ready_for_pr: false } }];\n}"
      }
    },
    {
      "name": "Trigger PR Workflow",
      "type": "n8n-nodes-base.executeWorkflow",
      "parameters": {
        "workflowId": "{{ $env.PR_WORKFLOW_ID }}",
        "source": {
          "epicKey": "={{ $('Load Epic & Plan').item.json.jira_epic_key }}"
        }
      }
    }
  ]
}
```

---

## Workflow 4: PR & Documentation Generation

**Trigger:** Called by Execution Pipeline when code complete  
**Purpose:** Create GitHub PR, generate docs, publish to Confluence

### Node Configuration

```json
{
  "name": "PR & Documentation Pipeline",
  "nodes": [
    {
      "name": "Workflow Trigger",
      "type": "n8n-nodes-base.executeWorkflowTrigger"
    },
    {
      "name": "Load Workflow Data",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "operation": "select",
        "table": "workflows",
        "where": {
          "jira_epic_key": "={{ $json.epicKey }}"
        }
      }
    },
    {
      "name": "Generate PR Description",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "parameters": {
        "agent": "conversationalAgent",
        "model": "anthropic",
        "modelName": "claude-sonnet-4-20250514",
        "systemMessage": "Generate a comprehensive GitHub Pull Request description based on the epic details.\n\nInclude:\n1. Summary of changes\n2. Acceptance criteria checklist\n3. Link to Jira epic\n4. Testing notes\n5. Breaking changes (if any)",
        "prompt": "Epic: {{ $('Load Workflow Data').item.json.jira_epic_data.summary }}\n\nDescription: {{ $('Load Workflow Data').item.json.jira_epic_data.description }}\n\nAcceptance Criteria:\n{{ $('Load Workflow Data').item.json.jira_epic_data.acceptanceCriteria }}\n\nFiles Changed:\n{{ $('Load Workflow Data').item.json.planning_data.subtasks.flatMap(s => s.files_changed) }}\n\nGenerate PR description in markdown."
      }
    },
    {
      "name": "Create GitHub PR",
      "type": "n8n-nodes-base.github",
      "parameters": {
        "resource": "pullRequest",
        "operation": "create",
        "owner": "the-lobbi",
        "repository": "={{ $('Load Workflow Data').item.json.targetRepo }}",
        "title": "[{{ $('Load Workflow Data').item.json.jira_epic_key }}] {{ $('Load Workflow Data').item.json.jira_epic_data.summary }}",
        "head": "epic/{{ $('Load Workflow Data').item.json.jira_epic_key }}",
        "base": "main",
        "body": "={{ $('Generate PR Description').item.json.output }}"
      }
    },
    {
      "name": "Update Workflow with PR",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "operation": "update",
        "table": "workflows",
        "where": {
          "jira_epic_key": "={{ $('Load Workflow Data').item.json.jira_epic_key }}"
        },
        "set": {
          "github_pr_url": "={{ $('Create GitHub PR').item.json.html_url }}",
          "github_pr_number": "={{ $('Create GitHub PR').item.json.number }}"
        }
      }
    },
    {
      "name": "Generate Confluence Documentation",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "parameters": {
        "agent": "conversationalAgent",
        "model": "anthropic",
        "modelName": "claude-sonnet-4-20250514",
        "systemMessage": "Generate comprehensive technical documentation for Confluence.\n\nUse Confluence Storage Format (XHTML-based).\n\nInclude:\n1. Executive Summary\n2. Technical Implementation Details\n3. Architecture Changes\n4. API Changes (if any)\n5. Testing Strategy\n6. Deployment Notes\n7. Links to PR and Jira epic",
        "prompt": "Epic: {{ $('Load Workflow Data').item.json.jira_epic_data.summary }}\n\nDescription: {{ $('Load Workflow Data').item.json.jira_epic_data.description }}\n\nPR URL: {{ $('Create GitHub PR').item.json.html_url }}\n\nImplementation Details:\n{{ $('Load Workflow Data').item.json.planning_data }}\n\nGenerate documentation in Confluence Storage Format."
      }
    },
    {
      "name": "Publish to Confluence",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "{{ $env.CONFLUENCE_BASE_URL }}/rest/api/content",
        "authentication": "basicAuth",
        "basicAuth": {
          "user": "{{ $env.ATLASSIAN_EMAIL }}",
          "password": "={{ $env.CONFLUENCE_API_TOKEN }}"
        },
        "bodyParameters": {
          "type": "page",
          "title": "[{{ $('Load Workflow Data').item.json.jira_epic_key }}] {{ $('Load Workflow Data').item.json.jira_epic_data.summary }}",
          "space": {
            "key": "{{ $env.CONFLUENCE_SPACE_KEY }}"
          },
          "body": {
            "storage": {
              "value": "={{ $('Generate Confluence Documentation').item.json.output }}",
              "representation": "storage"
            }
          },
          "metadata": {
            "labels": [
              { "name": "epic-documentation" },
              { "name": "{{ $('Load Workflow Data').item.json.jira_epic_key.toLowerCase() }}" },
              { "name": "auto-generated" }
            ]
          }
        }
      }
    },
    {
      "name": "Update Workflow with Confluence",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "operation": "update",
        "table": "workflows",
        "where": {
          "jira_epic_key": "={{ $('Load Workflow Data').item.json.jira_epic_key }}"
        },
        "set": {
          "confluence_page_id": "={{ $('Publish to Confluence').item.json.id }}",
          "confluence_page_url": "={{ $env.CONFLUENCE_BASE_URL }}/pages/viewpage.action?pageId={{ $('Publish to Confluence').item.json.id }}",
          "confluence_space_key": "={{ $env.CONFLUENCE_SPACE_KEY }}"
        }
      }
    },
    {
      "name": "Trigger Jira Update",
      "type": "n8n-nodes-base.executeWorkflow",
      "parameters": {
        "workflowId": "{{ $env.JIRA_UPDATE_WORKFLOW_ID }}",
        "source": {
          "epicKey": "={{ $('Load Workflow Data').item.json.jira_epic_key }}"
        }
      }
    }
  ]
}
```

---

## Workflow 5: Jira Update & Notifications

**Trigger:** Called by PR & Documentation workflow  
**Purpose:** Link artifacts and transition epic status

### Node Configuration

```json
{
  "name": "Jira Update & Notifications",
  "nodes": [
    {
      "name": "Workflow Trigger",
      "type": "n8n-nodes-base.executeWorkflowTrigger"
    },
    {
      "name": "Load Complete Workflow",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "operation": "select",
        "table": "workflows",
        "where": {
          "jira_epic_key": "={{ $json.epicKey }}"
        }
      }
    },
    {
      "name": "Post Epic Comment",
      "type": "n8n-nodes-base.jira",
      "parameters": {
        "resource": "issue",
        "operation": "addComment",
        "issueKey": "={{ $('Load Complete Workflow').item.json.jira_epic_key }}",
        "comment": "✅ Automated Workflow Completed\n\n**Pull Request:** {{ $('Load Complete Workflow').item.json.github_pr_url }}\n**Documentation:** {{ $('Load Complete Workflow').item.json.confluence_page_url }}\n\n**Workflow Summary:**\n✅ Code generated and tested\n✅ All tests passing\n✅ Code linted and formatted\n✅ PR created and ready for review\n✅ Documentation published to Confluence\n\nReady for review!"
      }
    },
    {
      "name": "Transition Epic Status",
      "type": "n8n-nodes-base.jira",
      "parameters": {
        "resource": "issue",
        "operation": "transition",
        "issueKey": "={{ $('Load Complete Workflow').item.json.jira_epic_key }}",
        "transition": "In Review"
      }
    },
    {
      "name": "Add PR Link to Epic",
      "type": "n8n-nodes-base.jira",
      "parameters": {
        "resource": "issue",
        "operation": "update",
        "issueKey": "={{ $('Load Complete Workflow').item.json.jira_epic_key }}",
        "fields": {
          "customfield_10060": "{{ $('Load Complete Workflow').item.json.github_pr_url }}"
        }
      }
    },
    {
      "name": "Send Slack Notification",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "resource": "message",
        "operation": "post",
        "channel": "#deployments",
        "text": "🚀 Epic Complete: {{ $('Load Complete Workflow').item.json.jira_epic_key }}\n\n**PR:** {{ $('Load Complete Workflow').item.json.github_pr_url }}\n**Docs:** {{ $('Load Complete Workflow').item.json.confluence_page_url }}\n\nReady for review! @channel"
      }
    },
    {
      "name": "Update Final Workflow Status",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "operation": "update",
        "table": "workflows",
        "where": {
          "jira_epic_key": "={{ $('Load Complete Workflow').item.json.jira_epic_key }}"
        },
        "set": {
          "status": "in_review",
          "completed_at": "={{ $now }}"
        }
      }
    }
  ]
}
```

---

## Environment Variables Configuration

Create `.env` file for n8n:

```bash
# Anthropic API
ANTHROPIC_API_KEY=sk-ant-...

# GitHub
GITHUB_TOKEN=ghp_...
GITHUB_ORG=the-lobbi

# Jira
JIRA_BASE_URL=https://brooksidebi.atlassian.net
JIRA_EMAIL=your-email@thelobbi.com
JIRA_API_TOKEN=...

# Confluence
CONFLUENCE_BASE_URL=https://brooksidebi.atlassian.net/wiki
CONFLUENCE_API_TOKEN=...  # Can reuse JIRA_API_TOKEN
CONFLUENCE_SPACE_KEY=DEV

# PostgreSQL (for state management)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=golden_armada
POSTGRES_USER=armada
POSTGRES_PASSWORD=...

# Workflow IDs (set after creating workflows)
PLANNING_WORKFLOW_ID=
PR_WORKFLOW_ID=
JIRA_UPDATE_WORKFLOW_ID=

# Optional: Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

---

## Database Schema

Create PostgreSQL tables for state management:

```sql
-- Workflows table
CREATE TABLE workflows (
    id SERIAL PRIMARY KEY,
    jira_epic_key VARCHAR(50) UNIQUE NOT NULL,
    jira_epic_data JSONB NOT NULL,
    status VARCHAR(50) NOT NULL,
    planning_data JSONB,
    github_pr_url VARCHAR(500),
    github_pr_number INTEGER,
    confluence_page_id VARCHAR(100),
    confluence_page_url VARCHAR(500),
    confluence_space_key VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    INDEX idx_epic_key (jira_epic_key),
    INDEX idx_status (status)
);

-- Workflow steps (for audit trail)
CREATE TABLE workflow_steps (
    id SERIAL PRIMARY KEY,
    workflow_id INTEGER REFERENCES workflows(id),
    step_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    INDEX idx_workflow_id (workflow_id)
);
```

---

## Integration with Golden Armada

### Option 1: Standalone n8n (Recommended for MVP)

Run n8n independently and trigger Golden Armada UI via webhooks:

```javascript
// In n8n workflow, add HTTP Request node
{
  "name": "Notify Golden Armada UI",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method": "POST",
    "url": "{{ $env.GOLDEN_ARMADA_API }}/api/workflows/status",
    "body": {
      "epicKey": "={{ $json.epicKey }}",
      "status": "={{ $json.status }}",
      "data": "={{ $json }}"
    }
  }
}
```

### Option 2: Embedded n8n with MCP

Use n8n as MCP server for Golden Armada:

```typescript
// In Golden Armada backend
import { MCPClient } from '@modelcontextprotocol/sdk';

const n8nMCP = new MCPClient({
  name: 'n8n-workflows',
  version: '1.0.0',
  endpoint: process.env.N8N_MCP_ENDPOINT
});

// Trigger workflow
await n8nMCP.callTool('execute_workflow', {
  workflowId: 'epic-intake',
  inputs: {
    type: 'webhook',
    webhookData: {
      body: epicData
    }
  }
});
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Kubernetes Cluster                          │
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐ │
│  │   n8n Pod    │◄────►│ PostgreSQL   │◄────►│ Golden Armada│ │
│  │              │      │   StatefulSet│      │   Deployment  │ │
│  │ - 5 Workflows│      │              │      │              │ │
│  │ - MCP Server │      │ - State DB   │      │ - UI/API     │ │
│  └──────────────┘      └──────────────┘      └──────────────┘ │
│         │                                            │         │
│         │                                            │         │
│  ┌──────▼────────────────────────────────────────────▼──────┐ │
│  │              External Secrets Operator                   │ │
│  │  (Pulls secrets from HashiCorp Vault)                   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
           ┌────▼───┐   ┌────▼───┐  ┌────▼─────┐
           │  Jira  │   │ GitHub │  │Confluence│
           │Webhooks│   │  API   │  │   API    │
           └────────┘   └────────┘  └──────────┘
```

---

## Deployment Steps

### Phase 1: n8n Setup

1. **Deploy n8n to Kubernetes:**
```bash
helm repo add n8n https://8gears.com/helm-charts/
helm install n8n n8n/n8n \
  --set persistence.enabled=true \
  --set ingress.enabled=true \
  --set ingress.hosts[0].host=n8n.thelobbi.com
```

2. **Import workflows** (use n8n CLI or UI import)

3. **Configure environment variables** via Kubernetes secrets

### Phase 2: Database Setup

```bash
# Create PostgreSQL database
kubectl apply -f postgres-statefulset.yaml

# Run migrations
psql -h postgres-service -U armada -d golden_armada -f schema.sql
```

### Phase 3: Webhook Configuration

1. **Jira Webhook:**
   - Go to Jira Settings → System → WebHooks
   - URL: `https://n8n.thelobbi.com/webhook/jira-epic-intake`
   - Events: `issue_updated` (filter: label='agentic-ready')

2. **GitHub Webhook:**
   - Repository Settings → Webhooks
   - URL: `https://n8n.thelobbi.com/webhook/github-review-feedback`
   - Events: `pull_request_review_comment`

### Phase 4: HashiCorp Vault Integration

```yaml
# external-secret.yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: n8n-secrets
spec:
  secretStoreRef:
    name: vault-backend
    kind: SecretStore
  target:
    name: n8n-credentials
  data:
    - secretKey: ANTHROPIC_API_KEY
      remoteRef:
        key: golden-armada/anthropic
        property: api_key
    - secretKey: GITHUB_TOKEN
      remoteRef:
        key: golden-armada/github
        property: token
```

---

## Monitoring & Observability

### Workflow Metrics Dashboard

Create Grafana dashboard tracking:
- Epic processing time (P50, P95, P99)
- Success rate per workflow
- Agent token consumption
- Confluence page creation rate
- PR merge time

### Logging Strategy

```javascript
// Add to each critical node
{
  "name": "Log Step",
  "type": "n8n-nodes-base.code",
  "parameters": {
    "jsCode": "console.log(JSON.stringify({\n  workflow: $workflow.name,\n  epicKey: $json.epicKey,\n  step: '{{ $node.name }}',\n  timestamp: new Date().toISOString(),\n  data: $json\n}));\nreturn $input.all();"
  }
}
```

---

## Testing Strategy

### Phase 1: Unit Testing
- Test each workflow independently with mock data
- Validate Claude agent prompts return expected structure

### Phase 2: Integration Testing
- Test full pipeline with real Jira test epic
- Verify GitHub branch creation, commits, PR
- Confirm Confluence page publication

### Phase 3: Load Testing
- Process 10 concurrent epics
- Monitor database connection pooling
- Validate queue handling

---

## Human-in-the-Loop Gates

### Gate 1: Planning Review
**Trigger:** Epic transitions to 'Planning Review'  
**Action:** Human reviews AI-generated stories/subtasks in Jira  
**Continue:** Human transitions to 'Ready for Execution'

### Gate 2: Code Review
**Trigger:** PR created  
**Action:** Human reviews code changes, adds @claude-review comments  
**Continue:** Human approves PR (triggers merge workflow)

---

## Future Enhancements

### Phase 2: Advanced Features
- **Parallel epic processing** (up to `MAX_PARALLEL_EPICS`)
- **Rollback workflows** (revert PR, delete Confluence page)
- **A/B testing for prompt variations**
- **Confidence scoring** (escalate low-confidence decisions)

### Phase 3: Agent Marketplace
- Pluggable agent definitions from `tools-golden-armada`
- User-selectable agents per epic type
- Agent performance analytics

### Phase 4: Cross-Epic Learning
- Store successful patterns in vector database
- Use RAG for similar epic detection
- Suggest reusable code modules

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Epic-to-PR Time | < 30 minutes | Workflow execution time |
| Human Review Time | < 2 hours | Jira status transitions |
| Test Pass Rate | > 95% | CI/CD results |
| Documentation Quality | > 4/5 stars | Team feedback |
| Agent Token Efficiency | < 100K tokens/epic | API usage logs |

---

## Troubleshooting Guide

### Issue: Workflow Stuck in Planning
**Symptom:** Epic remains in 'planning_review' for > 4 hours  
**Solution:** Check Claude API rate limits, review agent logs for errors

### Issue: Tests Failing After Code Generation
**Symptom:** Execution pipeline fails at test step  
**Solution:** Review agent implementation guidance, adjust system prompts

### Issue: Confluence Page Creation Fails
**Symptom:** 403/401 errors from Confluence API  
**Solution:** Verify API token permissions, check space access

---

*This architecture enables a complete agentic DevOps pipeline orchestrated through n8n workflows, integrating seamlessly with Golden Armada's existing infrastructure.*
