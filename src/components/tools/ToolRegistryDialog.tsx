import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Search, Wrench, Download, Check, Terminal, Globe, Database, Shield, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { ToolBuilderWizard } from './ToolBuilderWizard';

interface Tool {
    id: string;
    name: string;
    description: string;
    category: 'system' | 'network' | 'database' | 'security' | 'devops';
    version: string;
    installed: boolean;
    author: string;
}

const MOCK_TOOLS: Tool[] = [
    { id: 'git-suite', name: 'Git Suite', description: 'Essential Git commands: checkout, branch, commit, push', category: 'devops', version: '2.4.0', installed: true, author: 'Golden Armada' },
    { id: 'jira-api', name: 'Jira Connector', description: 'Create and update issues, transition workflow states', category: 'devops', version: '1.2.1', installed: true, author: 'Atlassian' },
    { id: 'postgres-client', name: 'Postgres Client', description: 'Execute safe SQL queries against registered databases', category: 'database', version: '0.9.5', installed: false, author: 'Golden Armada' },
    { id: 'slack-bot', name: 'Slack Notifier', description: 'Send rich text messages to configured channels', category: 'network', version: '3.0.0', installed: false, author: 'Slack' },
    { id: 'docker-ops', name: 'Docker Ops', description: 'Build, tag, and push images to registry', category: 'devops', version: '1.1.0', installed: false, author: 'Docker Inc.' },
    { id: 'snyk-scan', name: 'Snyk Security', description: 'Scan dependencies for vulnerabilities', category: 'security', version: '1.5.2', installed: false, author: 'Snyk' },
    { id: 'k8s-ctrl', name: 'Kubernetes Control', description: 'Apply manifests and check pod status', category: 'devops', version: '1.8.0', installed: false, author: 'CNCF' },
    { id: 'fs-access', name: 'FileSystem Access', description: 'Read/Write access to local workspace files', category: 'system', version: '1.0.0', installed: true, author: 'System' },
];

interface ToolRegistryDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ToolRegistryDialog({ isOpen, onClose }: ToolRegistryDialogProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [tools, setTools] = useState<Tool[]>(MOCK_TOOLS);
    const [showWizard, setShowWizard] = useState(false);

    const handleInstall = (toolId: string) => {
        setTools(prev => prev.map(t => t.id === toolId ? { ...t, installed: true } : t));
        toast.success("Tool Installed", {
            description: "Agent capabilities updated successfully."
        });
    };

    const handleUninstall = (toolId: string) => {
        setTools(prev => prev.map(t => t.id === toolId ? { ...t, installed: false } : t));
        toast.info("Tool Removed");
    };

    const handleCreateTool = (toolData: any) => {
        const newTool: Tool = {
            id: toolData.id || `custom-${Date.now()}`,
            name: toolData.name,
            description: toolData.description,
            category: toolData.category,
            version: toolData.version,
            installed: true,
            author: 'Me (Local)'
        };
        setTools(prev => [...prev, newTool]);
    };

    const filteredTools = tools.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const getCategoryIcon = (cat: Tool['category']) => {
        switch (cat) {
            case 'devops': return <Terminal className="size-3" />;
            case 'database': return <Database className="size-3" />;
            case 'network': return <Globe className="size-3" />;
            case 'security': return <Shield className="size-3" />;
            case 'system': return <Wrench className="size-3" />;
            default: return <Terminal className="size-3" />;
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-200 sm:max-w-[800px] h-[600px] p-0 gap-0 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-zinc-800 bg-zinc-900/30 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <DialogTitle className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                                    <Wrench className="size-4 text-amber-400" />
                                    Tool Registry
                                </DialogTitle>
                                <DialogDescription className="text-zinc-500 mt-1">
                                    Browse and install capability packages for your agents.
                                </DialogDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button 
                                    size="sm" 
                                    className="h-8 text-xs bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500 shadow-lg shadow-indigo-500/20"
                                    onClick={() => setShowWizard(true)}
                                >
                                    <Plus className="size-3 mr-1.5" /> Create Tool
                                </Button>
                                <div className="relative w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500" />
                                    <Input 
                                        className="pl-9 bg-zinc-900 border-zinc-800 font-mono text-sm focus:ring-amber-500/20 focus:border-amber-500/50 h-8" 
                                        placeholder="Search tools..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    
                    <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
                        <TabsList className="bg-transparent h-auto p-0 gap-2 w-full justify-start border-b border-transparent">
                            {['all', 'devops', 'database', 'security', 'network', 'system'].map(cat => (
                                <TabsTrigger 
                                    key={cat} 
                                    value={cat} 
                                    className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white px-3 py-1.5 text-xs rounded-md border border-transparent data-[state=active]:border-zinc-700 text-zinc-500 uppercase tracking-wide font-medium transition-all"
                                >
                                    {cat}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {/* Content */}
                <ScrollArea className="flex-1 bg-[#09090b]">
                    <div className="p-6 grid grid-cols-2 gap-4">
                        {filteredTools.map(tool => (
                            <div key={tool.id} className="group relative p-4 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-zinc-700 transition-all">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-zinc-600 transition-colors">
                                            {getCategoryIcon(tool.category)}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-zinc-200">{tool.name}</h4>
                                            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                                                <span>v{tool.version}</span>
                                                <span>•</span>
                                                <span>{tool.author}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {tool.installed ? (
                                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 pointer-events-none">
                                            <Check className="size-3 mr-1" /> INSTALLED
                                        </Badge>
                                    ) : (
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="h-7 text-xs border-zinc-700 hover:bg-zinc-800"
                                            onClick={() => handleInstall(tool.id)}
                                        >
                                            <Download className="size-3 mr-1.5" /> Install
                                        </Button>
                                    )}
                                </div>
                                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                                    {tool.description}
                                </p>
                                
                                {tool.installed && (
                                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-6 px-2 text-[10px] text-zinc-500 hover:text-red-400 hover:bg-red-400/10"
                                            onClick={() => handleUninstall(tool.id)}
                                        >
                                            Uninstall
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>

        <ToolBuilderWizard 
            isOpen={showWizard} 
            onClose={() => setShowWizard(false)} 
            onComplete={handleCreateTool}
        />
    </>
    );
}