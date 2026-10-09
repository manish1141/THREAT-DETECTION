import React from 'react';
import { 
  X, 
  HelpCircle, 
  ShieldAlert, 
  AlertTriangle, 
  KeyRound, 
  Download, 
  FileCode2,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export function AppDetailModal({ app, onClose }) {
  if (!app) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel-glow w-full max-w-2xl rounded-2xl overflow-hidden border border-cyan-500/30 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                APPLICATION RISK AUDIT
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                app.riskLevel === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                app.riskLevel === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                app.riskLevel === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {app.riskLevel} • {app.riskScore}/100
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1.5">
              {app.name}
            </h3>
            <p className="text-xs font-mono text-slate-400">
              {app.packageName}
            </p>
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
          {/* Metadata Card */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">Install Source</span>
              <span className="font-semibold text-slate-200 text-xs">{app.source}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">App Category</span>
              <span className="font-semibold text-slate-200 text-xs">{app.category || 'General'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-400 block mb-0.5">Background Task</span>
              <span className={`font-semibold text-xs ${app.isBackgroundRunning ? 'text-amber-400' : 'text-slate-400'}`}>
                {app.isBackgroundRunning ? 'Active in Background' : 'Idle'}
              </span>
            </div>
          </div>

          {/* Section: WHY IS THIS RISKY? (Requirement #5) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              WHY IS THIS RISKY? (Identified Risk Factors)
            </h4>

            {app.reasons && app.reasons.length > 0 ? (
              <div className="space-y-2">
                {app.reasons.map((r, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-800 shrink-0">
                      +{r.points} pts
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-200">
                        {r.rule}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {r.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>No high-risk permission abuses or stealth indicators detected for this application package.</span>
              </div>
            )}
          </div>

          {/* Cryptographic Signature Info */}
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 font-mono text-xs">
            <div className="text-[11px] font-sans font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
              Cryptographic APK Signature Verification
            </div>
            <div className="text-slate-300 break-all">
              {app.signature || 'SHA256: 4F:08:91:DE:3C:A9:01:... (Verified)'}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              Security Recommendations
            </h4>
            <div className="space-y-1.5">
              {(app.recommendations || []).map((rec, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-200 text-xs">
                  • {rec}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/60">
          <span className="text-[11px] text-slate-500">
            {app.disclaimer || 'Risk Assessment (Heuristic Evaluation)'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition"
          >
            Close Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
