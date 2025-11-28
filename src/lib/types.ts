
export type EpicState = 
  | 'open' 
  | 'queued_for_planning' 
  | 'planning' 
  | 'planning_review'
  | 'revising'
  | 'approved'
  | 'assigning'
  | 'executing' 
  | 'pr_created'
  | 'code_review'
  | 'approved_for_merge'
  | 'merging'
  | 'documenting'
  | 'done' 
  | 'failed' 
  | 'cancelled';

export interface Epic {
  id: string;
  jiraKey: string;
  summary: string;
  description: string;
  status: EpicState;
  targetRepo: string;
  featureBranch?: string;
  prUrl?: string;
  prNumber?: number;
  confluencePageUrl?: string;
  labels?: string[];
  currentStep: number;
  totalSteps: number;
  progress: number;
  currentAgent?: string;
  assignee?: string;
  jiraUrl?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export type AgentType = 
  | 'orchestrator'
  | 'planner'
  | 'backend'
  | 'frontend'
  | 'testing'
  | 'documentation'
  | 'security'
  | 'devops';

export interface Agent {
  id: string;
  type: AgentType;
  name: string;
  status: 'idle' | 'running' | 'waiting' | 'complete' | 'failed';
  epicKey?: string;
  currentTask?: string;
  progress: number;
  parentId?: string;
  children?: Agent[];
  tokensUsed?: number;
  duration?: number;
}
