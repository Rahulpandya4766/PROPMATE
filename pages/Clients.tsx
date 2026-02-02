
import React, { useState } from 'react';
import { Plus, Search, MapPin, X, Star, Trash2, Building, TrendingUp, Phone, Mail, User, Briefcase, UsersIcon, Calendar, Info, ShieldCheck } from 'lucide-react';
import { Client, LeadStage, TransactionType, FurnishingStatus } from '../types';

interface ClientsPageProps {
  clients: Client[];
  onAdd: (client: Client) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onAutoMatch: (client: Client) => void;
}

export const ClientsPage: React.FC<ClientsPageProps> = ({ 
  clients, 
  onAdd, 
  onDelete, 
  onToggleFavorite,
  onAutoMatch 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lead CRM Hub</h1>
          <p className="text-slate-500 text-sm font-medium">Manage comprehensive client profiles.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all"
        >
          <Plus size={20} /> Register Detailed Lead
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or phone..." 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black outline-none focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Profile</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Requirement</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stage</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 group cursor-pointer" onClick={() => setSelectedClient(client)}>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl shadow-sm border border-indigo-100 transform group-hover:rotate-3 transition-transform">
                        {client.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-base font-black text-black">{client.name}</p>
                          {client.isFavorite && <Star size={12} className="text-amber-400 fill-amber-400" />}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{client.profession || 'Self Employed'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-black">₹{client.budgetMax.toLocaleString()} Max</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{client.bhkPreference.join(', ')}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      client.leadStage === LeadStage.CLOSED ? 'bg-emerald-50 text-emerald-600' :
                      client.leadStage === LeadStage.LOST ? 'bg-rose-50 text-rose-600' :
                      'bg-indigo-50 text-indigo-600'
                    }`}>
                      {client.leadStage}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-4">
                      <button 
                        onClick={() => onAutoMatch(client)}
                        className="text-indigo-600 hover:text-indigo-800 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest"
                      >
                        <TrendingUp size={16} /> Smart Match
                      </button>
                      <button 
                        onClick={() => onToggleFavorite(client.id)}
                        className={`transition-all ${client.isFavorite ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400'}`}
                      >
                        <Star size={20} className={client.isFavorite ? 'fill-amber-400' : ''} />
                      </button>
                      <button onClick={() => onDelete(client.id)} className="text-slate-300 hover:text-rose-500 transition-all">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && <AddClientModal onClose={() => setShowAddModal(false)} onAdd={onAdd} />}
      {selectedClient && <ClientDetailModal client={selectedClient} onClose={() => setSelectedClient(null)} />}
    </div>
  );
};

const ClientDetailModal: React.FC<{ client: Client; onClose: () => void }> = ({ client, onClose }) => (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
    <div className="bg-white w-full max-w-4xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
      <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-xl">
             {client.name[0]}
           </div>
           <div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">{client.name}</h2>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{client.leadStage} Lead</p>
           </div>
        </div>
        <button onClick={onClose} className="p-4 hover:bg-white rounded-2xl text-slate-400 shadow-sm border border-transparent hover:border-slate-100 transition-all">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-12 space-y-12">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
             <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Contact & Identity</h4>
             <div className="space-y-4">
                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                   <Phone size={18} className="text-indigo-600" />
                   <span className="text-black font-black">{client.phone}</span>
                </div>
                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                   <Mail size={18} className="text-indigo-600" />
                   <span className="text-black font-black">{client.email || 'No email provided'}</span>
                </div>
                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                   <Briefcase size={18} className="text-indigo-600" />
                   <span className="text-black font-black">{client.profession || 'Self Employed'}</span>
                </div>
             </div>
          </div>
          
          <div className="space-y-6">
             <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Family & Lifestyle</h4>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                   <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Status</p>
                   <p className="text-sm font-black text-black">{client.maritalStatus}</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                   <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Family Size</p>
                   <p className="text-sm font-black text-black">{client.familySize} Members</p>
                </div>
             </div>
             <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic">
               <p className="text-sm text-black font-bold leading-relaxed">"{client.description}"</p>
             </div>
          </div>
        </section>

        <section className="space-y-6 pt-8 border-t border-slate-100">
           <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Property Requirements</h4>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <RequirementBlock label="Transaction" value={client.requirement} />
              <RequirementBlock label="Budget Max" value={`₹${client.budgetMax.toLocaleString()}`} />
              <RequirementBlock label="BHK Preference" value={client.bhkPreference.join('/')} />
              <RequirementBlock label="Move-in Date" value={new Date(client.moveInDate).toLocaleDateString()} />
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Preferred Neighborhoods</p>
                 <div className="flex flex-wrap gap-2">
                    {client.preferredAreas.map(a => <span key={a} className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-xs font-black text-black">{a}</span>)}
                 </div>
              </div>
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Furnishing Preference</p>
                 <div className="flex flex-wrap gap-2">
                    {client.furnishingPreference.map(f => <span key={f} className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-xs font-black text-black">{f}</span>)}
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  </div>
);

const RequirementBlock = ({ label, value }: { label: string, value: string }) => (
  <div className="space-y-1">
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className="text-sm font-black text-black">{value}</p>
  </div>
);

const AddClientModal: React.FC<{ onClose: () => void; onAdd: (c: Client) => void }> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState<Partial<Client>>({ 
    name: '', phone: '', email: '', description: '', profession: '', 
    maritalStatus: 'Bachelor', familySize: 1, requirement: TransactionType.RENT,
    preferredAreas: [], preferredCity: 'Mumbai', bhkPreference: ['2BHK'],
    furnishingPreference: [FurnishingStatus.SEMI], budgetMin: 0, budgetMax: 0,
    moveInDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...(formData as Client),
      id: `c${Date.now()}`,
      leadStage: LeadStage.NEW,
      createdAt: new Date().toISOString(),
      isFavorite: false,
      tags: []
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Register Detailed Lead</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Lead Capture Protocol</p>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"><X size={24}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input label="Full Name" required onChange={v => setFormData({...formData, name: v})} />
              <Input label="Phone Number" required onChange={v => setFormData({...formData, phone: v})} />
              <Input label="Email Address" onChange={v => setFormData({...formData, email: v})} />
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Requirements & Budget</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Type</label>
                 <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black appearance-none" onChange={e => setFormData({...formData, requirement: e.target.value as any})}>
                    <option value={TransactionType.RENT}>Rent</option><option value={TransactionType.SALE}>Sale</option>
                 </select>
               </div>
               <Input label="Min Budget" type="number" onChange={v => setFormData({...formData, budgetMin: Number(v)})} />
               <Input label="Max Budget" type="number" onChange={v => setFormData({...formData, budgetMax: Number(v)})} />
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Move-in Date</label>
                 <input type="date" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black" onChange={e => setFormData({...formData, moveInDate: e.target.value})} />
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Profile Narrative</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Input label="Profession" placeholder="e.g. Software Architect" onChange={v => setFormData({...formData, profession: v})} />
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Family Size</label>
                 <input type="number" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black" onChange={e => setFormData({...formData, familySize: Number(e.target.value)})} />
               </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Requirement Description</label>
              <textarea required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black min-h-[100px]" placeholder="Specific details about views, floors, or Vastu..." onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs shadow-2xl hover:bg-indigo-700 transition-all">Submit Lead to CRM</button>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, type = 'text', placeholder, required, onChange }: { label: string, type?: string, placeholder?: string, required?: boolean, onChange: (v: string) => void }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">{label}</label>
    <input 
      type={type} 
      required={required}
      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black" 
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)} 
    />
  </div>
);
