import React from 'react';
import { Settings as SettingsIcon, Key, Shield, Save } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System & Environment Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Configure Stripe API credentials, webhook secrets, and safety parameters.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center space-x-2">
            <Key className="w-4 h-4 text-indigo-400" />
            <span>Stripe API Credentials</span>
          </h2>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Stripe Restricted API Key</label>
            <input
              type="password"
              placeholder="rk_test_... or rk_live_..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">Leave empty or use <code className="text-amber-400 font-mono">rk_test_mock</code> for Evaluation Mock Mode.</p>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Stripe Webhook Signing Secret</label>
            <input
              type="password"
              placeholder="whsec_..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center space-x-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Safety Caps & Regional Defaults</span>
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Max Refund Limit (€)</label>
              <input
                type="number"
                defaultValue="500.00"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Default Settlement Country</label>
              <input
                type="text"
                defaultValue="AT"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>

        <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2.5 rounded-lg flex items-center space-x-2 transition-colors">
          <Save className="w-4 h-4" />
          <span>Save Environment Settings</span>
        </button>
      </div>
    </div>
  );
};
