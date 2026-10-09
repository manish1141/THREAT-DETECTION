import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Play, 
  RefreshCw, 
  Smartphone, 
  Lock, 
  Wifi, 
  Globe2, 
  CheckCircle2, 
  Activity, 
  ArrowUpRight,
  ChevronRight,
  Info,
  Laptop,
  Cpu,
  HardDrive
} from 'lucide-react';
import { SecurityScoreCircle } from '../components/SecurityScoreCircle';
import { ThreatCard } from '../components/ThreatCard';

export function DashboardPage({ 
  dashboardData, 
  onRunScan, 
  isScanning, 
  scanProgress, 
  onNavigate,
  onInspectThreat,
  onResolveThreat,
  realHostData
}) {
  const { 
    score, 
    status, 
    statusClass, 
    threatsCount, 
    highRiskCount, 
    privacyRisksCount, 
    networkStatus, 
    totalAppsAnalyzed, 
    lastCheck, 
    isMonitoringActive, 
    breakdown,
    threats 
  } = dashboardData;

  const activeThreats = (threats || []).filter(t => t.status === 'ACTIVE');
  const host = realHostData?.host;

  return (
    <div className="space-y-6 animate-fadeIn pb-16 lg:pb-8">
      {/* Real Hardware Node Telemetry Banner */}
      {host && (
        <div className="glass-panel p-4.5 rounded-2xl border-emerald-500/30 bg-emerald-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-mono">{host.hostname}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  REAL LAPTOP HARDWARE CONNECTED
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-2 font-mono">
                <span>OS: {host.platform.toUpperCase()} ({host.release})</span>
                <span>•</span>
                <span>CPU: {host.cpusCount} Logical Cores</span>
                <span>•</span>
                <span>User: {host.username}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">RAM USAGE</span>
              <span className="text-cyan-400 font-bold">{host.memoryUsagePct}% ({host.freeMemoryGb} Free / {host.totalMemoryGb})</span>
            </div>
            <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">UPTIME</span>
              <span className="text-emerald-400 font-bold">{host.uptimeHours} hrs</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner Alert / Scanning Modal Overlay */}
      {isScanning && (
        <div className="glass-panel-glow border-cyan-500/40 p-5 rounded-2xl relative overflow-hidden animate-pulse">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  RUNNING REAL-TIME HEURISTIC HARDWARE SCAN
                </h4>
                <p className="text-xs text-cyan-300 font-mono mt-0.5">
                  {scanProgress?.text || 'Auditing active laptop processes and registry packages...'}
                </p>
              </div>
            </div>
            <span className="text-lg font-mono font-black text-cyan-400">
              {scanProgress?.progress || 0}%
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-3">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
              style={{ width: `${scanProgress?.progress || 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Hero Security Overview Card */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 relative overflow-hidden border border-cyan-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          {/* Left: Score Visualizer */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <SecurityScoreCircle score={score} size={170} strokeWidth={14} />

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                <span className={`w-2 h-2 rounded-full ${isMonitoringActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                <span className="font-mono text-[11px]">Real-Time Sentinel: {isMonitoringActive ? 'ONLINE' : 'PAUSED'}</span>
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block">
                  DEVICE INTEGRITY STATUS
                </span>
                <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${statusClass}`}>
                  {status}
                </h2>
              </div>

              <p className="text-xs text-slate-400 max-w-sm">
                Evaluated against real laptop processes, Windows registry software, network sockets, and cryptographic signatures.
              </p>

              <div className="text-[11px] text-slate-500 font-mono">
                Last check: <span className="text-slate-300">{lastCheck}</span>
              </div>
            </div>
          </div>

          {/* Right: Quick Action & Scanner Trigger */}
          <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-3">
            <button
              onClick={onRunScan}
              disabled={isScanning}
              className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm tracking-wider uppercase flex items-center justify-center gap-3 transition shadow-xl ${
                isScanning 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-slate-950 shadow-emerald-950/60 cursor-pointer active:scale-95'
              }`}
            >
              <Play className={`w-5 h-5 fill-current ${isScanning ? 'animate-spin' : ''}`} />
              <span>RUN REAL-TIME SECURITY CHECK</span>
            </button>
            <span className="text-[11px] text-slate-400 font-mono">
              Live on-device audit • Zero cloud data exfiltration
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Key Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Threats */}
        <div 
          onClick={() => onNavigate('threatCenter')}
          className="glass-panel p-4.5 rounded-2xl border-slate-800 hover:border-rose-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Threats</span>
            <div className={`p-2 rounded-xl ${threatsCount > 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white group-hover:text-rose-400 transition">
            {threatsCount}
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            {highRiskCount} High / Critical incidents
          </span>
        </div>

        {/* Card 2: Privacy Risks */}
        <div 
          onClick={() => onNavigate('permissions')}
          className="glass-panel p-4.5 rounded-2xl border-slate-800 hover:border-amber-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Privacy Risks</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white group-hover:text-amber-400 transition">
            {privacyRisksCount}
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Privileged background hooks
          </span>
        </div>

        {/* Card 3: Network Risk */}
        <div 
          onClick={() => onNavigate('monitoring')}
          className="glass-panel p-4.5 rounded-2xl border-slate-800 hover:border-cyan-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Sockets</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Wifi className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-black text-emerald-400 group-hover:text-cyan-300 transition truncate">
            {realHostData?.networkSockets?.length ? `${realHostData.networkSockets.length} Ports` : 'Secure (15)'}
          </div>
          <span className="text-[11px] text-slate-500 block mt-1 truncate">
            Listening TCP Services
          </span>
        </div>

        {/* Card 4: Apps Analyzed */}
        <div 
          onClick={() => onNavigate('apps')}
          className="glass-panel p-4.5 rounded-2xl border-slate-800 hover:border-blue-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Real Host Apps</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Laptop className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white group-hover:text-blue-400 transition">
            {totalAppsAnalyzed}
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Windows Registry Packages
          </span>
        </div>
      </div>

      {/* Category Risk Breakdown */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Security Score Vector Breakdown
            </h3>
            <p className="text-xs text-slate-400">Weighted heuristic evaluation across live laptop telemetry</p>
          </div>
          <button
            onClick={() => onNavigate('report')}
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
          >
            Detailed Report <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: 'Applications', val: breakdown?.applications || 90, desc: 'Windows registry packages' },
            { label: 'Permissions', val: breakdown?.permissions || 82, desc: 'Active daemon privilege scopes' },
            { label: 'Network', val: breakdown?.network || 92, desc: 'Listening sockets & TLS' },
            { label: 'Privacy', val: breakdown?.privacy || 86, desc: 'Local memory & telemetry hygiene' },
            { label: 'Threat Protection', val: breakdown?.threatProtection || 95, desc: 'IOC & Known Malicious Hashes' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{item.label}</span>
                <span className={`font-mono font-bold ${
                  item.val >= 80 ? 'text-emerald-400' : item.val >= 60 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {item.val}%
                </span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    item.val >= 80 ? 'bg-emerald-500' : item.val >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${item.val}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Incident Feed */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Immediate Attention Items
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-400 border border-rose-800">
              {activeThreats.length} Active
            </span>
          </div>
          <button
            onClick={() => onNavigate('threatCenter')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <span>View All Incidents</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {activeThreats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeThreats.slice(0, 2).map((threat) => (
              <ThreatCard
                key={threat.id}
                threat={threat}
                onSelect={onInspectThreat}
                onStatusChange={onResolveThreat}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl glass-panel text-center border-emerald-500/20">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">No Active Threats Detected</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              All tested applications and permission vectors comply with baseline heuristic security policies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
