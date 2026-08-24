import React from 'react';
import { Inbox as InboxIcon, Activity, CheckCircle, AlertCircle } from 'lucide-react';

export const Inbox: React.FC = () => {
  const webhooks = [
    { id: 'evt_mock_001', type: 'payment_intent.succeeded', time: '10 mins ago', status: '200 OK', payload: { id: 'pi_mock_101', amount: 14900, currency: 'eur' } },
    { id: 'evt_mock_002', type: 'customer.subscription.created', time: '1 hour ago', status: '200 OK', payload: { id: 'sub_at_901', plan: 'pro_monthly' } },
    { id: 'evt_mock_003', type: 'invoice.paid', time: '3 hours ago', status: '200 OK', payload: { id: 'in_mock_501', gross_total: 178.8 } },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Webhook Live Stream</h1>
        <p className="text-sm text-slate-400 mt-1">Real-time webhook events arriving at POST /api/webhooks/stripe.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center space-x-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          <span>Incoming Webhook Stream</span>
        </h2>

        <div className="space-y-3">
          {webhooks.map((w) => (
            <div key={w.id} className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white">{w.type}</span>
                  <span className="text-slate-500">({w.id})</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-slate-500">{w.time}</span>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold">
                    {w.status}
                  </span>
                </div>
              </div>
              <pre className="p-2 bg-slate-900 rounded text-slate-300 overflow-x-auto text-[11px]">
                {JSON.stringify(w.payload, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
