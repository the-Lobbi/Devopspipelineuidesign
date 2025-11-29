# n8n Agentic DevOps - Quick Reference Card

## 🚀 Essential Commands

### Deployment

```bash
# Deploy complete stack to Kubernetes
./deploy.sh

# Deploy n8n only (Docker)
docker run -d --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n n8nio/n8n

# Import workflows
n8n import:workflow --input=workflows/01-epic-intake.json
n8n import:workflow --input=workflows/02-planning-orchestration.json
n8n import:workflow --input=workflows/03-execution-pipeline.json
n8n import:workflow --input=workflows/04-pr-documentation.json
n8n import:workflow --input=workflows/05-jira-update.json

# Or import all at once
for f in workflows/*.json; do n8n import:workflow --input="$f"; done
```

### Monitoring

```bash
# Check n8n pods
kubectl get pods -n golden-armada -l app=n8n

# View n8n logs
kubectl logs -f deployment/n8n -n golden-armada

# Check PostgreSQL
kubectl exec -it postgres-0 -n golden-armada -- psql -U armada -d golden_armada

# List workflows
kubectl exec -it n8n-0 -n golden-armada -- n8n list:workflows

# Check workflow execution
kubectl exec -it n8n-0 -n golden-armada -- n8n list:executions
```

### Testing

```bash
# Test complete pipeline
./scripts/test-pipeline.sh

# Test Epic Intake webhook
curl -X POST https://n8n.thelobbi.com/webhook/jira-epic-intake \
  -H "Content-Type: application/json" \
  -d '{"issue": {"key": "EPIC-123", "fields": {...}}}'

# Check workflow status
curl -H "X-N8N-API-KEY: $N8N_API_KEY" \
  http://n8n-service:5678/api/v1/executions/{executionId}

# Monitor epic in database
psql -h postgres-service -U armada -d golden_armada \
  -c "SELECT * FROM workflows WHERE jira_epic_key = 'EPIC-123';"
```

### Maintenance

```bash
# Backup workflows
n8n export:workflow --all --output=backup/workflows-$(date +%Y%m%d).json

# Backup database
kubectl exec postgres-0 -n golden-armada -- \
  pg_dump -U armada golden_armada > backup/db-$(date +%Y%m%d).sql

# Restart n8n
kubectl rollout restart deployment/n8n -n golden-armada

# Scale n8n
kubectl scale deployment/n8n --replicas=3 -n golden-armada

# View resource usage
kubectl top pods -n golden-armada
```

---

## 🔑 Environment Variables

### Required Secrets

```bash
# Anthropic API
ANTHROPIC_API_KEY=sk-ant-...

# GitHub
GITHUB_TOKEN=ghp_...

# Jira
JIRA_BASE_URL=https://brooksidebi.atlassian.net
JIRA_EMAIL=user@thelobbi.com
JIRA_API_TOKEN=...

# Confluence
CONFLUENCE_BASE_URL=https://brooksidebi.atlassian.net/wiki
CONFLUENCE_API_TOKEN=...  # Can reuse JIRA_API_TOKEN
CONFLUENCE_SPACE_KEY=DEV

# PostgreSQL
POSTGRES_HOST=postgres-service
POSTGRES_DB=golden_armada
POSTGRES_USER=armada
POSTGRES_PASSWORD=...

# n8n
N8N_BASE_URL=http://n8n-service:5678
N8N_API_KEY=...
N8N_ENCRYPTION_KEY=...
```

### Create Kubernetes Secrets

```bash
# Create secrets from environment variables
kubectl create secret generic n8n-credentials \
  --from-literal=ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY \
  --from-literal=GITHUB_TOKEN=$GITHUB_TOKEN \
  --from-literal=JIRA_EMAIL=$JIRA_EMAIL \
  --from-literal=JIRA_API_TOKEN=$JIRA_API_TOKEN \
  --from-literal=CONFLUENCE_API_TOKEN=$CONFLUENCE_API_TOKEN \
  --from-literal=JIRA_BASE_URL=$JIRA_BASE_URL \
  --from-literal=CONFLUENCE_BASE_URL=$CONFLUENCE_BASE_URL \
  --from-literal=CONFLUENCE_SPACE_KEY=$CONFLUENCE_SPACE_KEY \
  -n golden-armada

# Create PostgreSQL secret
kubectl create secret generic postgres-secret \
  --from-literal=password=$POSTGRES_PASSWORD \
  -n golden-armada

# Create n8n secret
kubectl create secret generic n8n-secret \
  --from-literal=encryption-key=$N8N_ENCRYPTION_KEY \
  --from-literal=api-key=$N8N_API_KEY \
  -n golden-armada
```

