import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { IntegrationCard } from '../settings/IntegrationCard';
import { 
  Settings as SettingsIcon,
  Globe,
  HardDrive,
  Search,
  Database,
  GitBranch,
  Bot,
  Bell,
  Shield,
  Key,
  Jira,
  Github,
  FileText,
  Server
} from 'lucide-react@0.469.0?deps=react@18.3.1,react-dom@18.3.1&external=react,react-dom';
import { toast } from 'sonner@2.0.3?deps=react@18.3.1,react-dom@18.3.1&external=react,react-dom';

export function SettingsView() {
  const [activeSection, setActiveSection] = useState('general');

  const menuItems = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'repositories', label: 'Repositories', icon: GitBranch },
    { id: 'agents', label: 'Agents', icon: Bot },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="flex h-full bg-[#09090b]">
      {/* Settings Sidebar */}
      <div className="w-64 flex-shrink-0 overflow-y-auto py-6 pl-6 pr-2 border-r border-zinc-800/50">
        <h2 className="text-lg font-semibold text-zinc-100 px-3 mb-4">Settings</h2>
        <nav className="space-y-0.5">
            {menuItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                        activeSection === item.id 
                            ? "bg-zinc-800 text-zinc-100 font-medium" 
                            : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                    )}
                >
                    <item.icon className="size-4" />
                    {item.label}
                </button>
            ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-8 max-w-5xl">
        {activeSection === 'general' && <GeneralSettings />}
        {activeSection === 'integrations' && <IntegrationsSettings />}
        {activeSection === 'repositories' && <RepositoriesSettings />}
        {activeSection === 'agents' && <AgentsSettings />}
        {activeSection === 'notifications' && <NotificationsSettings />}
        {activeSection === 'security' && <SecuritySettings />}
      </div>
    </div>
  );
}

function GeneralSettings() {
    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-6">General Configuration</h3>
                
                <div className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-200">Default Jira Project</label>
                            <Input className="bg-zinc-900 border-zinc-800" defaultValue="GA (Golden Armada)" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-200">Max Parallel Epics</label>
                            <Input className="bg-zinc-900 border-zinc-800" type="number" defaultValue="5" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-200">Agent Timeout (minutes)</label>
                        <Input className="bg-zinc-900 border-zinc-800" type="number" defaultValue="30" />
                        <p className="text-xs text-zinc-500">Maximum time an agent can run before automatic termination</p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-zinc-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-zinc-200">Auto-trigger workflows</div>
                                <div className="text-sm text-zinc-500">Start processing when 'agentic-ready' label is added</div>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-zinc-200">Generate Documentation</div>
                                <div className="text-sm text-zinc-500">Automatically create Confluence pages on completion</div>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-zinc-200">Manual PR Approval</div>
                                <div className="text-sm text-zinc-500">Require human approval before merging PRs</div>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-zinc-800">
                <Button 
                    className="bg-zinc-100 text-zinc-950 hover:bg-white rounded-full px-6"
                    onClick={() => toast.success("Settings saved successfully")}
                >
                    Save Changes
                </Button>
            </div>
        </div>
    );
}

function IntegrationsSettings() {
    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-2">Integrations</h3>
                <p className="text-zinc-500 mb-6">Manage connections to external services and tools.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <IntegrationCard 
                        name="Jira Software" 
                        icon={FileText}
                        status="connected" 
                        description="Sync epics, stories, and status updates bi-directionally."
                        meta="https://brooksidebi.atlassian.net"
                    />
                    <IntegrationCard 
                        name="GitHub" 
                        icon={GitBranch}
                        status="connected" 
                        description="Source code management, PR creation, and checks."
                        meta="Organization: golden-armada"
                    />
                    <IntegrationCard 
                        name="Confluence" 
                        icon={Globe}
                        status="disconnected" 
                        description="Publish documentation and architectural decisions."
                    />
                    <IntegrationCard 
                        name="HashiCorp Vault" 
                        icon={Key}
                        status="error" 
                        description="Secure secret management for API keys and creds."
                    />
                </div>
            </div>
        </div>
    );
}

