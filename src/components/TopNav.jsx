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
  currentUser
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
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm sm:text-base tracking-wider text-white">
                THREAT GUARD
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 hidden sm:inline-block">
                ON-DEVICE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block tracking-tight">
              Your Device. Your Security. Your Control.
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls: Genuine Current Visitor Device, Notifications, Sign Out */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dynamic Genuine Client Device Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-700/50 text-[11px] font-semibold text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="font-mono truncate max-w-[200px]">
            {deviceInfo?.platformName || 'Current Client Device'}
          </span>
        </div>

        {/* User Account / Profile Badge */}
        {currentUser && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="truncate max-w-[130px] font-mono">
              {currentUser.name || currentUser.email}
            </span>
          </div>
        )}

        {/* Notifications Icon with Badge */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition"
          aria-label="Open notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-slate-950">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Settings Shortcut */}
        <button
          onClick={() => onSelectTab('settings')}
          className={`p-2 rounded-xl border transition ${
            currentTab === 'settings' 
              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40' 
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border-slate-800'
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
