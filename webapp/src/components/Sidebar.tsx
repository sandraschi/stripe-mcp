import React from 'react';
import {
  LayoutDashboard,
  Users,
  Repeat,
  CreditCard,
  FileText,
  Link,
  Inbox,
  Wrench,
  Sparkles,
  MessageSquare,
  Settings,
  HelpCircle,
  Terminal,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'subscriptions', label: 'Subscriptions', icon: Repeat },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'checkout', label: 'Checkout Studio', icon: Link },
    { id: 'inbox', label: 'Webhook Inbox', icon: Inbox },
    { id: 'tools', label: 'API Tools', icon: Wrench },
    { id: 'skills', label: 'Skills Catalog', icon: Sparkles },
    { id: 'chat', label: 'LLM Chat', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Docs', icon: HelpCircle },
    { id: 'logs', label: 'Audit Logs', icon: Terminal },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-4 flex flex-col justify-between shrink-0">
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 text-center font-mono">
        Port 11166 | FastMCP 3.4+
      </div>
    </aside>
  );
};
