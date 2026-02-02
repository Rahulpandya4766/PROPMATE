
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, ComposedChart, Line
} from 'recharts';
import { 
  Download, TrendingUp, DollarSign, Home, Users, 
  BarChart3, UserCheck, UserX, Clock, Target, 
  MapPin, Sparkles, Filter, Briefcase, Zap
} from 'lucide-react';
import { Property, Client, PropertyStatus, Reminder, ReminderStatus, LeadStage } from '../types';

interface ReportsPageProps {
  properties: Property[];
  clients: Client[];
  reminders: Reminder[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'];

export const ReportsPage: React.FC<ReportsPageProps> = ({ properties, clients, reminders }) => {
  
  // 1. Lead Funnel Logic
  const funnelData = useMemo(() => {
    return Object.values(LeadStage).map(stage => ({
      name: stage,
      count: clients.filter(c => c.leadStage === stage).length
    }));
  }, [clients]);

  // 2. Area Popularity Heatmap
  const areaData = useMemo(() => {
    const areas: Record<string, number> = {};
    properties.forEach(p => {
      areas[p.location.area] = (areas[p.location.area] || 0) + 1;
    });
    return Object.entries(areas)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [properties]);

  // 3. Inventory Health
  const inventoryData = useMemo(() => [
    { name: 'Available', value: properties.filter(p => p.status === PropertyStatus.AVAILABLE).length },
    { name: 'Rented', value: properties.filter(p => p.status === PropertyStatus.RENTED).length },
    { name: 'Sold', value: properties.filter(p => p.status === PropertyStatus.SOLD).length },
  ].filter(d => d.value > 0), [properties]);

  // 4. Financial Calculations
  const totalValue = properties.reduce((acc, p) => acc + p.price, 0);
  const avgTicket = properties.length > 0 ? totalValue / properties.length : 0;
  
  const completedReminders = reminders.filter(r => r.status === ReminderStatus.COMPLETED);
  const clientAbsence = completedReminders.filter(r => r.clientPresent === false).length;
  const showRate = completedReminders.length > 0 
    ? Math.round(((completedReminders.length - clientAbsence) / completedReminders.length) * 100) 
    : 100;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-slate-500 font-medium">Business intelligence for property owners and managers.</p>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
             <Download size={20} /> Export Dataset
           </button>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsStat 
          icon={<DollarSign/>} 
          label="Managed Portfolio" 
          value={`₹${(totalValue / 10000000).toFixed(2)}Cr`} 
          sub="Total Gross Asset Value" 
          color="bg-indigo-600 text-white" 
        />
        <AnalyticsStat 
          icon={<Target/>} 
          label="Lead Conversion" 
          value={`${Math.round((clients.filter(c => c.leadStage === LeadStage.CLOSED).length / (clients.length || 1)) * 100)}%`} 
          sub="Win Rate (Closed/Lost)" 
          color="bg-emerald-500 text-white" 
        />
        <AnalyticsStat 
          icon={<Zap/>} 
          label="Meeting Precision" 
          value={`${showRate}%`} 
          sub="Client Attendance Rate" 
          color="bg-amber-500 text-white" 
        />
        <AnalyticsStat 
          icon={<Clock/>} 
          label="Cycle Time" 
          value="14 Days" 
          sub="Avg. Time to Close" 
          color="bg-slate-900 text-white" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lead Funnel Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900">Lead Conversion Funnel</h3>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Movement across sales stages</p>
            </div>
            <div className="flex gap-2">
               <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase">Active Pipeline</span>
            </div>
          </div>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#475569', fontSize: 10, fontWeight: 900}} 
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 12, 12, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#6366f1' : '#f1f5f9'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Mix */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-10">
            <h3 className="text-xl font-black text-slate-900">Inventory Status</h3>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Listing availability mix</p>
          </div>
          <div className="h-64 w-full relative mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={inventoryData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={75} 
                  outerRadius={100} 
                  paddingAngle={8} 
                  dataKey="value" 
                  stroke="none"
                >
                  {inventoryData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-900">{properties.length}</span>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Units</span>
            </div>
          </div>
          <div className="space-y-3 mt-auto">
             {inventoryData.map((item, i) => (
               <div key={item.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{item.value}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Area Demand */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900">Top Markets</h3>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Highest listing density by area</p>
            </div>
            <MapPin className="text-slate-200" size={32} />
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={areaData}>
                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} 
                />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" radius={[12, 12, 0, 0]} barSize={40} />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{ r: 6, fill: '#6366f1' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Section */}
        <div className="bg-slate-950 p-12 rounded-[4rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
           <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 transform rotate-6">
                    <Sparkles className="text-white fill-white/20" size={24} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black tracking-tight leading-none">AI Business Strategy</h3>
                    <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">PropMate Analytics Engine</p>
                 </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl">
                   <p className="text-sm font-medium leading-relaxed italic opacity-90">
                     "Your conversion rate in the <span className="text-indigo-400 font-bold">Bandra Market</span> is 22% higher than average. Strategy recommendation: Re-allocate 15% of your marketing budget from underperforming Alibaug villas to high-rise Bandra units to maximize Q4 revenue."
                   </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl">
                      <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Growth Forecast</p>
                      <p className="text-2xl font-black mt-2">+14.2%</p>
                   </div>
                   <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl">
                      <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Client Satisfaction</p>
                      <p className="text-2xl font-black mt-2">9.2/10</p>
                   </div>
                </div>
              </div>
           </div>
           
           <button className="relative z-10 w-full mt-10 py-5 bg-white text-slate-950 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-slate-50 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
              Request Custom Deep-Dive <TrendingUp size={16} />
           </button>

           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none"></div>
           <Sparkles className="absolute -right-10 -bottom-10 w-48 h-48 text-white/5 opacity-50 transform rotate-12 group-hover:scale-110 transition-transform duration-1000" />
        </div>
      </div>
    </div>
  );
};

const AnalyticsStat = ({ icon, label, value, sub, color }: any) => (
  <div className={`${color} p-8 rounded-[3rem] shadow-xl shadow-indigo-500/10 flex flex-col justify-between group overflow-hidden relative transform hover:-translate-y-1 transition-all`}>
    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">{label}</p>
      <h3 className="text-3xl font-black mt-2 tracking-tighter">{value}</h3>
      <p className="text-[10px] font-bold mt-2 opacity-60">{sub}</p>
    </div>
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
  </div>
);
