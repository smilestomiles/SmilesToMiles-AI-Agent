
import React, { useState, useMemo, useEffect } from 'react';
import { Lead, LeadSource, LeadStatus, Agent, NotificationSettings } from '../types';

interface CallLog {
  id: string;
  name: string;
  phone: string;
  type: 'Inbound' | 'Outbound';
  duration: string;
  status: 'Completed' | 'Missed' | 'Busy';
  timestamp: string;
  summary: string;
}

interface LeadManagerProps {
  notificationSettings?: NotificationSettings;
}

const INITIAL_TEAM: Agent[] = [
  { id: 'a1', name: 'Global AI (Default)', role: 'General Automation', avatar: '🌐', isAI: true, persona: 'Helpful travel assistant', style: 'Helpful' },
  { id: 'a2', name: 'Sameer Khan', role: 'Senior Consultant', avatar: '👨‍💼', isAI: false },
  { id: 'a3', name: 'Pooja Rawat', role: 'Support Executive', avatar: '👩‍💼', isAI: false },
  { id: 'a4', name: 'Vikram Mehta', role: 'Sales Manager', avatar: '👨‍💻', isAI: false },
];

const INITIAL_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Anjali Sharma',
    contact: '+91 98765 43210',
    source: LeadSource.WHATSAPP,
    status: LeadStatus.NEW,
    lastMessage: 'Looking for a 5-day package for Dubai.',
    timestamp: '10:30 AM',
    assignedTo: 'a1',
    tags: ['International', 'VIP'],
    reminder: { dateTime: new Date(Date.now() + 86400000).toISOString(), note: 'Send itinerary' }
  },
  {
    id: '2',
    name: 'Global Tech Solutions',
    contact: 'contact@globaltech.com',
    source: LeadSource.INDIAMART,
    status: LeadStatus.IN_PROGRESS,
    lastMessage: 'Bulk inquiry for corporate retreat in Goa.',
    timestamp: 'Yesterday',
    assignedTo: 'a2',
    tags: ['Corporate', 'Bulk Inquiry']
  },
  {
    id: '3',
    name: 'Mark Henderson',
    contact: '@markh_travels',
    source: LeadSource.SOCIAL_MEDIA,
    status: LeadStatus.FOLLOW_UP,
    lastMessage: 'Interested in the Switzerland winter deal.',
    timestamp: '2 hours ago',
    assignedTo: 'a1',
    tags: ['Europe', 'High Priority'],
    reminder: { dateTime: new Date(Date.now() + 3600000).toISOString(), note: 'Check visa status' }
  }
];

const MOCK_CALLS: CallLog[] = [
  {
    id: 'c1',
    name: 'Rajesh Kumar',
    phone: '+91 99000 11223',
    type: 'Inbound',
    duration: '2m 45s',
    status: 'Completed',
    timestamp: 'Today, 11:15 AM',
    summary: 'Customer inquired about Maldives summer packages. AI agent shared pricing.'
  }
];

