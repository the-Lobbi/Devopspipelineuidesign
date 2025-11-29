# n8n Agentic DevOps - Quick Start Implementation

## Implementation Guide for Golden Armada Integration

This guide provides the exact steps and code to implement the agentic DevOps pipeline in n8n with MCP integration.

---

## Prerequisites

- n8n instance (self-hosted or cloud)
- PostgreSQL database
- Golden Armada backend running
- API tokens for Jira, GitHub, Confluence, Anthropic

---

## Step 1: Import Base Workflow Templates

### Workflow 1: Epic Intake (Complete JSON)

Save as `epic-intake-workflow.json`:

```json
{
  "name": "Epic Intake Pipeline",
  "nodes": [
    {
      "parameters": {
        "path": "jira-epic-intake",
        "httpMethod": "POST",
        "responseMode": "lastNode",
        "options": {}
      },
      "id": "webhook-node",
      "name": "Jira Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "jsCode": "// Validate epic structure and extract data\nconst webhookData = $input.item.json;\nconst issue = webhookData.issue;\n\n// Validate required fields\nconst requiredFields = ['key', 'summary', 'description'];\nfor (const field of requiredFields) {\n  if (!issue.fields[field]) {\n    throw new Error(`Missing required field: ${field}`);\n  }\n}\n\n// Check for agentic-ready label\nconst labels = issue.fields.labels || [];\nif (!labels.includes('agentic-ready')) {\n  throw new Error('Epic missing agentic-ready label');\n}\n\n// Extract custom fields\nconst customFields = issue.fields;\nconst targetRepo = customFields.customfield_10050 || 'default-repo'; // Adjust field ID\nconst acceptanceCriteria = customFields.customfield_10051 || ''; // Adjust field ID\n\nreturn {\n  json: {\n    epicKey: issue.key,\n    summary: issue.fields.summary,\n    description: issue.fields.description,\n    acceptanceCriteria: acceptanceCriteria,\n    targetRepo: targetRepo,\n    project: issue.fields.project.key,\n    issueType: issue.fields.issuetype.name,\n    priority: issue.fields.priority?.name || 'Medium',\n    labels: labels,\n    validated: true,\n    timestamp: new Date().toISOString()\n  }\n};"
      },
      "id": "validate-node",
      "name": "Validate Epic Structure",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [450, 300]
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "INSERT INTO workflows (jira_epic_key, jira_epic_data, status, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id",
        "additionalFields": {
          "queryParams": "={{ $json.epicKey }},={{ JSON.stringify($json) }},queued_for_planning"
        }
      },
      "id": "postgres-insert",
      "name": "Store in PostgreSQL",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2,
      "position": [650, 300],
      "credentials": {
        "postgres": {
          "id": "postgres-creds",
          "name": "Golden Armada DB"
        }
      }
    },
    {
      "parameters": {
        "resource": "issue",
        "operation": "addComment",
        "issueKey": "={{ $('Validate Epic Structure').item.json.epicKey }}",
        "comment": "✅ Epic validated and queued for AI planning.\n\n**Workflow ID:** {{ $('Store in PostgreSQL').item.json.id }}\n**Status:** Queued for Planning\n**Target Repository:** {{ $('Validate Epic Structure').item.json.targetRepo }}\n\nThe planning agent will analyze your epic and generate implementation stories and subtasks."
      },
      "id": "jira-comment",
      "name": "Post Jira Comment",
      "type": "n8n-nodes-base.jira",
      "typeVersion": 1,
      "position": [850, 300],
      "credentials": {
        "jiraApi": {
          "id": "jira-creds",
          "name": "Jira API"
        }
      }
    },
    {
      "parameters": {
        "workflowId": "={{ $env.PLANNING_WORKFLOW_ID }}",
        "source": "={{ { epicKey: $('Validate Epic Structure').item.json.epicKey, workflowId: $('Store in PostgreSQL').item.json.id } }}"
      },
      "id": "trigger-planning",
      "name": "Trigger Planning Workflow",
      "type": "n8n-nodes-base.executeWorkflow",
      "typeVersion": 1,
      "position": [850, 450]
    }
  ],
  "connections": {
    "Jira Webhook": {
      "main": [[{ "node": "Validate Epic Structure", "type": "main", "index": 0 }]]
    },
    "Validate Epic Structure": {
      "main": [[{ "node": "Store in PostgreSQL", "type": "main", "index": 0 }]]
    },
    "Store in PostgreSQL": {
      "main": [
        [
          { "node": "Post Jira Comment", "type": "main", "index": 0 },
          { "node": "Trigger Planning Workflow", "type": "main", "index": 0 }
        ]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1"
  },
  "staticData": null,
  "tags": ["golden-armada", "epic-intake"],
  "triggerCount": 1,
  "updatedAt": "2025-11-29T00:00:00.000Z",
  "versionId": "1"
}
```

