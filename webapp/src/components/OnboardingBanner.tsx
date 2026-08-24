import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';

interface OnboardingBannerProps {
  onOpenSettings: () => void;
}

export const OnboardingBanner: React.FC<OnboardingBannerProps> = ({ onOpenSettings }) => {
  return (
    <div className="bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-indigo-500/20 border border-amber-500/30 rounded-xl p-4 mb-6 text-slate-200 shadow-lg relative overflow-hidden">
      <div className="flex items-start space-x-3">
        <div className="bg-amber-500/20 p-2 rounded-lg text-amber-400 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white">stripe-mcp Operating in Evaluation Mock Mode</h3>
          <p className="text-xs text-slate-300 mt-1">
            No live Stripe API key was detected in your <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-300 font-mono">.env</code> configuration. Synthetic customer and Austrian tax data is currently being rendered.
          </p>
        </div>
        <button
          onClick={onOpenSettings}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-4 py-2 rounded-lg text-xs flex items-center space-x-1.5 transition-colors shrink-0"
        >
          <span>Connect API Keys</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
