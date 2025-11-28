
import React from 'react';
import { Folder, FileCode, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CodeChangesView() {
  return (
    <div className="flex flex-col h-[600px] border border-zinc-800 rounded-lg overflow-hidden">
        <div className="bg-zinc-950 border-b border-zinc-800 p-3 flex items-center justify-between text-sm">
            <span className="text-zinc-400">Files Changed: <span className="text-zinc-200">12</span></span>
            <div className="flex gap-4 text-xs font-mono">
                <span className="text-emerald-500">+342 Insertions</span>
                <span className="text-red-500">-28 Deletions</span>
            </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
            {/* File Tree */}
            <div className="w-64 bg-zinc-900/30 border-r border-zinc-800 overflow-y-auto p-2">
                <FileTreeNode name="src/auth" type="folder" isOpen={true}>
                    <FileTreeNode name="register.ts" type="file" status="added" active />
                    <FileTreeNode name="login.ts" type="file" status="added" />
                    <FileTreeNode name="middleware.ts" type="file" status="modified" />
                    <FileTreeNode name="types.ts" type="file" status="added" />
                </FileTreeNode>
                <FileTreeNode name="src/models" type="folder" />
                <FileTreeNode name="tests" type="folder" />
            </div>
            
            {/* Diff Viewer */}
            <div className="flex-1 bg-zinc-950 overflow-auto font-mono text-sm">
                <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-4 py-2 text-xs text-zinc-400 flex justify-between items-center">
                    <span>src/auth/register.ts</span>
                    <button className="hover:text-white">Raw View</button>
                </div>
                
                <div className="p-4 space-y-0.5">
                    <DiffLine num={1} content="import { Hono } from 'hono';" type="add" />
                    <DiffLine num={2} content="import { z } from 'zod';" type="add" />
                    <DiffLine num={3} content="import { db } from '../db';" type="add" />
                    <DiffLine num={4} content="" type="add" />
                    <DiffLine num={5} content="const registerSchema = z.object({" type="add" />
                    <DiffLine num={6} content="  email: z.string().email()," type="add" />
                    <DiffLine num={7} content="  password: z.string().min(8)," type="add" />
                    <DiffLine num={8} content="  name: z.string().optional()," type="add" />
                    <DiffLine num={9} content="});" type="add" />
                    <DiffLine num={10} content="" type="add" />
                    <DiffLine num={11} content="export const authRoutes = new Hono()" type="add" />
                    <DiffLine num={12} content="  .post('/register', async (c) => {" type="add" />
                </div>
            </div>
        </div>
    </div>
  );
}

function FileTreeNode({ name, type, isOpen, status, active, children }: any) {
    return (
        <div className="pl-2">
            <div className={cn(
                "flex items-center gap-1.5 py-1 px-2 rounded cursor-pointer text-xs",
                active ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50"
            )}>
                {type === 'folder' ? (
                    <Folder className="size-3.5 text-zinc-500" />
                ) : (
                    <FileCode className="size-3.5 text-zinc-500" />
                )}
                <span className="flex-1 truncate">{name}</span>
                {status === 'added' && <div className="size-1.5 rounded-full bg-emerald-500" />}
                {status === 'modified' && <div className="size-1.5 rounded-full bg-amber-500" />}
            </div>
            {isOpen && children && <div className="pl-2 border-l border-zinc-800 ml-2">{children}</div>}
        </div>
    );
}

function DiffLine({ num, content, type }: { num: number, content: string, type?: 'add' | 'del' }) {
    return (
        <div className={cn(
            "flex hover:bg-zinc-900",
            type === 'add' ? "bg-emerald-950/10" : type === 'del' ? "bg-red-950/10" : ""
        )}>
            <div className="w-8 text-right pr-3 text-zinc-700 select-none">{num}</div>
            <div className="w-6 text-center select-none">
                {type === 'add' && <span className="text-emerald-500">+</span>}
                {type === 'del' && <span className="text-red-500">-</span>}
            </div>
            <div className={cn(
                "flex-1 pl-2 whitespace-pre",
                type === 'add' ? "text-emerald-100" : type === 'del' ? "text-red-100" : "text-zinc-300"
            )}>
                {content}
            </div>
        </div>
    );
}
