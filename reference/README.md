# n8n Agentic DevOps Pipeline - Complete Implementation Package

## 🎯 Overview

This package contains everything needed to implement a complete agentic DevOps pipeline using n8n MCP integration with Golden Armada.

**Pipeline Flow:**
```
Jira Epic (labeled 'agentic-ready')
    ↓
Epic Intake Workflow (n8n)
    ↓
Planning Orchestration (Claude Opus 4)
    ↓
Human Review (Jira Stories/Subtasks)
    ↓
Execution Pipeline (Claude Sonnet 4)
    ↓
PR & Documentation Generation
    ↓
Confluence Publication
    ↓
Jira Update & Notifications
```

---

## 📦 Package Contents

```
n8n-agentic-devops/
├── README.md (this file)
├── n8n-agentic-devops-architecture.md     # Complete architecture documentation
├── n8n-quick-start-implementation.md      # Step-by-step implementation guide
├── workflows/                             # n8n workflow JSON files (ready to import)
│   ├── 01-epic-intake.json
│   ├── 02-planning-orchestration.json
│   ├── 03-execution-pipeline.json
│   ├── 04-pr-documentation.json
│   └── 05-jira-update.json
├── integration/                           # Golden Armada integration code
│   ├── mcp/n8n_server.ts                 # MCP server for n8n
│   ├── services/n8n_workflow_service.py  # Backend service
│   └── api/n8n_workflows.py              # API endpoints
├── kubernetes/                            # K8s deployment manifests
│   ├── n8n-deployment.yaml
│   ├── n8n-service.yaml
│   ├── n8n-external-secret.yaml
│   └── postgres-statefulset.yaml
├── database/                              # Database schemas
│   └── schema.sql
└── scripts/                               # Utility scripts
    ├── test-pipeline.sh
    ├── deploy.sh
    └── setup-vault-secrets.sh
```

---

## 🚀 Quick Start (30 minutes)

### Prerequisites

- [ ] n8n instance (self-hosted or cloud)
- [ ] PostgreSQL database
- [ ] Kubernetes cluster (for production)
- [ ] HashiCorp Vault (for production secrets)
- [ ] API tokens:
  - [ ] Anthropic API key (Claude Opus 4 & Sonnet 4)
  - [ ] GitHub personal access token
  - [ ] Jira API token
  - [ ] Confluence API token (can reuse Jira token)

### Phase 1: n8n Setup (10 minutes)

1. **Deploy n8n:**
   ```bash
   # Option A: Docker (development)
   docker run -d \
     --name n8n \
     -p 5678:5678 \
     -v n8n_data:/home/node/.n8n \
     n8nio/n8n
   
   # Option B: Kubernetes (production)
   kubectl apply -f kubernetes/n8n-deployment.yaml
   ```

2. **Import workflows:**
   ```bash
   # Via n8n CLI
   n8n import:workflow --input=workflows/01-epic-intake.json
   n8n import:workflow --input=workflows/02-planning-orchestration.json
   n8n import:workflow --input=workflows/03-execution-pipeline.json
   n8n import:workflow --input=workflows/04-pr-documentation.json
   n8n import:workflow --input=workflows/05-jira-update.json
   
   # Or via UI: Workflows → Import from File → Select each JSON
   ```

3. **Configure credentials:**
   - Go to n8n UI → Settings → Credentials
   - Add credentials for:
     - Anthropic (API key)
     - GitHub (Personal Access Token)
     - Jira (Email + API Token)
     - Confluence (Email + API Token)
     - PostgreSQL (Golden Armada database)

### Phase 2: Database Setup (5 minutes)

```bash
# Create database and tables
psql -h postgres-service -U armada -d golden_armada -f database/schema.sql

# Or via kubectl
kubectl exec -it postgres-0 -- psql -U armada -d golden_armada < database/schema.sql
```

### Phase 3: Golden Armada Integration (10 minutes)

1. **Install MCP server:**
   ```bash
   cd integration/mcp
   npm install @modelcontextprotocol/sdk axios
   npm run build
   ```

