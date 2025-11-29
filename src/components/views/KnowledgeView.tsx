import React, { useState } from 'react';
import { Search, Info, FileText, Database, Code, Server, Shield, Upload, X } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Label } from "../ui/label";

// Mock Data
const INITIAL_KNOWLEDGE_ITEMS = [
  { id: 1, title: 'Frontend Architecture Guidelines', type: 'Documentation', tags: ['React', 'Architecture'], updated: '2h ago', icon: FileText, content: "This document outlines the core architectural principles for the frontend application..." },
  { id: 2, title: 'API Gateway Specs', type: 'Schema', tags: ['OpenAPI', 'Backend'], updated: '1d ago', icon: Server, content: "OpenAPI 3.0 specification for the main API Gateway..." },
  { id: 3, title: 'Database Schema: Core', type: 'Schema', tags: ['PostgreSQL', 'Prisma'], updated: '3d ago', icon: Database, content: "ERD and schema definitions for the core PostgreSQL database..." },
  { id: 4, title: 'Authentication Flow', type: 'Documentation', tags: ['Auth0', 'Security'], updated: '1w ago', icon: Shield, content: "Sequence diagrams for the OAuth2 authentication flow..." },
  { id: 5, title: 'Design System Tokens', type: 'Config', tags: ['Tailwind', 'Design'], updated: '2w ago', icon: Code, content: "JSON configuration for design system tokens and theme values..." },
];

export function KnowledgeView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const filteredItems = INITIAL_KNOWLEDGE_ITEMS.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
        setUploading(false);
        setIsUploadOpen(false);
        toast.success("Document uploaded successfully", {
            description: "It is now being indexed by the vector database."
        });
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b]">
      {/* Knowledge Header */}
      <div className="px-8 pt-8 pb-4 border-b border-zinc-800/50">
        <div className="flex items-center gap-6 mb-6 text-sm font-medium">
            <button className="text-zinc-100 border-b-2 border-zinc-100 pb-1">Knowledge Base</button>
            <button className="text-zinc-500 hover:text-zinc-300 transition-colors pb-1">Context Prompts</button>
            <button className="text-zinc-500 hover:text-zinc-300 transition-colors pb-1">Vector Store</button>
        </div>
        
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-zinc-100">Knowledge Base</h1>
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 hover:bg-zinc-700">{filteredItems.length}</Badge>
            </div>
            
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                        <Upload className="size-4 mr-2" />
                        Upload Document
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#121214] border-zinc-800 text-zinc-100">
                    <DialogHeader>
                        <DialogTitle>Upload to Knowledge Base</DialogTitle>
                        <DialogDescription className="text-zinc-500">
                            Upload a document to be indexed for agent context retrieval.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Document Title</Label>
                            <Input id="name" placeholder="e.g. API Documentation" className="bg-zinc-900 border-zinc-800" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="file">File</Label>
                            <div className="border-2 border-dashed border-zinc-800 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-900/50 transition-colors">
                                <Upload className="size-8 text-zinc-500 mb-2" />
                                <span className="text-sm text-zinc-500">Drag & drop or click to browse</span>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsUploadOpen(false)} className="text-zinc-400 hover:text-zinc-200">Cancel</Button>
                        <Button onClick={handleUpload} disabled={uploading} className="bg-violet-600 hover:bg-violet-700 text-white">
                            {uploading ? "Uploading..." : "Upload"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>

        <div className="flex items-center gap-4">
             <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                <Input 
                    className="pl-10 bg-zinc-900/50 border-zinc-800 focus:ring-zinc-700" 
                    placeholder="Search documentation, schemas, and code..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                   Filter
                </Button>
             </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
                <div 
                    key={item.id} 
                    onClick={() => setSelectedItem(item)}
                    className="group p-4 border border-zinc-800 rounded-xl bg-[#121214] hover:border-zinc-600 hover:bg-zinc-800/30 transition-all cursor-pointer"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700">
                            <item.icon className="size-5 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                        </div>
                        <span className="text-xs text-zinc-500">{item.updated}</span>
                    </div>
                    <h3 className="text-sm font-medium text-zinc-200 mb-2">{item.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {item.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="bg-zinc-900/50 border-zinc-800 text-zinc-500 text-[10px] px-1.5 py-0 h-5">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            ))}
            
            {/* Add New Placeholder */}
            <div 
                onClick={() => setIsUploadOpen(true)}
                className="flex flex-col items-center justify-center p-4 border border-dashed border-zinc-800 rounded-xl bg-transparent hover:bg-zinc-900/20 transition-all cursor-pointer h-[160px]"
            >
                <div className="size-10 rounded-full bg-zinc-900 flex items-center justify-center mb-3 border border-zinc-800">
                    <PlusIcon className="size-5 text-zinc-500" />
                </div>
                <span className="text-sm font-medium text-zinc-400">Add Knowledge</span>
            </div>
         </div>
      </div>
      
      <div className="px-8 py-3 border-t border-zinc-800/50 text-xs text-zinc-500 bg-[#0d0d0d]">
          <span className="font-medium text-violet-400">Tip:</span> Knowledge items are automatically indexed into the vector database for agent retrieval.
      </div>

      {/* Details Sheet */}
      <Sheet open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <SheetContent className="w-[500px] bg-[#09090b] border-l border-zinc-800 p-0">
            {selectedItem && (
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-zinc-800">
                        <div className="flex items-center gap-3 mb-4">
                             <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                                <selectedItem.icon className="size-6 text-zinc-300" />
                            </div>
                            <div>
                                <SheetTitle className="text-zinc-100">{selectedItem.title}</SheetTitle>
                                <SheetDescription className="text-zinc-500">{selectedItem.type}</SheetDescription>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {selectedItem.tags.map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="bg-zinc-800 text-zinc-400 hover:bg-zinc-700">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto">
                         <div className="prose prose-invert prose-sm max-w-none">
                            <h3 className="text-zinc-200">Overview</h3>
                            <p className="text-zinc-400">{selectedItem.content}</p>
                            <hr className="border-zinc-800 my-4" />
                            <h4 className="text-zinc-300">Metadata</h4>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <span className="text-zinc-500 block">Last Updated</span>
                                    <span className="text-zinc-300">{selectedItem.updated}</span>
                                </div>
                                <div>
                                    <span className="text-zinc-500 block">Author</span>
                                    <span className="text-zinc-300">System Admin</span>
                                </div>
                                <div>
                                    <span className="text-zinc-500 block">Size</span>
                                    <span className="text-zinc-300">2.4 MB</span>
                                </div>
                            </div>
                         </div>
                    </div>
                    <div className="p-6 border-t border-zinc-800 bg-[#09090b]">
                        <Button className="w-full bg-zinc-100 text-zinc-950 hover:bg-white">
                            Open in Editor
                        </Button>
                    </div>
                </div>
            )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
        </svg>
    );
}
