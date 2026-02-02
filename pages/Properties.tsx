
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, MapPin, X, Home, Bed, Maximize2, Building, Layers, Compass, 
  Car, Power, Dog, Users as UsersIcon, ChevronRight, Star, Trash2, ShieldCheck, 
  CheckCircle2, Info, Wind, Clock, UserCheck, Phone, Edit2, Map, Filter
} from 'lucide-react';
import { Property, PropertyStatus, TransactionType, PropertyType, FurnishingStatus, ListingSource } from '../types';

interface PropertiesPageProps {
  properties: Property[];
  onAdd: (prop: Property) => void;
  onUpdate: (prop: Property) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  triggerModal?: number;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({ properties, onAdd, onUpdate, onDelete, onToggleFavorite, triggerModal }) => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  useEffect(() => {
    if (triggerModal && triggerModal > 0) {
      setEditingProperty(null);
      setShowFormModal(true);
    }
  }, [triggerModal]);

  const filtered = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.location.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.buildingName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMinPrice = minPrice === '' || p.price >= Number(minPrice);
    const matchesMaxPrice = maxPrice === '' || p.price <= Number(maxPrice);
    
    return matchesSearch && matchesMinPrice && matchesMaxPrice;
  });

  const handleEditClick = (e: React.MouseEvent, prop: Property) => {
    e.stopPropagation();
    setEditingProperty(prop);
    setShowFormModal(true);
  };

  const handleAddNew = () => {
    setEditingProperty(null);
    setShowFormModal(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Listing Inventory</h1>
          <p className="text-slate-500 text-sm font-medium">Your comprehensive property database with location mapping.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all"
        >
          <Plus size={20} /> Add Detailed Listing
        </button>
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by city, area, or building..." 
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black focus:bg-white focus:outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-40">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">Min</span>
            <input 
              type="number" 
              placeholder="Price" 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black focus:bg-white focus:outline-none transition-all"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div className="relative w-full md:w-40">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">Max</span>
            <input 
              type="number" 
              placeholder="Price" 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black focus:bg-white focus:outline-none transition-all"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((prop) => (
          <div key={prop.id} className="bg-white rounded-[3rem] overflow-hidden border border-slate-200 shadow-sm group hover:shadow-2xl transition-all relative transform hover:-translate-y-1">
            <div className="h-64 bg-slate-100 relative overflow-hidden cursor-pointer" onClick={() => setSelectedProperty(prop)}>
              <img src={prop.photos[0]} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt="" />
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[9px] font-black text-indigo-600 uppercase tracking-widest shadow-lg">
                  {prop.transactionType}
                </span>
                <span className="px-4 py-2 bg-slate-900/90 backdrop-blur-md rounded-xl text-[9px] font-black text-white uppercase tracking-widest shadow-lg">
                  {prop.listingSource}
                </span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(prop.id); }}
                className={`absolute top-6 right-6 p-3 rounded-xl backdrop-blur-md transition-all ${prop.isFavorite ? 'bg-amber-400 text-white shadow-amber-200' : 'bg-white/50 text-white hover:bg-white hover:text-amber-400'}`}
              >
                <Star size={18} fill={prop.isFavorite ? "currentColor" : "none"} />
              </button>
            </div>
            
            <div className="p-8 space-y-5">
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-black text-black text-xl tracking-tight line-clamp-1 group-hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => setSelectedProperty(prop)}>{prop.title}</h3>
                <div className="flex items-center gap-1">
                  <button onClick={(e) => handleEditClick(e, prop)} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(prop.id); }} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-black text-sm font-black">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <MapPin size={16} />
                </div>
                <span className="truncate">{prop.location.area}, {prop.location.city}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Maximize2 size={14} /> {prop.carpetArea} sqft
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Layers size={14} /> Floor {prop.floorNumber}/{prop.totalFloors}
                 </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-2xl font-black text-black tracking-tight">₹{prop.price.toLocaleString()}</span>
                <span className="text-[10px] font-black px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl uppercase">{prop.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showFormModal && (
        <PropertyFormModal 
          onClose={() => { setShowFormModal(false); setEditingProperty(null); }} 
          onSave={(p) => { 
            editingProperty ? onUpdate(p) : onAdd(p); 
            setShowFormModal(false); 
            setEditingProperty(null); 
          }} 
          initialData={editingProperty}
        />
      )}
      {selectedProperty && <PropertyDetailModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />}
    </div>
  );
};

