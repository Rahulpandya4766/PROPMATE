
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, Building, User, MapPin, ArrowRight, Loader2, Zap } from 'lucide-react';
import { Property, Client } from '../types';
import { parseSmartSearchQuery } from '../geminiService';

interface SmartSearchModalProps {
  onClose: () => void;
  properties: Property[];
  clients: Client[];
  onSelectProperty: (p: Property) => void;
  onSelectClient: (c: Client) => void;
}

export const SmartSearchModal: React.FC<SmartSearchModalProps> = ({ 
  onClose, 
  properties, 
  clients, 
  onSelectProperty, 
  onSelectClient 
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{ properties: Property[], clients: Client[] }>({ properties: [], clients: [] });
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.length < 2) {
      setResults({ properties: [], clients: [] });
      return;
    }

    setIsSearching(true);
    
    // Basic local filtering first for speed
    const localProps = properties.filter(p => 
      p.title.toLowerCase().includes(val.toLowerCase()) || 
      p.location.area.toLowerCase().includes(val.toLowerCase()) ||
      p.location.city.toLowerCase().includes(val.toLowerCase())
    );
    const localClients = clients.filter(c => 
      c.name.toLowerCase().includes(val.toLowerCase()) || 
      c.phone.includes(val)
    );

    setResults({ properties: localProps, clients: localClients });
    setIsSearching(false);
  };

  const triggerSmartSearch = async () => {
    if (query.length < 3) return;
    setIsAiProcessing(true);
    
    const filters = await parseSmartSearchQuery(query);
    
    if (filters) {
      const aiProps = properties.filter(p => {
        let match = true;
        if (filters.bhk && !p.bhk.includes(filters.bhk)) match = false;
        if (filters.city && !p.location.city.toLowerCase().includes(filters.city.toLowerCase())) match = false;
        if (filters.maxPrice && p.price > filters.maxPrice) match = false;
        if (filters.transactionType && !p.transactionType.toLowerCase().includes(filters.transactionType.toLowerCase())) match = false;
        return match;
      });

      const aiClients = clients.filter(c => {
        if (filters.clientName && c.name.toLowerCase().includes(filters.clientName.toLowerCase())) return true;
        return false;
      });

      setResults({ properties: aiProps, clients: aiClients });
    }
    setIsAiProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center p-4 pt-[10vh] bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[75vh] border border-white/20">
        <div className="p-8 border-b border-slate-100 relative bg-slate-50/50">
          <div className="relative group">
            <Search className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${isAiProcessing ? 'text-indigo-600 animate-pulse' : 'text-slate-400 group-focus-within:text-indigo-600'}`} size={24} />
            <input 
              ref={inputRef}
              type="text" 
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && triggerSmartSearch()}
              placeholder="Search anything... e.g. '3BHK in Bandra for rent'" 
              className="w-full pl-16 pr-32 py-6 bg-white border border-slate-200 rounded-[2rem] text-lg font-black text-black outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {query.length >= 3 && (
                <button 
                  onClick={triggerSmartSearch}
                  disabled={isAiProcessing}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                  {isAiProcessing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Smart Search
                </button>
              )}
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {!query && (
            <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Suggested Queries</h4>
                <div className="flex flex-wrap gap-3">
                  {['2BHK in Mumbai', 'Luxury Villas Sale', 'Budget under 50k', 'Active Leads'].map(q => (
                    <button 
                      key={q} 
                      onClick={() => handleSearch(q)}
                      className="px-5 py-3 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-2xl text-xs font-bold text-slate-600 transition-all flex items-center gap-2"
                    >
                      <Zap size={14} className="text-indigo-500" /> {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {query && results.properties.length === 0 && results.clients.length === 0 && !isAiProcessing && (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                <Search size={32} />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No matches found for "{query}"</p>
            </div>
          )}

          <div className="space-y-10">
            {results.properties.length > 0 && (
              <section className="animate-in slide-in-from-bottom-2">
                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Building size={14}/> Properties ({results.properties.length})
                </h4>
                <div className="space-y-3">
                  {results.properties.map(p => (
                    <button 
                      key={p.id} 
                      onClick={() => onSelectProperty(p)}
                      className="w-full p-5 bg-slate-50 hover:bg-white border border-slate-100 hover:border-indigo-200 rounded-[1.5rem] flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-4 text-left">
                        <img src={p.photos[0]} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <p className="font-black text-black text-sm">{p.title}</p>
                          <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-widest">
                            <MapPin size={10} /> {p.location.area}, {p.location.city}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-black text-indigo-600">₹{p.price.toLocaleString()}</span>
                        <ArrowRight size={18} className="text-slate-200 group-hover:text-indigo-600 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {results.clients.length > 0 && (
              <section className="animate-in slide-in-from-bottom-2">
                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <User size={14}/> Clients ({results.clients.length})
                </h4>
                <div className="space-y-3">
                  {results.clients.map(c => (
                    <button 
                      key={c.id} 
                      onClick={() => onSelectClient(c)}
                      className="w-full p-5 bg-slate-50 hover:bg-white border border-slate-100 hover:border-emerald-200 rounded-[1.5rem] flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">
                          {c.name[0]}
                        </div>
                        <div>
                          <p className="font-black text-black text-sm">{c.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{c.phone}</p>
                        </div>
                      </div>
                      <ArrowRight size={18} className="text-slate-200 group-hover:text-emerald-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
             <kbd className="px-2 py-1 bg-white rounded border border-slate-200 text-slate-900">ENTER</kbd>
             <span>for AI Analysis</span>
           </div>
           <p className="text-[9px] text-slate-300 font-black uppercase tracking-widest">PropMate Intelligence v1.2</p>
        </div>
      </div>
    </div>
  );
};
