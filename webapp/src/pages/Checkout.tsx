import React, { useState } from 'react';
import { Link as LinkIcon, ExternalLink, Copy, Check } from 'lucide-react';

export const Checkout: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const sampleLink = 'https://buy.stripe.com/test_00g4gH78901234';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sampleLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Checkout Studio</h1>
        <p className="text-sm text-slate-400 mt-1">Generate 3DS2 payment links supporting EPS, SEPA Direct Debit, and Cards.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-white flex items-center space-x-2">
          <LinkIcon className="w-4 h-4 text-indigo-400" />
          <span>Payment Link Generator</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Settlement Amount (€)</label>
            <input
              type="number"
              defaultValue="149.00"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Allowed Payment Methods</label>
            <div className="flex space-x-3 text-xs text-slate-300 pt-2">
              <label className="flex items-center space-x-1.5"><input type="checkbox" defaultChecked /><span>Credit Card</span></label>
              <label className="flex items-center space-x-1.5"><input type="checkbox" defaultChecked /><span>EPS Online Bank</span></label>
              <label className="flex items-center space-x-1.5"><input type="checkbox" defaultChecked /><span>SEPA Debit</span></label>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
          <span className="font-mono text-sm text-indigo-400 truncate pr-4">{sampleLink}</span>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-md flex items-center space-x-1 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <a
              href={sampleLink}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-md flex items-center space-x-1 transition-colors"
            >
              <span>Test Checkout</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