2. **Add to Golden Armada backend:**
   ```bash
   # Copy integration files
   cp integration/services/n8n_workflow_service.py \
      ../ui-golden-armada/backend/armada/services/
   
   cp integration/api/n8n_workflows.py \
      ../ui-golden-armada/backend/armada/api/
   
   # Update main.py to include router
   # Add to ui-golden-armada/backend/armada/main.py:
   # from armada.api import n8n_workflows
   # app.include_router(n8n_workflows.router)
   ```

3. **Configure environment:**
   ```bash
   # Add to .env
   echo "N8N_BASE_URL=http://n8n-service:5678" >> .env
   echo "N8N_API_KEY=your-n8n-api-key" >> .env
   ```

### Phase 4: Configure Webhooks (5 minutes)

1. **Jira Webhook:**
   - Go to Jira Settings → System → WebHooks
   - Add new webhook:
     - **Name:** "Golden Armada Epic Intake"
     - **URL:** `https://n8n.thelobbi.com/webhook/jira-epic-intake`
     - **Events:** Issue → updated
     - **JQL Filter:** `labels = agentic-ready AND issuetype = Epic`

2. **GitHub Webhook:**
   - Go to Repository → Settings → Webhooks
   - Add webhook:
     - **Payload URL:** `https://n8n.thelobbi.com/webhook/github-review-feedback`
     - **Content type:** application/json
     - **Events:** Pull request review comments

### Phase 5: Test the Pipeline

```bash
# Run test script
chmod +x scripts/test-pipeline.sh
./scripts/test-pipeline.sh
```

---

## 🏗️ Architecture Diagrams

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Kubernetes Cluster                     │
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐ │
│  │   n8n Pod    │◄────►│ PostgreSQL   │◄────►│Golden Armada │ │
│  │              │      │  StatefulSet │      │  (UI/API)    │ │
│  │ - Workflows  │      │              │      │              │ │
│  │ - MCP Server │      │ - State DB   │      │ - Frontend   │ │
│  │ - Webhooks   │      │              │      │ - Backend    │ │
│  └──────┬───────┘      └──────────────┘      └──────┬───────┘ │
│         │                                            │         │
│  ┌──────▼────────────────────────────────────────────▼──────┐ │
│  │          External Secrets Operator                       │ │
│  │          (HashiCorp Vault Integration)                   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
           ┌────▼───┐   ┌────▼───┐  ┌────▼─────┐
           │  Jira  │   │ GitHub │  │Confluence│
           │Webhooks│   │  API   │  │   API    │
           └────┬───┘   └────┬───┘  └────┬─────┘
                │            │            │
           ┌────▼────────────▼────────────▼─────┐
           │      Anthropic API (Claude)        │
           │  - Opus 4 (Orchestration)          │
           │  - Sonnet 4 (Execution)            │
           └────────────────────────────────────┘
```

### Workflow Sequence

```
1. EPIC INTAKE
   Jira Webhook → Validate → Store in DB → Trigger Planning

2. PLANNING
   Load Epic → Analyze Repo → Claude Planning Agent
   → Generate Stories/Subtasks → Create in Jira → Human Review

3. EXECUTION (after human approval)
   Create Branch → Process Subtasks in Parallel
   → Claude Execution Agent → Tests → Linters → Commits

4. PR & DOCS
   Generate PR Description → Create GitHub PR
   → Generate Confluence Docs → Publish to Confluence

5. FINALIZATION
   Post Jira Comment → Add Links → Transition Status
   → Send Notifications
