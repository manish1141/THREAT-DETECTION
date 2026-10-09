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
  Lock, 
  Trash2,
  LogOut,
  Info
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import { ANDROID_INTEGRATION_STATUS } from '../security/androidNativeBridge';
import { TeamCreditsCard } from '../components/TeamCreditsCard';

export function SettingsPage({ profile, settings, onUpdateProfile, onUpdateSettings, onResetAll, currentUser, onSignOut }) {
  const [profileForm, setProfileForm] = useState(profile);
  const [settingsForm, setSettingsForm] = useState(settings);
  const [savedMessage, setSavedMessage] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateProfile(profileForm);
    onUpdateSettings(settingsForm);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  const handleDeleteUserData = () => {
    storageService.clearUserData();
    setDeleteConfirm(false);
    onResetAll();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 lg:pb-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border-cyan-500/20">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
            SETTINGS & PRIVACY CONTROLS
          </span>
        </div>
        <h2 className="text-2xl font-black text-white mt-1">
          Device Settings & Privacy Governance
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
          Customize on-device heuristics, scan frequencies, notification thresholds, and isolated user account privacy.
        </p>
      </div>

      {savedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Security preferences saved successfully to isolated local storage.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* User Account & Session Profile */}
        <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              Authenticated User Account & Session
            </h3>
            {currentUser && (
              <span className="text-[11px] font-mono text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800">
                ● Active Session (Expires in 12h)
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Account Email Address
              </label>
              <input
                type="text"
                disabled
                value={currentUser?.email || profileForm.email || 'analyst@endpoint.local'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 font-mono cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Device Moniker / Label
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
                Heuristic Audit Interval
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
                Deliver High-Risk Alert Banners and Notifications
              </span>
            </label>
          </div>
        </div>

        {/* Data Privacy & Deletion (Requirement #8) */}
        <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            Data Privacy & Data Deletion
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            All your scan histories, threat resolutions, and profile preferences are stored strictly on-device in isolated local storage. You can delete your personal audit history at any time.
          </p>

          <div className="pt-1">
            {!deleteConfirm ? (
              <button
                type="button"
                onClick={() => setDeleteConfirm(true)}
                className="px-4 py-2.5 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 border border-rose-800/40 text-rose-300 text-xs font-bold flex items-center gap-2 transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete All My Stored Scan Records</span>
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-700 text-xs space-y-3">
                <span className="text-rose-200 font-bold block">
                  Are you sure you want to permanently delete all scan history and local security records for this account?
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleDeleteUserData}
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition"
                  >
                    Confirm Permanent Deletion
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {currentUser && (
            <button
              type="button"
              onClick={onSignOut}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Sign Out of Account</span>
            </button>
          )}

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-cyan-950 active:scale-95 ml-auto"
          >
            Save Security Preferences
          </button>
        </div>
      </form>

      {/* Team Credits Card */}
      <TeamCreditsCard />
    </div>
  );
}