---

## 📊 Database Queries

### Monitor Workflow Progress

```sql
-- Active workflows
SELECT jira_epic_key, status, created_at 
FROM workflows 
WHERE status NOT IN ('done', 'failed')
ORDER BY created_at DESC;

-- Workflow statistics
SELECT status, COUNT(*) as count, AVG(EXTRACT(EPOCH FROM (completed_at - created_at))) as avg_duration_seconds
FROM workflows
WHERE completed_at IS NOT NULL
GROUP BY status;

-- Failed workflows
SELECT jira_epic_key, status, created_at
FROM workflows
WHERE status = 'failed'
ORDER BY created_at DESC
LIMIT 10;

-- Workflow steps for epic
SELECT step_name, status, started_at, completed_at
FROM workflow_steps
WHERE workflow_id = (SELECT id FROM workflows WHERE jira_epic_key = 'EPIC-123')
ORDER BY started_at;
```

### Performance Metrics

```sql
-- Processing time by epic
SELECT 
  jira_epic_key,
  EXTRACT(EPOCH FROM (completed_at - created_at))/60 as duration_minutes
FROM workflows
WHERE completed_at IS NOT NULL
ORDER BY completed_at DESC
LIMIT 20;

-- Average processing time by status
SELECT 
  status,
  COUNT(*) as count,
  AVG(EXTRACT(EPOCH FROM (completed_at - created_at))/60) as avg_minutes,
  MIN(EXTRACT(EPOCH FROM (completed_at - created_at))/60) as min_minutes,
  MAX(EXTRACT(EPOCH FROM (completed_at - created_at))/60) as max_minutes
FROM workflows
WHERE completed_at IS NOT NULL
GROUP BY status;
```

---

## 🌐 Webhook Configuration

### Jira Webhook

**URL:** `https://n8n.thelobbi.com/webhook/jira-epic-intake`

**Events:**
- `issue_updated`

**JQL Filter:**
```jql
labels = agentic-ready AND issuetype = Epic
```

**Webhook Configuration:**
1. Go to Jira → Settings → System → WebHooks
2. Click "Create a WebHook"
3. Name: "Golden Armada Epic Intake"
4. URL: `https://n8n.thelobbi.com/webhook/jira-epic-intake`
5. Events: Select "Issue → updated"
6. JQL: `labels = agentic-ready AND issuetype = Epic`
7. Save

### GitHub Webhook

**URL:** `https://n8n.thelobbi.com/webhook/github-review-feedback`

**Events:**
- `pull_request_review_comment`

**Webhook Configuration:**
1. Go to Repository → Settings → Webhooks
2. Click "Add webhook"
3. Payload URL: `https://n8n.thelobbi.com/webhook/github-review-feedback`
4. Content type: `application/json`
5. Events: Select "Pull request review comments"
6. Active: ✓
7. Add webhook

---

## 📈 Monitoring Queries

### Prometheus Metrics

```promql
# Workflow execution rate
rate(n8n_workflow_executions_total[5m])

# Workflow duration (95th percentile)
histogram_quantile(0.95, n8n_workflow_duration_seconds_bucket)

# Error rate
rate(n8n_workflow_failures_total[5m])

# Active workflows
n8n_active_workflows

# Database connections
pg_stat_activity_count{datname="golden_armada"}
```

### Grafana Dashboard Panels

**Panel 1: Epic Processing Time**
```
Query: histogram_quantile(0.95, n8n_workflow_duration_seconds_bucket{workflow="epic-intake"})
Visualization: Graph
```

**Panel 2: Success Rate**
```
Query: sum(rate(n8n_workflow_executions_total{status="success"}[5m])) / sum(rate(n8n_workflow_executions_total[5m]))
Visualization: Stat
```

**Panel 3: Active Epics**
```
Query: count(workflows{status!="done",status!="failed"})
Visualization: Stat
```

---

## 🔧 Troubleshooting

### Common Issues

**Issue: Workflow stuck in "Running"**
```bash
# Check n8n logs
kubectl logs -f deployment/n8n -n golden-armada | grep ERROR

# Check database locks
psql -h postgres-service -U armada -d golden_armada \
  -c "SELECT * FROM pg_locks WHERE NOT granted;"

# Restart workflow
kubectl exec n8n-0 -n golden-armada -- \
  n8n execute --id={executionId} --reset
```

