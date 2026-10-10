import React from 'react';
import { 
  ShieldAlert, 
  HelpCircle, 
  ChevronRight, 
  AlertTriangle, 
  ShieldCheck,
  FolderGit2,
  Lock
} from 'lucide-react';

export function AppRiskCard({ app, onInspect }) {
  const getRiskBadge = (level) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'LOW':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 hover:border-[#00ff66]/50 transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,255,102,0.1)]">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-white font-mono tracking-wide">
              {app.name}
            </h4>
            {app.source === 'Google Play Store' ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30">
                Play Store
              </span>
            ) : (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                {app.source}
              </span>
            )}
          </div>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            {app.packageName}
          </p>
        </div>

        {/* Risk Score Pill */}
        <div className="text-right flex flex-col items-end">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getRiskBadge(app.riskLevel)}`}>
            {app.riskLevel} • {app.riskScore}/100
          </span>
          <span className="text-[10px] text-slate-500 mt-1 uppercase font-mono">
            v{app.version}
          </span>
        </div>
      </div>

      {/* Permissions List Tag */}
      <div className="mb-4">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 font-mono">
          Requested Permissions ({app.permissions?.length || 0})
        </span>
        <div className="flex flex-wrap gap-1.5">
          {(app.permissions || []).map((perm, idx) => {
            const isHighRisk = ['Accessibility', 'Overlay', 'SMS'].includes(perm);
            return (
              <span
                key={idx}
                className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${
                  isHighRisk 
                    ? 'bg-rose-950/40 text-rose-300 border-rose-800/50' 
                    : 'bg-[#04120a] text-slate-300 border-emerald-950'
                }`}
              >
                {perm}
              </span>
            );
          })}
        </div>
      </div>

      {/* Footer trigger "WHY IS THIS RISKY?" */}
      <div className="pt-3 border-t border-emerald-950/80 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-mono">
          Updated: {app.lastUpdated}
        </span>
        <button
          onClick={() => onInspect && onInspect(app)}
          className="text-xs font-semibold text-[#00ff66] hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#051c0f] border border-[#00ff66]/40 hover:bg-[#00ff66]/20 transition shadow-[0_0_8px_rgba(0,255,102,0.15)] font-mono"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>WHY IS THIS RISKY?</span>
        </button>
      </div>
    </div>
  );
}
