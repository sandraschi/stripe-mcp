import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const Skills: React.FC = () => {
  const skills = [
    { title: 'Customer Onboarding & ATU Verification', desc: 'Validates ATU syntax and applies 0.0% Reverse Charge zero-rating for B2B EU purchases.' },
    { title: 'SaaS Churn Mitigation Workflow', desc: 'Monitors canceled subscriptions, logs user feedback, and generates targeted discount checkout links.' },
    { title: 'Policy-Bounded Refund Execution', desc: 'Enforces strict safety cap (€500.00 max) before executing partial or full transaction refunds.' },
    { title: 'BAO § 132 Fiscal Record Retention', desc: 'Tags invoice generation calls with 7-year statutory lock flags required under Austrian fiscal law.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Agent Skills & Operational Recipes</h1>
        <p className="text-sm text-slate-400 mt-1">Pre-configured operational recipes for AI agents utilizing stripe-mcp.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((s, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-white">{s.title}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
            <div className="mt-4 flex items-center space-x-1 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ready to invoke</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
