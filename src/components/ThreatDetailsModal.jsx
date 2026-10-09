import React from 'react';
import { 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Terminal, 
  Lightbulb, 
  Activity 
} from 'lucide-react';

export function ThreatDetailsModal({ threat, onClose, onStatusChange }) {
  if (!threat) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel-glow w-full max-w-2xl rounded-2xl overflow-hidden border border-cyan-500/30 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              threat.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
              threat.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
              'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}>
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {threat.id}
                </span>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  {threat.threatType}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {threat.name}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Key Metric Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">Risk Score</span>
              <span className="text-2xl font-black text-rose-400">{threat.riskScore || 74}/100</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">Severity</span>
              <span className="text-sm font-bold text-orange-400 block mt-1.5 uppercase">{threat.severity}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">Status</span>
              <span className="text-sm font-bold text-cyan-400 block mt-1.5 uppercase">{threat.status}</span>
            </div>
          </div>

          {/* Affected Target */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Affected Device Resource
            </div>
            <div className="text-slate-200 font-mono text-sm break-all">
              {threat.affectedItem}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Detected: {threat.detectedTime}</span>
              <span className="mx-1">•</span>
              <span>Source: {threat.source || 'Threat Engine Heuristics'}</span>
            </div>
          </div>

          {/* Why is this risky? */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-2">
              <Activity className="w-4 h-4" />
              Why Is This Risky?
            </h4>
            <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              {threat.riskExplanation}
            </p>
          </div>

          {/* Possible Impact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-4 h-4" />
              Possible Security Impact
            </h4>
            <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              {threat.possibleImpact}
            </p>
          </div>

          {/* Recommended Action */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
              <Lightbulb className="w-4 h-4" />
              Recommended Remediation
            </h4>
            <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl text-emerald-200 leading-relaxed">
              {threat.recommendedAction}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="text-xs text-slate-500">
            Rule Engine Heuristic Assessment
          </div>
          <div className="flex items-center gap-2">
            {threat.status === 'ACTIVE' ? (
              <button
                onClick={() => {
                  onStatusChange(threat.id, 'RESOLVED');
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-950"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark as Resolved
              </button>
            ) : (
              <button
                onClick={() => {
                  onStatusChange(threat.id, 'ACTIVE');
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
              >
                Reopen Incident
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
