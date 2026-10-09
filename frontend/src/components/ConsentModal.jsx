import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Globe2, 
  FileCheck2, 
  Info, 
  ArrowRight,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

export function ConsentModal({ isOpen, onAcceptConsent, onDeclineConsent }) {
  const [consentOptions, setConsentOptions] = useState({
    allowBrowserDiagnostics: true,
    allowFileHashCalculation: true,
    allowUrlHeuristics: true,
    allowNotifications: false
  });

  if (!isOpen) return null;

  const toggleOption = (key) => {
    setConsentOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfirm = () => {
    onAcceptConsent(consentOptions);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel-glow w-full max-w-2xl rounded-3xl overflow-hidden border border-cyan-500/30 flex flex-col shadow-2xl max-h-[92vh]">
        
        {/* Banner */}
        <div className="p-6 bg-gradient-to-r from-cyan-950/80 via-slate-900/90 to-blue-950/80 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                PRIVACY FIRST • INFORMED USER CONSENT
              </span>
              <h2 className="text-xl font-black text-white mt-1">
                Permission & Diagnostic Consent
              </h2>
              <p className="text-xs text-slate-400">
                Transparent disclosure before initiating on-device cybersecurity checks.
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Information Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          
          {/* Important Sandbox Disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-200 space-y-1.5">
            <div className="font-bold flex items-center gap-2 text-sm text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              Browser Platform Security Notice:
            </div>
            <p className="leading-relaxed">
              In standard web browsers, security sandboxing strictly prevents arbitrary inspection of your entire operating system or other installed software. Threat Guard <strong>never bypasses browser security</strong> and only inspects data you explicitly authorize.
            </p>
          </div>

          {/* Granular Permission Toggles */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-100 uppercase tracking-wider text-[11px]">
              Select Supported Features You Authorize:
            </h3>

            {/* Feature 1 */}
            <div 
              onClick={() => toggleOption('allowBrowserDiagnostics')}
              className={`p-4 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                consentOptions.allowBrowserDiagnostics 
                  ? 'bg-slate-900/80 border-cyan-500/40 text-white' 
                  : 'bg-slate-950/50 border-slate-800 text-slate-400'
              }`}
            >
              <div className="space-y-1">
                <div className="font-bold flex items-center gap-2 text-xs">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span>Browser & Platform Telemetry (Current Visitor Only)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Allows reading public browser navigator properties (e.g., OS family, CPU concurrency, screen dimensions). Data stays 100% on your device.
                </p>
              </div>
              <input 
                type="checkbox" 
                checked={consentOptions.allowBrowserDiagnostics} 
                onChange={() => {}}
                className="mt-1 rounded text-cyan-500 focus:ring-0 bg-slate-900" 
              />
            </div>

            {/* Feature 2 */}
            <div 
              onClick={() => toggleOption('allowFileHashCalculation')}
              className={`p-4 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                consentOptions.allowFileHashCalculation 
                  ? 'bg-slate-900/80 border-cyan-500/40 text-white' 
                  : 'bg-slate-950/50 border-slate-800 text-slate-400'
              }`}
            >
              <div className="space-y-1">
                <div className="font-bold flex items-center gap-2 text-xs">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span>On-Device Cryptographic SHA-256 File Inspection</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Permits calculating SHA-256 cryptographic hashes in browser memory using the Web Crypto API for files you choose. Your files are <strong>never uploaded to any server</strong>.
                </p>
              </div>
              <input 
                type="checkbox" 
                checked={consentOptions.allowFileHashCalculation} 
                onChange={() => {}}
                className="mt-1 rounded text-cyan-500 focus:ring-0 bg-slate-900" 
              />
            </div>

            {/* Feature 3 */}
            <div 
              onClick={() => toggleOption('allowUrlHeuristics')}
              className={`p-4 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                consentOptions.allowUrlHeuristics 
                  ? 'bg-slate-900/80 border-cyan-500/40 text-white' 
                  : 'bg-slate-950/50 border-slate-800 text-slate-400'
              }`}
            >
              <div className="space-y-1">
                <div className="font-bold flex items-center gap-2 text-xs">
                  <Globe2 className="w-4 h-4 text-blue-400" />
                  <span>URL Pattern & Message Phishing Heuristic Analysis</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Enables offline regex evaluation for Punycode homographs, deceptive banking keywords, and unencrypted links without visiting the suspicious endpoints.
                </p>
              </div>
              <input 
                type="checkbox" 
                checked={consentOptions.allowUrlHeuristics} 
                onChange={() => {}}
                className="mt-1 rounded text-cyan-500 focus:ring-0 bg-slate-900" 
              />
            </div>

            {/* Feature 4 */}
            <div 
              onClick={() => toggleOption('allowNotifications')}
              className={`p-4 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                consentOptions.allowNotifications 
                  ? 'bg-slate-900/80 border-cyan-500/40 text-white' 
                  : 'bg-slate-950/50 border-slate-800 text-slate-400'
              }`}
            >
              <div className="space-y-1">
                <div className="font-bold flex items-center gap-2 text-xs">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Optional Browser Security Alert Banners</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Allows in-app or browser notification banners when a critical risk factor is identified during your scan session.
                </p>
              </div>
              <input 
                type="checkbox" 
                checked={consentOptions.allowNotifications} 
                onChange={() => {}}
                className="mt-1 rounded text-cyan-500 focus:ring-0 bg-slate-900" 
              />
            </div>
          </div>

          {/* Privacy Guarantee Matrix */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2 text-[11px]">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Our Zero-Knowledge Commitment:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>No personal data or browsing history is collected or sold.</li>
              <li>You can revoke permission or delete all stored scan history at any time in Settings.</li>
              <li>Every user account is strictly isolated from other accounts.</li>
            </ul>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onDeclineConsent}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Decline & Use Restricted Sandbox Mode
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-950"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Accept Informed Consent & Enter Dashboard</span>
          </button>
        </div>

      </div>
    </div>
  );
}