**Import to n8n:**
```bash
# Using n8n CLI
n8n import:workflow --input=epic-intake-workflow.json

# Or via UI: Workflows → Import from File → Select JSON
```

---

## Step 2: MCP Server Integration

### Option A: n8n as MCP Server

Create MCP server wrapper for n8n workflows:

```typescript
// File: golden-armada/backend/armada/mcp/n8n_server.ts

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

interface N8nConfig {
  baseUrl: string;
  apiKey: string;
}

class N8nMCPServer {
  private server: Server;
  private config: N8nConfig;

  constructor(config: N8nConfig) {
    this.config = config;
    this.server = new Server(
      {
        name: "n8n-workflows",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "execute_workflow",
            description: "Execute an n8n workflow by ID with provided inputs",
            inputSchema: {
              type: "object",
              properties: {
                workflowId: {
                  type: "string",
                  description: "The ID of the n8n workflow to execute",
                },
                inputs: {
                  type: "object",
                  description: "Input data for the workflow",
                  properties: {
                    type: {
                      type: "string",
                      enum: ["chat", "form", "webhook"],
                      description: "Type of workflow input",
                    },
                    data: {
                      type: "object",
                      description: "Workflow-specific input data",
                    },
                  },
                  required: ["type", "data"],
                },
              },
              required: ["workflowId", "inputs"],
            },
          },
          {
            name: "get_workflow_status",
            description: "Get the execution status of a workflow",
            inputSchema: {
              type: "object",
              properties: {
                executionId: {
                  type: "string",
                  description: "The execution ID to check status for",
                },
              },
              required: ["executionId"],
            },
          },
          {
            name: "list_workflows",
            description: "List all available n8n workflows",
            inputSchema: {
              type: "object",
              properties: {
                tags: {
                  type: "array",
                  items: { type: "string" },
                  description: "Filter workflows by tags",
                },
              },
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case "execute_workflow":
          return await this.executeWorkflow(args);
        case "get_workflow_status":
          return await this.getWorkflowStatus(args);
        case "list_workflows":
          return await this.listWorkflows(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  private async executeWorkflow(args: any) {
    try {
      const { workflowId, inputs } = args;

      // Execute webhook-based workflow
      if (inputs.type === "webhook") {
        const response = await axios.post(
          `${this.config.baseUrl}/webhook/${workflowId}`,
          inputs.data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                executionId: response.data.executionId,
                result: response.data,
              }),
            },
          ],
        };
      }

      // Execute via API (requires n8n API key)
      const response = await axios.post(
        `${this.config.baseUrl}/api/v1/workflows/${workflowId}/execute`,
        inputs.data,
        {
          headers: {
            "X-N8N-API-KEY": this.config.apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              executionId: response.data.executionId,
              result: response.data.data,
            }),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: error.message,
              details: error.response?.data,
            }),
          },
        ],
        isError: true,
      };
    }
  }

  private async getWorkflowStatus(args: any) {
    try {
      const { executionId } = args;

      const response = await axios.get(
        `${this.config.baseUrl}/api/v1/executions/${executionId}`,
        {
          headers: {
            "X-N8N-API-KEY": this.config.apiKey,
          },
        }
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              executionId,
              status: response.data.status,
              startedAt: response.data.startedAt,
              stoppedAt: response.data.stoppedAt,
              data: response.data.data,
            }),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: error.message,
            }),
          },
        ],
        isError: true,
      };
    }
  }

  private async listWorkflows(args: any) {
    try {
      const response = await axios.get(
        `${this.config.baseUrl}/api/v1/workflows`,
        {
          headers: {
            "X-N8N-API-KEY": this.config.apiKey,
          },
        }
      );

      let workflows = response.data.data;

      // Filter by tags if provided
      if (args.tags && args.tags.length > 0) {
        workflows = workflows.filter((w: any) =>
          w.tags?.some((t: any) => args.tags.includes(t.name))
        );
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              workflows: workflows.map((w: any) => ({
                id: w.id,
                name: w.name,
                active: w.active,
                tags: w.tags,
                createdAt: w.createdAt,
                updatedAt: w.updatedAt,
              })),
            }),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: error.message,
            }),
          },
        ],
        isError: true,
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("n8n MCP Server running on stdio");
  }
}

// Start server
const server = new N8nMCPServer({
  baseUrl: process.env.N8N_BASE_URL || "http://localhost:5678",
  apiKey: process.env.N8N_API_KEY || "",
});

server.run().catch(console.error);
```

