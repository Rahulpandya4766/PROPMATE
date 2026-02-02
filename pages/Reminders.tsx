
import React, { useState, useEffect } from 'react';
import { 
  Plus, Calendar, Clock, Trash2, CheckCircle2, AlertCircle, 
  Search, X, User, Home, ChevronRight, Bell, CalendarDays, 
  Sparkles, LayoutList, Calendar as CalendarIcon, MoreVertical,
  Check, UserCheck, UserX, Building
} from 'lucide-react';
import { Reminder, ReminderType, Client, Property, ReminderStatus } from '../types';

interface RemindersPageProps {
  reminders: Reminder[];
  clients: Client[];
  properties: Property[];
  onAdd: (rem: Reminder) => void;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Reminder>) => void;
  onDelete: (id: string) => void;
  triggerModal?: number;
}

export const RemindersPage: React.FC<RemindersPageProps> = ({ 
  reminders, 
  clients, 
  properties, 
  onAdd, 
  onToggle, 
  onUpdate,
  onDelete,
  triggerModal
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);

  useEffect(() => {
    if (triggerModal && triggerModal > 0) setShowAddModal(true);
  }, [triggerModal]);

  const sortedReminders = [...reminders].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleSetOutcome = (id: string, clientPresent: boolean, ownerPresent: boolean) => {
    onUpdate(id, { 
      clientPresent, 
      ownerPresent, 
      status: ReminderStatus.COMPLETED,
      isCompleted: true 
    });
    setSelectedOutcome(null);
  };

  const handleReschedule = (id: string) => {
    const newTime = prompt("Enter new time (YYYY-MM-DDTHH:MM)", reminders.find(r => r.id === id)?.time);
    if (newTime) {
      const current = reminders.find(r => r.id === id);
      onUpdate(id, { 
        time: newTime, 
        status: ReminderStatus.RESCHEDULED, 
        rescheduleCount: (current?.rescheduleCount || 0) + 1 
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Agent Schedule</h1>
          <p className="text-slate-500 font-medium mt-1">Manage meetings, site visits, and outcome reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-2xl border border-slate-100 flex gap-1 shadow-sm">
             <button 
              onClick={() => setView('list')}
              className={`p-2.5 rounded-xl transition-all ${view === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:bg-slate-50'}`}
             >
               <LayoutList size={20} />
             </button>
             <button 
              onClick={() => setView('calendar')}
              className={`p-2.5 rounded-xl transition-all ${view === 'calendar' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:bg-slate-50'}`}
             >
               <CalendarIcon size={20} />
             </button>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
          >
            <Plus size={20} /> Add Task
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-4">
            {sortedReminders.length > 0 ? (
              sortedReminders.map(rem => (
                <div key={rem.id} className={`group bg-white p-8 rounded-[2.5rem] border border-slate-200 transition-all relative ${rem.isCompleted ? 'bg-slate-50/50' : 'hover:shadow-xl hover:border-indigo-100'}`}>
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 border ${rem.isCompleted ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                      <span className="text-[10px] font-black uppercase">{new Date(rem.time).toLocaleDateString(undefined, { month: 'short' })}</span>
                      <span className="text-2xl font-black leading-none">{new Date(rem.time).getDate()}</span>
                    </div>

                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          rem.status === ReminderStatus.COMPLETED ? 'bg-emerald-100 text-emerald-600' :
                          rem.status === ReminderStatus.RESCHEDULED ? 'bg-amber-100 text-amber-600' :
                          'bg-indigo-100 text-indigo-600'
                        }`}>{rem.status}</span>
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5"><Clock size={14}/> {new Date(rem.time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                        {rem.rescheduleCount > 0 && <span className="text-[9px] font-black text-amber-500 uppercase">Rescheduled {rem.rescheduleCount}x</span>}
                      </div>
                      
                      <h3 className={`text-xl font-black text-slate-900 tracking-tight ${rem.isCompleted ? 'line-through text-slate-400' : ''}`}>{rem.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2 italic leading-relaxed">{rem.description}</p>

                      <div className="flex flex-wrap gap-3 pt-2">
                        {rem.clientId && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-100">
                            <User size={12}/> {clients.find(c => c.id === rem.clientId)?.name}
                            {rem.isCompleted && (rem.clientPresent ? <UserCheck size={12} className="text-emerald-500"/> : <UserX size={12} className="text-rose-500"/>)}
                          </div>
                        )}
                        {rem.propertyId && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-100">
                            <Building size={12}/> {properties.find(p => p.id === rem.propertyId)?.title.slice(0, 15)}...
                            {rem.isCompleted && (rem.ownerPresent ? <UserCheck size={12} className="text-emerald-500"/> : <UserX size={12} className="text-rose-500"/>)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                       {!rem.isCompleted && (
                         <>
                           <button onClick={() => setSelectedOutcome(rem.id)} className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                             <CheckCircle2 size={24} />
                           </button>
                           <button onClick={() => handleReschedule(rem.id)} className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all shadow-sm">
                             <CalendarIcon size={20} />
                           </button>
                         </>
                       )}
                       <button onClick={() => onDelete(rem.id)} className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                         <Trash2 size={20} />
                       </button>
                    </div>
                  </div>

                  {selectedOutcome === rem.id && (
                    <div className="mt-6 p-6 bg-slate-50 rounded-3xl border border-indigo-100 animate-in zoom-in-95">
                       <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Meeting Outcome Report</h4>
                       <div className="grid grid-cols-2 gap-4">
                          <button onClick={() => handleSetOutcome(rem.id, true, true)} className="p-4 bg-white rounded-2xl text-xs font-bold text-slate-700 hover:border-emerald-500 border border-slate-200 transition-all flex flex-col items-center gap-2">
                             <div className="flex gap-1 text-emerald-500"><UserCheck size={16}/><UserCheck size={16}/></div>
                             Both Present
                          </button>
                          <button onClick={() => handleSetOutcome(rem.id, true, false)} className="p-4 bg-white rounded-2xl text-xs font-bold text-slate-700 hover:border-amber-500 border border-slate-200 transition-all flex flex-col items-center gap-2">
                             <div className="flex gap-1"><UserCheck size={16} className="text-emerald-500"/><UserX size={16} className="text-rose-500"/></div>
                             Only Client
                          </button>
                          <button onClick={() => handleSetOutcome(rem.id, false, true)} className="p-4 bg-white rounded-2xl text-xs font-bold text-slate-700 hover:border-amber-500 border border-slate-200 transition-all flex flex-col items-center gap-2">
                             <div className="flex gap-1"><UserX size={16} className="text-rose-500"/><UserCheck size={16} className="text-emerald-500"/></div>
                             Only Owner
                          </button>
                          <button onClick={() => handleSetOutcome(rem.id, false, false)} className="p-4 bg-white rounded-2xl text-xs font-bold text-slate-700 hover:border-rose-500 border border-slate-200 transition-all flex flex-col items-center gap-2">
                             <div className="flex gap-1 text-rose-500"><UserX size={16}/><UserX size={16}/></div>
                             No-Show
                          </button>
                       </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-24 text-center bg-white rounded-[3rem] border border-slate-100 border-dashed">
                <CalendarDays size={64} className="mx-auto mb-6 text-slate-100" />
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No activities scheduled</p>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Attendance Metrics</h4>
               <div className="space-y-4">
                  <MetricRow label="Meetings Completed" value={reminders.filter(r => r.status === ReminderStatus.COMPLETED).length} />
                  <MetricRow label="Client No-Shows" value={reminders.filter(r => r.isCompleted && r.clientPresent === false).length} color="text-rose-500" />
                  <MetricRow label="Owner No-Shows" value={reminders.filter(r => r.isCompleted && r.ownerPresent === false).length} color="text-amber-500" />
                  <MetricRow label="Reschedule Rate" value={`${Math.round((reminders.filter(r => r.rescheduleCount > 0).length / (reminders.length || 1)) * 100)}%`} />
               </div>
            </div>
          </aside>
        </div>
      ) : (
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl animate-in zoom-in-95 duration-500">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h3>
           </div>
           <div className="grid grid-cols-7 gap-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">{day}</div>
              ))}
              {calendarDays.map(day => {
                const dayReminders = sortedReminders.filter(r => new Date(r.time).getDate() === day && new Date(r.time).getMonth() === currentMonth);
                return (
                  <div key={day} className={`min-h-[140px] p-4 rounded-3xl border border-slate-100 flex flex-col gap-2 group transition-all hover:border-indigo-200 ${day === new Date().getDate() ? 'bg-indigo-50/30 border-indigo-200 ring-4 ring-indigo-50' : 'bg-slate-50/30'}`}>
                    <span className={`text-sm font-black ${day === new Date().getDate() ? 'text-indigo-600' : 'text-slate-400'}`}>{day}</span>
                    <div className="space-y-1 overflow-y-auto max-h-[80px] scrollbar-hide">
                      {dayReminders.map(r => (
                        <div key={r.id} className={`text-[9px] p-2 rounded-lg font-bold truncate ${r.isCompleted ? 'bg-slate-100 text-slate-400' : 'bg-indigo-100 text-indigo-700'}`}>
                           {new Date(r.time).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })} • {r.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
           </div>
        </div>
      )}

      {showAddModal && <AddReminderModal onClose={() => setShowAddModal(false)} onAdd={onAdd} clients={clients} properties={properties} />}
    </div>
  );
};

const MetricRow = ({ label, value, color = "text-slate-900" }: { label: string, value: string | number, color?: string }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-50">
     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
     <span className={`text-lg font-black ${color}`}>{value}</span>
  </div>
);

const AddReminderModal: React.FC<{ 
  onClose: () => void; 
  onAdd: (r: Reminder) => void;
  clients: Client[];
  properties: Property[];
}> = ({ onClose, onAdd, clients, properties }) => {
  const [formData, setFormData] = useState<Partial<Reminder>>({
    title: '',
    description: '',
    time: new Date(new Date().getTime() + 3600000).toISOString().slice(0, 16),
    type: ReminderType.MEETING,
    status: ReminderStatus.PENDING,
    isCompleted: false,
    notified: false,
    rescheduleCount: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...(formData as Reminder),
      id: `rem-${Date.now()}`,
      createdAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Add Task</h2>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200/50 rounded-2xl text-slate-400"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="space-y-4">
            <input required placeholder="Task Title" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" onChange={e => setFormData({...formData, title: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <select onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold appearance-none">
                {Object.values(ReminderType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="datetime-local" required defaultValue={formData.time} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" onChange={e => setFormData({...formData, time: e.target.value})} />
            </div>
            <textarea placeholder="Task details..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold min-h-[100px]" onChange={e => setFormData({...formData, description: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <select onChange={e => setFormData({...formData, clientId: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold appearance-none">
                <option value="">No Client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select onChange={e => setFormData({...formData, propertyId: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold appearance-none">
                <option value="">No Property</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Discard</button>
            <button type="submit" className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};
