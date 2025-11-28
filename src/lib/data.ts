
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
    key: "GA-33",
    title: "Phase Alpha: Foundation - Repository and Project Setup",
    description: "Establish the foundational repository structure and development environment for the Golden Armada Open WebUI-style interface.",
    status: "PLANNING",
    tags: ["foundation", "setup", "docker"],
    timeElapsed: "2 days",
    progress: 15,
    step: "1/4",
    agent: "Planner Agent",
    agentIcon: Bot,
    repo: "golden-armada",
    branch: "phase/alpha",
    created: "Nov 27, 2025",
    assignee: "@markus"
  },
  {
    id: "GA-34",
    key: "GA-34",
    title: "Phase Beta: Backend Core - Database, State Machine, and APIs",
    description: "Implement the core backend infrastructure including database models, state machine, API routes, WebSocket support, and Vault integration.",
    status: "PLANNING",
    tags: ["backend", "fastapi", "db"],
    timeElapsed: "1 day",
    progress: 0,
    step: "0/5",
    agent: "Code Generator",
    agentIcon: Terminal,
    repo: "golden-armada",
    branch: "phase/beta",
    created: "Nov 27, 2025",
    assignee: "@markus"
  },
  {
    id: "GA-35",
    key: "GA-35",
    title: "Phase Gamma: Integrations - Jira, GitHub, Confluence Pipelines",
    description: "Build integration clients and pipelines for Jira, GitHub, and Confluence with webhook handlers and agent factory.",
    status: "PLANNING",
    tags: ["integrations", "jira", "github"],
    timeElapsed: "Pending",
    progress: 0,
    step: "0/5",
    agent: "Planner Agent",
    agentIcon: Bot,
    repo: "golden-armada",
    branch: "phase/gamma",
    created: "Nov 27, 2025",
    assignee: "@markus"
  },
  {
    id: "GA-36",
    key: "GA-36",
    title: "Phase Delta: Frontend Shell - Layout, Theme, and Navigation",
    description: "Create the Open WebUI-style frontend shell with responsive layout, theme system, sidebar navigation, and chat interface base.",
    status: "PLANNING",
    tags: ["frontend", "sveltekit", "ui"],
    timeElapsed: "Pending",
    progress: 0,
    step: "0/4",
    agent: "Planner Agent",
    agentIcon: Bot,
    repo: "golden-armada",
    branch: "phase/delta",
    created: "Nov 27, 2025",
    assignee: "@markus"
  },
  {
    id: "GA-37",
    key: "GA-37",
    title: "Phase Epsilon: DevOps UI - Dashboard, Agents, and Workflow",
    description: "Build the DevOps-specific UI components including Kanban dashboard, agent tree visualization, workflow progress indicator, and settings panel.",
    status: "PLANNING",
    tags: ["frontend", "dashboard", "components"],
    timeElapsed: "Pending",
    progress: 0,
    step: "0/4",
    agent: "Planner Agent",
    agentIcon: Bot,
    repo: "golden-armada",
    branch: "phase/epsilon",
    created: "Nov 27, 2025",
    assignee: "@markus"
  },
  {
    id: "GA-38",
    key: "GA-38",
    title: "Phase Zeta: Polish - Tests, Metrics, and Deployment",
    description: "Add production-ready polish including integration tests, Prometheus metrics, and Helm charts for Kubernetes deployment.",
    status: "PLANNING",
    tags: ["devops", "testing", "k8s"],
    timeElapsed: "Pending",
    progress: 0,
    step: "0/3",
    agent: "Planner Agent",
    agentIcon: Bot,
    repo: "golden-armada",
    branch: "phase/zeta",
    created: "Nov 27, 2025",
    assignee: "@markus"
  }
];

export const ACTIVITY_LOG = [
  {
    id: 1,
    time: "2 min ago",
    agentName: "Planner Agent",
    action: "Created execution plan for Phase Alpha",
    context: "GA-33 › Foundation",
    type: "system"
  },
  {
    id: 2,
    time: "15 min ago",
    agentName: "System",
    action: "Imported 16 issues from Jira",
    context: "Project: Golden-Armada",
    type: "system"
  },
  {
    id: 3,
    time: "1 hour ago",
    agentName: "Markus",
    action: "Created Epic: Open WebUI Style Agentic DevOps Interface",
    context: "GA-32",
    type: "human"
  }
];
