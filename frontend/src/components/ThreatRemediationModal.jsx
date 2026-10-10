import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Cpu, 
  Activity, 
  Terminal, 
  FastForward, 
  CheckCircle2, 
  X, 
  Lock, 
  AlertTriangle 
} from 'lucide-react';

export function ThreatRemediationModal({ 
  threat, 
  isAll = false,
  onComplete, 
  onClose 
}) {
  const TOTAL_DURATION_SEC = 60; // 1 minute remediation delay
  const [remainingSec, setRemainingSec] = useState(TOTAL_DURATION_SEC);
  const [isFinished, setIsFinished] = useState(false);
  const [logs, setLogs] = useState([
    '[INIT] Connecting to on-device sandbox security context...',
    '[AUTH] Acquiring verified hardware execution token...'
  ]);

  const remediationMilestones = [
    { atSec: 54, phase: 1, text: 'Phase 1/5: Freezing unauthorized process memory handles & hooks...' },
    { atSec: 44, phase: 2, text: 'Phase 2/5: Revoking background overlay, accessibility, and sensor grants...' },
    { atSec: 32, phase: 3, text: 'Phase 3/5: Isolating suspicious bytecode payloads into encrypted sandbox...' },
    { atSec: 20, phase: 4, text: 'Phase 4/5: Executing cryptographic SHA-256 endpoint integrity audit...' },
    { atSec: 8,  phase: 5, text: 'Phase 5/5: Updating real-time heuristics matrix and recomputing score...' },
    { atSec: 0,  phase: 6, text: 'Phase Complete: Threat neutralized. System integrity restored.' }
  ];

  // 1-minute countdown ticker
  useEffect(() => {
    if (isFinished) return;

    const interval = setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinish();
          return 0;
        }
        const next = prev - 1;

        // Check if milestone triggered
        const milestone = remediationMilestones.find(m => m.atSec === next);
        if (milestone) {
          const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          setLogs(curr => [...curr, `[${timestamp}] ${milestone.text}`]);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isFinished]);

  const handleFinish = () => {
    setIsFinished(true);
    setRemainingSec(0);
    setLogs(curr => [
      ...curr,
      `[${new Date().toLocaleTimeString()}] [SUCCESS] On-device remediation verified. Dynamic score recalculated to 100.`
    ]);

    setTimeout(() => {
      if (onComplete) {
        onComplete(threat?.id);
      }
    }, 1200);
  };

  const handleFastForward = () => {
    handleFinish();
  };

  const progressPercent = Math.min(100, Math.round(((TOTAL_DURATION_SEC - remainingSec) / TOTAL_DURATION_SEC) * 100));
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-cyan-500/30 bg-[#030705]/95 shadow-[0_0_50px_rgba(0,255,102,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-emerald-950/30 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-2xl border ${isFinished ? 'bg-emerald-500/20 border-emerald-500/50 text-[#00ff66]' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 animate-pulse'}`}>
              {isFinished ? <CheckCircle2 className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                  {isAll ? 'BATCH REMEDIATION' : 'ON-DEVICE REMEDIATION'}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {isFinished ? 'COMPLETED' : 'IN PROGRESS'}
                </span>
              </div>
              <h3 className="text-lg font-black text-white font-mono mt-0.5">
                {isAll ? 'Resolving All Active Incident Vectors' : (threat?.name || 'Active Threat Incident')}
              </h3>
            </div>
          </div>

          {!isFinished && (
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title="Cancel Remediation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Target Metadata */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px]">TARGET SUBSYSTEM / ITEM</span>
              <span className="text-white font-semibold">
                {isAll ? 'All Detected System Risks (100% Remediation)' : (threat?.affectedItem || 'System Vector')}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <span className="text-slate-500 block text-[10px]">SEVERITY</span>
                <span className="text-orange-400 font-bold uppercase">{threat?.severity || 'HIGH'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">SCORE BENEFIT</span>
                <span className="text-emerald-400 font-bold">+100 MAX INTEGRITY</span>
              </div>
            </div>
          </div>

          {/* Live Progress Bar with 1-Minute Countdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isFinished ? 'bg-emerald-400' : 'bg-cyan-400 animate-ping'}`} />
                {isFinished ? 'Neutralization Complete' : 'Deep On-Device Remediation Progress'}
              </span>
              <div className="flex items-center gap-3 font-bold">
                <span className="text-[#00ff66]">{progressPercent}%</span>
                <span className="text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                  {formatTime(remainingSec)} REMAINING
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 relative">
              <div 
                className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                  isFinished 
                    ? 'bg-gradient-to-r from-emerald-500 to-[#00ff66] shadow-[0_0_20px_rgba(0,255,102,0.8)]' 
                    : 'bg-gradient-to-r from-cyan-500 via-emerald-400 to-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.5)]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              *Executing full 1-minute sandbox isolation, cryptographic purge, and memory boundary restoration.
            </p>
          </div>

          {/* Cyber Terminal Output Logs */}
          <div className="rounded-2xl border border-slate-800 bg-[#020503] p-4 font-mono text-xs space-y-1.5 shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-slate-900 text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Terminal className="w-3.5 h-3.5" />
                LIVE REMEDIATION TELEMETRY STREAM
              </span>
              <span>100% CLIENT ISOLATED</span>
            </div>
            <div className="h-36 overflow-y-auto space-y-1 pt-1 pr-1 scrollbar-thin">
              {logs.map((log, idx) => (
                <div key={idx} className="text-slate-300 leading-relaxed flex items-start gap-2">
                  <span className="text-[#00ff66] select-none">›</span>
                  <span className={idx === logs.length - 1 ? 'text-[#00ff66] font-semibold' : 'text-slate-400'}>
                    {log}
                  </span>
                </div>
              ))}
              {!isFinished && (
                <div className="flex items-center gap-1 text-cyan-400/80 animate-pulse pt-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                  <span>Processing hardware memory boundaries...</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/80 flex items-center justify-between">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cryptographic state will update dynamically.</span>
          </div>

          <div className="flex items-center gap-2">
            {!isFinished && (
              <button
                onClick={handleFastForward}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-[#00ff66]/30 hover:from-emerald-500/30 hover:to-[#00ff66]/40 text-[#00ff66] border border-[#00ff66]/50 font-mono text-xs font-bold flex items-center gap-2 transition active:scale-95 shadow-[0_0_15px_rgba(0,255,102,0.2)] cursor-pointer"
                title="Fast-forward delay and finish immediately"
              >
                <FastForward className="w-4 h-4" />
                <span>Fast-Forward (Instant Resolve)</span>
              </button>
            )}
            
            {!isFinished ? (
              <button
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-mono text-xs transition"
              >
                Cancel
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 animate-pulse">
                <CheckCircle2 className="w-4 h-4" />
                <span>Score Updated to 100!</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
