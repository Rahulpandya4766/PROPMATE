
import React, { useState } from 'react';
import { Plus, Search, MapPin, X, Star, Trash2, Building, TrendingUp } from 'lucide-react';
import { Client, LeadStage, TransactionType } from '../types';

interface ClientsPageProps {
  clients: Client[];
  onAdd: (client: Client) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  // Added onAutoMatch to fix the TypeScript error in App.tsx
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
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Client Hub</h1>
          <p className="text-slate-500 text-sm font-medium">Manage your private leads.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all"
        >
          <Plus size={20} /> Register Client
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
              placeholder="Search by name..." 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Profile</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stage</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-lg">
                        {client.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black text-black">{client.name}</p>
                          {client.isFavorite && <Star size={12} className="text-amber-400 fill-amber-400" />}
                        </div>
                        <p className="text-[10px] text-black font-bold italic mt-1 line-clamp-1">"{client.description}"</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="px-4 py-2 rounded-xl text-[10px] font-black uppercase bg-indigo-50 text-indigo-600">
                      {client.leadStage}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-4">
                      {/* Fixed: Use onAutoMatch to enable smart matching logic from the list */}
                      <button 
                        onClick={() => onAutoMatch(client)}
                        className="text-indigo-600 hover:text-indigo-800 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest"
                      >
                        <TrendingUp size={16} /> Smart Match
                      </button>
                      {/* Fixed: Enable onToggleFavorite functionality */}
                      <button 
                        onClick={() => onToggleFavorite(client.id)}
                        className={`transition-all opacity-0 group-hover:opacity-100 ${client.isFavorite ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400'}`}
                      >
                        <Star size={20} className={client.isFavorite ? 'fill-amber-400' : ''} />
                      </button>
                      <button onClick={() => onDelete(client.id)} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
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
    </div>
  );
};

const AddClientModal: React.FC<{ onClose: () => void; onAdd: (c: Client) => void }> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState<Partial<Client>>({ name: '', phone: '', description: '', budgetMax: 0 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...(formData as Client),
      id: `c${Date.now()}`,
      leadStage: LeadStage.NEW,
      createdAt: new Date().toISOString(),
      isFavorite: false,
      requirement: TransactionType.RENT,
      preferredAreas: [],
      preferredCity: 'Mumbai',
      bhkPreference: [],
      furnishingPreference: [],
      budgetMin: 0,
      maritalStatus: 'Bachelor',
      familySize: 1,
      tags: [],
      moveInDate: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">New Client</h2>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-xl text-slate-400"><X size={24}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <input required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black" placeholder="Client Name" onChange={e => setFormData({...formData, name: e.target.value})} />
          <input required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black" placeholder="Phone Number" onChange={e => setFormData({...formData, phone: e.target.value})} />
          <textarea required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black min-h-[120px]" placeholder="Requirements Narrative..." onChange={e => setFormData({...formData, description: e.target.value})} />
          <input required type="number" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black" placeholder="Max Budget (₹)" onChange={e => setFormData({...formData, budgetMax: Number(e.target.value)})} />
          <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-xs shadow-2xl">Register Lead</button>
        </form>
      </div>
    </div>
  );
};
