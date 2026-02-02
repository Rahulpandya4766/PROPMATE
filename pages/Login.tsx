
import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
}

export const LoginPage: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('Piyushdidwania@gmail.com');
  const [password, setPassword] = useState('Piyush@123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Secure workspace provisioning for Piyush
    setTimeout(() => {
      if (email === 'Piyushdidwania@gmail.com' && password === 'Piyush@123') {
        onLogin(email);
      } else {
        setError('Unauthorized credentials. Access restricted to Admin.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-700">
        <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10">
          <div className="p-12">
            <div className="flex flex-col items-center mb-10 text-center">
              <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 mb-8 transform hover:rotate-6 transition-transform">
                <span className="text-white font-black text-4xl">P</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">PropMate Cloud</h1>
              <p className="text-slate-500 mt-2 text-sm font-bold uppercase tracking-widest">Premium CRM Gateway</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-black text-center animate-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Secure Identifier</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-black text-black focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 outline-none transition-all"
                    placeholder="name@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Access Key</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-black text-black focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-indigo-700 shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] transition-all active:scale-95 disabled:opacity-70 group"
              >
                {isLoading ? 'Syncing Cloud...' : 'Initialize Workspace'}
              </button>
            </form>
          </div>

          <div className="bg-slate-50 px-10 py-8 border-t border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">TLS 1.3 Active</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">Vercel Ready</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