const PropertyDetailModal: React.FC<{ property: Property; onClose: () => void }> = ({ property, onClose }) => (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
    <div className="bg-white w-full max-w-5xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col md:flex-row max-h-[95vh]">
      <div className="w-full md:w-2/5 relative bg-slate-100 overflow-hidden">
        <img src={property.photos[0]} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <button onClick={onClose} className="absolute top-8 left-8 p-4 bg-white/20 backdrop-blur-xl hover:bg-white text-white hover:text-slate-900 rounded-2xl transition-all shadow-2xl">
          <X size={24} />
        </button>
        <div className="absolute bottom-10 left-10 right-10 text-white">
           <h2 className="text-3xl font-black tracking-tight leading-tight">{property.title}</h2>
           <div className="flex items-center gap-3 mt-4">
              <span className="px-3 py-1.5 bg-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{property.transactionType}</span>
              <span className="text-xs font-black opacity-80">{property.buildingName}</span>
           </div>
        </div>
      </div>
      
      <div className="w-full md:w-3/5 p-12 overflow-y-auto space-y-12 bg-white custom-scrollbar">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Source Details</h4>
            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${property.listingSource === ListingSource.DIRECT ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
              {property.listingSource} Listing
            </span>
          </div>
          {property.listingSource === ListingSource.BROKER && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100 flex items-center gap-3">
                <UserCheck size={16} className="text-indigo-600" />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Broker Name</p>
                  <p className="text-sm font-black text-black">{property.brokerName || 'Not Provided'}</p>
                </div>
              </div>
              <div className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100 flex items-center gap-3">
                <Phone size={16} className="text-indigo-600" />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Broker Phone</p>
                  <p className="text-sm font-black text-black">{property.brokerNumber || 'Not Provided'}</p>
                </div>
              </div>
            </div>
          )}
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Description</h4>
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner">
             <p className="text-black font-bold leading-relaxed text-sm">{property.description}</p>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <DetailBlock label="Price" value={`₹${property.price.toLocaleString()}`} />
          <DetailBlock label="BHK" value={property.bhk} />
          <DetailBlock label="Carpet Area" value={`${property.carpetArea} sqft`} />
          <DetailBlock label="Facing" value={property.facing} />
          <DetailBlock label="Floor" value={`${property.floorNumber} / ${property.totalFloors}`} />
          <DetailBlock label="Furnishing" value={property.furnishingStatus} />
          <DetailBlock label="Status" value={property.status} />
          <DetailBlock label="Type" value={property.type} />
        </section>

        <section>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Location Details</h4>
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
             <div className="grid grid-cols-2 gap-4 mb-6">
               <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">City</p>
                 <p className="text-sm font-black text-black">{property.location.city}</p>
               </div>
               <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Area</p>
                 <p className="text-sm font-black text-black">{property.location.area}</p>
               </div>
             </div>
             <div className="flex items-center gap-3 text-black font-black mb-4">
                <MapPin className="text-indigo-600" /> Full Address
             </div>
             <p className="text-sm text-slate-600 font-medium pl-9 leading-relaxed">{property.location.address}</p>
          </div>
        </section>

        <section>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Amenities & Features</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <FeatureBadge label="Parking" active={property.parking} icon={<Car size={16}/>} />
            <FeatureBadge label="Elevator" active={property.liftAvailable} icon={<Layers size={16}/>} />
            <FeatureBadge label="Power Backup" active={property.powerBackup} icon={<Power size={16}/>} />
            <FeatureBadge label="Pets Allowed" active={property.petsAllowed} icon={<Dog size={16}/>} />
            <FeatureBadge label="Bachelors" active={property.bachelorsAllowed} icon={<UsersIcon size={16}/>} />
            <FeatureBadge label="Negotiable" active={property.negotiable} icon={<ShieldCheck size={16}/>} />
          </div>
        </section>
      </div>
    </div>
  </div>
);

const DetailBlock = ({ label, value }: { label: string, value: string }) => (
  <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm text-center">
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-black text-black">{value}</p>
  </div>
);

