
import React from 'react';
import { CheckSquare, Clock, ArrowRight } from 'lucide-react';

export function ChangeRequestQueue() {
  return (
    <div className="bg-[#121214] border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <CheckSquare className="size-4 text-violet-400" />
                Change Requests
            </h3>
            <span className="text-xs text-zinc-500">3 Pending</span>
        </div>

        <div className="space-y-2">
            {[
                { title: 'Update API error handling', status: 'In Progress', agent: 'Code Generator' },
                { title: 'Add unit tests for Auth', status: 'Queued', agent: 'Test Writer' },
                { title: 'Refactor navigation component', status: 'Queued', agent: 'Code Generator' }
            ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                    <div>
                        <div className="text-sm text-zinc-300">{item.title}</div>
                        <div className="text-[10px] text-zinc-500 flex items-center gap-1 mt-1">
                            <span className="text-violet-400">{item.agent}</span>
                            <span>•</span>
                            <span>{item.status}</span>
                        </div>
                    </div>
                    <ArrowRight className="size-3 text-zinc-600" />
                </div>
            ))}
        </div>
    </div>
  );
}
