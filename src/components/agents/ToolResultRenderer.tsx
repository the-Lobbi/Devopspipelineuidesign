import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { FileText, Shield, Database, AlertTriangle, Check, X, Info, GitBranch, Lock, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolResultRendererProps {
    toolName?: string;
    output: any;
}

export function ToolResultRenderer({ toolName, output }: ToolResultRendererProps) {
    // Normalize tool name
    const name = toolName?.toLowerCase() || '';

    // 1. Git Operations (git_status, git_diff, etc.)
    if (name.includes('git_') || name === 'git_status' || name === 'git_diff') {
        return <GitResultRenderer output={output} />;
    }

    // 2. Security Scans (scan_endpoints, snyk_scan, etc.)
    if (name.includes('scan') || name.includes('security') || name.includes('audit')) {
        return <SecurityScanRenderer output={output} />;
    }

    // 3. Database Queries (postgres_query, sql_exec)
    if (name.includes('query') || name.includes('sql') || name.includes('db_')) {
        return <DatabaseResultRenderer output={output} />;
    }

    // 4. Network / HTTP (curl, http_get)
    if (name.includes('http') || name.includes('curl') || name.includes('fetch')) {
        return <HttpResultRenderer output={output} />;
    }

    // Default JSON Fallback
    return <JsonRenderer output={output} />;
}

function JsonRenderer({ output }: { output: any }) {
    return (
        <div className="p-3 bg-zinc-950 border border-zinc-800/50 rounded-md">
            <pre className="text-[10px] text-zinc-400 overflow-x-auto font-mono">
                {typeof output === 'string' ? output : JSON.stringify(output, null, 2)}
            </pre>
        </div>
    );
}

// --- Specific Renderers ---

function GitResultRenderer({ output }: { output: any }) {
    // Handle mock output format from AgentDetailPanel simulation
    const files = output.files || 0;
    const insertions = output.insertions || 0;
    const deletions = output.deletions || 0;
    const fileList = output.fileList || []; 
    const summary = typeof output === 'string' ? output : null;

    if (summary) {
         return (
            <div className="bg-[#0d1117] border border-zinc-800 rounded-md p-3 font-mono text-xs text-zinc-300">
                {summary.split('\n').map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap">{line}</div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-3 bg-[#0d1117] border border-zinc-800 rounded-md p-3">
            <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-zinc-400">
                    <FileText className="size-3.5" />
                    <span>{files} files changed</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="text-emerald-500">+</span>
                    <span>{insertions}</span>
                </div>
                <div className="flex items-center gap-1.5 text-red-400">
                    <span className="text-red-500">-</span>
                    <span>{deletions}</span>
                </div>
            </div>
            
            {/* Visual Diff Bar */}
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                <div style={{ width: `${(insertions / (insertions + deletions + 1)) * 100}%` }} className="h-full bg-emerald-500" />
                <div style={{ width: `${(deletions / (insertions + deletions + 1)) * 100}%` }} className="h-full bg-red-500" />
            </div>

            {fileList.length > 0 && (
                <div className="space-y-1 mt-2 pt-2 border-t border-zinc-800/50">
                    {fileList.map((file: string, i: number) => (
                        <div key={i} className="text-[10px] font-mono text-zinc-400 flex items-center gap-2">
                             <GitBranch className="size-3 text-zinc-600" />
                             {file}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function SecurityScanRenderer({ output }: { output: any }) {
    const vulns = output.vulnerabilities || 0;
    const warnings = output.warnings || 0;
    const passed = vulns === 0;

    return (
        <div className={cn(
            "border rounded-md p-3 space-y-3",
            passed ? "bg-emerald-950/10 border-emerald-900/30" : "bg-red-950/10 border-red-900/30"
        )}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Shield className={cn("size-4", passed ? "text-emerald-400" : "text-red-400")} />
                    <span className={cn("text-xs font-bold uppercase tracking-wider", passed ? "text-emerald-400" : "text-red-400")}>
                        {passed ? "Security Check Passed" : "Vulnerabilities Detected"}
                    </span>
                </div>
                <Badge variant="outline" className={cn(
                    "text-[10px] font-mono border-opacity-50",
                    passed ? "text-emerald-400 border-emerald-500 bg-emerald-500/10" : "text-red-400 border-red-500 bg-red-500/10"
                )}>
                    {passed ? "CLEAN" : "CRITICAL"}
                </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2">
                 <div className="p-2 bg-zinc-950/50 rounded border border-zinc-800/50 flex flex-col items-center justify-center">
                     <span className="text-[10px] text-zinc-500 uppercase">Critical</span>
                     <span className={cn("text-lg font-bold font-mono", vulns > 0 ? "text-red-400" : "text-zinc-400")}>{vulns}</span>
                 </div>
                 <div className="p-2 bg-zinc-950/50 rounded border border-zinc-800/50 flex flex-col items-center justify-center">
                     <span className="text-[10px] text-zinc-500 uppercase">Warnings</span>
                     <span className={cn("text-lg font-bold font-mono", warnings > 0 ? "text-amber-400" : "text-zinc-400")}>{warnings}</span>
                 </div>
            </div>
        </div>
    );
}

function DatabaseResultRenderer({ output }: { output: any }) {
    // Handle array of objects (rows) or simple result object
    const rows = Array.isArray(output) ? output : (output.rows || []);
    const rowCount = rows.length;
    const columns = rowCount > 0 ? Object.keys(rows[0]) : [];

    if (rowCount === 0 && !Array.isArray(output)) {
        return <JsonRenderer output={output} />;
    }

    return (
        <div className="border border-zinc-800 rounded-md overflow-hidden bg-[#0c0c0e]">
            <div className="px-3 py-2 bg-zinc-900/50 border-b border-zinc-800 flex items-center gap-2 text-xs text-zinc-400">
                <Database className="size-3.5" />
                <span className="font-mono">{rowCount} results</span>
            </div>
            <ScrollArea className="max-h-[200px]">
                <div className="min-w-full">
                    <table className="w-full text-left text-[10px] font-mono">
                        <thead className="bg-zinc-900/30 sticky top-0 z-10">
                            <tr>
                                {columns.map(col => (
                                    <th key={col} className="px-3 py-2 font-medium text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {rows.map((row: any, i: number) => (
                                <tr key={i} className="hover:bg-zinc-900/20 transition-colors">
                                    {columns.map(col => (
                                        <td key={col} className="px-3 py-2 text-zinc-300 whitespace-nowrap">
                                            {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ScrollArea>
        </div>
    );
}

function HttpResultRenderer({ output }: { output: any }) {
    const status = output.status || 200;
    const isOk = status >= 200 && status < 300;
    
    return (
        <div className="border border-zinc-800 rounded-md bg-zinc-950 p-3 font-mono text-xs space-y-2">
            <div className="flex items-center gap-2 mb-2">
                <Badge variant={isOk ? "default" : "destructive"} className={cn("h-5 text-[10px]", isOk ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" : "")}>
                    {status} {isOk ? 'OK' : 'ERROR'}
                </Badge>
                <span className="text-zinc-500">{output.url || 'http://api.internal/v1/endpoint'}</span>
            </div>
            <div className="p-2 bg-zinc-900 rounded border border-zinc-800 text-zinc-400 overflow-x-auto">
                {typeof output.data === 'string' ? output.data : JSON.stringify(output.data, null, 2)}
            </div>
        </div>
    );
}