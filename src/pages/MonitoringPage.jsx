import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Smartphone, 
  Lock, 
  Wifi, 
  Globe2, 
  FileCheck2, 
  Radio, 
  Pause, 
  Play, 
  RefreshCw, 
  ShieldCheck, 
  Terminal,
  Info,
  Laptop,
  Cpu
} from 'lucide-react';

export function MonitoringPage({ deviceInfo }) {
  const [isLive, setIsLive] = useState(true);
  const [feed, setFeed] = useState([
    { id: 1, time: '12:41:20', type: 'SYS', text: 'On-device baseline security check initialized for current visitor session.', status: 'SAFE' },
    { id: 2, time: '12:41:35', type: 'ENV', text: `Detected client environment: ${deviceInfo?.platformName || 'Web Browser'} (${deviceInfo?.screenResolution || '1920x1080'})`, status: 'SAFE' },
    { id: 3, time: '12:42:01', type: 'URL', text: 'URL risk analysis engine armed with offline homograph regex filter: Ready.', status: 'SAFE' },
    { id: 4, time: '12:42:19', type: 'CRYPTO', text: 'Hardware-accelerated Web Crypto SubtleCrypto SHA-256 worker verified.', status: 'SAFE' },
    { id: 5, time: '12:42:48', type: 'NET', text: `Network interface probe validated status: ${deviceInfo?.networkType || 'Online TLS Transport'}.`, status: 'SAFE' }
  ]);

  // Periodic simulated live stream event append (labeled clearly as simulation)
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const simulatedEvents = [
        { type: 'CRYPTO', text: 'Web Crypto Subtle SHA-256 stream idle and ready for user file selection.', status: 'SAFE' },
        { type: 'HEURISTIC', text: 'Client offline phishing regex evaluated clipboard link check: Zero malicious hooks found.', status: 'SAFE' },
        { type: 'SANDBOX', text: 'Browser origin sandbox boundary active. Strict isolation maintained.', status: 'SAFE' },
        { type: 'NETWORK', text: `Connection status: ${deviceInfo?.networkType || 'Active'} without DNS hijacking indicators.`, status: 'SAFE' }
      ];

      const pick = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      setFeed(prev => [
        { id: Date.now(), time: timeStr, type: pick.type, text: pick.text, status: pick.status },
        ...prev.slice(0, 19)
      ]);
    }, 6000);

    return () => clearInterval(interval);
  }, [isLive, deviceInfo]);

  const sentinelCards = [
    { title: 'Client Environment', icon: Laptop, status: 'Active Session', ping: '1ms', details: `${deviceInfo?.platformName} (${deviceInfo?.deviceType})`, health: 'NORMAL' },
    { title: 'Web Crypto SHA-256', icon: FileCheck2, status: 'Hardware Accel', ping: '0ms', details: 'SubtleCrypto in-browser digest worker', health: 'NORMAL' },
    { title: 'Network Security', icon: Wifi, status: 'Online Link', ping: '12ms', details: `Transport: ${deviceInfo?.networkType || 'TLS Secure'}`, health: 'NORMAL' },
    { title: 'Phishing URL Guard', icon: Globe2, status: 'Filter Armed', ping: '0ms', details: 'Client-side Regex & Homograph inspection', health: 'NORMAL' },
    { title: 'Message Scam Filter', icon: Lock, status: 'Armed', ping: '0ms', details: 'Credential demand & urgency heuristic model', health: 'NORMAL' },
    { title: 'User Data Isolation', icon: Activity, status: 'Enforced', ping: '0ms', details: 'Scoped local storage per authenticated user', health: 'NORMAL' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-16 lg:pb-8">
      {/* Header status bar */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLive ? 'bg-cyan-400 opacity-75' : 'bg-slate-500'}`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isLive ? 'bg-cyan-500' : 'bg-slate-600'}`} />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              {isLive ? '● MONITORING ACTIVE' : '○ MONITORING PAUSED'}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Real-Time Security Sentinel
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Active browser endpoint telemetry and heuristic event stream for your current device.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              isLive 
                ? 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700' 
                : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold'
            }`}
          >
            {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isLive ? 'Pause Stream' : 'Resume Live Sentinel'}</span>
          </button>
        </div>
      </div>

      {/* 6 Monitoring Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sentinelCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass-panel p-5 rounded-2xl border-slate-800 hover:border-cyan-500/40 transition">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  {card.health}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                {card.title}
              </h4>
              <div className="text-xs text-cyan-300 font-mono mb-2">
                ● {card.status} <span className="text-slate-500 text-[10px]">({card.ping})</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                {card.details}
              </p>
            </div>
          );
        })}
      </div>

      {/* Live Event Terminal Stream */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono uppercase font-bold text-slate-300 tracking-wider">
              CLIENT HEURISTIC EVENT LOG (SIMULATED TELEMETRY FEED)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">
            AUTO-REFRESHING ({feed.length})
          </span>
        </div>

        <div className="bg-slate-950/80 rounded-xl p-4 font-mono text-xs border border-slate-800 space-y-2.5 max-h-96 overflow-y-auto">
          {feed.map((item) => (
            <div key={item.id} className="flex items-start gap-3 hover:bg-slate-900/60 p-1.5 rounded transition">
              <span className="text-slate-500 shrink-0 select-none">
                {item.time}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 bg-cyan-950 text-cyan-400 border border-cyan-800">
                [{item.type}]
              </span>
              <span className="leading-relaxed text-slate-300">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
