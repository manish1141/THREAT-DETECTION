import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Smartphone, 
  Lock, 
  Globe2, 
  FileCheck2, 
  Layers, 
  History, 
  BookOpen, 
  Settings, 
  FileText, 
  MessageSquare,
  HelpCircle,
  Users
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Security Dashboard', icon: ShieldAlert },
  { id: 'monitoring', label: 'Real-Time Sentinel', icon: Activity },
  { id: 'apps', label: 'App Risk Analyzer', icon: Smartphone },
  { id: 'permissions', label: 'Permission Auditor', icon: Lock },
  { id: 'urlScanner', label: 'URL / Phishing Guard', icon: Globe2 },
  { id: 'msgScanner', label: 'Message / SMS Scanner', icon: MessageSquare },
  { id: 'fileScanner', label: 'File Hash Inspector', icon: FileCheck2 },
  { id: 'threatCenter', label: 'Threat Incident Center', icon: Layers },
  { id: 'history', label: 'Scan History & Trends', icon: History },
  { id: 'report', label: 'Executive Security Report', icon: FileText },
  { id: 'education', label: 'Cyber Safety Academy', icon: BookOpen },
  { id: 'settings', label: 'Settings & Privacy Controls', icon: Settings },
];

const GUJARATI_LABELS = {
  dashboard: 'સુરક્ષા ડેશબોર્ડ',
  monitoring: 'રીયલ-ટાઇમ સેન્ટીનલ',
  apps: 'એપ રિસ્ક એનાલાઇઝર',
  permissions: 'પરમિશન ઓડિટર',
  urlScanner: 'URL / ફિશિંગ ગાર્ડ',
  msgScanner: 'મેસેજ / SMS સ્કેનર',
  fileScanner: 'ફાઇલ હેશ ઇન્સ્પેક્ટર',
  threatCenter: 'થ્રેટ ઇન્સિડન્ટ સેન્ટર',
  history: 'સ્કેન હિસ્ટ્રી અને ટ્રેન્ડ્સ',
  report: 'એક્ઝિક્યુટિવ સુરક્ષા રિપોર્ટ',
  education: 'સાયબર સેફ્ટી એકેડેમી',
  settings: 'સેટિંગ્સ અને પ્રાઇવસી કંટ્રોલ્સ',
};

export function Sidebar({ currentTab, onSelectTab, isOpen, onClose, currentLanguage = 'en' }) {
  const isGujarati = currentLanguage === 'gu';
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
            {isGujarati ? 'સુરક્ષા મોડ્યુલ્સ' : 'SECURITY SUITE MODULES'}
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const displayLabel = isGujarati ? (GUJARATI_LABELS[item.id] || item.label) : item.label;
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
                    ? 'bg-gradient-to-r from-[#00ff66]/20 to-[#00f0ff]/10 text-[#00ff66] border border-[#00ff66]/40 shadow-md shadow-[#00ff66]/10' 
                    : 'text-slate-400 hover:text-white hover:bg-[#071a10] border border-transparent'}
                `}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-[#00ff66] scale-110 drop-shadow-[0_0_8px_rgba(0,255,102,0.8)]' : 'text-slate-500 group-hover:text-emerald-400'}`} />
                <span className="truncate">{displayLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Local-First Privacy Footer */}
        <div className="pt-4 border-t border-emerald-950/80">
          <div className="p-3 rounded-xl bg-[#040f09] border border-[#00ff66]/20 text-[11px] shadow-[0_0_12px_rgba(0,255,102,0.06)]">
            <div className="flex items-center gap-1.5 text-[#00ff66] font-bold mb-1">
              <span>Client-Isolated Protection</span>
            </div>
            <p className="text-slate-400 text-[10px] leading-tight">
              Calculated on your device. Zero developer or server hardware details are displayed.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
