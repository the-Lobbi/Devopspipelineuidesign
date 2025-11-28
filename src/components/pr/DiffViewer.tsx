
import React from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const SAMPLE_DIFF = `  import { useState } from 'react';
  
  export function LoginForm() {
-   const [email, setEmail] = useState('');
+   const [email, setEmail] = useState<string>('');
+   const [isLoading, setIsLoading] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
+     setIsLoading(true);
+     try {
        await login(email);
+     } catch (error) {
+       console.error(error);
+     } finally {
+       setIsLoading(false);
+     }
    };
  
    return (
-     <form onSubmit={handleSubmit}>
+     <form onSubmit={handleSubmit} className="space-y-4">`;

export function DiffViewer() {
  const lines = SAMPLE_DIFF.split('\n');

  return (
    <div className="border border-zinc-800 rounded-xl bg-[#0D0D10] overflow-hidden font-mono text-xs">
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 border-b border-zinc-800 text-zinc-400">
            <span>src/components/auth/LoginForm.tsx</span>
            <div className="flex gap-4">
                <span className="text-red-400">- 2 lines</span>
                <span className="text-emerald-400">+ 8 lines</span>
            </div>
        </div>
        
        <ScrollArea className="h-[400px]">
            <div className="py-2">
                {lines.map((line, i) => {
                    const isAdd = line.startsWith('+');
                    const isDel = line.startsWith('-');
                    
                    return (
                        <div 
                            key={i} 
                            className={cn(
                                "flex",
                                isAdd ? "bg-emerald-950/30" : isDel ? "bg-red-950/30" : ""
                            )}
                        >
                            <div className="w-12 shrink-0 text-right pr-4 text-zinc-600 select-none border-r border-zinc-800/50 mr-4">
                                {i + 1}
                            </div>
                            <div className={cn(
                                "flex-1 whitespace-pre",
                                isAdd ? "text-emerald-200" : isDel ? "text-red-200" : "text-zinc-400"
                            )}>
                                {line}
                            </div>
                        </div>
                    );
                })}
            </div>
        </ScrollArea>
    </div>
  );
}
