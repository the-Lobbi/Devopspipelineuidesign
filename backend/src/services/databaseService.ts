import { Pool } from 'pg';
import logger from '../utils/logger';

export class DatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('error', (err) => {
      logger.error('Unexpected database error', { error: err });
    });
  }

  async query(text: string, params?: any[]) {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      logger.debug('Database query executed', { text, duration, rows: result.rowCount });
      return result;
    } catch (error) {
      logger.error('Database query error', { error, text });
      throw error;
    }
  }

  // Epics
  async getEpics(options: {
    status?: string;
    assignee?: string;
    limit: number;
    offset: number;
  }) {
    let query = `
      SELECT * FROM epics
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (options.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(options.status);
      paramIndex++;
    }

    if (options.assignee) {
      query += ` AND assignee = $${paramIndex}`;
      params.push(options.assignee);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(options.limit, options.offset);

    const result = await this.query(query, params);
    return result.rows;
  }

  async getEpic(key: string) {
    const result = await this.query(
      'SELECT * FROM epics WHERE jira_key = $1',
      [key]
    );
    return result.rows[0];
  }

  async createEpic(data: any) {
    const result = await this.query(
      `INSERT INTO epics (jira_key, summary, description, status, assignee, labels, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [data.jiraKey, data.summary, data.description, data.status, data.assignee, data.labels]
    );
    return result.rows[0];
  }

  async updateEpic(key: string, updates: any) {
    const fields = [];
    const params = [];
    let paramIndex = 1;

    Object.entries(updates).forEach(([field, value]) => {
      fields.push(`${field} = $${paramIndex}`);
      params.push(value);
      paramIndex++;
    });

    fields.push('updated_at = NOW()');
    params.push(key);

    const result = await this.query(
      `UPDATE epics SET ${fields.join(', ')} WHERE jira_key = $${paramIndex} RETURNING *`,
      params
    );
    return result.rows[0];
  }

  async getEpicActivities(key: string) {
    const result = await this.query(
      `SELECT * FROM epic_activities WHERE epic_key = $1 ORDER BY created_at DESC`,
      [key]
    );
    return result.rows;
  }

  // Agents
  async getAgents() {
    const result = await this.query('SELECT * FROM agents ORDER BY created_at DESC');
    return result.rows;
  }

  async getAgent(id: string) {
    const result = await this.query('SELECT * FROM agents WHERE id = $1', [id]);
    return result.rows[0];
  }

  async createAgent(data: any) {
    const result = await this.query(
      `INSERT INTO agents (name, type, model, configuration, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [data.name, data.type, data.model, JSON.stringify(data.configuration), data.status || 'active']
    );
    return result.rows[0];
  }

  async updateAgent(id: string, updates: any) {
    const fields = [];
    const params = [];
    let paramIndex = 1;

    Object.entries(updates).forEach(([field, value]) => {
      if (field === 'configuration') {
        fields.push(`${field} = $${paramIndex}`);
        params.push(JSON.stringify(value));
      } else {
        fields.push(`${field} = $${paramIndex}`);
        params.push(value);
      }
      paramIndex++;
    });

    fields.push('updated_at = NOW()');
    params.push(id);

    const result = await this.query(
      `UPDATE agents SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      params
    );
    return result.rows[0];
  }

  async deleteAgent(id: string) {
    await this.query('DELETE FROM agents WHERE id = $1', [id]);
  }

  async getAgentConversations(agentId: string) {
    const result = await this.query(
      `SELECT * FROM agent_conversations WHERE agent_id = $1 ORDER BY created_at DESC`,
      [agentId]
    );
    return result.rows;
  }

  // Workflows
  async createWorkflow(data: any) {
    const result = await this.query(
      `INSERT INTO workflows (n8n_workflow_id, jira_epic_key, status, started_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [data.n8nWorkflowId, data.epicKey, data.status]
    );
    return result.rows[0];
  }

  async updateWorkflow(id: string, updates: any) {
    const fields = [];
    const params = [];
    let paramIndex = 1;

    Object.entries(updates).forEach(([field, value]) => {
      fields.push(`${field} = $${paramIndex}`);
      params.push(value);
      paramIndex++;
    });

    params.push(id);

    const result = await this.query(
      `UPDATE workflows SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      params
    );
    return result.rows[0];
  }

  async getWorkflow(id: string) {
    const result = await this.query('SELECT * FROM workflows WHERE id = $1', [id]);
    return result.rows[0];
  }

  async close() {
    await this.pool.end();
  }
}
