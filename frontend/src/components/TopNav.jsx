import React from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  Bell, 
  Settings as SettingsIcon, 
  Zap, 
  Menu,
  Laptop,
  LogOut,
  UserCheck
} from 'lucide-react';

export function TopNav({ 
  currentTab, 
  onSelectTab, 
  profile, 
  unreadCount = 0, 
  onOpenNotifications,
  onToggleMobileMenu,
  deviceInfo,
  onSignOut,
  currentUser,
  currentLanguage = 'en',
  onToggleLanguage
}) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div 
          onClick={() => onSelectTab('dashboard')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#00ff66] to-[#00f0ff] p-0.5 shadow-lg shadow-[#00ff66]/25 group-hover:shadow-[#00ff66]/50 transition">
            <div className="w-full h-full bg-[#030a06] rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#00ff66] group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-audiowide text-base sm:text-lg tracking-wider text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                THREAT GUARD
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#072414] text-[#00ff66] border border-[#00ff66]/40 hidden sm:inline-block shadow-[0_0_8px_rgba(0,255,102,0.2)]">
                ON-DEVICE
              </span>
            </div>
            <p className="text-[10px] text-emerald-400/70 hidden sm:block tracking-tight font-mono">
              {currentLanguage === 'gu' ? 'તમારું ડિવાઇસ. તમારી સુરક્ષા. તમારું નિયંત્રણ.' : 'Your Device. Your Security. Your Control.'}
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls: Offline Badge, Language Toggle, Device Pill, Notifications, Sign Out */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Zero-Telemetry Offline Guarantee Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-300 shadow-[0_0_10px_rgba(0,255,102,0.1)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-ping" />
          <span>100% OFFLINE CAPABLE • 0 TELEMETRY</span>
        </div>

        {/* Gujarati / English Interactive Language Switcher */}
        {onToggleLanguage && (
          <button
            onClick={onToggleLanguage}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-cyan-950/80 via-[#03150b] to-emerald-950/80 hover:border-[#00ff66]/50 border border-slate-800 text-[11px] font-mono font-bold text-[#00ff66] transition flex items-center gap-1.5 active:scale-95 shadow-[0_0_10px_rgba(0,255,102,0.15)] cursor-pointer"
            title="Toggle between English and Gujarati (જૂરી રાઉન્ડ માટે)"
          >
            <span>🌐</span>
            <span>{currentLanguage === 'gu' ? 'ગુજરાતી' : 'English'}</span>
          </button>
        )}

        {/* Dynamic Genuine Client Device Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#041a0e] border border-[#00ff66]/40 text-[11px] font-semibold text-[#00ff66] shadow-[0_0_12px_rgba(0,255,102,0.15)]">
          <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse shadow-[0_0_8px_#00ff66]"></span>
          <span className="font-mono truncate max-w-[180px]">
            {deviceInfo?.platformName || 'Current Client Device'}
          </span>
        </div>

        {/* User Account / Profile Badge */}
        {currentUser && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#06140b] border border-[#00ff66]/30 text-xs text-slate-300">
            <UserCheck className="w-3.5 h-3.5 text-[#00ff66]" />
            <span className="truncate max-w-[130px] font-mono">
              {currentUser.name || currentUser.email}
            </span>
          </div>
        )}

        {/* Notifications Icon with Badge */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl text-slate-300 hover:text-[#00ff66] hover:bg-[#06180e] border border-emerald-950 transition"
          aria-label="Open notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-black">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Settings Shortcut */}
        <button
          onClick={() => onSelectTab('settings')}
          className={`p-2 rounded-xl border transition ${
            currentTab === 'settings' 
              ? 'bg-[#00ff66]/15 text-[#00ff66] border-[#00ff66]/50 shadow-[0_0_10px_rgba(0,255,102,0.3)]' 
              : 'text-slate-300 hover:text-[#00ff66] hover:bg-[#06180e] border-emerald-950'
          }`}
          aria-label="Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>

        {/* Sign Out Button (Requirement #2) */}
        {currentUser && (
          <button
            onClick={onSignOut}
            title="Sign out of protected session"
            className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
