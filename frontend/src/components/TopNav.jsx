import React from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  Bell, 
  Settings as SettingsIcon, 
  Zap, 
  Menu,
  Laptop,
  CheckCircle2
} from 'lucide-react';

export function TopNav({ 
  currentTab, 
  onSelectTab, 
  profile, 
  unreadCount = 0, 
  onOpenNotifications,
  onToggleMobileMenu,
  realHostInfo,
  onToggleRealMode,
  isRealMode = true
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

      {/* Right Controls: Real Hardware Moniker & Live Mode Badge */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* REAL TIME HARDWARE BADGE */}
        <div 
          onClick={onToggleRealMode}
          title="Click to toggle Real Live Host Mode"
          className="flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer transition bg-emerald-950/80 border border-emerald-500/50 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-900/60 shadow-lg shadow-emerald-950/40"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-mono font-bold">REAL-TIME LAPTOP CHECK</span>
        </div>

        {/* Real Laptop Device Descriptor */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <Laptop className="w-3.5 h-3.5 text-cyan-400" />
          <span className="truncate max-w-[170px] font-mono font-bold text-cyan-200">
            {realHostInfo?.hostname || 'DESKTOP-60BRJ0F'}
          </span>
        </div>

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
      </div>
    </header>
  );
}
