
import React, { useState, useEffect } from 'react';
import { Plus, Search, MapPin, X, Star, Trash2, Building, TrendingUp, Phone, Mail, User, Briefcase, UsersIcon, Calendar, Info, ShieldCheck, UserCheck, Edit2, Map } from 'lucide-react';
import { Client, LeadStage, TransactionType, FurnishingStatus, ListingSource } from '../types';

interface ClientsPageProps {
  clients: Client[];
  onAdd: (client: Client) => void;
  onUpdate: (client: Client) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onAutoMatch: (client: Client) => void;
  triggerModal?: number;
}

export const ClientsPage: React.FC<ClientsPageProps> = ({ 
  clients, 
  onAdd, 
  onUpdate,
  onDelete, 
  onToggleFavorite,
  onAutoMatch,
  triggerModal
}) => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (triggerModal && triggerModal > 0) {
      setEditingClient(null);
      setShowFormModal(true);
    }
  }, [triggerModal]);

  const filtered = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.preferredCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.preferredAreas.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
    c.phone.includes(searchQuery)
  );

  const handleEditClick = (e: React.MouseEvent, client: Client) => {
    e.stopPropagation();
    setEditingClient(client);
    setShowFormModal(true);
  };

  const handleAddNew = () => {
    setEditingClient(null);
    setShowFormModal(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lead CRM Hub</h1>
          <p className="text-slate-500 text-sm font-medium">Manage leads and target locations for acquisition.</p>
        </div>
        <button 
          onClick={handleAddNew}
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
              placeholder="Search by city, area, or name..." 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black outline-none focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Profile</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Requirement & Location</th>
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
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{client.profession || 'Self Employed'}</p>
                          <span className="px-2 py-0.5 bg-slate-100 text-[8px] font-black uppercase text-slate-500 rounded">{client.listingSource}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 text-indigo-600 font-black text-xs mb-1">
                        <MapPin size={12} /> {client.preferredAreas[0] || 'Any'}, {client.preferredCity}
                      </div>
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
                        onClick={(e) => handleEditClick(e, client)}
                        className="text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Edit2 size={20} />
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

      {showFormModal && (
        <ClientFormModal 
          onClose={() => { setShowFormModal(false); setEditingClient(null); }} 
          onSave={(c) => {
            editingClient ? onUpdate(c) : onAdd(c);
            setShowFormModal(false);
            setEditingClient(null);
          }} 
          initialData={editingClient}
        />
      )}
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
             <div className="flex items-center gap-2 mt-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{client.leadStage} Lead</p>
               <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${client.listingSource === ListingSource.DIRECT ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                 {client.listingSource}
               </span>
             </div>
           </div>
        </div>
        <button onClick={onClose} className="p-4 hover:bg-white rounded-2xl text-slate-400 shadow-sm border border-transparent hover:border-slate-100 transition-all">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
        <section className="animate-in slide-in-from-top-2">
          <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4 text-left">Geographic Preferences</h4>
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center gap-8">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600">
              <Map size={24} />
            </div>
            <div className="grid grid-cols-2 gap-10 flex-1">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Target City</p>
                <p className="text-xl font-black text-black">{client.preferredCity}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Areas</p>
                <div className="flex flex-wrap gap-2">
                  {client.preferredAreas.map(a => <span key={a} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-black text-black">{a}</span>)}
                </div>
              </div>
            </div>
          </div>
        </section>

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
                   <span className="text-black font-black truncate">{client.email || 'No email provided'}</span>
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

const ClientFormModal: React.FC<{ onClose: () => void; onSave: (c: Client) => void; initialData?: Client | null }> = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Client>>(initialData || { 
    name: '', phone: '', email: '', description: '', profession: '', 
    maritalStatus: 'Bachelor', familySize: 1, requirement: TransactionType.RENT,
    preferredAreas: [], preferredCity: 'Mumbai', bhkPreference: ['2BHK'],
    furnishingPreference: [FurnishingStatus.SEMI], budgetMin: 0, budgetMax: 0,
    moveInDate: new Date().toISOString().split('T')[0],
    listingSource: ListingSource.DIRECT, brokerName: '', brokerNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(formData as Client),
      id: formData.id || `c${Date.now()}`,
      leadStage: formData.leadStage || LeadStage.NEW,
      createdAt: formData.createdAt || new Date().toISOString(),
      isFavorite: formData.isFavorite || false,
      tags: formData.tags || []
    });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{initialData ? 'Update Lead Profile' : 'Register Detailed Lead'}</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{initialData ? 'Modify CRM Record' : 'Lead Capture Protocol'}</p>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"><X size={24}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
          {/* Section: Contact Information */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input label="Full Name" value={formData.name || ''} required onChange={v => setFormData({...formData, name: v})} />
              <Input label="Phone Number" value={formData.phone || ''} required onChange={v => setFormData({...formData, phone: v})} />
              <Input label="Email Address" value={formData.email || ''} onChange={v => setFormData({...formData, email: v})} />
            </div>
          </div>

          {/* Section: Location explicitly requested */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Geographic Targeting</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Input 
                label="Preferred City" 
                value={formData.preferredCity || ''} 
                placeholder="e.g. Mumbai" 
                required 
                onChange={v => setFormData({...formData, preferredCity: v})} 
               />
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Preferred Areas (Comma Separated)</label>
                 <input 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black" 
                  placeholder="e.g. Bandra, Juhu, Andheri"
                  value={formData.preferredAreas?.join(', ') || ''}
                  onChange={e => setFormData({...formData, preferredAreas: e.target.value.split(',').map(a => a.trim())})}
                 />
               </div>
            </div>
          </div>

          {/* Section: Requirements & Budget */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Requirements & Budget</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Type</label>
                 <select value={formData.requirement || TransactionType.RENT} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black appearance-none" onChange={e => setFormData({...formData, requirement: e.target.value as any})}>
                    <option value={TransactionType.RENT}>Rent</option><option value={TransactionType.SALE}>Sale</option>
                 </select>
               </div>
               <Input label="Min Budget" value={String(formData.budgetMin || 0)} type="number" onChange={v => setFormData({...formData, budgetMin: Number(v)})} />
               <Input label="Max Budget" value={String(formData.budgetMax || 0)} type="number" onChange={v => setFormData({...formData, budgetMax: Number(v)})} />
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Move-in Date</label>
                 <input type="date" value={formData.moveInDate || ''} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black" onChange={e => setFormData({...formData, moveInDate: e.target.value})} />
               </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Requirement Description</label>
            <textarea required value={formData.description || ''} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black min-h-[100px]" placeholder="Specific details about views, floors, or Vastu..." onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <button type="submit" className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs shadow-2xl hover:bg-indigo-700 transition-all">
            {initialData ? 'Update Lead Data' : 'Submit Lead to CRM'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, value, type = 'text', placeholder, required, onChange }: { label: string, value?: string, type?: string, placeholder?: string, required?: boolean, onChange: (v: string) => void }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">{label}</label>
    <input 
      type={type} 
      required={required}
      value={value}
      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black" 
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)} 
    />
  </div>
);
