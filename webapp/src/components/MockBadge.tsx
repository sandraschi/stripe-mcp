import React from 'react';
import { Database } from 'lucide-react';

interface MockBadgeProps {
  onClick?: () => void;
}

export const MockBadge: React.FC<MockBadgeProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
      title="Click to configure live Stripe API key"
    >
      <Database className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
      <span>MOCK DATA MODE</span>
    </button>
  );
};
