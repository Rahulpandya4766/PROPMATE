
import React, { useState } from 'react';
import { 
  Building, Users, Settings as SettingsIcon, Bell, CreditCard, 
  Shield, Camera, ChevronRight, Info, Download, CheckCircle2, Star,
  Zap, Sliders, Save, Trash2, LogOut, Database
} from 'lucide-react';

interface SettingsPageProps {
  userPlan: 'Free' | 'Premium';
  onUpgrade: () => void;
  onLogout: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ userPlan, onUpgrade, onLogout }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [weights, setWeights] = useState({ budget: 30, location: 20, bhk: 15, cityArea: 25, others: 10 });

  const handleUpgrade = () => {
    setIsUpgrading(true);
    setTimeout(() => {
      onUpgrade();
      setIsUpgrading(false);
    }, 1500);
  };

  const sections = [
    { id: 'profile', label: 'Profile & Business', icon: <Building size={20} /> },
    { id: 'matching', label: 'Matching Engine', icon: <Zap size={20} /> },
    { id: 'billing', label: 'Subscription & Billing', icon: <CreditCard size={20} /> },
    { id: 'account', label: 'Account & Session', icon: <LogOut size={20} /> },
    { id: 'security', label: 'Security & Privacy', icon: <Shield size={20} /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Workspace Settings</h1>
          <p className="text-slate-500 font-medium">Fine-tune PropMate for your specific business needs.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
             <Database size={14} className="text-emerald-600" />
             <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Local Persistence Active</span>
          </div>
          <button className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
             <Save size={18} /> Save Changes
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-10">
        <nav className="lg:w-80 shrink-0 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-4 px-6 py-4.5 rounded-[1.5rem] transition-all relative group ${activeSection === section.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-500 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-100'}`}
            >
              <span className={`p-2.5 rounded-xl ${activeSection === section.id ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-indigo-50 transition-colors'}`}>{section.icon}</span>
              <span className="font-black text-sm uppercase tracking-wider">{section.label}</span>
              {activeSection === section.id && <ChevronRight className="absolute right-6 opacity-50" size={18} />}
            </button>
          ))}
        </nav>

        <div className="flex-1 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden min-h-[700px]">
          <div className="p-12 h-full">
            {activeSection === 'profile' && (
              <div className="space-y-10 animate-in slide-in-from-bottom-4">
                <div className="flex items-center gap-8">
                   <div className="relative group">
                     <div className="w-40 h-40 rounded-[2.5rem] bg-indigo-50 overflow-hidden border-4 border-white shadow-xl ring-1 ring-slate-100">
                        <img 
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Piyush&backgroundColor=b6e3f4" 
                          className="w-full h-full object-cover" 
                          alt="Agency Avatar" 
                          onError={(e) => { e.currentTarget.src = "https://picsum.photos/seed/agency/200" }}
                        />
                     </div>
                     <button className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition-all border-2 border-white">
                        <Camera size={20}/>
                     </button>
                   </div>
                   <div>
                     <h3 className="text-3xl font-black text-slate-900 tracking-tight">Agency Identity</h3>
                     <p className="text-sm text-slate-500 font-black uppercase tracking-widest mt-1">Premium Managed Workspace</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-10">
                  <SettingsInput label="Agency Full Name" defaultValue="Malhotra Group Real Estate" />
                  <SettingsInput label="Primary Agent" defaultValue="Piyush Malhotra" />
                  <SettingsInput label="Business Registration ID" defaultValue="IND-REA-9988-XM" />
                  <SettingsInput label="Default Operating City" defaultValue="Mumbai" />
                </div>
              </div>
            )}

            {activeSection === 'matching' && (
              <div className="space-y-10 animate-in slide-in-from-bottom-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Matching Logic Tuning</h3>
                  <p className="text-sm text-slate-500 font-medium">Adjust the weights to prioritize different match criteria for your leads.</p>
                </div>

                <div className="space-y-12">
                   <SliderItem 
                    label="Budget Compliance" 
                    value={weights.budget} 
                    onChange={(v) => setWeights({...weights, budget: v})} 
                    desc="How strictly the property price must stay within client budget range."
                   />
                   <SliderItem 
                    label="Location Proximity" 
                    value={weights.location} 
                    onChange={(v) => setWeights({...weights, location: v})} 
                    desc="Influence of general vicinity and neighborhood preference."
                   />
                   <SliderItem 
                    label="Configuration (BHK)" 
                    value={weights.bhk} 
                    onChange={(v) => setWeights({...weights, bhk: v})} 
                    desc="Weightage of room count and floor preferences."
                   />
                   <SliderItem 
                    label="City/Area Match" 
                    value={weights.cityArea} 
                    onChange={(v) => setWeights({...weights, cityArea: v})} 
                    desc="Precision score for matching exact city and specific area name strings."
                   />
                </div>

                <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-start gap-5">
                   <Info className="text-amber-600 mt-1" size={24} />
                   <div>
                      <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest">Expert Tip</h4>
                      <p className="text-xs text-amber-700 leading-relaxed font-medium mt-1">For picky clients, increase 'City/Area Match'. For those open to nearby alternatives, increase 'Location Proximity' but lower 'City/Area Match'.</p>
                   </div>
                </div>
              </div>
            )}

            {activeSection === 'billing' && (
              <div className="space-y-10 animate-in slide-in-from-bottom-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Subscription & Billing</h3>
                    <p className="text-sm text-slate-500 font-medium">Manage your workspace capacity and billing details.</p>
                  </div>
                </div>

                <div className={`rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl transition-all duration-700 transform hover:scale-[1.01] ${userPlan === 'Premium' ? 'bg-slate-950' : 'bg-indigo-600'}`}>
                  {userPlan === 'Premium' && <Star className="absolute top-10 right-10 text-amber-400 fill-amber-400 animate-bounce" size={32} />}
                  <h4 className="text-indigo-200 font-black uppercase tracking-[0.25em] text-[10px]">Your PropMate Plan</h4>
                  <h2 className="text-5xl font-black mt-4 tracking-tight">{userPlan} Plan</h2>
                  <p className="text-indigo-100/70 mt-4 text-sm font-medium leading-relaxed max-w-md">
                    {userPlan === 'Free' 
                      ? 'Upgrade to unlock unlimited properties, advanced matching, and dedicated cloud storage for high-res images.' 
                      : 'You are a PropMate Power User. All features are fully unlocked for your account.'}
                  </p>
                  
                  {userPlan === 'Free' && (
                    <button 
                      onClick={handleUpgrade}
                      disabled={isUpgrading}
                      className="mt-10 px-10 py-5 bg-white text-indigo-600 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-50 hover:scale-105 transition-all flex items-center gap-3 shadow-2xl shadow-black/20"
                    >
                      {isUpgrading ? 'Provisioning...' : 'Upgrade Now - ₹500/mo'}
                      <Zap size={18} className="fill-indigo-600" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'account' && (
              <div className="space-y-10 animate-in slide-in-from-bottom-4 h-full flex flex-col">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Account & Session</h3>
                  <p className="text-sm text-slate-500 font-medium">Manage your current login session and data safety.</p>
                </div>

                <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                      <Shield size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">Session Security</h4>
                      <p className="text-xs text-slate-500 font-medium mt-1">Your data is currently pinned to this browser session using local storage. Signing out will return you to the gateway but keep your local data intact.</p>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col gap-4">
                    <button 
                      onClick={onLogout}
                      className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-rose-50 text-rose-600 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-rose-600 hover:text-white transition-all group"
                    >
                      <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                      Sign Out from PropMate
                    </button>
                    <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-[0.15em]">PropMate uses secure isolated storage. Your listings are safe.</p>
                  </div>
                </div>

                <div className="mt-auto pt-10 border-t border-slate-100">
                   <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.25em] mb-4">Danger Zone</h4>
                   <button 
                    onClick={() => {
                      if(confirm("This will permanently delete ALL listings and clients from this browser. This action is IRREVERSIBLE. Proceed?")) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="flex items-center gap-2 px-6 py-4 border-2 border-rose-100 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all"
                   >
                      <Trash2 size={16}/> Wipe All Workspace Data (Irreversible)
                   </button>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4 text-center animate-in fade-in">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-slate-100 mb-4">
                  <Shield size={40} className="text-slate-200" />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Enhanced Encryption</h3>
                <p className="text-sm text-slate-400 max-w-xs font-medium">Automatic row-level security is active for your tenant ID. No further configuration required for trial.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsInput = ({ label, defaultValue }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      className="w-full px-6 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-black font-black tracking-tight focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all" 
      defaultValue={defaultValue} 
    />
  </div>
);

const SliderItem = ({ label, value, onChange, desc }: any) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
       <div>
         <p className="text-sm font-black text-slate-900 tracking-tight uppercase tracking-wider">{label}</p>
         <p className="text-xs text-slate-500 font-medium mt-1">{desc}</p>
       </div>
       <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black">{value}%</span>
    </div>
    <input 
      type="range" 
      min="0" 
      max="100" 
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
    />
  </div>
);
