import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Smartphone, 
  Bell, 
  Shield, 
  Database, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  ExternalLink,
  Lock,
  Moon,
  Info
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { ANDROID_INTEGRATION_STATUS } from '../security/androidNativeBridge';

export function SettingsPage({ profile, settings, onUpdateProfile, onUpdateSettings, onResetAll }) {
  const [profileForm, setProfileForm] = useState(profile);
  const [settingsForm, setSettingsForm] = useState(settings);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateProfile(profileForm);
    onUpdateSettings(settingsForm);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 lg:pb-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border-cyan-500/20">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
            CONFIGURATION & GOVERNANCE
          </span>
        </div>
        <h2 className="text-2xl font-black text-white mt-1">
          Settings & Local Security Policies
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
          Customize on-device heuristics, scan frequencies, notification thresholds, and privacy storage parameters.
        </p>
      </div>

      {savedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Security preferences saved successfully to local storage.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile & Device Identity */}
        <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            Device Operator & Node Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Security Officer / User Profile
              </label>
              <input
                type="text"
                value={profileForm.username}
                onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Monitored Device Descriptor
              </label>
              <input
                type="text"
                value={profileForm.deviceName}
                onChange={(e) => setProfileForm({ ...profileForm, deviceName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Protection & Sentinel Preferences */}
        <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            Threat Guard Heuristics & Scan Frequency
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Continuous Heuristic Audit Interval
              </label>
              <select
                value={settingsForm.scanFrequency}
                onChange={(e) => setSettingsForm({ ...settingsForm, scanFrequency: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="realtime">Continuous Sentinel Stream (Every 10 min)</option>
                <option value="every_6h">Every 6 Hours (Recommended)</option>
                <option value="daily">Daily Scheduled Background Audit</option>
                <option value="manual">Manual Trigger Only</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Heuristic Strictness Level
              </label>
              <select
                value={settingsForm.heuristicAggressiveness}
                onChange={(e) => setSettingsForm({ ...settingsForm, heuristicAggressiveness: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="relaxed">Relaxed (Flag only confirmed exploits & known malware)</option>
                <option value="balanced">Balanced (Standard BCA evaluation guidelines)</option>
                <option value="strict">Strict (Flag any sideloaded APK or unknown permission)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settingsForm.autoMonitoring}
                onChange={(e) => setSettingsForm({ ...settingsForm, autoMonitoring: e.target.checked })}
                className="rounded text-cyan-500 focus:ring-0 bg-slate-900"
              />
              <span className="text-xs text-slate-300">
                Enable Real-Time Background Sentinel Event Stream
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profileForm.notificationsEnabled}
                onChange={(e) => setProfileForm({ ...profileForm, notificationsEnabled: e.target.checked })}
                className="rounded text-cyan-500 focus:ring-0 bg-slate-900"
              />
              <span className="text-xs text-slate-300">
                Deliver High-Risk Alert Banners and Audio Chimes
              </span>
            </label>
          </div>
        </div>

        {/* Optional Cloud Intelligence Settings (Requirement #18) */}
        <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              Optional External Threat Intelligence Feeds (VirusTotal / Play Integrity)
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
              PRIVACY-FIRST (DISABLED BY DEFAULT)
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            By default, Threat Guard executes 100% locally. You can optionally hook external reputation endpoints without exposing client API secrets.
          </p>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={settingsForm.cloudReputationServiceEnabled}
                onChange={(e) => setSettingsForm({ ...settingsForm, cloudReputationServiceEnabled: e.target.checked })}
                className="mt-0.5 rounded text-purple-500 focus:ring-0 bg-slate-900"
              />
              <div>
                <span className="text-xs font-bold text-white block">Enable Cloud Anonymous Hash Queries</span>
                <span className="text-[11px] text-slate-400">
                  Sends only 6-character cryptographic prefix of SHA-256 (k-Anonymity model) without transmitting file contents.
                </span>
              </div>
            </label>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-[11px] text-slate-400">
              <div>Environment Variable Hooks:</div>
              <div className="text-cyan-400 mt-1">VITE_THREAT_INTELLIGENCE_API_URL: <span className="text-slate-300">{settingsForm.cloudApiUrl || '(Unset - Running Purely Local Heuristics)'}</span></div>
              <div className="text-cyan-400">VITE_THREAT_INTELLIGENCE_API_KEY: <span className="text-slate-300">{settingsForm.cloudApiKeyConfigured ? 'Configured (Masked)' : '(Unset)'}</span></div>
            </div>
          </div>
        </div>

        {/* Capacitor Android Integration Blueprint (Requirement #19 & #20) */}
        <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            Capacitor Android Native Bridge Diagnostic
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {Object.entries(ANDROID_INTEGRATION_STATUS.capabilities).map(([key, val]) => (
              <div key={key} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">{key}</span>
                <span className={`font-bold ${val.native ? 'text-emerald-400' : 'text-cyan-400'}`}>
                  {val.native ? '● Native Browser API' : '○ Emulated for Web'}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1 truncate">{val.method}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={onResetAll}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 border border-rose-800/40 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Database to Demo Baseline</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-cyan-950 active:scale-95"
          >
            Save Security Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
