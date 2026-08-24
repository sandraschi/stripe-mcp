import React from 'react';
import { ShieldCheck, ShieldAlert, CreditCard, ExternalLink } from 'lucide-react';
import { MockBadge } from './MockBadge';

interface NavbarProps {
  isMock: boolean;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isMock, onOpenSettings }) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/30">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg tracking-tight text-white">stripe-mcp</span>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
              v1.0.0
            </span>
          </div>
          <p className="text-xs text-slate-400">Payment Gateway & Austrian Tax Engine</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {isMock ? (
          <MockBadge onClick={onOpenSettings} />
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
            LIVE / TEST CONNECTED
          </span>
        )}

        <a
          href="http://127.0.0.1:11165/api/health"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 border border-slate-800 hover:border-slate-700 px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <span>Backend Health</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </header>
  );
};
