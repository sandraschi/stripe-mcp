import React, { useState } from 'react';
import { FileText, Download, CheckCircle, Calculator } from 'lucide-react';

export const Invoices: React.FC = () => {
  const [netAmount, setNetAmount] = useState<number>(100);
  const [vatRate, setVatRate] = useState<number>(0.20);
  const [vatId, setVatId] = useState<string>('ATU12345678');

  const isReverseCharge = vatId.startsWith('ATU') && vatId.length === 11;
  const applicableVatRate = isReverseCharge ? 0 : vatRate;
  const vatAmount = netAmount * applicableVatRate;
  const grossTotal = netAmount + vatAmount;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">BAO § 132 Fiscal Invoices Studio</h1>
        <p className="text-sm text-slate-400 mt-1">
          Generate Austrian tax-compliant PDF invoice schemas with 7-year fiscal locks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-indigo-400" />
            <span>Interactive Invoice Calculator</span>
          </h2>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Net Subtotal (€)</label>
            <input
              type="number"
              value={netAmount}
              onChange={(e) => setNetAmount(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Customer ATU VAT ID (Optional B2B)</label>
            <input
              type="text"
              value={vatId}
              onChange={(e) => setVatId(e.target.value)}
              placeholder="e.g. ATU12345678"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Applicable Tax Category</label>
            <select
              value={vatRate}
              onChange={(e) => setVatRate(parseFloat(e.target.value))}
              disabled={isReverseCharge}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
            >
              <option value={0.20}>Standard 20.0% (Digital SaaS, Software)</option>
              <option value={0.10}>Reduced 10.0% (E-books, Publications)</option>
              <option value={0.13}>Reduced 13.0% (Events, Accommodations)</option>
            </select>
          </div>

          {isReverseCharge && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-400 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>B2B Reverse Charge zero-rating applied for ATU VAT ID.</span>
            </div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-white mb-4 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>BAO § 132 Invoice Preview</span>
            </h2>
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3 text-xs font-mono text-slate-300">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">Seller UID:</span>
                <span className="text-white font-bold">ATU78901234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Net Amount:</span>
                <span className="text-white">€{netAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">VAT ({isReverseCharge ? 'Reverse Charge 0%' : `${(vatRate * 100).toFixed(0)}%`}):</span>
                <span className="text-white">€{vatAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 text-sm">
                <span className="font-bold text-white">Gross Total:</span>
                <span className="font-bold text-emerald-400">€{grossTotal.toFixed(2)}</span>
              </div>
              <div className="pt-2 text-[10px] text-slate-500 italic">
                Statutory BAO § 132 retention lock applied (7-year archive record).
              </div>
            </div>
          </div>

          <button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg text-xs flex items-center justify-center space-x-2 transition-colors">
            <Download className="w-4 h-4" />
            <span>Generate & Download Fiscal PDF Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
};
