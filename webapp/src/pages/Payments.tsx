import React, { useState } from 'react';
import { CreditCard, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

export const Payments: React.FC = () => {
  const [selectedCharge, setSelectedCharge] = useState<string | null>(null);
  const charges = [
    { id: 'ch_at_501', customer: 'Sandra Mockinger', amount: '€149.00', method: 'EPS Online Banking', status: 'Succeeded', date: '2026-08-24 14:30' },
    { id: 'ch_at_502', customer: 'Joe Mocky GmbH', amount: '€299.00', method: 'SEPA Direct Debit', status: 'Succeeded', date: '2026-08-24 12:15' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Payments & Policy-Bounded Refunds</h1>
        <p className="text-sm text-slate-400 mt-1">
          Inspect charge logs and issue refunds up to €500.00 safety limit.
        </p>
      </div>

      <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center justify-between text-xs text-indigo-300">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Active Safety Cap Guardrail: <strong>MAX_REFUND_AMOUNT_EUR = €500.00</strong></span>
        </div>
        <span className="font-mono bg-slate-900 px-2 py-1 rounded border border-indigo-500/20 text-slate-400">Strict Cap Enforcement</span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950 text-xs uppercase text-slate-400 font-mono border-b border-slate-800">
            <tr>
              <th className="px-6 py-3.5">Charge ID</th>
              <th className="px-6 py-3.5">Customer</th>
              <th className="px-6 py-3.5">Payment Method</th>
              <th className="px-6 py-3.5">Amount</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5">Timestamp</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {charges.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4 font-mono text-indigo-400">{c.id}</td>
                <td className="px-6 py-4 font-semibold text-white">{c.customer}</td>
                <td className="px-6 py-4 text-slate-300 flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-slate-500" />
                  <span>{c.method}</span>
                </td>
                <td className="px-6 py-4 font-bold text-white">{c.amount}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 font-mono text-xs">{c.date}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setSelectedCharge(c.id)}
                    className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold flex items-center space-x-1 ml-auto transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Refund</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCharge && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <RotateCcw className="w-5 h-5 text-amber-400" />
              <span>Issue Bounded Refund</span>
            </h3>
            <p className="text-xs text-slate-400">Target Charge: <code className="text-indigo-400">{selectedCharge}</code></p>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Refund Amount (€)</label>
              <input
                type="number"
                defaultValue="49.00"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Reason Rationale</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                <option value="requested_by_customer">Requested by Customer</option>
                <option value="duplicate">Duplicate Charge</option>
                <option value="fraudulent">Fraudulent Activity</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 justify-end pt-2">
              <button
                onClick={() => setSelectedCharge(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Refund issued for ${selectedCharge}`);
                  setSelectedCharge(null);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition-colors"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