### MCP Configuration

Add to Golden Armada's MCP config:

```json
// File: golden-armada/backend/mcp_config.json
{
  "mcpServers": {
    "n8n-workflows": {
      "command": "node",
      "args": ["dist/mcp/n8n_server.js"],
      "env": {
        "N8N_BASE_URL": "http://n8n-service:5678",
        "N8N_API_KEY": "${N8N_API_KEY}"
      }
    }
  }
}
```

---

## Step 3: Golden Armada Integration

### Backend Workflow Service Extension

```python
# File: golden-armada/backend/armada/services/n8n_workflow_service.py

from typing import Dict, Any, Optional
import httpx
import structlog
from sqlalchemy.ext.asyncio import AsyncSession

from armada.config import settings
from armada.db.models import Workflow, WorkflowStep
from armada.services.mcp_client import MCPClient

logger = structlog.get_logger()


class N8nWorkflowService:
    """Service for orchestrating n8n workflows."""

    def __init__(self):
        self.mcp_client = MCPClient(server_name="n8n-workflows")
        self.n8n_base_url = settings.n8n_base_url

    async def trigger_epic_intake(
        self,
        db: AsyncSession,
        epic_key: str,
        epic_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Trigger the Epic Intake workflow in n8n.
        
        Args:
            db: Database session
            epic_key: Jira epic key (e.g., EPIC-123)
            epic_data: Complete epic data from Jira
            
        Returns:
            Workflow execution result
        """
        logger.info(
            "Triggering Epic Intake workflow",
            epic_key=epic_key
        )

        # Create workflow record
        workflow = Workflow(
            jira_epic_key=epic_key,
            jira_epic_data=epic_data,
            status="queued_for_planning"
        )
        db.add(workflow)
        await db.commit()
        await db.refresh(workflow)

        # Execute n8n workflow via MCP
        try:
            result = await self.mcp_client.call_tool(
                "execute_workflow",
                {
                    "workflowId": "epic-intake",  # or use workflow ID
                    "inputs": {
                        "type": "webhook",
                        "data": {
                            "issue": {
                                "key": epic_key,
                                "fields": epic_data
                            }
                        }
                    }
                }
            )

            logger.info(
                "Epic Intake workflow triggered",
                epic_key=epic_key,
                execution_id=result.get("executionId")
            )

            return {
                "workflow_id": workflow.id,
                "n8n_execution_id": result.get("executionId"),
                "status": "processing"
            }

        except Exception as e:
            logger.error(
                "Failed to trigger Epic Intake workflow",
                epic_key=epic_key,
                error=str(e)
            )
            workflow.status = "failed"
            await db.commit()
            raise

    async def check_workflow_status(
        self,
        execution_id: str
    ) -> Dict[str, Any]:
        """
        Check the status of an n8n workflow execution.
        
        Args:
            execution_id: n8n execution ID
            
        Returns:
            Workflow status and data
        """
        result = await self.mcp_client.call_tool(
            "get_workflow_status",
            {"executionId": execution_id}
        )

        return {
            "execution_id": execution_id,
            "status": result.get("status"),
            "started_at": result.get("startedAt"),
            "stopped_at": result.get("stoppedAt"),
            "data": result.get("data")
        }

    async def list_available_workflows(
        self,
        tags: Optional[list] = None
    ) -> list:
        """
        List all available n8n workflows.
        
        Args:
            tags: Optional list of tags to filter by
            
        Returns:
            List of available workflows
        """
        result = await self.mcp_client.call_tool(
            "list_workflows",
            {"tags": tags or ["golden-armada"]}
        )

        return result.get("workflows", [])
```

