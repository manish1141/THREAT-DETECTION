import React, { useState } from 'react';
import { 
  Layers, 
  Filter, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw,
  Search
} from 'lucide-react';
import { ThreatCard } from '../components/ThreatCard';
import { ThreatDetailsModal } from '../components/ThreatDetailsModal';

export function ThreatCenterPage({ threats, onStatusChange, onResetThreats }) {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedThreat, setSelectedThreat] = useState(null);

  const filtered = threats.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(search.toLowerCase()) || 
      t.affectedItem.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'ALL') return true;
    if (filter === 'CRITICAL') return t.severity === 'CRITICAL';
    if (filter === 'HIGH') return t.severity === 'HIGH';
    if (filter === 'MEDIUM') return t.severity === 'MEDIUM';
    if (filter === 'LOW') return t.severity === 'LOW';
    if (filter === 'RESOLVED') return t.status === 'RESOLVED';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-16 lg:pb-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border-cyan-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
                INCIDENT RESPONSE COMMAND
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Threat Incident Center
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive triage hub for identified security signals, dangerous behaviors, and risk vectors.
            </p>
          </div>

          <button
            onClick={onResetThreats}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Incidents</span>
          </button>
        </div>

        {/* Filter controls (Requirement #10) */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search threat ID, vector name, or affected package..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'RESOLVED'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  filter === lvl
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Threats Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(threat => (
            <ThreatCard
              key={threat.id}
              threat={threat}
              onSelect={(t) => setSelectedThreat(t)}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-2xl text-center border-slate-800">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-white">No incidents match current filter</h4>
          <p className="text-xs text-slate-400 mt-1">Try switching filter selector back to "ALL".</p>
        </div>
      )}

      {/* Threat Detail Modal (Requirement #11) */}
      {selectedThreat && (
        <ThreatDetailsModal
          threat={selectedThreat}
          onClose={() => setSelectedThreat(null)}
          onStatusChange={onStatusChange}
        />
      )}
    </div>
  );
}
