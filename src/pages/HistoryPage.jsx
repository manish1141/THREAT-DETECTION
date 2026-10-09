import React, { useState } from 'react';
import { 
  History, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  TrendingUp, 
  BarChart2, 
  PieChart, 
  Filter, 
  Trash2 
} from 'lucide-react';
import { storageService } from '../services/storageService';

export function HistoryPage() {
  const [history, setHistory] = useState(() => storageService.getScanHistory());
  const [filterType, setFilterType] = useState('ALL');

  // If empty, provide rich demo baseline scan history
  const displayHistory = history.length > 0 ? history : [
    { id: 'scan-1', date: '2026-10-08', time: '12:41 PM', scanType: 'Full System Check', threatsFound: 2, securityScore: 86, status: 'DEVICE PROTECTED', summary: 'Analyzed 5 apps, 2 high-risk permission abuses identified.' },
    { id: 'scan-2', date: '2026-10-07', time: '06:15 PM', scanType: 'App Risk Audit', threatsFound: 1, securityScore: 89, status: 'DEVICE PROTECTED', summary: 'Audited 5 APK manifests and runtime permissions.' },
    { id: 'scan-3', date: '2026-10-06', time: '09:30 AM', scanType: 'Full System Check', threatsFound: 3, securityScore: 78, status: 'ACTION RECOMMENDED', summary: 'Detected sideloaded utility and unencrypted HTTP transport.' },
    { id: 'scan-4', date: '2026-10-04', time: '03:10 PM', scanType: 'Network & URL Scan', threatsFound: 0, securityScore: 94, status: 'DEVICE PROTECTED', summary: 'Audited WPA3 encryption handshake and DNS resolver.' }
  ];

  const filtered = displayHistory.filter(item => {
    if (filterType === 'ALL') return true;
    return item.scanType.toLowerCase().includes(filterType.toLowerCase());
  });

  const clearHistory = () => {
    storageService.set('threatguard_scan_history', []);
    setHistory([]);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 lg:pb-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border-cyan-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
                AUDIT LOGS & ANALYTICS
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Security Scan History & Trends
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Historical ledger of past on-device scans, security score evolutions, and resolved vectors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearHistory}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts (Requirement #12) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Chart 1: Security Score Trend */}
        <div className="glass-panel p-5 rounded-2xl border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Security Score Trend
            </span>
            <span className="text-[10px] font-mono text-emerald-400">+8% overall</span>
          </div>

          {/* High-tech custom SVG Line / Sparkline */}
          <div className="h-32 flex items-end justify-between gap-2 pt-6 px-2">
            {[
              { day: 'Oct 4', score: 94 },
              { day: 'Oct 5', score: 91 },
              { day: 'Oct 6', score: 78 },
              { day: 'Oct 7', score: 89 },
              { day: 'Oct 8', score: 86 }
            ].map((pt, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] font-mono text-cyan-400 font-bold opacity-0 group-hover:opacity-100 transition">
                  {pt.score}
                </span>
                <div 
                  className="w-full bg-cyan-500/20 group-hover:bg-cyan-500 rounded-t-lg transition-all"
                  style={{ height: `${(pt.score / 100) * 85}%` }}
                />
                <span className="text-[9px] font-mono text-slate-500">{pt.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Threat Count History */}
        <div className="glass-panel p-5 rounded-2xl border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-amber-400" />
              Threat Incidents Detected
            </span>
            <span className="text-[10px] font-mono text-slate-400">Past 5 Runs</span>
          </div>

          <div className="h-32 flex items-end justify-between gap-3 pt-6 px-2">
            {[
              { day: 'Run 1', count: 0 },
              { day: 'Run 2', count: 1 },
              { day: 'Run 3', count: 3 },
              { day: 'Run 4', count: 1 },
              { day: 'Run 5', count: 2 }
            ].map((pt, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] font-mono text-rose-400 font-bold">
                  {pt.count}
                </span>
                <div 
                  className={`w-full rounded-t-lg transition-all ${pt.count === 0 ? 'bg-emerald-500/40' : 'bg-rose-500/60'}`}
                  style={{ height: `${Math.max(15, pt.count * 28)}%` }}
                />
                <span className="text-[9px] font-mono text-slate-500">{pt.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Risk Vector Distribution */}
        <div className="glass-panel p-5 rounded-2xl border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-purple-400" />
              Risk Vector Distribution
            </span>
          </div>

          <div className="space-y-2.5 pt-2">
            {[
              { label: 'Permissions (Accessibility/Overlay)', pct: 50, color: 'bg-rose-500' },
              { label: 'Sideloaded / Unknown Signers', pct: 30, color: 'bg-amber-500' },
              { label: 'Network / Transport Protocols', pct: 20, color: 'bg-cyan-500' }
            ].map((vec, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span className="truncate pr-2">{vec.label}</span>
                  <span className="font-mono text-slate-200 font-bold">{vec.pct}%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${vec.color}`} style={{ width: `${vec.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Table List (Requirement #12) */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Historical Scan Ledger
          </h3>
          <div className="flex items-center gap-2">
            {['ALL', 'Full System', 'App Risk', 'Network'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterType === type 
                    ? 'bg-cyan-500 text-slate-950 font-bold' 
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          {filtered.map(scan => (
            <div 
              key={scan.id} 
              className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-cyan-500/30 transition flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{scan.scanType}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      Score: {scan.securityScore}/100
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{scan.summary}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400 shrink-0">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{scan.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{scan.time}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  scan.threatsFound > 0 
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  {scan.threatsFound} Threats
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