### API Endpoint

```python
# File: golden-armada/backend/armada/api/n8n_workflows.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from armada.db.database import get_db
from armada.services.n8n_workflow_service import N8nWorkflowService

router = APIRouter(prefix="/api/n8n", tags=["n8n"])


class TriggerEpicRequest(BaseModel):
    epic_key: str
    epic_data: dict


@router.post("/trigger-epic")
async def trigger_epic_workflow(
    request: TriggerEpicRequest,
    db: AsyncSession = Depends(get_db)
):
    """Trigger the Epic Intake workflow."""
    service = N8nWorkflowService()
    
    try:
        result = await service.trigger_epic_intake(
            db=db,
            epic_key=request.epic_key,
            epic_data=request.epic_data
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status/{execution_id}")
async def get_workflow_status(execution_id: str):
    """Get the status of an n8n workflow execution."""
    service = N8nWorkflowService()
    
    try:
        result = await service.check_workflow_status(execution_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/workflows")
async def list_workflows(tags: str = "golden-armada"):
    """List available n8n workflows."""
    service = N8nWorkflowService()
    
    try:
        tag_list = tags.split(",") if tags else None
        result = await service.list_available_workflows(tags=tag_list)
        return {"workflows": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

## Step 4: Environment Configuration

### n8n Environment Variables

```bash
# File: n8n/.env

# n8n Configuration
N8N_PORT=5678
N8N_PROTOCOL=https
N8N_HOST=n8n.thelobbi.com
WEBHOOK_URL=https://n8n.thelobbi.com/

# Database
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=postgres-service
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n_user
DB_POSTGRESDB_PASSWORD=${N8N_DB_PASSWORD}

# Security
N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
N8N_API_KEY=${N8N_API_KEY}

# External Services
ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
GITHUB_TOKEN=${GITHUB_TOKEN}
JIRA_BASE_URL=https://brooksidebi.atlassian.net
JIRA_EMAIL=${JIRA_EMAIL}
JIRA_API_TOKEN=${JIRA_API_TOKEN}
CONFLUENCE_BASE_URL=https://brooksidebi.atlassian.net/wiki
CONFLUENCE_API_TOKEN=${CONFLUENCE_API_TOKEN}
CONFLUENCE_SPACE_KEY=DEV

# Golden Armada Integration
GOLDEN_ARMADA_DB_HOST=postgres-service
GOLDEN_ARMADA_DB_PORT=5432
GOLDEN_ARMADA_DB_NAME=golden_armada
GOLDEN_ARMADA_DB_USER=armada
GOLDEN_ARMADA_DB_PASSWORD=${GOLDEN_ARMADA_DB_PASSWORD}

# Workflow IDs (populated after import)
PLANNING_WORKFLOW_ID=
PR_WORKFLOW_ID=
JIRA_UPDATE_WORKFLOW_ID=
```

### Golden Armada Environment Variables

```bash
# File: golden-armada/.env

# Add these to existing config
N8N_BASE_URL=http://n8n-service:5678
N8N_API_KEY=${N8N_API_KEY}
N8N_WEBHOOK_BASE_URL=https://n8n.thelobbi.com/webhook
```

---

## Step 5: Kubernetes Deployment

### n8n Deployment

```yaml
# File: k8s/n8n-deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: n8n
  namespace: golden-armada
spec:
  replicas: 2
  selector:
    matchLabels:
      app: n8n
  template:
    metadata:
      labels:
        app: n8n
    spec:
      containers:
      - name: n8n
        image: n8nio/n8n:latest
        ports:
        - containerPort: 5678
        envFrom:
        - secretRef:
            name: n8n-secrets
        volumeMounts:
        - name: n8n-data
          mountPath: /home/node/.n8n
      volumes:
      - name: n8n-data
        persistentVolumeClaim:
          claimName: n8n-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: n8n-service
  namespace: golden-armada
spec:
  selector:
    app: n8n
  ports:
  - port: 5678
    targetPort: 5678
  type: ClusterIP
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: n8n-pvc
  namespace: golden-armada
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

### External Secrets for n8n

