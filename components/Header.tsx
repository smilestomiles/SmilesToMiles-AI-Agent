
import React from 'react';
import { View } from '../types';

interface HeaderProps {
  toggleSidebar: () => void;
  activeView: View;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, activeView }) => {
  const titles: Record<View, string> = {
    dashboard: 'Analytics Overview',
    chat: 'Live Chat Simulator',
    leads: 'Lead Management',
    settings: 'System Configuration'
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 lg:hidden"
        >
          ☰
        </button>
        <h2 className="text-lg font-semibold text-slate-800 capitalize">{titles[activeView]}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          AI Agent Online
        </div>
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
          🔔
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
