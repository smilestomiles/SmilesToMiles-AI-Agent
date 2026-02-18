
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

// --- Types & Data Mockups ---

type Range = 'Today' | '7D' | '30D';

const DATA_SET: Record<Range, any> = {
  'Today': {
    stats: { leads: "42", response: "100%", time: "0.8s", conversion: "3" },
    activity: [
      { time: '08:00', leads: 4, handled: 4 },
      { time: '10:00', leads: 8, handled: 8 },
      { time: '12:00', leads: 12, handled: 12 },
      { time: '14:00', leads: 6, handled: 6 },
      { time: '16:00', leads: 9, handled: 9 },
      { time: '18:00', leads: 3, handled: 3 },
    ],
    sources: [
      { name: 'WhatsApp', value: 20, color: '#25D366' },
      { name: 'Website', value: 12, color: '#6366f1' },
      { name: 'IndiaMart', value: 6, color: '#f59e0b' },
      { name: 'Social', value: 4, color: '#ec4899' },
    ]
  },
  '7D': {
    stats: { leads: "1,120", response: "99.4%", time: "1.2s", conversion: "84" },
    activity: [
      { day: 'Mon', leads: 40, handled: 38 },
      { day: 'Tue', leads: 55, handled: 52 },
      { day: 'Wed', leads: 35, handled: 35 },
      { day: 'Thu', leads: 65, handled: 60 },
      { day: 'Fri', leads: 80, handled: 75 },
      { day: 'Sat', leads: 45, handled: 42 },
      { day: 'Sun', leads: 30, handled: 30 },
    ],
    sources: [
      { name: 'WhatsApp', value: 450, color: '#25D366' },
      { name: 'Website', value: 300, color: '#6366f1' },
      { name: 'IndiaMart', value: 200, color: '#f59e0b' },
      { name: 'Social', value: 150, color: '#ec4899' },
    ]
  },
  '30D': {
    stats: { leads: "4,280", response: "98.9%", time: "1.4s", conversion: "312" },
    activity: Array.from({ length: 15 }, (_, i) => ({
      day: `Day ${i * 2 + 1}`,
      leads: Math.floor(Math.random() * 100) + 50,
      handled: Math.floor(Math.random() * 90) + 40,
    })),
    sources: [
      { name: 'WhatsApp', value: 1800, color: '#25D366' },
      { name: 'Website', value: 1100, color: '#6366f1' },
      { name: 'IndiaMart', value: 950, color: '#f59e0b' },
      { name: 'Social', value: 430, color: '#ec4899' },
    ]
  }
};

// --- Custom Components ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs">
        <p className="font-bold mb-2 text-slate-400">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-3 py-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="capitalize text-slate-300">{entry.name}:</span>
            <span className="font-mono font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, change, icon, trend }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md hover:border-indigo-200 group">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
        {trend === 'up' ? '↑' : '↓'} {change}
      </span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-black text-slate-800 mt-1">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const [range, setRange] = useState<Range>('7D');
  const currentData = useMemo(() => DATA_SET[range], [range]);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Operational Intelligence</h1>
          <p className="text-sm text-slate-500">Real-time performance of your AI travel agents.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {(['Today', '7D', '30D'] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                range === r 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Leads" value={currentData.stats.leads} change="+12.5%" icon="👤" trend="up" />
        <StatCard title="AI Response Rate" value={currentData.stats.response} change="+0.2%" icon="🤖" trend="up" />
        <StatCard title="Avg Handling Time" value={currentData.stats.time} change="-15%" icon="⚡" trend="up" />
        <StatCard title="Converted Trips" value={currentData.stats.conversion} change="+5.4%" icon="🏖️" trend="up" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Activity Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Lead Volume & Resolution</h3>
              <p className="text-xs text-slate-400">Comparing total leads vs AI handled cases</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-1.5 bg-indigo-500 rounded-full"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Leads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-1.5 bg-emerald-500 rounded-full"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Handled</span>
              </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData.activity}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHandled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey={range === 'Today' ? 'time' : 'day'} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorLeads)" 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="handled" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorHandled)" 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#059669' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Distribution Chart */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Sources</h3>
          <p className="text-xs text-slate-400 mb-8">Where your customers find you</p>
          <div className="h-64 flex flex-col items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentData.sources}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {currentData.sources.map((entry: any, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke="none"
                      className="outline-none cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-800">
                {currentData.sources.reduce((a: any, b: any) => a + b.value, 0)}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Leads</span>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {currentData.sources.map((s: any) => (
              <div key={s.name} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }}></div>
                  <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{s.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logs Table (Interactive) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Real-time Agent Activity</h3>
          <button className="text-indigo-600 text-xs font-bold hover:underline">View Full Logs</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operation</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { op: 'Initial Booking Draft', platform: 'WhatsApp', time: '2m ago', status: 'Success' },
                { op: 'Lead Enrichment', platform: 'IndiaMart', time: '14m ago', status: 'Success' },
                { op: 'Quote Generation', platform: 'Website', time: '1h ago', status: 'Scheduled' },
                { op: 'Sentiment Analysis', platform: 'Facebook', time: '2h ago', status: 'Success' },
              ].map((log, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{log.op}</div>
                    <div className="text-[10px] text-slate-400">Lead ID: #STM-{Math.floor(Math.random() * 10000)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                      log.platform === 'WhatsApp' ? 'bg-green-100 text-green-700' :
                      log.platform === 'IndiaMart' ? 'bg-amber-100 text-amber-700' :
                      log.platform === 'Website' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-pink-100 text-pink-700'
                    }`}>
                      {log.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs font-medium">{log.time}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'Success' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
                      <span className={`text-xs font-bold ${log.status === 'Success' ? 'text-emerald-600' : 'text-indigo-600'}`}>{log.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
