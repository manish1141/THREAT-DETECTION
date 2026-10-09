import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Smartphone, 
  Lock, 
  Layers 
} from 'lucide-react';

export function MobileBottomNav({ currentTab, onSelectTab }) {
  const items = [
    { id: 'dashboard', label: 'Overview', icon: ShieldAlert },
    { id: 'monitoring', label: 'Monitor', icon: Activity },
    { id: 'apps', label: 'Apps', icon: Smartphone },
    { id: 'permissions', label: 'Perms', icon: Lock },
    { id: 'threatCenter', label: 'Threats', icon: Layers }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center p-1 rounded-xl transition ${
              isActive ? 'text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-cyan-400' : ''}`} />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
