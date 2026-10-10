import React from 'react';
import { AlertTriangle, ShieldAlert, X, AlertOctagon, Terminal, Trash2, MessageSquare, ExternalLink } from 'lucide-react';

export function UrgentThreatModal({ threat, onClose, onQuarantine }) {
  if (!threat) return null;

  const isMessageThreat = threat.type === 'MESSAGE_SCAM' || Boolean(threat.text);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#18080a] to-[#0d0405] border-2 border-red-500 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.5)] overflow-hidden">
        {/* Animated Warning Header Banner */}
        <div className="bg-red-600/30 border-b border-red-500/50 p-4 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="flex h-4 w-4 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
            <div className="flex items-center space-x-2 text-red-400 font-bold tracking-wider text-sm uppercase">
              <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
              <span>URGENT: {isMessageThreat ? 'SUSPICIOUS MESSAGE INTERCEPTED' : 'HIGH RISK THREAT DETECTED'}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors hover:bg-red-950/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Main Danger Alert Callout */}
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start space-x-3">
            <AlertOctagon className="w-8 h-8 text-red-500 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <h3 className="text-xl font-black text-red-400 tracking-wide font-mono">
                {isMessageThreat ? 'DANGEROUS SCAM MESSAGE DETECTED!' : 'RISKY FILE INTERCEPTED!'}
              </h3>
              <p className="text-sm text-red-200/90 mt-1">
                {isMessageThreat 
                  ? 'On-time background sentinel intercepted a message on your device containing fraud tactics, fake urgency, or phishing hooks.' 
                  : 'The continuous on-device sentinel intercepted a newly introduced file exceeding threat heuristic limits.'}
              </p>
            </div>
          </div>

          {/* Threat Metadata Card */}
          <div className="bg-black/60 rounded-xl p-4 border border-slate-800 space-y-3 font-mono text-sm">
            {isMessageThreat ? (
              <>
                <div className="border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400 block text-xs mb-1">Intercepted Message Content:</span>
                  <div className="p-2.5 rounded bg-red-950/20 border border-red-900/40 text-xs text-red-200/90 italic break-words">
                    "{threat.text}"
                  </div>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Threat Severity:</span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                    {threat.riskLevel} ({threat.riskScore}/100)
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Interception Time:</span>
                  <span className="text-slate-300">{threat.detectedAt}</span>
                </div>
                {threat.urlsFound && threat.urlsFound.length > 0 && (
                  <div>
                    <span className="text-slate-400 text-xs block mb-1">Embedded Links:</span>
                    <div className="bg-black/80 p-2 rounded text-[11px] text-cyan-400 break-all border border-cyan-950">
                      {threat.urlsFound.join(', ')}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">File Name:</span>
                  <span className="text-red-400 font-bold truncate max-w-[280px]">{threat.fileName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Threat Severity:</span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                    {threat.riskLevel} ({threat.riskScore}/100)
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">File Size:</span>
                  <span className="text-slate-300">{threat.fileSize || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Interception Time:</span>
                  <span className="text-slate-300">{threat.detectedAt}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block mb-1">SHA-256 Checksum:</span>
                  <div className="bg-black/80 p-2 rounded text-[11px] text-cyan-400 break-all select-all border border-cyan-950">
                    {threat.sha256}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Identified Danger Factors */}
          {threat.reasons && threat.reasons.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5 font-mono">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Detection Indicators</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {threat.reasons.map((r, i) => (
                  <li key={i} className="flex items-start space-x-2 bg-red-950/20 p-2 rounded border border-red-900/30">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{typeof r === 'object' ? r.desc || r.factor : r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Recommendations */}
          <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200/90 font-mono">
            <span className="font-bold text-amber-400 block mb-1">🛡️ Immediate Action Recommended:</span>
            {isMessageThreat 
              ? 'Do NOT reply, do NOT share any OTP/password, and do NOT tap any embedded links.' 
              : 'Do NOT open, double-click, or execute this file. Quarantine or permanently delete it immediately.'}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => {
                if (onQuarantine) onQuarantine(threat);
                onClose();
              }}
              className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-red-600/30 active:scale-98 font-mono"
            >
              <Trash2 className="w-4 h-4" />
              <span>Acknowledge & Mark Risky</span>
            </button>
            <button
              onClick={onClose}
              className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors font-mono"
            >
              Dismiss Warning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
