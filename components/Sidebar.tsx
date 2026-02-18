
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, isOpen }) => {
  const menuItems: { id: View; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'chat', label: 'AI Simulator', icon: '🤖' },
    { id: 'leads', label: 'Leads Inbox', icon: '📥' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-2xl">
            ✈️
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Smiles To Miles</h1>
            <p className="text-xs text-slate-400">AI Command Center</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeView === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800">
        <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
          <img src="https://picsum.photos/40/40" className="w-8 h-8 rounded-full" alt="User" />
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-slate-400 truncate">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