```yaml
# File: k8s/n8n-external-secret.yaml

apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: n8n-secrets
  namespace: golden-armada
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: vault-backend
    kind: SecretStore
  target:
    name: n8n-secrets
    creationPolicy: Owner
  data:
    - secretKey: N8N_ENCRYPTION_KEY
      remoteRef:
        key: golden-armada/n8n
        property: encryption_key
    - secretKey: N8N_API_KEY
      remoteRef:
        key: golden-armada/n8n
        property: api_key
    - secretKey: N8N_DB_PASSWORD
      remoteRef:
        key: golden-armada/postgres
        property: n8n_password
    - secretKey: ANTHROPIC_API_KEY
      remoteRef:
        key: golden-armada/anthropic
        property: api_key
    - secretKey: GITHUB_TOKEN
      remoteRef:
        key: golden-armada/github
        property: token
    - secretKey: JIRA_EMAIL
      remoteRef:
        key: golden-armada/atlassian
        property: email
    - secretKey: JIRA_API_TOKEN
      remoteRef:
        key: golden-armada/atlassian
        property: api_token
    - secretKey: CONFLUENCE_API_TOKEN
      remoteRef:
        key: golden-armada/atlassian
        property: api_token
    - secretKey: GOLDEN_ARMADA_DB_PASSWORD
      remoteRef:
        key: golden-armada/postgres
        property: armada_password
```

---

## Step 6: Testing the Pipeline

### Test Script

```bash
#!/bin/bash
# File: test-n8n-pipeline.sh

set -e

echo "🧪 Testing n8n Agentic DevOps Pipeline"

# 1. Check n8n is running
echo "1. Checking n8n status..."
curl -s http://n8n-service:5678/healthz || echo "❌ n8n not responding"

# 2. List workflows
echo "2. Listing workflows..."
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
  http://n8n-service:5678/api/v1/workflows | jq '.data[] | {id, name, active}'

# 3. Create test epic in Jira
echo "3. Creating test epic..."
EPIC_KEY=$(curl -s -X POST \
  -H "Authorization: Basic $(echo -n $JIRA_EMAIL:$JIRA_API_TOKEN | base64)" \
  -H "Content-Type: application/json" \
  $JIRA_BASE_URL/rest/api/3/issue \
  -d '{
    "fields": {
      "project": {"key": "TEST"},
      "summary": "Test Epic for n8n Pipeline",
      "description": "Automated test epic",
      "issuetype": {"name": "Epic"},
      "labels": ["agentic-ready"],
      "customfield_10050": "test-repo"
    }
  }' | jq -r '.key')

echo "   Created epic: $EPIC_KEY"

# 4. Trigger Epic Intake workflow
echo "4. Triggering Epic Intake workflow..."
EXECUTION_ID=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  https://n8n.thelobbi.com/webhook/jira-epic-intake \
  -d "{
    \"issue\": {
      \"key\": \"$EPIC_KEY\",
      \"fields\": {
        \"summary\": \"Test Epic\",
        \"description\": \"Test\",
        \"labels\": [\"agentic-ready\"],
        \"customfield_10050\": \"test-repo\"
      }
    }
  }" | jq -r '.executionId')

echo "   Execution ID: $EXECUTION_ID"

# 5. Monitor execution
echo "5. Monitoring execution..."
sleep 5
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
  http://n8n-service:5678/api/v1/executions/$EXECUTION_ID | jq '.status'

echo "✅ Pipeline test complete"
```

---

## Next Steps

1. **Import all 5 workflows** to n8n
2. **Configure credentials** in n8n UI for Jira, GitHub, Confluence
3. **Deploy MCP server** to Golden Armada backend
4. **Set up Kubernetes** resources (n8n + External Secrets)
5. **Run test script** to validate end-to-end flow
6. **Monitor workflows** in n8n UI and Golden Armada dashboard

---

## Monitoring Dashboard

Create Grafana dashboard JSON:

```json
{
  "dashboard": {
    "title": "n8n Agentic DevOps Pipeline",
    "panels": [
      {
        "title": "Workflow Executions (24h)",
        "targets": [{
          "expr": "rate(n8n_workflow_executions_total[24h])"
        }]
      },
      {
        "title": "Epic Processing Time",
        "targets": [{
          "expr": "histogram_quantile(0.95, n8n_workflow_duration_seconds_bucket{workflow=\"epic-intake\"})"
        }]
      }
    ]
  }
}
```

---

*This quick-start guide provides everything needed to deploy the n8n agentic DevOps pipeline integrated with Golden Armada.*