function RepositoriesSettings() {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-zinc-100">Repositories</h3>
                    <p className="text-zinc-500">Configure which repositories agents can access.</p>
                </div>
                <Button 
                    variant="outline" 
                    className="border-zinc-700 text-zinc-300 hover:text-white"
                    onClick={() => toast("Repository wizard", { description: "Repository connection flow is currently disabled." })}
                >
                    Add Repository
                </Button>
            </div>

            <div className="border border-zinc-800 rounded-xl overflow-hidden">
                {[
                    { name: 'ui-golden-armada', branch: 'main', type: 'Frontend' },
                    { name: 'api-gateway', branch: 'develop', type: 'Backend' },
                    { name: 'infra-core', branch: 'main', type: 'DevOps' }
                ].map((repo, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[#121214] border-b border-zinc-800 last:border-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400 border border-zinc-800">
                                <GitBranch className="size-4" />
                            </div>
                            <div>
                                <div className="font-medium text-zinc-200">{repo.name}</div>
                                <div className="text-xs text-zinc-500 flex items-center gap-2">
                                    <span>{repo.branch}</span>
                                    <span className="text-zinc-700">•</span>
                                    <span>{repo.type}</span>
                                </div>
                            </div>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-zinc-500 hover:text-zinc-300"
                            onClick={() => toast.info(`Configuring ${repo.name}`)}
                        >
                            Configure
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AgentsSettings() {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-2">Agent Configuration</h3>
                <p className="text-zinc-500 mb-6">Tune the behavior and models for each specialist agent.</p>
                
                <div className="space-y-4">
                    {[
                        { name: 'Orchestrator', model: 'Claude 3.5 Sonnet', role: 'Planning & Delegation' },
                        { name: 'Code Generator', model: 'Claude 3.5 Sonnet', role: 'Implementation' },
                        { name: 'Reviewer', model: 'Claude 3 Opus', role: 'Quality Assurance' }
                    ].map((agent, i) => (
                        <div key={i} className="p-4 border border-zinc-800 rounded-xl bg-[#121214]">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20">
                                        <Bot className="size-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-zinc-200">{agent.name}</div>
                                        <div className="text-xs text-zinc-500">{agent.role}</div>
                                    </div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-400">Model</label>
                                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1.5 text-sm text-zinc-300">
                                        <option>{agent.model}</option>
                                        <option>GPT-4o</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-400">Max Tokens</label>
                                    <Input className="h-9 bg-zinc-900 border-zinc-800" defaultValue="4096" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function NotificationsSettings() {
    return (
        <div className="space-y-8 animate-in fade-in duration-300">
             <div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-6">Notifications</h3>
                
                <div className="space-y-6 max-w-2xl">
                    <div className="space-y-4 border-b border-zinc-800 pb-6">
                        <h4 className="text-sm font-medium text-zinc-100">Events</h4>
                        {[
                            { label: "Workflow Started", desc: "Notify when a new workflow is triggered" },
                            { label: "Workflow Completed", desc: "Notify when a workflow finishes successfully" },
                            { label: "Agent Errors", desc: "Notify when an agent encounters an error" },
                            { label: "Pending Approvals", desc: "Notify when manual intervention is required" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-zinc-300">{item.label}</div>
                                    <div className="text-xs text-zinc-500">{item.desc}</div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                         <h4 className="text-sm font-medium text-zinc-100">Channels</h4>
                         <div className="grid grid-cols-2 gap-4">
                             <div className="p-4 border border-zinc-800 rounded-xl bg-[#121214] flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                     <div className="size-8 rounded-lg bg-[#4A154B] flex items-center justify-center text-white">
                                         <span className="font-bold text-xs">#</span>
                                     </div>
                                     <div>
                                         <div className="text-sm font-medium text-zinc-200">Slack</div>
                                         <div className="text-xs text-zinc-500">#devops-alerts</div>
                                     </div>
                                 </div>
                                 <Switch defaultChecked />
                             </div>
                             <div className="p-4 border border-zinc-800 rounded-xl bg-[#121214] flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                     <div className="size-8 rounded-lg bg-[#5865F2] flex items-center justify-center text-white">
                                         <span className="font-bold text-xs">D</span>
                                     </div>
                                     <div>
                                         <div className="text-sm font-medium text-zinc-200">Discord</div>
                                         <div className="text-xs text-zinc-500">Connected</div>
                                     </div>
                                 </div>
                                 <Switch />
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SecuritySettings() {
    return (
        <div className="space-y-8 animate-in fade-in duration-300">
             <div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-6">Security</h3>
                
                <div className="space-y-6 max-w-2xl">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-200">API Key Rotation</label>
                        <div className="p-4 border border-zinc-800 rounded-xl bg-[#121214]">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="text-sm font-medium text-zinc-200">OpenAI API Key</div>
                                    <div className="text-xs text-zinc-500">Last rotated: 30 days ago</div>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                    onClick={() => toast.success("OpenAI API Key rotated", { description: "New key generated and stored in Vault." })}
                                >
                                    Rotate Key
                                </Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-zinc-200">Anthropic API Key</div>
                                    <div className="text-xs text-zinc-500">Last rotated: 12 days ago</div>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                    onClick={() => toast.success("Anthropic API Key rotated", { description: "New key generated and stored in Vault." })}
                                >
                                    Rotate Key
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 border-t border-zinc-800 pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-zinc-200">Audit Logs</div>
                                <div className="text-sm text-zinc-500">Log all agent actions to external audit service</div>
                            </div>
                            <Switch defaultChecked />
                        </div>
                         <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-zinc-200">Human-in-the-loop</div>
                                <div className="text-sm text-zinc-500">Require approval for any code modification actions</div>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
