import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Customers } from './pages/Customers';
import { Subscriptions } from './pages/Subscriptions';
import { Payments } from './pages/Payments';
import { Invoices } from './pages/Invoices';
import { Checkout } from './pages/Checkout';
import { Inbox } from './pages/Inbox';
import { Tools } from './pages/Tools';
import { Skills } from './pages/Skills';
import { Chat } from './pages/Chat';
import { Settings } from './pages/Settings';
import { Help } from './pages/Help';
import { Logs } from './pages/Logs';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMock] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard isMock={isMock} onOpenSettings={() => setActiveTab('settings')} />;
      case 'customers':
        return <Customers />;
      case 'subscriptions':
        return <Subscriptions />;
      case 'payments':
        return <Payments />;
      case 'invoices':
        return <Invoices />;
      case 'checkout':
        return <Checkout />;
      case 'inbox':
        return <Inbox />;
      case 'tools':
        return <Tools />;
      case 'skills':
        return <Skills />;
      case 'chat':
        return <Chat />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <Help />;
      case 'logs':
        return <Logs />;
      default:
        return <Dashboard isMock={isMock} onOpenSettings={() => setActiveTab('settings')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar isMock={isMock} onOpenSettings={() => setActiveTab('settings')} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-8 overflow-y-auto bg-slate-950/80">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
