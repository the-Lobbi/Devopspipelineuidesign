-- Epics table
CREATE TABLE IF NOT EXISTS epics (
    id SERIAL PRIMARY KEY,
    jira_key VARCHAR(50) UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'open',
    assignee VARCHAR(255),
    labels TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Epic activities table
CREATE TABLE IF NOT EXISTS epic_activities (
    id SERIAL PRIMARY KEY,
    epic_key VARCHAR(50) NOT NULL REFERENCES epics(jira_key) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    description TEXT,
    user_name VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    model VARCHAR(100),
    configuration JSONB,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Agent conversations table
CREATE TABLE IF NOT EXISTS agent_conversations (
    id SERIAL PRIMARY KEY,
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Workflows table
CREATE TABLE IF NOT EXISTS workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    n8n_workflow_id VARCHAR(255),
    jira_epic_key VARCHAR(50) REFERENCES epics(jira_key) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'pending',
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Workflow steps table
CREATE TABLE IF NOT EXISTS workflow_steps (
    id SERIAL PRIMARY KEY,
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    step_name VARCHAR(255) NOT NULL,
    step_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Pull requests table
CREATE TABLE IF NOT EXISTS pull_requests (
    id SERIAL PRIMARY KEY,
    github_pr_number INTEGER NOT NULL,
    repository VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    branch_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'open',
    epic_key VARCHAR(50) REFERENCES epics(jira_key) ON DELETE SET NULL,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(repository, github_pr_number)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_epics_status ON epics(status);
CREATE INDEX IF NOT EXISTS idx_epics_created_at ON epics(created_at);
CREATE INDEX IF NOT EXISTS idx_epic_activities_epic_key ON epic_activities(epic_key);
CREATE INDEX IF NOT EXISTS idx_epic_activities_created_at ON epic_activities(created_at);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
CREATE INDEX IF NOT EXISTS idx_agent_conversations_agent_id ON agent_conversations(agent_id);
CREATE INDEX IF NOT EXISTS idx_workflows_status ON workflows(status);
CREATE INDEX IF NOT EXISTS idx_workflows_epic_key ON workflows(jira_epic_key);
CREATE INDEX IF NOT EXISTS idx_workflow_steps_workflow_id ON workflow_steps(workflow_id);
CREATE INDEX IF NOT EXISTS idx_pull_requests_epic_key ON pull_requests(epic_key);
CREATE INDEX IF NOT EXISTS idx_pull_requests_status ON pull_requests(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_epics_updated_at ON epics;
CREATE TRIGGER update_epics_updated_at BEFORE UPDATE ON epics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agents_updated_at ON agents;
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pull_requests_updated_at ON pull_requests;
CREATE TRIGGER update_pull_requests_updated_at BEFORE UPDATE ON pull_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
