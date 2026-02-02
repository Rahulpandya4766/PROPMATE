
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, MapPin, X, Home, Bed, Maximize2, Building, Layers, Compass, 
  Car, Power, Dog, Users as UsersIcon, ChevronRight, Star, Trash2
} from 'lucide-react';
import { Property, PropertyStatus, TransactionType, PropertyType, FurnishingStatus, ListingSource } from '../types';

interface PropertiesPageProps {
  properties: Property[];
  onAdd: (prop: Property) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  triggerModal?: number;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({ properties, onAdd, onDelete, onToggleFavorite, triggerModal }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (triggerModal && triggerModal > 0) setShowAddModal(true);
  }, [triggerModal]);

  const filtered = properties.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.location.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Listing Inventory</h1>
          <p className="text-slate-500 text-sm font-medium">Your private property database.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all"
        >
          <Plus size={20} /> Add Listing
        </button>
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by area or title..." 
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black focus:bg-white focus:outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((prop) => (
          <div key={prop.id} className="bg-white rounded-[3rem] overflow-hidden border border-slate-200 shadow-sm group hover:shadow-2xl transition-all relative transform hover:-translate-y-1">
            <div className="h-64 bg-slate-100 relative overflow-hidden" onClick={() => setSelectedProperty(prop)}>
              <img src={prop.photos[0]} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt="" />
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[9px] font-black text-indigo-600 uppercase tracking-widest shadow-lg">
                  {prop.transactionType}
                </span>
              </div>
            </div>
            
            <div className="p-8 space-y-5">
              <h3 className="font-black text-black text-xl tracking-tight line-clamp-1 group-hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => setSelectedProperty(prop)}>{prop.title}</h3>
              
              <div className="flex items-center gap-2 text-black text-sm font-black">
                <MapPin size={16} className="text-indigo-600" /> {prop.location.area}, {prop.location.city}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-2xl font-black text-black tracking-tight">₹{prop.price.toLocaleString()}</span>
                <span className="text-[10px] font-black px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl uppercase">Available</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && <AddPropertyModal onClose={() => setShowAddModal(false)} onAdd={onAdd} />}
      {selectedProperty && <PropertyDetailModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />}
    </div>
  );
};

const PropertyDetailModal: React.FC<{ property: Property; onClose: () => void }> = ({ property, onClose }) => (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
    <div className="bg-white w-full max-w-4xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col md:flex-row max-h-[90vh]">
      <div className="w-full md:w-1/2 relative bg-slate-100">
        <img src={property.photos[0]} className="w-full h-full object-cover" alt="" />
        <button onClick={onClose} className="absolute top-8 left-8 p-4 bg-white/20 backdrop-blur-xl hover:bg-white text-white hover:text-slate-900 rounded-2xl transition-all shadow-2xl">
          <X size={24} />
        </button>
      </div>
      <div className="w-full md:w-1/2 p-12 overflow-y-auto space-y-10 bg-white">
        <div>
          <h2 className="text-3xl font-black text-black tracking-tight leading-tight">{property.title}</h2>
          <p className="text-indigo-600 font-black uppercase text-[10px] tracking-widest mt-4">{property.type} • {property.bhk}</p>
        </div>
        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
           <p className="text-black font-bold leading-relaxed">{property.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Asking Price</p>
             <p className="text-2xl font-black text-black">₹{property.price.toLocaleString()}</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Carpet Area</p>
             <p className="text-2xl font-black text-black">{property.carpetArea} sqft</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AddPropertyModal: React.FC<{ onClose: () => void; onAdd: (p: Property) => void }> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState<Partial<Property>>({
    title: '', description: '', price: 0, carpetArea: 0, location: { area: '', city: 'Mumbai', address: '' },
    transactionType: TransactionType.RENT, type: PropertyType.FLAT, bhk: '2BHK'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...(formData as Property),
      id: `p-${Date.now()}`,
      photos: [`https://picsum.photos/seed/${Date.now()}/800/600`],
      createdAt: new Date().toISOString(),
      status: PropertyStatus.AVAILABLE,
      isFavorite: false,
      listingSource: ListingSource.DIRECT
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">New Listing</h2>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-xl text-slate-400"><X size={24}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <input required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black" placeholder="Listing Title" onChange={e => setFormData({...formData, title: e.target.value})} />
          <textarea required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black min-h-[120px]" placeholder="Full Description..." onChange={e => setFormData({...formData, description: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
             <input required type="number" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black" placeholder="Price (₹)" onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
             <input required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black" placeholder="Area Name" onChange={e => setFormData({...formData, location: {...formData.location!, area: e.target.value}})} />
          </div>
          <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-xs shadow-2xl">Publish Listing</button>
        </form>
      </div>
    </div>
  );
};
