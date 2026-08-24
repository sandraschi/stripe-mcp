import React, { useState } from 'react';
import { Search, UserPlus, CheckCircle, Building } from 'lucide-react';

export const Customers: React.FC = () => {
  const [query, setQuery] = useState('');
  const customers = [
    { id: 'cus_at_101', name: 'Sandra Mockinger', email: 'sandra@vienna-tech.at', vat_id: 'ATU12345678', country: 'AT', created: '2026-08-20' },
    { id: 'cus_at_102', name: 'Joe Mocky GmbH', email: 'billing@mocky-solutions.at', vat_id: 'ATU87654321', country: 'AT', created: '2026-08-21' },
    { id: 'cus_at_103', name: 'Graz Robotics Studio', email: 'office@graz-ai.at', vat_id: 'ATU55667788', country: 'AT', created: '2026-08-22' },
  ];

  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase()) || c.vat_id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Customer Directory</h1>
          <p className="text-sm text-slate-400 mt-1">Manage customer profiles and Austrian/EU tax identifiers.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-colors">
          <UserPlus className="w-4 h-4" />
          <span>New Customer</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by customer name, email, or ATU VAT ID..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950 text-xs uppercase text-slate-400 font-mono border-b border-slate-800">
            <tr>
              <th className="px-6 py-3.5">Customer ID</th>
              <th className="px-6 py-3.5">Name</th>
              <th className="px-6 py-3.5">Email</th>
              <th className="px-6 py-3.5">ATU VAT ID</th>
              <th className="px-6 py-3.5">Country</th>
              <th className="px-6 py-3.5">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4 font-mono text-indigo-400">{c.id}</td>
                <td className="px-6 py-4 font-semibold text-white flex items-center space-x-2">
                  <Building className="w-4 h-4 text-slate-500" />
                  <span>{c.name}</span>
                </td>
                <td className="px-6 py-4 text-slate-300">{c.email}</td>
                <td className="px-6 py-4 font-mono text-emerald-400">
                  <span className="inline-flex items-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{c.vat_id}</span>
                  </span>
                </td>
                <td className="px-6 py-4">{c.country}</td>
                <td className="px-6 py-4 text-slate-500 font-mono text-xs">{c.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