**Issue: Claude API rate limit**
```bash
# Check current usage
curl https://api.anthropic.com/v1/usage \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01"

# Reduce concurrency in n8n
kubectl set env deployment/n8n MAX_PARALLEL_EPICS=1 -n golden-armada
```

**Issue: GitHub PR creation fails**
```bash
# Verify token permissions
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/user

# Check repository access
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/repos/the-lobbi/{repo}

# Required scopes: repo, workflow, read:org
```

**Issue: Confluence page creation fails**
```bash
# Test Confluence API
curl -u "$JIRA_EMAIL:$CONFLUENCE_API_TOKEN" \
  "$CONFLUENCE_BASE_URL/rest/api/content" | jq

# Verify space permissions
curl -u "$JIRA_EMAIL:$CONFLUENCE_API_TOKEN" \
  "$CONFLUENCE_BASE_URL/rest/api/space/$CONFLUENCE_SPACE_KEY" | jq
```

---

## 🎯 Quick Actions

### Create Test Epic

```bash
# Create test epic in Jira
curl -X POST \
  -H "Authorization: Basic $(echo -n $JIRA_EMAIL:$JIRA_API_TOKEN | base64)" \
  -H "Content-Type: application/json" \
  $JIRA_BASE_URL/rest/api/3/issue \
  -d '{
    "fields": {
      "project": {"key": "TEST"},
      "summary": "Test Epic for n8n Pipeline",
      "description": "Automated test epic for pipeline validation",
      "issuetype": {"name": "Epic"},
      "labels": ["agentic-ready"],
      "customfield_10050": "test-repo"
    }
  }'
```

### Trigger Workflow Manually

```bash
# Trigger Epic Intake
curl -X POST https://n8n.thelobbi.com/webhook/jira-epic-intake \
  -H "Content-Type: application/json" \
  -d @test-data/sample-epic.json

# Trigger Execution (bypass planning)
curl -X POST https://n8n.thelobbi.com/webhook/execute-epic \
  -H "Content-Type: application/json" \
  -d '{"epicKey": "EPIC-123"}'
```

### Check Agent Token Usage

```bash
# View token consumption by epic
psql -h postgres-service -U armada -d golden_armada -c "
  SELECT 
    jira_epic_key,
    (planning_data->'token_usage'->>'total_tokens')::int as tokens
  FROM workflows
  WHERE planning_data IS NOT NULL
  ORDER BY tokens DESC
  LIMIT 10;
"
```

---

## 📋 Workflow IDs Reference

After importing workflows, note their IDs:

```bash
# List all workflows with IDs
kubectl exec n8n-0 -n golden-armada -- n8n list:workflows

# Update environment variables with workflow IDs
kubectl set env deployment/n8n \
  PLANNING_WORKFLOW_ID={id} \
  PR_WORKFLOW_ID={id} \
  JIRA_UPDATE_WORKFLOW_ID={id} \
  -n golden-armada
```

---

## 🔐 HashiCorp Vault Paths

```bash
# Anthropic API
vault kv get golden-armada/anthropic
vault kv put golden-armada/anthropic api_key="sk-ant-..."

# GitHub
vault kv get golden-armada/github
vault kv put golden-armada/github token="ghp_..."

# Atlassian
vault kv get golden-armada/atlassian
vault kv put golden-armada/atlassian \
  email="user@thelobbi.com" \
  api_token="..."

# n8n
vault kv get golden-armada/n8n
vault kv put golden-armada/n8n \
  encryption_key="..." \
  api_key="..."

# PostgreSQL
vault kv get golden-armada/postgres
vault kv put golden-armada/postgres \
  armada_password="..." \
  n8n_password="..."
```

---

## 📞 Support Contacts

- **Slack:** `#golden-armada-dev`
- **Email:** devops@thelobbi.com
- **GitHub Issues:** `the-lobbi/ui-golden-armada`
- **Documentation:** https://docs.thelobbi.com/golden-armada

---

## 🎓 Training Resources

- **Architecture:** `n8n-agentic-devops-architecture.md`
- **Implementation:** `n8n-quick-start-implementation.md`
- **Diagrams:** `WORKFLOW_DIAGRAMS.md`
- **Executive Summary:** `EXECUTIVE_SUMMARY.md`

---

*Keep this reference card handy for day-to-day operations!*
