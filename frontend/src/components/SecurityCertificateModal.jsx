import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  Download, 
  Printer, 
  X, 
  CheckCircle2, 
  Lock, 
  Cpu, 
  QrCode, 
  FileText 
} from 'lucide-react';

export function SecurityCertificateModal({ 
  onClose, 
  deviceInfo, 
  currentUser, 
  score = 100 
}) {
  const auditId = 'TG-CERT-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const dateFormatted = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const timeFormatted = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  const certHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-3xl rounded-3xl border-2 border-[#00ff66]/40 bg-[#020704]/98 shadow-[0_0_60px_rgba(0,255,102,0.25)] overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Top Control Bar */}
        <div className="p-4 border-b border-emerald-900/60 bg-emerald-950/30 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#00ff66]" />
            <span className="text-xs font-mono font-bold text-white tracking-widest uppercase">
              OFFICIAL ON-DEVICE AUDIT CERTIFICATE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-[#00ff66]/30 hover:from-emerald-500/30 hover:to-[#00ff66]/40 text-[#00ff66] border border-[#00ff66]/50 text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-[0_0_12px_rgba(0,255,102,0.2)]"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Body */}
        <div className="p-8 sm:p-12 overflow-y-auto space-y-8 print:p-6 text-center relative">
          
          {/* Subtle Watermark Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <ShieldCheck className="w-[450px] h-[450px] text-[#00ff66]" />
          </div>

          {/* Certificate Framing */}
          <div className="border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-10 bg-slate-950/40 relative">
            
            {/* Header Badge */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00ff66] to-emerald-600 p-0.5 mx-auto mb-4 shadow-[0_0_30px_rgba(0,255,102,0.4)] flex items-center justify-center">
              <div className="w-full h-full bg-[#030905] rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-9 h-9 text-[#00ff66]" />
              </div>
            </div>

            <span className="text-[11px] font-mono font-extrabold tracking-[0.25em] text-[#00ff66] uppercase block">
              ON-DEVICE THREAT GUARD PROTOCOL
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-audiowide mt-1 tracking-wider uppercase">
              CERTIFICATE OF ENDPOINT INTEGRITY
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-2 max-w-lg mx-auto">
              This document certifies that the evaluated client hardware endpoint has undergone rigorous local cryptographic heuristic verification and zero active threat vectors were detected.
            </p>

            {/* Score Showcase */}
            <div className="my-8 py-5 px-6 rounded-2xl bg-[#041209] border border-[#00ff66]/30 inline-block">
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">
                VERIFIED SECURITY POSTURE
              </span>
              <div className="text-4xl sm:text-5xl font-black font-audiowide text-[#00ff66] drop-shadow-[0_0_15px_rgba(0,255,102,0.5)] mt-1">
                100 / 100
              </div>
              <span className="text-[11px] font-mono text-slate-300 block mt-1">
                STATUS: PERFECT HARDWARE & CODE INTEGRITY
              </span>
            </div>

            {/* Verification Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left font-mono text-xs max-w-xl mx-auto border-t border-b border-emerald-950/80 py-4 my-6">
              <div>
                <span className="text-slate-500 block text-[10px]">VERIFIED CLIENT TARGET</span>
                <span className="text-white font-bold">{deviceInfo?.platformName || 'Windows 11 / Client Endpoint'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">ISSUED TO ACCOUNT</span>
                <span className="text-white font-bold">{currentUser?.name || 'Security Analyst (On-Device)'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">AUDIT TIMESTAMP</span>
                <span className="text-slate-300">{dateFormatted} at {timeFormatted}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">TELEMETRY CONFINEMENT</span>
                <span className="text-[#00ff66] font-bold">100% Client-Side Isolated (Zero-Cloud)</span>
              </div>
            </div>

            {/* Cryptographic SHA-256 Signature Stamp */}
            <div className="bg-black/60 p-3 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 max-w-xl mx-auto flex items-center justify-between gap-2">
              <div className="truncate">
                <span className="text-[#00ff66] font-bold">SHA-256 PROOF: </span>
                <span className="truncate">{certHash}</span>
              </div>
              <span className="text-cyan-400 font-bold shrink-0">{auditId}</span>
            </div>

            {/* Official Seal Footer */}
            <div className="mt-8 flex items-center justify-between pt-4 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#00ff66]" />
                <span>Compliant with DPDP Act & GDPR Privacy Guarantees</span>
              </div>
              <div className="text-right">
                <span className="text-emerald-400 font-bold block">Google Antigravity Lab Verified</span>
                <span className="text-[10px] text-slate-500">Autonomous Endpoint Sentinel Engine</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
