import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Filter, 
  Eye,
  RefreshCw,
  Bell,
  MapPin,
  Camera,
  Mic,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { liveSecurityAuditor } from '../services/liveSecurityAuditor';

export function PermissionsPage() {
  const [realPerms, setRealPerms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTestingPerm, setActiveTestingPerm] = useState(null);
  const [testMessage, setTestMessage] = useState('');

  const loadRealPermissions = async () => {
    setIsLoading(true);
    try {
      const perms = await liveSecurityAuditor.auditRealBrowserPermissions();
      setRealPerms(perms);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRealPermissions();

    // Listen to real permission changes live via Permissions API event listeners
    const listeners = [];
    const setupLiveListeners = async () => {
      if (typeof navigator !== 'undefined' && navigator.permissions?.query) {
        for (const name of ['geolocation', 'notifications', 'camera', 'microphone']) {
          try {
            const status = await navigator.permissions.query({ name });
            const changeHandler = () => {
              loadRealPermissions();
            };
            status.addEventListener('change', changeHandler);
            listeners.push({ status, changeHandler });
          } catch {}
        }
      }
    };
    setupLiveListeners();

    return () => {
      listeners.forEach(({ status, changeHandler }) => {
        try {
          status.removeEventListener('change', changeHandler);
        } catch {}
      });
    };
  }, []);

  // Live Real Interactive Test: Triggers the browser's native permission dialog or check
  const handleTestPermission = async (perm) => {
    setActiveTestingPerm(perm.technicalName);
    setTestMessage('');

    try {
      if (perm.technicalName === 'notifications') {
        if ('Notification' in window) {
          const res = await Notification.requestPermission();
          setTestMessage(`Browser Notification Status: "${res.toUpperCase()}"`);
          loadRealPermissions();
        }
      } else if (perm.technicalName === 'geolocation') {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            () => {
              setTestMessage('Geolocation access GRANTED by browser!');
              loadRealPermissions();
            },
            (err) => {
              setTestMessage(`Geolocation state: ${err.message}`);
              loadRealPermissions();
            },
            { timeout: 8000 }
          );
        }
      } else if (perm.technicalName === 'camera') {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(t => t.stop());
            setTestMessage('Camera hardware test: GRANTED and verified locally.');
            loadRealPermissions();
          } catch (err) {
            setTestMessage(`Camera hardware test: ${err.name || err.message}`);
            loadRealPermissions();
          }
        }
      } else if (perm.technicalName === 'microphone') {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(t => t.stop());
            setTestMessage('Microphone hardware test: GRANTED and verified locally.');
            loadRealPermissions();
          } catch (err) {
            setTestMessage(`Microphone hardware test: ${err.name || err.message}`);
            loadRealPermissions();
          }
        }
      }
    } catch (err) {
      setTestMessage(`Request outcome: ${err.message}`);
    } finally {
      setTimeout(() => setActiveTestingPerm(null), 1000);
    }
  };

  const getIconForPerm = (name) => {
    switch (name) {
      case 'geolocation': return <MapPin className="w-5 h-5 text-[#00ff66]" />;
      case 'notifications': return <Bell className="w-5 h-5 text-[#00f0ff]" />;
      case 'camera': return <Camera className="w-5 h-5 text-amber-400" />;
      case 'microphone': return <Mic className="w-5 h-5 text-rose-400" />;
      default: return <Lock className="w-5 h-5 text-[#00ff66]" />;
    }
  };

  const getBadgeStyle = (state) => {
    switch (state) {
      case 'granted':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
      case 'denied':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]';
      default:
        return 'bg-[#00ff66]/15 text-[#00ff66] border-[#00ff66]/30 shadow-[0_0_10px_rgba(0,255,102,0.15)]';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 lg:pb-8 font-mono">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border-[#00ff66]/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#00ff66] font-bold px-2 py-0.5 rounded bg-[#072414] border border-[#00ff66]/40 shadow-[0_0_8px_rgba(0,255,102,0.2)]">
                LIVE BROWSER PERMISSION AUDITOR
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1 font-sans">
              Real-Time Browser Permission Security
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl font-sans">
              Queries real browser runtime permissions for your current device using the official W3C Permissions API. You can test live permission toggles in real time.
            </p>
          </div>

          <button
            onClick={loadRealPermissions}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00ff66] to-[#00f0ff] hover:from-[#00ff66] text-[#030a06] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-[#00ff66]/20 active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Re-Query Live Permissions</span>
          </button>
        </div>

        {testMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#061e11] border border-[#00ff66]/40 text-[#00ff66] text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{testMessage}</span>
          </div>
        )}
      </div>

      {/* Real vs Native Explanation Box */}
      <div className="p-4 rounded-2xl bg-[#04120a] border border-[#00ff66]/20 text-xs text-slate-300 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#00ff66] shrink-0 mt-0.5" />
        <div className="font-sans">
          <span className="font-bold text-white block mb-0.5">
            Real vs. Native Operating System Capabilities
          </span>
          <span>
            These results are queried live from your browser's security manager. A web page cannot inspect Android system permissions (such as other apps' SMS or Accessibility hooks) due to sandbox boundaries; those require an installed APK built via our included <code className="text-[#00ff66]">androidNativeBridge.js</code>.
          </span>
        </div>
      </div>

      {/* Real Permissions Feed */}
      <div className="space-y-3">
        {realPerms.map((item) => (
          <div 
            key={item.id}
            className="glass-panel p-5 rounded-2xl border-emerald-950 hover:border-[#00ff66]/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#030d07] border border-[#00ff66]/30 text-[#00ff66] shrink-0 group-hover:scale-105 transition-transform">
                {getIconForPerm(item.technicalName)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white">
                    {item.permission}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getBadgeStyle(item.state)}`}>
                    STATE: {item.state.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 font-sans">
                  {item.advisory}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              {/* Live Test Trigger Button */}
              <button
                onClick={() => handleTestPermission(item)}
                disabled={activeTestingPerm === item.technicalName}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#061c0f] hover:bg-[#00ff66] text-[#00ff66] hover:text-[#030a06] border border-[#00ff66]/30 transition active:scale-95 flex items-center gap-1.5 shadow-[0_0_8px_rgba(0,255,102,0.1)]"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{activeTestingPerm === item.technicalName ? 'Testing...' : 'Test / Request Live'}</span>
              </button>

              <span className="text-[10px] font-mono px-2.5 py-1.5 rounded-lg bg-black text-slate-400 border border-slate-800 hidden sm:inline-block">
                {item.source}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PermissionsPage;