```

---

## 🔒 Security Configuration

### Production Deployment with HashiCorp Vault

1. **Store secrets in Vault:**
   ```bash
   # Run setup script
   chmod +x scripts/setup-vault-secrets.sh
   ./scripts/setup-vault-secrets.sh
   
   # Or manually:
   vault kv put golden-armada/anthropic api_key="sk-ant-..."
   vault kv put golden-armada/github token="ghp_..."
   vault kv put golden-armada/atlassian \
     email="user@thelobbi.com" \
     api_token="..."
   vault kv put golden-armada/n8n \
     encryption_key="..." \
     api_key="..."
   ```

2. **Deploy External Secrets Operator:**
   ```bash
   helm repo add external-secrets https://charts.external-secrets.io
   helm install external-secrets external-secrets/external-secrets
   
   # Apply secret store
   kubectl apply -f kubernetes/vault-secret-store.yaml
   
   # Apply external secret
   kubectl apply -f kubernetes/n8n-external-secret.yaml
   ```

### Network Security

```yaml
# NetworkPolicy for n8n
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: n8n-network-policy
spec:
  podSelector:
    matchLabels:
      app: n8n
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: golden-armada
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 5678
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: postgres
    ports:
    - protocol: TCP
      port: 5432
  - to:
    - namespaceSelector: {}
    ports:
    - protocol: TCP
      port: 443  # External APIs
```

---

## 📊 Monitoring & Observability

### Grafana Dashboard

Import the Grafana dashboard:

```bash
# Dashboard included in package
kubectl create configmap n8n-dashboard \
  --from-file=monitoring/grafana-dashboard.json

# Or import via Grafana UI
```

**Key Metrics:**
- Epic processing time (P50, P95, P99)
- Workflow success rate
- Agent token consumption
- Database query performance
- Webhook latency

### Logging

n8n logs are automatically captured by Kubernetes:

```bash
# View n8n logs
kubectl logs -f deployment/n8n -n golden-armada

# View specific workflow execution
kubectl logs -f deployment/n8n -n golden-armada | grep "epicKey=EPIC-123"

# Export to Elasticsearch/Loki
# (Configure via Fluent Bit or Promtail)
```

### Alerts

Configure alerts in Prometheus:

```yaml
# alerts.yaml
groups:
- name: n8n-agentic-devops
  rules:
  - alert: HighWorkflowFailureRate
    expr: |
      rate(n8n_workflow_failures_total[5m]) > 0.1
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High n8n workflow failure rate"
      
  - alert: SlowEpicProcessing
    expr: |
      histogram_quantile(0.95, n8n_workflow_duration_seconds_bucket) > 1800
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "Epic processing taking longer than 30 minutes"
```

---

## 🧪 Testing Strategy

### Phase 1: Unit Testing

Test each workflow independently:

```bash
# Test Epic Intake
curl -X POST https://n8n.thelobbi.com/webhook/jira-epic-intake \
  -H "Content-Type: application/json" \
  -d @test-data/sample-epic.json

# Test Planning
# (Triggered automatically after Epic Intake)

# Test Execution
curl -X POST https://n8n.thelobbi.com/webhook/execute-epic \
  -H "Content-Type: application/json" \
  -d '{"epicKey": "EPIC-123"}'
```

### Phase 2: Integration Testing

Run end-to-end test:

```bash
# Create test epic in Jira
./scripts/create-test-epic.sh

# Monitor progress
./scripts/monitor-epic.sh EPIC-123

# Validate results
./scripts/validate-pipeline.sh EPIC-123
```

### Phase 3: Load Testing

```bash
# Process multiple epics concurrently
./scripts/load-test.sh --concurrent=10 --duration=30m
```

---

## 📈 Performance Tuning

### n8n Configuration

```yaml
# n8n-deployment.yaml (performance optimized)
spec:
  containers:
  - name: n8n
    resources:
      requests:
        memory: "2Gi"
        cpu: "1000m"
      limits:
        memory: "4Gi"
        cpu: "2000m"
    env:
    - name: N8N_METRICS
      value: "true"
    - name: EXECUTIONS_PROCESS
      value: "main"  # Use 'own' for better isolation
    - name: EXECUTIONS_MODE
      value: "queue"  # Use queue for high load
    - name: QUEUE_BULL_REDIS_HOST
      value: "redis-service"
