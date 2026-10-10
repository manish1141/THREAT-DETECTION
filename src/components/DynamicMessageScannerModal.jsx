import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertOctagon, 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Radio, 
  Trash2, 
  Terminal,
  Activity,
  Cpu
} from 'lucide-react';

export function DynamicMessageScannerModal({ 
  scanJob, 
  onClose, 
  onQuarantine 
}) {
  const [phase, setPhase] = useState(0); 
  // 0: Tokenizing message
  // 1: Linguistic vector & urgency parsing
  // 2: Cryptographic heuristic correlation
  // 3: Finished evaluation

  const [currentScore, setCurrentScore] = useState(0);

  const steps = [
    'Parsing message lexicon & token frequencies...',
    'Checking psychological urgency & coercive deadlines...',
    'Analyzing credential theft & banking OTP traps...',
    'Synthesizing final risk assessment & mitigation...'
  ];

  useEffect(() => {
    if (!scanJob) return;

    setPhase(0);
    setCurrentScore(5);

    const timer1 = setTimeout(() => {
      setPhase(1);
      setCurrentScore(Math.round(scanJob.riskScore * 0.4));
    }, 450);

    const timer2 = setTimeout(() => {
      setPhase(2);
      setCurrentScore(Math.round(scanJob.riskScore * 0.75));
    }, 950);

    const timer3 = setTimeout(() => {
      setPhase(3);
      setCurrentScore(scanJob.riskScore);
    }, 1450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [scanJob]);

  if (!scanJob) return null;

  const isDone = phase === 3;
  const isHighRisk = scanJob.riskScore >= 35;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className={`relative w-full max-w-xl bg-gradient-to-b ${
        isDone && isHighRisk 
          ? 'from-[#18080a] to-[#0a0304] border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.4)]'
          : 'from-[#07170e] to-[#030a06] border-[#00ff66]/60 shadow-[0_0_40px_rgba(0,255,102,0.3)]'
      } border-2 rounded-3xl overflow-hidden transition-all duration-500`}>
        
        {/* Animated Cyber Header */}
        <div className={`p-4 px-6 flex items-center justify-between border-b ${
          isDone && isHighRisk 
            ? 'bg-red-950/40 border-red-500/40 text-red-400' 
            : 'bg-[#00ff66]/10 border-[#00ff66]/30 text-[#00ff66]'
        }`}>
          <div className="flex items-center space-x-3">
            <span className="flex h-3.5 w-3.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isDone && isHighRisk ? 'bg-red-400' : 'bg-[#00ff66]'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
                isDone && isHighRisk ? 'bg-red-500' : 'bg-[#00ff66]'
              }`}></span>
            </span>
            <span className="font-audiowide text-sm tracking-wider uppercase">
              {isDone 
                ? (isHighRisk ? 'LIVE SENTINEL: RISKY MESSAGE' : 'LIVE SENTINEL: MESSAGE VERIFIED') 
                : 'REAL-TIME HEURISTIC INTERCEPTOR'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto font-mono">
          
          {/* Real-time Dynamic Scanning Animation Bar */}
          {!isDone ? (
            <div className="p-5 rounded-2xl bg-black/60 border border-[#00ff66]/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#00ff66] flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>{steps[phase]}</span>
                </span>
                <span className="text-white font-bold">{Math.round(((phase + 1) / 4) * 100)}%</span>
              </div>

              {/* Progress track */}
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-emerald-950">
                <div 
                  className="h-full bg-gradient-to-r from-[#00ff66] to-[#00f0ff] transition-all duration-300"
                  style={{ width: `${((phase + 1) / 4) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Intercept Origin: {scanJob.source || 'Device Telemetry'}</span>
                <span className="text-cyan-400">Score Tracker: {currentScore}/100</span>
              </div>
            </div>
          ) : (
            /* Completed Analysis Header Card */
            <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
              isHighRisk 
                ? 'bg-red-950/40 border-red-500/40' 
                : 'bg-[#041a0e] border-[#00ff66]/30'
            }`}>
              {isHighRisk ? (
                <AlertOctagon className="w-8 h-8 text-red-500 shrink-0 mt-0.5 animate-bounce" />
              ) : (
                <ShieldCheck className="w-8 h-8 text-[#00ff66] shrink-0 mt-0.5" />
              )}
              <div>
                <h3 className={`text-lg font-black tracking-wide ${isHighRisk ? 'text-red-400' : 'text-[#00ff66]'}`}>
                  {isHighRisk ? 'DANGEROUS SCAM INTERCEPTED!' : 'MESSAGE PROFILE SAFE'}
                </h3>
                <p className="text-xs text-slate-300 mt-1 font-sans">
                  {isHighRisk
                    ? 'Our on-device sentinel detected active fraud vectors, panic triggers, or credential harvesting hooks in this incoming message.'
                    : 'The message has been dynamically audited locally. No fraudulent coercion patterns were detected.'}
                </p>
              </div>
            </div>
          )}

          {/* Intercepted Text Snippet */}
          <div className="p-4 rounded-xl bg-black/70 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">
              Intercepted Message:
            </span>
            <div className="p-3 rounded-lg bg-[#040c07] border border-emerald-950/80 text-xs text-emerald-200/90 leading-relaxed break-words italic">
              "{scanJob.text}"
            </div>
          </div>

          {/* Detailed Indicators When Done */}
          {isDone && (
            <>
              {/* Score breakdown metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-black/60 border border-slate-800 flex flex-col justify-between">
                  <span className="text-slate-400">Calculated Risk Score:</span>
                  <span className={`text-lg font-black mt-1 ${isHighRisk ? 'text-red-400' : 'text-[#00ff66]'}`}>
                    {scanJob.riskScore}/100 ({scanJob.riskLevel})
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-slate-800 flex flex-col justify-between">
                  <span className="text-slate-400">Evaluation Method:</span>
                  <span className="text-cyan-400 font-bold mt-1">
                    100% On-Device Heuristic
                  </span>
                </div>
              </div>

              {/* Flagged reasons */}
              {scanJob.reasons && scanJob.reasons.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    Triggered Risk Heuristics ({scanJob.reasons.length}):
                  </span>
                  <div className="space-y-1.5">
                    {scanJob.reasons.map((r, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/40 text-xs text-red-200 flex items-start gap-2">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{typeof r === 'object' ? r.desc || r.factor : r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Recommendation */}
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200">
                <span className="font-bold text-amber-400 block mb-1">🛡️ Safety Advisory:</span>
                {scanJob.recommendations?.[0] || 'Do NOT reply to suspicious messages or share passwords/OTPs.'}
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            {isHighRisk && (
              <button
                onClick={() => {
                  if (onQuarantine) onQuarantine(scanJob);
                  onClose();
                }}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-red-600/30 active:scale-95 text-xs uppercase tracking-wider"
              >
                <Trash2 className="w-4 h-4" />
                <span>Mark Risky & Quarantine</span>
              </button>
            )}
            <button
              onClick={onClose}
              className={`py-3 px-5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                isHighRisk 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
                  : 'flex-1 bg-gradient-to-r from-[#00ff66] to-[#00f0ff] text-[#030a06] shadow-lg shadow-[#00ff66]/20'
              }`}
            >
              {isDone ? 'Dismiss Audit' : 'Cancel Scan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
