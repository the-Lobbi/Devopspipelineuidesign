# DevOps Pipeline UI Design

**A comprehensive React-based web application for DevOps pipeline management, monitoring, and agent orchestration.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

> **Original Design**: [Figma - DevOps Pipeline UI Design](https://www.figma.com/design/F4bjLgYllxrlBcnh3CIlvU/DevOps-Pipeline-UI-Design)

---

## 🎯 Overview

DevOps Pipeline UI Design provides a robust visual interface for managing CI/CD workflows, AI agents, and DevOps operations. Built with modern frontend technologies, it delivers an intuitive platform for orchestrating complex development pipelines.

### Core Capabilities

- **Pipeline Visualization**: Visual workflow design and real-time execution monitoring
- **Agent Management**: Create, configure, and orchestrate AI agents with drag-and-drop interface
- **Epic Tracking**: Comprehensive epic and task management with Kanban boards
- **Pull Request Reviews**: Integrated PR review with side-by-side diff viewing
- **Real-time Updates**: WebSocket-based live status updates and notifications
- **Integration Wizards**: Guided setup for GitHub, Jira, and third-party services

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Prerequisites

- **Node.js** 20+
- **npm** or **pnpm**
- Modern browser with ES2020 support

---

## 🛠 Technology Stack

### Core Framework

- **React 18.3**: Modern React with concurrent features
- **Vite 6.3**: Fast build tool and development server
- **TypeScript**: Type-safe development

### UI Components & Styling

- **Radix UI**: Comprehensive accessible component library (25+ components)
- **Tailwind CSS**: Utility-first styling via class-variance-authority
- **Lucide React**: Icon system (487+ icons)
- **Motion** (Framer Motion): Advanced animation library
- **Recharts**: Data visualization and charting

### State Management & Data

- **Zustand**: Lightweight state management
- **React Hook Form + Zod**: Type-safe form handling with schema validation
- **React Query**: Server state caching and synchronization
- **Context Providers**: Feature-specific state isolation

### Advanced Features

- **React DnD**: Drag-and-drop pipeline builder
- **WebSocket Manager**: Resilient real-time communication
- **Sonner**: Beautiful toast notifications
- **Vaul**: Accessible drawer components

---

## 📁 Project Structure

```plaintext
src/
├── app/
│   └── (dashboard)/        # Dashboard layout group
│       ├── epics/          # Epic management pages
│       ├── prs/            # Pull request review pages
│       └── settings/       # Settings pages (agents, integrations, etc.)
├── components/
│   ├── agents/             # Agent management UI
│   ├── dashboard/          # Dashboard widgets and metrics
│   ├── epic-detail/        # Epic detail views
│   ├── epics/              # Epic list and management
│   ├── pr/                 # Pull request review components
│   ├── wizards/            # Step-by-step setup wizards
│   ├── layout/             # App shell, header, sidebar
│   ├── modals/             # Modal dialogs
│   ├── notifications/      # Notification system
│   ├── settings/           # Settings components
│   ├── skeletons/          # Loading states
│   ├── tools/              # Tool builder and registry
│   ├── ui/                 # Shared UI component library
│   └── views/              # Top-level view components
├── lib/
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── queries/            # Data fetching queries
│   ├── websocket/          # WebSocket connection management
│   ├── store.ts            # Zustand global state store
│   ├── theme.ts            # Theme configuration
│   ├── types.ts            # TypeScript type definitions
│   └── utils.ts            # Utility functions
└── styles/
    └── globals.css         # Global styles and Tailwind config
```

---

## 🧩 Component Architecture

### Page Routes

| Route | Purpose |
|-------|---------|
| `/` | Dashboard with metrics and activity feed |
| `/epics` | Epic management and tracking |
| `/prs` | Pull request review interface |
| `/settings/agents` | Agent configuration |
| `/settings/integrations` | Third-party service connections |
| `/settings/notifications` | Notification preferences |
| `/settings/repositories` | Repository management |

### Feature Components

#### Agent Management (`src/components/agents`)

- **AgentBuilderWizard**: Visual agent creation with step-by-step guidance
- **AgentConversation**: Interactive chat interface for agent interaction
- **AgentDetailPanel**: Comprehensive agent configuration and status
- **AgentTerminal**: Command-line interface for direct agent control
- **AgentTree**: Hierarchical visualization of agent relationships
- **NodePalette**: Draggable pipeline building blocks (GitHub, Jira, logic nodes)
- **PipelineMinimap**: Bird's-eye view navigation for complex pipelines
- **PipelineTimeline**: Execution timeline with step-by-step progress
- **Forms**: Specialized configuration forms for different node types

#### Dashboard (`src/components/dashboard`)

- **ActivityFeed**: Real-time stream of system activities and events
- **EpicCard**: Summary cards with status, progress, and quick actions
- **KanbanBoard**: Drag-and-drop task board with swim lanes
- **WorkflowKanban**: Workflow-specific kanban visualization
- **MetricsBar**: Key performance indicators and system metrics
- **SystemStatus**: Health monitoring and status indicators

#### Epic Management (`src/components/epics`)

- **EpicTable**: Sortable, filterable list with advanced search
- **EpicTableRow**: Individual epic row with inline actions
- **FilterBar**: Multi-criteria filtering controls
- **BulkActions**: Batch operations for selected epics
- **epic-detail-drawer**: Slide-out panel with comprehensive details
- **Tabs**: Activity log, assigned agents, and execution plan views

#### Pull Request Review (`src/components/pr`)

- **DiffViewer**: Side-by-side code comparison with syntax highlighting
- **PRDetailCard**: PR summary, metadata, and CI/CD status
- **FeedbackThread**: Threaded comment system with reactions
- **ChangeRequestQueue**: Pending code review requests

#### Wizards (`src/components/wizards`)

- **AgentCreationWizard**: Multi-step agent setup with validation
- **IntegrationWizard**: Guided third-party service connection
- **OrchestrationWizard**: Complex multi-agent workflow designer
- **PipelineWizard**: CI/CD pipeline configuration builder
- **WorkflowWizard**: Custom workflow creation tool

### UI Component Library (`src/components/ui`)

#### Custom Components

- **empty-state**: Friendly empty states with call-to-action
- **filter-chip**: Removable filter tags
- **glass-card**: Glassmorphism card design
- **global-console**: System-wide console output
- **loading-spinner**: Consistent loading indicators
- **page-transition**: Smooth page transitions
- **progress-bar**: Determinate progress visualization
- **stat-card**: Metric display cards
- **status-badge**: Color-coded status indicators
- **workflow-stepper**: Multi-step workflow progress

#### Radix UI Components (25+)

Accordion • Alert • Alert Dialog • Avatar • Badge • Breadcrumb • Button • Calendar • Card • Carousel • Chart • Checkbox • Collapsible • Command • Context Menu • Dialog • Drawer • Dropdown Menu • Form • Hover Card • Input • Label • Menubar • Navigation Menu • OTP Input • Pagination • Popover • Progress • Radio Group • Resizable • Scroll Area • Select • Separator • Sheet • Sidebar • Slider • Switch • Table • Tabs • Textarea • Toggle • Tooltip

### Context Providers (`src/lib/context`)

| Provider | Responsibility |
|----------|---------------|
| `activity-provider` | Activity feed state and real-time updates |
| `agents-provider` | Agent lifecycle and configuration management |
| `epics-provider` | Epic data, mutations, and cache invalidation |
| `notifications-provider` | Toast notifications and system alerts |
| `socket-provider` | WebSocket connection and event handling |

### Utilities (`src/lib`)

- **hooks**: Custom React hooks for keyboard shortcuts, WebSocket connections
- **queries**: React Query integration for server state management
- **store**: Zustand global state store for client-side state
- **theme**: Theme configuration and dark mode utilities
- **types**: Comprehensive TypeScript type definitions
- **utils**: Helper functions for common operations
- **websocket/manager**: WebSocket connection lifecycle management

---

## 🏗 Architecture Patterns

### Component Organization

- **Feature-based structure**: Components grouped by domain for better maintainability
- **Atomic design principles**: UI components organized from atoms to organisms
- **Context-based state**: Feature-specific providers for isolated, testable state
- **Custom hooks**: Reusable logic extraction for cross-component functionality

### Data Flow

1. **Context Providers**: Top-level state management for feature domains
2. **React Query**: Server state caching, synchronization, and optimistic updates
3. **Zustand Store**: Global client state for cross-cutting concerns
4. **WebSocket**: Real-time bidirectional communication with automatic reconnection

### Type Safety

- **Strict TypeScript**: Enforced type checking throughout the codebase
- **Zod schemas**: Runtime validation with compile-time type inference
- **Type-safe forms**: React Hook Form integration with full TypeScript support
- **Generated types**: Automated type generation from data models

---

## 🔌 Integration Points

### Supported Integrations

- **GitHub**: Repository management, PR reviews, issue tracking, webhooks
- **Jira**: Epic and task synchronization, status updates, sprint planning
- **WebSocket**: Real-time event streaming for live updates
- **Custom Agents**: Extensible agent framework with plugin architecture

### Wizard-Guided Setup

All integrations feature intuitive step-by-step configuration:

- ✅ Secure credential management
- ✅ Granular permission scoping
- ✅ Automated webhook configuration
- ✅ Connection testing and validation

---

## ⚡ Performance Optimizations

- **Code splitting**: Route-based lazy loading for faster initial load
- **Skeleton screens**: Improved perceived performance during data fetching
- **Virtualized lists**: Efficient rendering of large datasets (1000+ items)
- **Optimistic updates**: Immediate UI feedback before server confirmation
- **WebSocket reconnection**: Resilient real-time connections with exponential backoff
- **Memoization**: Strategic use of `useMemo` and `useCallback` for expensive operations

---

## ♿ Accessibility Features

- **Radix UI primitives**: WCAG 2.1 AA compliant by default
- **Keyboard navigation**: Full application control without mouse
- **ARIA attributes**: Comprehensive semantic markup for screen readers
- **Focus management**: Logical focus flow and trap in modals
- **Screen reader support**: Descriptive labels, roles, and live regions
- **Color contrast**: Meets accessibility standards in all themes

---

## 📖 Documentation

- **Component Documentation**: Inline JSDoc comments and TypeScript types
- **Architecture Decisions**: Documented in `.claude/` directory
- **Integration Guides**: Step-by-step setup instructions for each integration
- **Obsidian Vault**: Comprehensive documentation synchronized to [Obsidian vault](C:\Users\MarkusAhling\obsidian\Repositories\the-Lobbi\Devopspipelineuidesign.md)

---

## 🤝 Contributing

This project follows the Golden Armada development patterns:

1. Feature branches from `main`
2. Comprehensive testing before merge
3. Documentation updates required
4. Code review by at least one team member

---

## 📝 License

Proprietary - the-Lobbi Organization

---

## 🔗 Related Projects

- [lib-shared-pipeline](https://github.com/the-Lobbi/lib-shared-pipeline) - Shared pipeline utilities
- [Golden Armada](https://github.com/the-Lobbi/golden-armada) - AI Agent orchestration platform

---

**Last Updated**: 2025-11-29
**Maintained By**: the-Lobbi team
**Repository**: [github.com/the-Lobbi/Devopspipelineuidesign](https://github.com/the-Lobbi/Devopspipelineuidesign)
