import React, { useState } from 'react';
import { Wrench, Play, Terminal } from 'lucide-react';

export const Tools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState('manage_stripe_customers');
  const [output, setOutput] = useState<string | null>(null);

  const tools = [
    { name: 'manage_stripe_customers', desc: 'Customer CRUD, search, and VAT ID verification' },
    { name: 'manage_stripe_subscriptions', desc: 'Subscription lifecycle (pause, resume, cancel)' },
    { name: 'manage_stripe_payments', desc: 'Charge inspection, 3DS2 lookups, bounded refunds' },
    { name: 'manage_stripe_checkout', desc: 'Payment Links, Checkout Sessions, and Invoices' },
    { name: 'stripe_revenue_analytics', desc: 'SaaS metrics (MRR, Churn, Austrian VAT summary)' },
    { name: 'calculate_austrian_vat', desc: '20%/10%/13% VAT rates & ATU Reverse Charge checker' },
  ];

  const handleRun = () => {
    setOutput(`[SUCCESS] Executed ${selectedTool} in MOCK mode. Output payload returned clean 200 OK.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Interactive FastMCP API Workbench</h1>
        <p className="text-sm text-slate-400 mt-1">Test stripe-mcp tools directly from your browser.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
          <h2 className="text-xs uppercase font-mono text-slate-400 font-bold px-2 py-1">Available FastMCP Tools</h2>
          {tools.map((t) => (
            <button
              key={t.name}
              onClick={() => { setSelectedTool(t.name); setOutput(null); }}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selectedTool === t.name
                  ? 'bg-indigo-600/20 border-indigo-500 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="font-mono text-xs font-bold text-indigo-400">{t.name}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{t.desc}</div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-white flex items-center justify-between">
              <span>Execute Tool: <code className="text-indigo-400 font-mono">{selectedTool}</code></span>
              <button
                onClick={handleRun}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Run Tool</span>
              </button>
            </h2>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
              {`{\n  "operation": "list"\n}`}
            </div>

            {output && (
              <div className="p-4 bg-slate-950 border border-emerald-500/30 rounded-lg font-mono text-xs text-emerald-400">
                <div className="flex items-center space-x-2 text-emerald-500 font-bold mb-2">
                  <Terminal className="w-4 h-4" />
                  <span>Execution Result</span>
                </div>
                <div>{output}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
