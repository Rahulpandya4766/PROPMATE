
import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, Home, Users, Zap, BarChart3, Settings, 
  LogOut, Bell, Search, Plus, Sparkles, Calendar, CheckCircle2, Clock, 
  ShieldCheck, X, Building, UserPlus, FileText, ChevronUp
} from 'lucide-react';
import { Reminder } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userPlan?: string;
  onLogout: () => void;
  onGoProperties?: () => void;
  onGoClients?: () => void;
  onGoMatching?: () => void;
  onGoReminders?: () => void;
  onGoHome?: () => void;
  onGoReports?: () => void;
  onGoSettings?: () => void;
  onOpenSmartSearch?: () => void;
  reminders?: Reminder[];
  onToggleReminder?: (id: string) => void;
  userEmail?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  onLogout,
  onGoProperties,
  onGoClients,
  onGoMatching,
  onGoReminders,
  onGoHome,
  onGoReports,
  onGoSettings,
  onOpenSmartSearch,
  reminders = [],
  onToggleReminder,
  userEmail = 'Piyushdidwania@gmail.com'
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);

  const activeReminders = reminders.filter(r => !r.isCompleted);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'properties', label: 'Properties', icon: <Home size={20} /> },
    { id: 'clients', label: 'Clients & Leads', icon: <Users size={20} /> },
    { id: 'reminders', label: 'Reminders', icon: <Calendar size={20} /> },
    { id: 'matching', label: 'Smart Matching', icon: <Zap size={20} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const profilePhotoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userEmail)}&background=6366f1&color=fff&bold=true&size=128`;

  // Close FAB when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsFabOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFabAction = (action: (() => void) | undefined) => {
    if (action) {
      action();
      setIsFabOpen(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar - Desktop only */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} transition-all duration-500 bg-indigo-950 text-white hidden lg:flex flex-col border-r border-indigo-900/50 shadow-2xl z-40`}>
        <div className="p-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20 transform rotate-3 shrink-0">
            <span className="text-white font-black text-2xl">P</span>
          </div>
          {isSidebarOpen && (
            <div className="animate-in fade-in slide-in-from-left duration-500">
              <span className="text-2xl font-black tracking-tight block">PropMate</span>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest whitespace-nowrap">Cloud Workspace</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all relative group ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-indigo-300/70 hover:bg-white/5 hover:text-white'}`}
            >
              <span className={`${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform shrink-0`}>{item.icon}</span>
              {isSidebarOpen && <span className="font-bold text-sm whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-5 py-4 text-indigo-400 hover:text-rose-400 transition-all rounded-2xl font-bold text-sm hover:bg-rose-500/5 group">
            <LogOut size={20} className="shrink-0" />
            {isSidebarOpen && <span className="whitespace-nowrap">Sign Out</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4 lg:gap-8 flex-1">
            <div className="lg:hidden w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg" onClick={onGoHome}>P</div>
             <div className="relative max-w-lg w-full group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search database..." 
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-[1.5rem] text-sm text-black focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 outline-none transition-all font-black" 
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 lg:gap-5 lg:pl-8 lg:border-l lg:border-slate-100">
               <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-black">Piyush Admin</p>
                <div className="flex items-center gap-1 justify-end">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live</span>
                </div>
              </div>
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-[1.25rem] bg-indigo-50 border-4 border-white shadow-xl overflow-hidden ring-1 ring-slate-100 flex items-center justify-center shrink-0">
                <img src={profilePhotoUrl} className="w-full h-full object-cover" alt="Profile" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[#f8fafc]/50 relative">
          {children}
        </main>

        {/* Mobile FAB Hub - Removed Smart Search, Added Smart Matching */}
        <div ref={fabRef} className="lg:hidden fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          {isFabOpen && (
            <div className="flex flex-col items-end gap-3 mb-2 animate-in slide-in-from-bottom-5 duration-300">
              <FabItem 
                label="Smart Matching" 
                icon={<Zap size={20} />} 
                onClick={() => handleFabAction(onGoMatching)} 
                color="bg-indigo-600 text-white shadow-indigo-200"
              />
              <div className="h-px w-8 bg-slate-200 my-1"></div>
              <FabItem 
                label="Settings" 
                icon={<Settings size={20} />} 
                onClick={() => handleFabAction(onGoSettings)} 
                color="bg-white text-slate-600"
              />
              <FabItem 
                label="Reports" 
                icon={<BarChart3 size={20} />} 
                onClick={() => handleFabAction(onGoReports)} 
                color="bg-white text-emerald-600"
              />
              <FabItem 
                label="Reminders" 
                icon={<Calendar size={20} />} 
                onClick={() => handleFabAction(onGoReminders)} 
                color="bg-white text-indigo-600"
              />
              <FabItem 
                label="Clients" 
                icon={<Users size={20} />} 
                onClick={() => handleFabAction(onGoClients)} 
                color="bg-white text-indigo-600"
              />
              <FabItem 
                label="Properties" 
                icon={<Home size={20} />} 
                onClick={() => handleFabAction(onGoProperties)} 
                color="bg-white text-indigo-600"
              />
              <FabItem 
                label="Dashboard" 
                icon={<LayoutDashboard size={20} />} 
                onClick={() => handleFabAction(onGoHome)} 
                color="bg-white text-indigo-600"
              />
            </div>
          )}
          
          <button 
            onClick={() => setIsFabOpen(!isFabOpen)}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform ${isFabOpen ? 'bg-slate-900 rotate-45 scale-90' : 'bg-indigo-600 hover:scale-110 active:scale-95'}`}
          >
            {isFabOpen ? <X size={28} className="text-white" /> : <Plus size={28} className="text-white" />}
          </button>
        </div>

        {/* Overlay backdrop for FAB */}
        {isFabOpen && (
          <div className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 transition-all duration-300" onClick={() => setIsFabOpen(false)}></div>
        )}
      </div>
    </div>
  );
};

const FabItem = ({ label, icon, onClick, color }: { label: string, icon: React.ReactNode, onClick: () => void, color: string }) => (
  <div className="flex items-center gap-3 group" onClick={onClick}>
    <span className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl opacity-0 group-hover:opacity-100 lg:opacity-100 transition-opacity">
      {label}
    </span>
    <button className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl border border-slate-100 transition-all active:scale-90 ${color}`}>
      {icon}
    </button>
  </div>
);