```

### Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX idx_workflows_status ON workflows(status);
CREATE INDEX idx_workflows_epic_key ON workflows(jira_epic_key);
CREATE INDEX idx_workflows_created_at ON workflows(created_at);
CREATE INDEX idx_workflow_steps_workflow_id ON workflow_steps(workflow_id);

-- Vacuum and analyze
VACUUM ANALYZE workflows;
VACUUM ANALYZE workflow_steps;
```

### Agent Optimization

```typescript
// Adjust Claude model selection for cost/speed trade-off
const agentConfig = {
  // Planning: Use Opus 4 for complex reasoning
  planning: "claude-opus-4-20250514",
  
  // Execution: Use Sonnet 4 for faster, cost-effective implementation
  execution: "claude-sonnet-4-20250514",
  
  // Documentation: Use Sonnet 4
  documentation: "claude-sonnet-4-20250514"
};
```

---

## 🔄 Maintenance & Operations

### Backup Strategy

```bash
# Backup n8n workflows
n8n export:workflow --all --output=backup/workflows-$(date +%Y%m%d).json

# Backup database
pg_dump -h postgres-service -U armada golden_armada > backup/db-$(date +%Y%m%d).sql

# Automated daily backups
0 2 * * * /scripts/backup-n8n.sh
```

### Upgrade Procedure

```bash
# 1. Backup current state
./scripts/backup-all.sh

# 2. Update n8n image
kubectl set image deployment/n8n \
  n8n=n8nio/n8n:latest \
  -n golden-armada

# 3. Verify health
kubectl rollout status deployment/n8n -n golden-armada

# 4. Run smoke tests
./scripts/test-pipeline.sh
```

### Troubleshooting

**Issue: Workflow stuck in 'Running' state**
```bash
# Check n8n logs
kubectl logs deployment/n8n -n golden-armada --tail=100

# Check database connections
psql -h postgres-service -U armada -c "SELECT count(*) FROM pg_stat_activity;"

# Restart n8n if needed
kubectl rollout restart deployment/n8n -n golden-armada
```

**Issue: Claude API rate limits**
```bash
# Check API usage
curl https://api.anthropic.com/v1/usage \
  -H "x-api-key: $ANTHROPIC_API_KEY"

# Adjust concurrency in workflow
# Reduce MAX_PARALLEL_EPICS in n8n environment
```

**Issue: GitHub PR creation fails**
```bash
# Verify GitHub token permissions
# Token needs: repo, workflow, read:org

# Test GitHub API
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/user
```

---

## 📚 Additional Resources

- **Full Architecture:** `n8n-agentic-devops-architecture.md`
- **Implementation Guide:** `n8n-quick-start-implementation.md`
- **n8n Documentation:** https://docs.n8n.io
- **MCP SDK:** https://github.com/modelcontextprotocol/sdk
- **Golden Armada Repo:** https://github.com/the-lobbi/ui-golden-armada

---

## 🆘 Support & Feedback

**Issues:**
- Create GitHub issue in `the-lobbi/ui-golden-armada`
- Tag with `agentic-devops`, `n8n`

**Questions:**
- Slack: `#golden-armada-dev`
- Email: devops@thelobbi.com

---

## 📝 License

This implementation is part of the Golden Armada project and follows the same license terms.

---

## ✅ Deployment Checklist

### Development Environment

- [ ] n8n running locally (Docker)
- [ ] PostgreSQL database created
- [ ] All 5 workflows imported
- [ ] Credentials configured in n8n
- [ ] Test epic created in Jira
- [ ] Webhook URLs configured
- [ ] MCP server running
- [ ] Integration tests passing

### Production Environment

- [ ] Kubernetes cluster ready
- [ ] HashiCorp Vault configured
- [ ] External Secrets Operator deployed
- [ ] n8n deployed to K8s
- [ ] PostgreSQL StatefulSet deployed
- [ ] Network policies applied
- [ ] Monitoring dashboard imported
- [ ] Alerts configured
- [ ] Backup automation configured
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Team trained on pipeline

---

**Ready to transform your DevOps workflow with AI agents!** 🚀

Start with Phase 1 (n8n Setup) and follow the quick start guide above.
