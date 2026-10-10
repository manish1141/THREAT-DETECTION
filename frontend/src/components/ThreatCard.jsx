import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';

export function ThreatCard({ threat, onSelect, onStatusChange }) {
  const getBadge = (sev) => {
    switch (sev) {
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

  const getStatusBadge = (st) => {
    switch (st) {
      case 'ACTIVE':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'REVIEWED':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'RESOLVED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="glass-panel rounded-xl p-5 hover:border-cyan-500/40 transition-all duration-200 group">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
            {threat.id}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getBadge(threat.severity)}`}>
            {threat.severity} RISK
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getStatusBadge(threat.status)}`}>
            {threat.status}
          </span>
        </div>
        <div className="flex items-center text-xs text-slate-400 gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{threat.detectedTime}</span>
        </div>
      </div>

      <h4 className="text-base font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
        {threat.name || threat.title || 'Security Threat'}
      </h4>

      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
        {threat.riskExplanation || threat.description || 'Elevated risk detected on device.'}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
        <div className="text-slate-400">
          Target: <span className="text-slate-200 font-mono">{(threat.affectedItem || threat.text || 'Device').substring(0, 25)}</span>
        </div>
        <div className="flex items-center gap-2">
          {threat.status === 'ACTIVE' && onStatusChange && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(threat.id, 'RESOLVED');
              }}
              className="text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded bg-emerald-950/40 border border-emerald-800/40 hover:bg-emerald-900/60 transition"
            >
              Resolve
            </button>
          )}
          <button
            onClick={() => onSelect && onSelect(threat)}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold transition"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
