
import { 
  LayoutDashboard, 
  Layers, 
  Bot, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  GitPullRequest, 
  FileText, 
  Terminal, 
  Shield, 
  Activity,
  Database,
  Server,
  Globe,
  Smartphone,
  Mail
} from 'lucide-react';

export const METRICS = [
  { label: "Active Phases", value: "6", trend: "▲ 2 this week", status: "neutral" },
  { label: "Pending Tasks", value: "9", trend: "⚠ 4 high priority", status: "warning" },
  { label: "Completed", value: "0", trend: "—", status: "neutral" },
  { label: "Success Rate", value: "100%", trend: "Stable", status: "success" },
];

export const EPICS = [
  {
    id: "GA-33",
    jiraKey: "GA-33",
    summary: "Phase Alpha: Foundation - Repository and Project Setup",
    description: "Establish the foundational repository structure and development environment for the Golden Armada Open WebUI-style interface.",
    status: "planning",
    labels: ["foundation", "setup", "docker"],
    currentStep: 1,
    totalSteps: 4,
    progress: 15,
    targetRepo: "golden-armada",
    featureBranch: "phase/alpha",
    createdAt: "2025-11-27T00:00:00Z",
    updatedAt: "2025-11-27T00:00:00Z",
    assignee: "@markus"
  },
  {
    id: "GA-34",
    jiraKey: "GA-34",
    summary: "Phase Beta: Backend Core - Database, State Machine, and APIs",
    description: "Implement the core backend infrastructure including database models, state machine, API routes, WebSocket support, and Vault integration.",
    status: "planning",
    labels: ["backend", "fastapi", "db"],
    currentStep: 0,
    totalSteps: 5,
    progress: 0,
    targetRepo: "golden-armada",
    featureBranch: "phase/beta",
    createdAt: "2025-11-27T00:00:00Z",
    updatedAt: "2025-11-27T00:00:00Z",
    assignee: "@markus"
  },
  {
    id: "GA-35",
    jiraKey: "GA-35",
    summary: "Phase Gamma: Integrations - Jira, GitHub, Confluence Pipelines",
    description: "Build integration clients and pipelines for Jira, GitHub, and Confluence with webhook handlers and agent factory.",
    status: "planning",
    labels: ["integrations", "jira", "github"],
    currentStep: 0,
    totalSteps: 5,
    progress: 0,
    targetRepo: "golden-armada",
    featureBranch: "phase/gamma",
    createdAt: "2025-11-27T00:00:00Z",
    updatedAt: "2025-11-27T00:00:00Z",
    assignee: "@markus"
  },
  {
    id: "GA-36",
    jiraKey: "GA-36",
    summary: "Phase Delta: Frontend Shell - Layout, Theme, and Navigation",
    description: "Create the Open WebUI-style frontend shell with responsive layout, theme system, sidebar navigation, and chat interface base.",
    status: "planning",
    labels: ["frontend", "sveltekit", "ui"],
    currentStep: 0,
    totalSteps: 4,
    progress: 0,
    targetRepo: "golden-armada",
    featureBranch: "phase/delta",
    createdAt: "2025-11-27T00:00:00Z",
    updatedAt: "2025-11-27T00:00:00Z",
    assignee: "@markus"
  },
  {
    id: "GA-37",
    jiraKey: "GA-37",
    summary: "Phase Epsilon: DevOps UI - Dashboard, Agents, and Workflow",
    description: "Build the DevOps-specific UI components including Kanban dashboard, agent tree visualization, workflow progress indicator, and settings panel.",
    status: "planning",
    labels: ["frontend", "dashboard", "components"],
    currentStep: 0,
    totalSteps: 4,
    progress: 0,
    targetRepo: "golden-armada",
    featureBranch: "phase/epsilon",
    createdAt: "2025-11-27T00:00:00Z",
    updatedAt: "2025-11-27T00:00:00Z",
    assignee: "@markus"
  },
  {
    id: "GA-38",
    jiraKey: "GA-38",
    summary: "Phase Zeta: Polish - Tests, Metrics, and Deployment",
    description: "Add production-ready polish including integration tests, Prometheus metrics, and Helm charts for Kubernetes deployment.",
    status: "planning",
    labels: ["devops", "testing", "k8s"],
    currentStep: 0,
    totalSteps: 3,
    progress: 0,
    targetRepo: "golden-armada",
    featureBranch: "phase/zeta",
    createdAt: "2025-11-27T00:00:00Z",
    updatedAt: "2025-11-27T00:00:00Z",
    assignee: "@markus"
  }
];

export const ACTIVITY_LOG = [
  {
    id: 1,
    timestamp: "2 min ago",
    agentName: "Planner Agent",
    description: "Created execution plan for Phase Alpha",
    context: "GA-33 › Foundation",
    type: "system"
  },
  {
    id: 2,
    timestamp: "15 min ago",
    agentName: "System",
    description: "Imported 16 issues from Jira",
    context: "Project: Golden-Armada",
    type: "system"
  },
  {
    id: 3,
    timestamp: "1 hour ago",
    agentName: "Markus",
    description: "Created Epic: Open WebUI Style Agentic DevOps Interface",
    context: "GA-32",
    type: "human"
  }
];
