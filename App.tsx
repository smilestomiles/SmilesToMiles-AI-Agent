
import React, { useState } from 'react';
import { View, NotificationSettings } from './types';
import Dashboard from './components/Dashboard';
import ChatBot from './components/ChatBot';
import LeadManager from './components/LeadManager';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import VerificationModal from './components/VerificationModal';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('+91 9625688486');
  const [facebookPage, setFacebookPage] = useState('https://www.facebook.com/smilestomiles');
  const [websiteUrl, setWebsiteUrl] = useState('www.smilestomiles.com');
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: 'info@smilestomiles.com',
    onNewLead: true,
    onHighPriority: true,
    onReminder: true,
    onConversion: true,
  });

  const handleNotificationToggle = (key: keyof Omit<NotificationSettings, 'email'>) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'chat':
        return <ChatBot />;
      case 'leads':
        return <LeadManager notificationSettings={notificationSettings} />;
      case 'settings':
        return (
          <div className="p-8 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>
              <div className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded">VERSION 2.5.0</div>
            </div>
            
            <div className="space-y-6 pb-20">
              {/* Notification Preferences Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center text-white text-xl">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Email Notification Preferences</h3>
                    <p className="text-xs text-slate-500">Decide which updates trigger an email alert to your team.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Notification Email Address</label>
                    <input 
                      type="email" 
                      value={notificationSettings.email}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="e.g. info@smilestomiles.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'onNewLead', label: 'New Lead Inbound', desc: 'Alert when a new customer message arrives.' },
                      { key: 'onHighPriority', label: 'High Priority Tags', desc: 'Alert when "VIP" or "High Priority" is added.' },
                      { key: 'onReminder', label: 'Upcoming Reminders', desc: 'Alert 1 hour before scheduled follow-ups.' },
                      { key: 'onConversion', label: 'Successful Conversions', desc: 'Celebratory alert when a trip is closed.' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-800">{item.label}</p>
                          <p className="text-[10px] text-slate-500">{item.desc}</p>
                        </div>
                        <button 
                          onClick={() => handleNotificationToggle(item.key as any)}
                          className={`w-10 h-5 rounded-full relative transition-colors ${notificationSettings[item.key as keyof NotificationSettings] ? 'bg-indigo-600' : 'bg-slate-300'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${notificationSettings[item.key as keyof NotificationSettings] ? 'right-1' : 'left-1'}`}></div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Website Integration Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Website Chat Widget</h3>
                    <p className="text-xs text-slate-500">Manage the AI agent on your official domain.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Production Domain</label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm">https://</span>
                        <input 
                          type="text" 
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-16 pr-4 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                      </div>
                      <button 
                        onClick={() => setIsVerifyModalOpen(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Configuration Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">WhatsApp Integration</h3>
                    <p className="text-xs text-slate-500">Official business channel for customer communication.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Phone Number</label>
                    <input 
                      type="text" 
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-700 font-medium">Synced & Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <VerificationModal 
              isOpen={isVerifyModalOpen} 
              onClose={() => setIsVerifyModalOpen(false)} 
              domain={websiteUrl}
            />
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} activeView={activeView} />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