const LeadManager: React.FC<LeadManagerProps> = ({ notificationSettings }) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'calls' | 'agents'>('leads');
  const [filterSource, setFilterSource] = useState<LeadSource | 'All'>('All');
  const [filterTag, setFilterTag] = useState<string>('All');
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [team, setTeam] = useState<Agent[]>(INITIAL_TEAM);
  const [newTagInputs, setNewTagInputs] = useState<Record<string, string>>({});
  const [schedulingLeadId, setSchedulingLeadId] = useState<string | null>(null);
  const [activeToast, setActiveToast] = useState<{ message: string, type: 'info' | 'success' } | null>(null);
  
  // Agent Creation State
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
    name: '',
    persona: '',
    knowledgeBase: '',
    style: 'Helpful',
    avatar: '🤖'
  });

  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => setActiveToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  const triggerEmailNotification = (subject: string, leadName: string) => {
    if (!notificationSettings) return;
    setActiveToast({ 
      message: `Email alert sent to ${notificationSettings.email}: ${subject} for ${leadName}`, 
      type: 'success' 
    });
  };

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    leads.forEach(l => l.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [leads]);

  const handleAssign = (leadId: string, agentId: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, assignedTo: agentId } : l));
  };

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        if (newStatus === LeadStatus.CONVERTED && notificationSettings?.onConversion) {
          triggerEmailNotification("Trip Conversion Success", l.name);
        }
        return { ...l, status: newStatus };
      }
      return l;
    }));
  };

  const handleCreateAgent = () => {
    if (!newAgent.name) return;
    const agent: Agent = {
      id: `ai-${Date.now()}`,
      name: newAgent.name,
      role: 'Custom AI Persona',
      avatar: newAgent.avatar || '🤖',
      isAI: true,
      persona: newAgent.persona,
      knowledgeBase: newAgent.knowledgeBase,
      style: newAgent.style as any
    };
    setTeam(prev => [...prev, agent]);
    setIsCreatingAgent(false);
    setNewAgent({ name: '', persona: '', knowledgeBase: '', style: 'Helpful', avatar: '🤖' });
  };

  const handleAddTag = (leadId: string) => {
    const tagName = newTagInputs[leadId]?.trim();
    if (!tagName) return;
    setLeads(prev => prev.map(l => {
      if (l.id === leadId && !l.tags.includes(tagName)) {
        if (['VIP', 'High Priority'].includes(tagName) && notificationSettings?.onHighPriority) {
          triggerEmailNotification("High Priority Lead Alert", l.name);
        }
        return { ...l, tags: [...l.tags, tagName] };
      }
      return l;
    }));
    setNewTagInputs(prev => ({ ...prev, [leadId]: '' }));
  };

  const handleRemoveTag = (leadId: string, tagToRemove: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, tags: l.tags.filter(t => t !== tagToRemove) } : l));
  };

  const handleSetReminder = (leadId: string, dateTime: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        if (notificationSettings?.onReminder) {
          triggerEmailNotification("Follow-up Reminder Scheduled", l.name);
        }
        return { ...l, reminder: { dateTime } };
      }
      return l;
    }));
    setSchedulingLeadId(null);
  };

  const clearReminder = (leadId: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, reminder: undefined } : l));
  };

  const filteredLeads = leads.filter(l => {
    const sourceMatch = filterSource === 'All' || l.source === filterSource;
    const tagMatch = filterTag === 'All' || l.tags.includes(filterTag);
    return sourceMatch && tagMatch;
  });

  const formatReminder = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    return `${isToday ? 'Today' : date.toLocaleDateString()} @ ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 relative">
      {/* Toast Notification Simulation */}
      {activeToast && (
        <div className="fixed top-20 right-8 z-[60] animate-in slide-in-from-right-8 fade-in">
          <div className={`px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 ${activeToast.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-indigo-600 border-indigo-500 text-white'}`}>
             <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
             </div>
             <div>
                <p className="text-xs font-bold leading-tight">System Notification</p>
                <p className="text-[11px] opacity-90">{activeToast.message}</p>
             </div>
             <button onClick={() => setActiveToast(null)} className="ml-4 opacity-50 hover:opacity-100">✕</button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Omnichannel Hub</h2>
          <p className="text-sm text-slate-500">Intelligent lead workflow management for Smiles To Miles.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setActiveTab('leads')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'leads' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>📥 Leads</button>
          <button onClick={() => setActiveTab('calls')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'calls' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>📞 Calls</button>
          <button onClick={() => setActiveTab('agents')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'agents' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>🤖 AI Agents</button>
        </div>
      </div>

      {activeTab === 'leads' ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-3 w-full sm:w-auto">
              <select value={filterSource} onChange={(e) => setFilterSource(e.target.value as any)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
                <option value="All">All Sources</option>
                {Object.values(LeadSource).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={filterTag} onChange={(e) => setFilterTag(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
                <option value="All">All Tags</option>
                {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
              </select>
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${notificationSettings?.email ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
              Alerts: {notificationSettings?.email || 'Disabled'}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Info</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Follow-up</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assignment</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => {
                  const assignedAgent = team.find(a => a.id === lead.assignedTo);
                  const isReminderToday = lead.reminder && new Date(lead.reminder.dateTime).toDateString() === new Date().toDateString();

                  return (
                    <tr key={lead.id} className={`hover:bg-slate-50/80 transition-colors group ${isReminderToday ? 'bg-amber-50/30' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{lead.name}</div>
                        <div className="text-xs text-slate-400 font-mono">{lead.contact}</div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {lead.tags.map(tag => (
                            <span key={tag} className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${tag === 'VIP' || tag === 'High Priority' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}>{tag}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {lead.reminder ? (
                          <div className={`px-2 py-1 rounded-md text-[10px] font-bold inline-flex items-center gap-1.5 ${isReminderToday ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                            ⏰ {formatReminder(lead.reminder.dateTime)}
                          </div>
                        ) : (
                          <button onClick={() => setSchedulingLeadId(lead.id)} className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors">+ Set Follow-up</button>
                        )}
                        {schedulingLeadId === lead.id && (
                          <div className="absolute z-20 mt-2 p-3 bg-white rounded-xl shadow-2xl border border-slate-200 animate-in zoom-in-95">
                            <input type="datetime-local" className="text-xs border rounded p-1 mb-2 w-full" onChange={(e) => handleSetReminder(lead.id, e.target.value)} />
                            <div className="flex justify-end gap-2">
                              <button onClick={() => setSchedulingLeadId(null)} className="text-[10px] font-bold text-slate-400">Cancel</button>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                         <select 
                            value={lead.status} 
                            onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                            className="bg-transparent border-none text-[11px] font-bold text-slate-700 focus:ring-0 outline-none cursor-pointer"
                          >
                            {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{assignedAgent?.avatar || '👤'}</span>
                          <select value={lead.assignedTo || ''} onChange={(e) => handleAssign(lead.id, e.target.value)} className="bg-transparent border-none text-[11px] font-bold text-slate-700 outline-none">
                            <option value="" disabled>Unassigned</option>
                            {team.map(agent => <option key={agent.id} value={agent.id}>{agent.name} {agent.isAI ? '(AI)' : ''}</option>)}
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex justify-end gap-2">
                            <input 
                              type="text" 
                              placeholder="Tag..." 
                              value={newTagInputs[lead.id] || ''} 
                              onChange={(e) => setNewTagInputs(prev => ({ ...prev, [lead.id]: e.target.value }))}
                              onKeyPress={(e) => e.key === 'Enter' && handleAddTag(lead.id)}
                              className="bg-slate-50 border rounded px-2 py-0.5 text-[10px] w-14 outline-none focus:ring-1 focus:ring-indigo-300" 
                            />
                            <button className="text-indigo-600 font-bold text-[10px] uppercase hover:underline">Chat</button>
                         </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'agents' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Travel Agent Fleets</h3>
              <p className="text-xs text-slate-400">Deploy custom AI with unique personas for your specific niche.</p>
            </div>
            <button 
              onClick={() => setIsCreatingAgent(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg"
            >
              Deploy New Persona
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.filter(a => a.isAI).map((agent) => (
              <div key={agent.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-200 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {agent.avatar}
                  </div>
                  <span className="px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700">
                    {agent.style || 'Helpful'} Mode
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-lg mb-1">{agent.name}</h4>
                <p className="text-xs text-slate-500 mb-4 italic line-clamp-2">"{agent.persona || 'Default AI Assistant Persona'}"</p>
                
                <div className="space-y-2 border-t pt-4 border-slate-50">
                   <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400">
                    <span>Performance</span>
                    <span className="text-indigo-600">Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isCreatingAgent && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-in zoom-in-95">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Create Custom Travel Expert</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Expert Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Maldives Guru"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      value={newAgent.name}
                      onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Persona Brief</label>
                    <textarea 
                      placeholder="Define the tone, specialty, and interaction style..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 h-24"
                      value={newAgent.persona}
                      onChange={(e) => setNewAgent({...newAgent, persona: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Communication Style</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none"
                        value={newAgent.style}
                        onChange={(e) => setNewAgent({...newAgent, style: e.target.value as any})}
                      >
                        <option value="Helpful">Helpful & Friendly</option>
                        <option value="Formal">Professional & Direct</option>
                        <option value="Casual">Casual & Witty</option>
                        <option value="Aggressive">High Conversion Focus</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex gap-3">
                  <button onClick={() => setIsCreatingAgent(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
                  <button onClick={handleCreateAgent} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Deploy Specialist</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-20 text-center">
          <div className="text-4xl mb-4">🎙️</div>
          <p className="text-slate-400 font-medium">Smiles To Miles Voice AI Logs are loading...</p>
        </div>
      )}
    </div>
  );
};

export default LeadManager;
