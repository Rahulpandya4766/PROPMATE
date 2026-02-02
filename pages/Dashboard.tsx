
import React from 'react';
import { 
  Users, 
  Home, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  PlusCircle,
  Zap,
  Sparkles,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Star,
  MapPin,
  Building
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Property, Client, PropertyStatus, Reminder } from '../types';
import { NavigationTab } from '../App';

interface DashboardProps {
  properties: Property[];
  clients: Client[];
  reminders?: Reminder[];
  onToggleReminder?: (id: string) => void;
  onNavigate: (tab: NavigationTab) => void;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export const Dashboard: React.FC<DashboardProps> = ({ properties, clients, reminders = [], onToggleReminder, onNavigate }) => {
  const availableCount = properties.filter(p => p.status === PropertyStatus.AVAILABLE).length;
  const soldCount = properties.filter(p => p.status === PropertyStatus.SOLD).length;
  const rentedCount = properties.filter(p => p.status === PropertyStatus.RENTED).length;

  const pieData = [
    { name: 'Available', value: availableCount },
    { name: 'Sold', value: soldCount },
    { name: 'Rented', value: rentedCount },
  ].filter(d => d.value > 0);

  const upcomingReminders = reminders
    .filter(r => !r.isCompleted)
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
    .slice(0, 3);

  const favoriteProperties = properties.filter(p => p.isFavorite).slice(0, 3);
  const favoriteClients = clients.filter(c => c.isFavorite).slice(0, 3);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Agent Workspace</h1>
          <p className="text-slate-500 font-medium">Your private real estate control center.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Isolated Sync Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Active Listings" 
          value={properties.length.toString()} 
          change="Manage" 
          isPositive={true} 
          icon={<Home className="text-indigo-600" />} 
          onClick={() => onNavigate(NavigationTab.PROPERTIES)}
        />
        <StatCard 
          title="Lead Volume" 
          value={clients.length.toString()} 
          change="Manage" 
          isPositive={true} 
          icon={<Users className="text-emerald-600" />} 
          onClick={() => onNavigate(NavigationTab.CLIENTS)}
        />
        <StatCard 
          title="Upcoming Tasks" 
          value={reminders.filter(r => !r.isCompleted).length.toString()} 
          change="View Schedule" 
          isPositive={true} 
          icon={<Calendar className="text-amber-600" />} 
          onClick={() => onNavigate(NavigationTab.REMINDERS)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Favorites Hub */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Favorites Hub</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Quick access to starred items</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Starred Properties</h4>
                {favoriteProperties.length > 0 ? favoriteProperties.map(p => (
                  <div key={p.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 hover:bg-white hover:shadow-lg transition-all cursor-pointer group" onClick={() => onNavigate(NavigationTab.PROPERTIES)}>
                    <img src={p.photos[0]} className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-black truncate group-hover:text-indigo-600 transition-colors">{p.title}</p>
                      <p className="text-[10px] text-slate-900 flex items-center gap-1 font-bold"><MapPin size={10}/> {p.location.area}</p>
                    </div>
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                  </div>
                )) : <p className="text-xs text-slate-400 italic py-4">No starred properties.</p>}
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Top Leads</h4>
                {favoriteClients.length > 0 ? favoriteClients.map(c => (
                  <div key={c.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 hover:bg-white hover:shadow-lg transition-all cursor-pointer group" onClick={() => onNavigate(NavigationTab.CLIENTS)}>
                    <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xl">{c.name[0]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-black truncate group-hover:text-emerald-600 transition-colors">{c.name}</p>
                      <p className="text-[10px] text-slate-900 uppercase tracking-widest font-black">{c.leadStage}</p>
                    </div>
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                  </div>
                )) : <p className="text-xs text-slate-400 italic py-4">No starred leads.</p>}
              </div>
            </div>
          </div>

          {/* Daily Schedule Widget */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Daily Schedule</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Upcoming agenda items</p>
              </div>
              <button onClick={() => onNavigate(NavigationTab.REMINDERS)} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View Calendar</button>
            </div>
            <div className="space-y-4">
              {upcomingReminders.length > 0 ? (
                upcomingReminders.map(rem => (
                  <div key={rem.id} className="flex items-center gap-6 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-white flex flex-col items-center justify-center border border-slate-100 shadow-sm shrink-0">
                      <span className="text-[10px] font-black text-slate-400 uppercase">{new Date(rem.time).toLocaleDateString(undefined, { month: 'short' })}</span>
                      <span className="text-xl font-black text-slate-900 leading-none">{new Date(rem.time).getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded text-[8px] font-black uppercase tracking-widest">{rem.type}</span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-900">
                          <Clock size={10}/> {new Date(rem.time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 className="font-black text-black truncate">{rem.title}</h4>
                    </div>
                    <button 
                      onClick={() => onToggleReminder?.(rem.id)}
                      className="w-12 h-12 rounded-xl border-2 border-slate-100 flex items-center justify-center text-slate-300 hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-50 transition-all"
                    >
                      <CheckCircle2 size={24} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-[2rem] border border-dashed">
                  <p className="text-xs font-black uppercase tracking-widest">No meetings today</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-full">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Inventory Mix</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">Live listing status</p>
            <div className="h-64 w-full relative mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-black text-slate-900">{properties.length}</span>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Units</span>
              </div>
            </div>
            <div className="space-y-4 mt-auto">
              {pieData.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; change: string; isPositive: boolean; icon: React.ReactNode; onClick: () => void }> = ({ title, value, change, isPositive, icon, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer"
  >
    <div className="flex items-start justify-between">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24 }) : icon}
      </div>
      <div className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {change}
      </div>
    </div>
    <div className="mt-8">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h4>
      <p className="text-3xl font-black text-slate-900 mt-2 tracking-tight">{value}</p>
    </div>
  </div>
);
