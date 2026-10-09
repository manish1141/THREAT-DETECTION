import React from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Trash2, 
  ShieldAlert, 
  AlertTriangle, 
  Info,
  ArrowRight
} from 'lucide-react';

export function NotificationDrawer({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkRead, 
  onMarkAllRead, 
  onDelete,
  onNavigate 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel-glow border-l border-cyan-500/30 flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Security Alerts & Signals</h3>
                <p className="text-[11px] text-slate-400">On-Device Notification Hub</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={onMarkAllRead}
                title="Mark all as read"
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No recent security notifications.
              </div>
            ) : (
              notifications.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => {
                    onMarkRead(item.id);
                    if (item.route && onNavigate) onNavigate(item.route);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
                    item.read 
                      ? 'bg-slate-900/30 border-slate-800 text-slate-400' 
                      : 'bg-slate-900/80 border-cyan-500/30 text-white shadow-lg shadow-black/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      {item.type === 'HIGH' && <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />}
                      {item.type === 'MEDIUM' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                      {item.type === 'INFO' && <Info className="w-4 h-4 text-cyan-400 shrink-0" />}
                      <span className="text-xs font-bold">{item.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-2">
                    {item.message}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                    <span className="text-cyan-400 group-hover:underline flex items-center gap-1 font-semibold">
                      Inspect Details <ArrowRight className="w-3 h-3" />
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      className="text-slate-500 hover:text-rose-400 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
