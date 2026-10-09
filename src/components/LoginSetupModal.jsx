import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  ShieldAlert, 
  Lock, 
  Wifi, 
  ArrowRight,
  CheckCircle2,
  Sparkles,
  UserCheck
} from 'lucide-react';

export function LoginSetupModal({ isOpen, onComplete, initialProfile }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    username: initialProfile?.username || 'Security Officer',
    deviceName: initialProfile?.deviceName || 'Pixel 9 Pro / BCA Node',
    securityLevel: initialProfile?.securityLevel || 'MAXIMUM',
    notificationsEnabled: initialProfile?.notificationsEnabled ?? true,
    autoMonitoring: true,
    disclaimerAccepted: false
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel-glow w-full max-w-lg rounded-2xl overflow-hidden border border-cyan-500/30">
        {/* Banner */}
        <div className="p-6 bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-blue-950/60 border-b border-slate-800 text-center relative">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3 shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">
            BCA CYBERSECURITY SYSTEM SETUP
          </span>
          <h2 className="text-xl font-black text-white mt-2">
            ON-DEVICE THREAT GUARD
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            "Your Device. Your Security. Your Control."
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {step === 1 ? (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                Step 1: Security Node Identity
              </h3>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Operator Name / Profile
                </label>
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  placeholder="e.g. BCA Cybersecurity Analyst"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Target Device Name
                </label>
                <input
                  type="text"
                  value={profile.deviceName}
                  onChange={(e) => setProfile({ ...profile, deviceName: e.target.value })}
                  placeholder="e.g. Samsung Galaxy S24 / Pixel 9"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Protection Rigor Preset
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['BALANCED', 'HIGH', 'MAXIMUM'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setProfile({ ...profile, securityLevel: lvl })}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        profile.securityLevel === lvl
                          ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500 shadow-md shadow-cyan-950'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-950"
              >
                <span>Continue to Security Baseline</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Step 2: Privacy & Telemetry Guard
              </h3>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.notificationsEnabled}
                    onChange={(e) => setProfile({ ...profile, notificationsEnabled: e.target.checked })}
                    className="mt-0.5 rounded text-cyan-500 focus:ring-0 bg-slate-900"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Real-Time Threat Notifications</span>
                    <span className="text-[11px] text-slate-400">Receive local on-device banners for high-risk signals</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.autoMonitoring}
                    onChange={(e) => setProfile({ ...profile, autoMonitoring: e.target.checked })}
                    className="mt-0.5 rounded text-cyan-500 focus:ring-0 bg-slate-900"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Continuous Sentinel Monitoring</span>
                    <span className="text-[11px] text-slate-400">Regular heuristic audit of permission and URL vectors</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.disclaimerAccepted}
                    onChange={(e) => setProfile({ ...profile, disclaimerAccepted: e.target.checked })}
                    className="mt-0.5 rounded text-cyan-500 focus:ring-0 bg-slate-900"
                  />
                  <div>
                    <span className="text-xs font-bold text-cyan-300 block">Acknowledge Local-First Heuristic Model</span>
                    <span className="text-[11px] text-slate-400">
                      I understand Threat Guard operates on-device transparent heuristics without claiming 100% detection.
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-bold transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!profile.disclaimerAccepted}
                  onClick={() => onComplete(profile)}
                  className={`w-2/3 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                    profile.disclaimerAccepted
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-950 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Launch Threat Guard</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
