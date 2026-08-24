import React from 'react';
import { Repeat, Pause, Play, XCircle } from 'lucide-react';

export const Subscriptions: React.FC = () => {
  const subscriptions = [
    { id: 'sub_at_901', customer: 'Sandra Mockinger (cus_at_101)', plan: 'SaaS Pro Monthly', amount: '€49.00 / mo', status: 'active', period_end: '2026-09-24' },
    { id: 'sub_at_902', customer: 'Joe Mocky GmbH (cus_at_102)', plan: 'Enterprise Fleet Annual', amount: '€299.00 / mo', status: 'active', period_end: '2027-08-24' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Subscriptions Manager</h1>
        <p className="text-sm text-slate-400 mt-1">Track and modify active SaaS recurring plans.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950 text-xs uppercase text-slate-400 font-mono border-b border-slate-800">
            <tr>
              <th className="px-6 py-3.5">Subscription ID</th>
              <th className="px-6 py-3.5">Customer</th>
              <th className="px-6 py-3.5">Plan</th>
              <th className="px-6 py-3.5">Amount</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5">Period End</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {subscriptions.map((s) => (
              <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4 font-mono text-indigo-400">{s.id}</td>
                <td className="px-6 py-4 font-semibold text-white">{s.customer}</td>
                <td className="px-6 py-4 text-slate-300">{s.plan}</td>
                <td className="px-6 py-4 font-semibold text-emerald-400">{s.amount}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 font-mono text-xs">{s.period_end}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors" title="Pause Billing">
                    <Pause className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors" title="Cancel Subscription">
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
