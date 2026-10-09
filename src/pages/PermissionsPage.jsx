import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Filter, 
  Eye,
  RefreshCw
} from 'lucide-react';
import { liveSecurityAuditor } from '../services/liveSecurityAuditor';

export function PermissionsPage() {
  const [realPerms, setRealPerms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadRealPermissions = async () => {
    setIsLoading(true);
    const perms = await liveSecurityAuditor.auditRealBrowserPermissions();
    setRealPerms(perms);
    setIsLoading(false);
  };

  useEffect(() => {
    loadRealPermissions();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn pb-16 lg:pb-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border-cyan-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
                LIVE BROWSER PERMISSION AUDITOR
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Real-Time Browser Permission Security
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
              Queries real browser runtime permissions for your current device using the official W3C Permissions API.
            </p>
          </div>

          <button
            onClick={loadRealPermissions}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-cyan-400 flex items-center gap-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Re-Query Live Permissions</span>
          </button>
        </div>
      </div>

      {/* Distinction Note */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block mb-0.5">
            Real vs. Native Operating System Capabilities
          </span>
          <span>
            These results are queried live from your browser's security manager. A web page cannot inspect Android system permissions (such as other apps' SMS or Accessibility hooks) due to sandbox boundaries; those require an installed APK built via our included <code>androidNativeBridge.js</code>.
          </span>
        </div>
      </div>

      {/* Real Permissions Feed */}
      <div className="space-y-3">
        {realPerms.map((item) => (
          <div 
            key={item.id}
            className="glass-panel p-5 rounded-2xl border-slate-800 hover:border-cyan-500/30 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    {item.permission}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    item.state === 'granted' 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    STATE: {item.state.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {item.advisory}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-slate-950 text-slate-400 border border-slate-800">
                {item.source}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
