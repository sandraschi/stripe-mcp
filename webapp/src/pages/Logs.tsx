import React from 'react';
import { Terminal, RefreshCw } from 'lucide-react';

export const Logs: React.FC = () => {
  const logs = [
    '[2026-08-24 18:50:00] [INFO] FastMCP server initialized on http://127.0.0.1:11165',
    '[2026-08-24 18:50:01] [INFO] Operating Mode: DECLARED MOCK MODE (Synthetic Austrian Data)',
    '[2026-08-24 18:51:22] [INFO] Tool Call: manage_stripe_customers(operation="list") -> 200 OK',
    '[2026-08-24 18:52:10] [INFO] Tool Call: calculate_austrian_vat(amount=100.0, vat_type="standard_20") -> 200 OK',
    '[2026-08-24 18:53:05] [INFO] Safety Cap Check: issue_refund requested 49.00 EUR <= 500.00 EUR limit -> PASSED',
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System & Audit Logs</h1>
          <p className="text-sm text-slate-400 mt-1">Live audit stream of FastMCP server calls and safety guardrail checks.</p>
        </div>
        <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Logs</span>
        </button>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2 overflow-x-auto">
        {logs.map((log, i) => (
          <div key={i} className="hover:bg-slate-900/60 p-1.5 rounded transition-colors">
            <span className="text-indigo-400">{log.substring(0, 21)}</span>
            <span className="text-emerald-400 font-bold">{log.substring(21, 28)}</span>
            <span className="text-slate-200">{log.substring(28)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
