import React, { useState } from 'react';
import { 
  Smartphone, 
  Search, 
  Filter, 
  ShieldAlert, 
  AlertTriangle, 
  ShieldCheck, 
  PlusCircle, 
  RefreshCw,
  Laptop
} from 'lucide-react';
import { AppRiskCard } from '../components/AppRiskCard';
import { AppDetailModal } from '../components/AppDetailModal';

export function AppsPage({ apps, onRefreshApps, isRealMode = true }) {
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState(null);

  const filtered = apps.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(search.toLowerCase()) || 
      app.packageName.toLowerCase().includes(search.toLowerCase());
    
    if (filterLevel === 'ALL') return matchesSearch;
    return matchesSearch && app.riskLevel === filterLevel;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-16 lg:pb-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border-emerald-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800">
                REAL INSTALLED SOFTWARE AUDITOR
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Real Windows Laptop Installed Packages ({apps.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Directly queried from your Windows Registry (VS Code, Filmora, Python, Antigravity, Typing Master) and evaluated through the Threat Engine.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefreshApps}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-emerald-400 flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Query Live Registry</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search real installed laptop software (e.g. Python, Filmora, Code)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'SAFE'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  filterLevel === lvl
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Apps */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(app => (
            <AppRiskCard
              key={app.id || app.packageName}
              app={app}
              onInspect={(a) => setSelectedApp(a)}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-2xl text-center border-slate-800">
          <Laptop className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-white">No software packages match filter</h4>
          <p className="text-xs text-slate-400 mt-1">Try resetting your search query.</p>
        </div>
      )}

      {/* Inspect Modal */}
      {selectedApp && (
        <AppDetailModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
}
