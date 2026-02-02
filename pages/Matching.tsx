
import React, { useState, useMemo, useEffect } from 'react';
import { Property, Client, MatchResult, TransactionType, FurnishingStatus } from '../types';
import { Zap, Sparkles, Info, ChevronRight, MapPin } from 'lucide-react';
import { getAIRecommendationSummary } from '../geminiService';

interface MatchingPageProps {
  properties: Property[];
  clients: Client[];
  initialClient?: Client | null;
}

export const MatchingPage: React.FC<MatchingPageProps> = ({ properties, clients, initialClient }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(initialClient || clients[0] || null);
  const [aiSummaries, setAiSummaries] = useState<Record<string, string>>({});
  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  useEffect(() => {
    if (initialClient) setSelectedClient(initialClient);
  }, [initialClient]);

  const calculateDetailedMatch = (prop: Property, client: Client): MatchResult => {
    let score = 0;
    const reasons: string[] = [];
    const breakdown = { budget: 0, area: 0, bhk: 0, furnishing: 0, lifestyle: 0, availability: 0 };

    if (prop.price >= client.budgetMin && prop.price <= client.budgetMax) {
      breakdown.budget = 30;
    } else {
      const diff = Math.abs(prop.price - client.budgetMax);
      breakdown.budget = Math.max(0, 30 - (diff / client.budgetMax) * 100);
    }

    const isStrictAreaMatch = client.preferredAreas.some(a => 
      prop.location.area.toLowerCase() === a.toLowerCase() || 
      prop.location.city.toLowerCase() === client.preferredCity.toLowerCase()
    );
    breakdown.area = isStrictAreaMatch ? 25 : 10;

    if (client.bhkPreference.includes(prop.bhk)) breakdown.bhk = 15;
    if (prop.transactionType === client.requirement) breakdown.availability = 30;

    score = Object.values(breakdown).reduce((a, b) => a + b, 0);
    return { propertyId: prop.id, clientId: client.id, score: Math.round(score), breakdown, reasons };
  };

  const matches = useMemo(() => {
    if (!selectedClient) return [];
    return properties
      .map(p => ({ property: p, result: calculateDetailedMatch(p, selectedClient) }))
      .sort((a, b) => b.result.score - a.result.score);
  }, [selectedClient, properties]);

  const fetchAI = async (prop: Property) => {
    if (!selectedClient) return;
    setLoadingAI(prop.id);
    const summary = await getAIRecommendationSummary(prop, selectedClient);
    setAiSummaries(prev => ({ ...prev, [prop.id]: summary }));
    setLoadingAI(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Zap className="text-indigo-600 fill-indigo-600" /> Match Intelligence
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Deterministic scoring engine with high-performance analysis.</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-[1.5rem] border border-slate-200 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Lead:</span>
          <select 
            value={selectedClient?.id || ''}
            className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-black text-indigo-600 cursor-pointer focus:outline-none"
            onChange={(e) => setSelectedClient(clients.find(c => c.id === e.target.value) || null)}
          >
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-indigo-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
             <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center text-2xl font-black shadow-xl border-2 border-indigo-400/30">
                     {selectedClient?.name[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">{selectedClient?.name}</h2>
                    <p className="text-indigo-400 text-xs font-black uppercase tracking-widest mt-1">{selectedClient?.requirement} Profile</p>
                  </div>
                </div>
                
                <div className="space-y-4 pt-8 border-t border-white/5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-400 font-black uppercase tracking-widest text-[9px]">Budget Ceiling</span>
                    <span className="font-bold text-indigo-100">₹{selectedClient?.budgetMax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-400 font-black uppercase tracking-widest text-[9px]">Primary Area</span>
                    <span className="font-bold text-indigo-100">{selectedClient?.preferredAreas[0]}</span>
                  </div>
                </div>
             </div>
             <Sparkles className="absolute -right-10 -bottom-10 w-48 h-48 text-white/5 opacity-30" />
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          {matches.map(({property, result}) => (
            <div key={property.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 hover:shadow-2xl transition-all group relative overflow-hidden transform hover:-translate-y-1">
              <div className="flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-64 h-48 rounded-[2rem] overflow-hidden shrink-0 shadow-lg border-4 border-white">
                  <img src={property.photos[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                </div>
                
                <div className="flex-1 space-y-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-black text-black tracking-tight">{property.title}</h3>
                      <p className="text-sm text-black font-bold mt-1 flex items-center gap-2">
                         <MapPin size={14} className="text-indigo-600"/> {property.location.area} • <span>₹{property.price.toLocaleString()}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-5xl font-black tracking-tighter ${result.score > 80 ? 'text-emerald-500' : 'text-indigo-600'}`}>
                        {result.score}%
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Match Index</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50">
                    {aiSummaries[property.id] ? (
                      <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100/50 animate-in zoom-in-95 duration-500">
                        <p className="text-xs italic text-black font-bold leading-relaxed">
                          <Sparkles size={16} className="inline mr-3 text-indigo-600 fill-indigo-600/10" />
                          {aiSummaries[property.id]}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <button 
                          onClick={() => fetchAI(property)} 
                          className="px-6 py-3 bg-white border border-indigo-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2 hover:bg-indigo-50 transition-all shadow-sm"
                        >
                          <Sparkles size={16} className={loadingAI === property.id ? 'animate-spin' : ''} /> 
                          {loadingAI === property.id ? 'Analyzing...' : 'Analyze Match'}
                        </button>
                        <button className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
                          Pitch Listing <ChevronRight size={14}/>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
