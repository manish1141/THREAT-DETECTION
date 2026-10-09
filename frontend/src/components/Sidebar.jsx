import React from 'react';
import { 
  ShieldAlert, 
  Smartphone, 
  Globe2, 
  FileCheck2, 
  Layers, 
  History, 
  BookOpen, 
  Settings, 
  FileText, 
  Activity, 
  Sliders,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Security Dashboard', icon: ShieldAlert },
  { id: 'monitoring', label: 'Real-Time Sentinel', icon: Activity },
  { id: 'apps', label: 'App Risk Analyzer', icon: Smartphone },
  { id: 'permissions', label: 'Permission Auditor', icon: Lock },
  { id: 'urlScanner', label: 'URL / Phishing Guard', icon: Globe2 },
  { id: 'fileScanner', label: 'File Hash Inspector', icon: FileCheck2 },
  { id: 'threatCenter', label: 'Threat Incident Center', icon: Layers },
  { id: 'history', label: 'Scan History & Trends', icon: History },
  { id: 'report', label: 'Executive Security Report', icon: FileText },
  { id: 'education', label: 'Cyber Safety Academy', icon: BookOpen },
  { id: 'settings', label: 'Device Settings & Privacy', icon: Settings },
];

export function Sidebar({ currentTab, onSelectTab, isOpen, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 lg:top-[61px] left-0 z-50 lg:z-30
        w-64 h-full lg:h-[calc(100vh-61px)]
        glass-panel border-r border-slate-800/80
        flex flex-col justify-between p-4
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Navigation list */}
        <div className="overflow-y-auto space-y-1 pr-1">
          <div className="text-[11px] font-mono uppercase text-slate-500 font-bold px-3 py-2 tracking-wider">
            SECURITY SUITE MODULES
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onClose) onClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold
                  transition-all duration-150 text-left group
                  ${isActive 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-950/40' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'}
                `}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-cyan-400 scale-110' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Local-First Privacy Footer */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px]">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Local-First Guarantee</span>
            </div>
            <p className="text-slate-400 text-[10px] leading-tight">
              Calculated on-device. Zero personal telemetry transmitted without user authorization.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