const FeatureBadge = ({ label, active, icon }: { label: string, active: boolean, icon: React.ReactNode }) => (
  <div className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${active ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-slate-50 border-slate-100 text-slate-300 opacity-60'}`}>
    {icon}
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    {active && <CheckCircle2 size={12} className="ml-auto" />}
  </div>
);

const PropertyFormModal: React.FC<{ onClose: () => void; onSave: (p: Property) => void; initialData?: Property | null }> = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Property>>(initialData || {
    title: '', description: '', price: 0, carpetArea: 0, builtUpArea: 0, bhk: '2BHK',
    location: { area: '', city: 'Mumbai', address: '' },
    transactionType: TransactionType.RENT, type: PropertyType.FLAT,
    floorNumber: 0, totalFloors: 10, buildingName: '', facing: 'East',
    furnishingStatus: FurnishingStatus.SEMI, parking: true, liftAvailable: true, 
    powerBackup: true, petsAllowed: false, bachelorsAllowed: true, 
    negotiable: true, availabilityDate: new Date().toISOString().split('T')[0],
    listingSource: ListingSource.DIRECT, brokerName: '', brokerNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(formData as Property),
      id: formData.id || `p-${Date.now()}`,
      photos: formData.photos || [`https://picsum.photos/seed/${Date.now()}/800/600`],
      createdAt: formData.createdAt || new Date().toISOString(),
      status: formData.status || PropertyStatus.AVAILABLE,
      isFavorite: formData.isFavorite || false
    });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{initialData ? 'Update Listing' : 'Add Detailed Listing'}</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{initialData ? 'Modify Inventory Record' : 'Complete Inventory Form'}</p>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"><X size={24}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
          {/* Section: Source Selection */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Listing Source</h4>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setFormData({...formData, listingSource: ListingSource.DIRECT})}
                className={`p-5 rounded-[1.5rem] border text-xs font-black uppercase tracking-widest transition-all ${formData.listingSource === ListingSource.DIRECT ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-white'}`}
              >
                Direct Property
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, listingSource: ListingSource.BROKER})}
                className={`p-5 rounded-[1.5rem] border text-xs font-black uppercase tracking-widest transition-all ${formData.listingSource === ListingSource.BROKER ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-white'}`}
              >
                Via Broker
              </button>
            </div>
            {formData.listingSource === ListingSource.BROKER && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Broker Full Name</label>
                  <input required value={formData.brokerName || ''} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black" placeholder="Enter broker name" onChange={e => setFormData({...formData, brokerName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Broker Phone Number</label>
                  <input required value={formData.brokerNumber || ''} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black" placeholder="+91 00000 00000" onChange={e => setFormData({...formData, brokerNumber: e.target.value})} />
                </div>
              </div>
            )}
          </div>

          {/* Section: Identity */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Listing Title</label>
                <input required value={formData.title || ''} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black" placeholder="e.g. Sea View 3BHK Penthouse" onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Building Name</label>
                <input required value={formData.buildingName || ''} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black" placeholder="e.g. Sky Heights" onChange={e => setFormData({...formData, buildingName: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Section: Location explicitly requested */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Location Intelligence</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">City</label>
                <input 
                  required 
                  value={formData.location?.city || ''} 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black" 
                  placeholder="e.g. Mumbai" 
                  onChange={e => setFormData({...formData, location: { ...formData.location!, city: e.target.value }})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Area / Locality</label>
                <input 
                  required 
                  value={formData.location?.area || ''} 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black" 
                  placeholder="e.g. Bandra West" 
                  onChange={e => setFormData({...formData, location: { ...formData.location!, area: e.target.value }})} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Detailed Address</label>
              <textarea 
                required 
                value={formData.location?.address || ''} 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black min-h-[80px]" 
                placeholder="Shop/Flat No, Building, Street, Landmark..." 
                onChange={e => setFormData({...formData, location: { ...formData.location!, address: e.target.value }})} 
              />
            </div>
          </div>

          {/* Section: Specs */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Specifications & Pricing</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Price (₹)</label>
                 <input required type="number" value={formData.price || 0} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black" onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Carpet Area</label>
                 <input required type="number" value={formData.carpetArea || 0} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black" placeholder="sqft" onChange={e => setFormData({...formData, carpetArea: Number(e.target.value)})} />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">BHK</label>
                 <select value={formData.bhk || '2BHK'} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black appearance-none" onChange={e => setFormData({...formData, bhk: e.target.value})}>
                    <option value="1BHK">1BHK</option><option value="2BHK">2BHK</option><option value="3BHK">3BHK</option><option value="4BHK">4BHK</option><option value="5BHK">5BHK+</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Transaction</label>
                 <select value={formData.transactionType || TransactionType.RENT} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black appearance-none" onChange={e => setFormData({...formData, transactionType: e.target.value as any})}>
                    <option value={TransactionType.RENT}>Rent</option><option value={TransactionType.SALE}>Sale</option>
                 </select>
               </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Floor No.</label>
                 <input type="number" value={formData.floorNumber || 0} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black" onChange={e => setFormData({...formData, floorNumber: Number(e.target.value)})} />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Total Floors</label>
                 <input type="number" value={formData.totalFloors || 10} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black" onChange={e => setFormData({...formData, totalFloors: Number(e.target.value)})} />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Facing</label>
                 <select value={formData.facing || 'East'} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black appearance-none" onChange={e => setFormData({...formData, facing: e.target.value as any})}>
                    <option value="East">East</option><option value="West">West</option><option value="North">North</option><option value="South">South</option>
                 </select>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Furnishing Status</label>
                <select value={formData.furnishingStatus || FurnishingStatus.SEMI} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black appearance-none" onChange={e => setFormData({...formData, furnishingStatus: e.target.value as any})}>
                  {Object.values(FurnishingStatus).map(fs => <option key={fs} value={fs}>{fs}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Property Type</label>
                <select value={formData.type || PropertyType.FLAT} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black appearance-none" onChange={e => setFormData({...formData, type: e.target.value as any})}>
                  {Object.values(PropertyType).map(pt => <option key={pt} value={pt}>{pt}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Description</label>
            <textarea required value={formData.description || ''} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-black min-h-[100px]" placeholder="Highlight features, proximity, and condition..." onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <button type="submit" className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs shadow-2xl hover:bg-indigo-700 transition-all">
            {initialData ? 'Update Record' : 'Submit Property to Cloud'}
          </button>
        </form>
      </div>
    </div>
  );
};
