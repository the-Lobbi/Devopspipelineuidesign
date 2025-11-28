
import { CheckCircle, Loader2, Circle, AlertCircle, XCircle } from 'lucide-react';

export const PLAN_DATA = [
  {
    id: 'sprint-alpha',
    title: 'Phase Alpha: Foundation',
    status: 'active',
    stories: [
      {
        id: 'ga-33',
        title: 'GA-33: Phase Alpha - Repository Setup',
        status: 'active',
        points: 8,
        agent: 'Orchestrator',
        tasks: [
          {
            id: 'ga-39',
            title: 'GA-39: 1A: Initialize Directory Structure',
            status: 'pending',
            agent: 'System Agent',
            subtasks: []
          },
          {
            id: 'ga-40',
            title: 'GA-40: 1B: Backend Entry Points (FastAPI)',
            status: 'pending',
            agent: 'Code Generator',
            subtasks: []
          },
          {
            id: 'ga-41',
            title: 'GA-41: 1C: Development Environment (Docker)',
            status: 'pending',
            agent: 'DevOps Agent',
            subtasks: []
          },
          {
            id: 'ga-42',
            title: 'GA-42: 1D: Frontend Setup (SvelteKit)',
            status: 'pending',
            agent: 'Code Generator',
            subtasks: []
          }
        ]
      }
    ]
  },
  {
    id: 'sprint-beta',
    title: 'Phase Beta: Backend Core',
    status: 'pending',
    stories: [
      {
        id: 'ga-34',
        title: 'GA-34: Phase Beta - Backend Infrastructure',
        status: 'pending',
        points: 13,
        agent: 'Orchestrator',
        tasks: [
          {
            id: 'ga-43',
            title: 'GA-43: 2A: Database Schema (SQLAlchemy)',
            status: 'pending',
            agent: 'Code Generator',
            subtasks: []
          },
          {
            id: 'ga-44',
            title: 'GA-44: 2B: State Machine (Epic Lifecycle)',
            status: 'pending',
            agent: 'Code Generator',
            subtasks: []
          },
          {
            id: 'ga-45',
            title: 'GA-45: 2C: API Router (DevOps Endpoints)',
            status: 'pending',
            agent: 'Code Generator',
            subtasks: []
          },
          {
            id: 'ga-46',
            title: 'GA-46: 2D: WebSocket Infrastructure',
            status: 'pending',
            agent: 'Code Generator',
            subtasks: []
          },
          {
            id: 'ga-47',
            title: 'GA-47: 2E: Vault Integration',
            status: 'pending',
            agent: 'Security Agent',
            subtasks: []
          }
        ]
      }
    ]
  }
];

export const AGENT_TREE = {
  id: 'root',
  name: 'Orchestrator',
  model: 'claude-opus-4',
  status: 'running',
  activity: 'Planning Phase Alpha execution',
  children: [
    {
      id: 'agent-1',
      name: 'Planner Agent',
      model: 'claude-sonnet-4',
      status: 'running',
      activity: 'Analyzing dependency graph for GA-33',
      children: []
    },
    {
      id: 'agent-2',
      name: 'Code Generator',
      model: 'claude-sonnet-4',
      status: 'idle',
      activity: 'Waiting for plan approval',
      children: []
    },
    {
      id: 'agent-3',
      name: 'DevOps Agent',
      model: 'claude-sonnet-4',
      status: 'idle',
      activity: 'Docker environment check queued',
      children: []
    }
  ]
};
