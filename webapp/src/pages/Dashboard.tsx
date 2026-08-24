import React from 'react';
import { DollarSign, Users, TrendingDown, Percent, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { OnboardingBanner } from '../components/OnboardingBanner';

interface DashboardProps {
  isMock: boolean;
  onOpenSettings: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ isMock, onOpenSettings }) => {
  const kpis = [
    { label: 'Monthly Recurring Revenue (MRR)', value: '€4,850.00', icon: DollarSign, change: '+12.4%', color: 'indigo' },
    { label: 'Active Subscriptions', value: '42', icon: Users, change: '+5 this month', color: 'emerald' },
    { label: 'Monthly Churn Rate', value: '1.8%', icon: TrendingDown, change: '-0.4%', color: 'amber' },
    { label: 'Austrian VAT Collected (20%)', value: '€970.00', icon: Percent, change: '100% compliant', color: 'purple' },
  ];

  const recentActivity = [
    { type: 'Payment', desc: 'Sandra Mockinger - Annual Subscription', amount: '€149.00', status: 'Succeeded', time: '10 mins ago' },
    { type: 'Customer', desc: 'Joe Mocky GmbH created with VAT ATU87654321', amount: 'Reverse Charge', status: 'Verified', time: '1 hour ago' },
    { type: 'Refund', desc: 'Refund processed for charge ch_at_501', amount: '-€49.00', status: 'Completed', time: '3 hours ago' },
    { type: 'Invoice', desc: 'BAO § 132 PDF invoice generated for sub_at_901', amount: '€299.00', status: 'Issued', time: '5 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {isMock && <OnboardingBanner onOpenSettings={onOpenSettings} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time Stripe financial metrics and Austrian VAT compliance overview.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-slate-400 mb-3">
                <span className="text-xs font-medium">{kpi.label}</span>
                <div className="p-2 rounded-lg bg-slate-800 text-slate-200">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{kpi.value}</div>
              <div className="flex items-center space-x-1 text-xs text-emerald-400 mt-2">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Recent Transaction Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((act, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-slate-200">{act.desc}</div>
                    <div className="text-xs text-slate-500">{act.type} • {act.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">{act.amount}</div>
                  <div className="text-xs text-emerald-400 font-medium">{act.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Austrian Tax Health</h2>
          <div className="space-y-4 text-sm text-slate-300">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">UStG 1994 Standard Rate</div>
              <div className="text-lg font-bold text-white mt-0.5">20.0%</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">BAO § 132 Retention Rule</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">7-Year Fiscal Lock</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">EU Reverse Charge (ATU)</div>
              <div className="text-lg font-bold text-indigo-400 mt-0.5">Syntax Verified</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
