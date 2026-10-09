import React, { useState } from 'react';
import { 
  Lock, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Filter, 
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { permissionService, PERMISSION_CATEGORIES } from '../services/permissionService';

export function PermissionsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');

  const audits = permissionService.getAuditsFiltered(selectedCategory, severityFilter);

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 lg:pb-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border-cyan-500/20">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
            PRIVACY & RUNTIME ACCESS ENGINE
          </span>
        </div>
        <h2 className="text-2xl font-black text-white mt-1">
          Permission Security Auditor
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
          Deep heuristic analysis of dangerous permission vectors (Accessibility, Overlay, SMS, Location) granted to installed applications.
        </p>

        {/* Categories Bar */}
        <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {PERMISSION_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950 font-bold'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Android Disclaimer Note (Requirement #6) */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block mb-0.5">
            Android Security Architecture & Permission Model
          </span>
          <span>
            Standard web browsers are sandboxed and cannot directly inspect Android OS runtime permissions. This data model directly mirrors the Android <code>PackageManager.GET_PERMISSIONS</code> and <code>AppOpsManager</code> APIs for native deployment via Capacitor.
          </span>
        </div>
      </div>

      {/* Permission Table / Card Feed (Requirement #6) */}
      <div className="space-y-3">
        {audits.length > 0 ? (
          audits.map((item) => (
            <div 
              key={item.id}
              className="glass-panel p-4.5 rounded-2xl border-slate-800 hover:border-cyan-500/30 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Column: Permission & App */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {item.permission}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(item.severity)}`}>
                      {item.severity} RISK
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 font-mono">
                    <span className="text-slate-200 font-semibold">{item.appName}</span>
                    <span className="text-slate-500">({item.packageName})</span>
                  </div>
                </div>
              </div>

              {/* Middle Column: Reason & Analysis */}
              <div className="md:max-w-md text-xs">
                <div className="text-slate-300 font-medium leading-relaxed">
                  {item.reason}
                </div>
                <div className="text-[11px] text-emerald-400 mt-1">
                  Advisory: {item.recommendation}
                </div>
              </div>

              {/* Right Column: Source Badge */}
              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {item.appSource}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-panel p-12 rounded-2xl text-center border-slate-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">No permissions match criteria</h4>
            <p className="text-xs text-slate-400 mt-1">Try selecting "All" categories to inspect the full matrix.</p>
          </div>
        )}
      </div>
    </div>
  );
}
