import React, { useState } from 'react';
import { 
  Zap, 
  ShieldAlert, 
  Smartphone, 
  MessageSquare, 
  Camera, 
  AlertTriangle, 
  RotateCcw, 
  CheckCircle2, 
  Activity 
} from 'lucide-react';

export function AttackSimulatorCard({ 
  onSimulateThreat, 
  onSimulateScamMessage, 
  onResetThreats,
  currentLanguage = 'en'
}) {
  const [activeSimulation, setActiveSimulation] = useState(null);

  const isGujarati = currentLanguage === 'gu';

  const handleSimulateBankingTrojan = () => {
    setActiveSimulation('trojan');
    if (onSimulateThreat) {
      onSimulateThreat({
        title: 'CRITICAL: Banking Trojan Dropper Injected (com.bank.trojan.stealer)',
        threatType: 'Dangerous Permission Combination',
        severity: 'CRITICAL',
        riskScore: 92,
        affectedItem: 'InstantBank OTP Hijacker (com.bank.trojan.stealer.apk)',
        riskExplanation: 'Simulated malware requested Accessibility Service, Screen Overlay, and SMS Intercept to siphon 2FA banking tokens.',
        possibleImpact: 'Automated bank account takeover and unauthenticated OTP diversion.',
        recommendedAction: 'Immediate process isolation and revocation of Accessibility hooks.'
      });
    }
    setTimeout(() => setActiveSimulation(null), 1800);
  };

  const handleSimulateElectricityScam = () => {
    setActiveSimulation('scam');
    if (onSimulateScamMessage) {
      onSimulateScamMessage({
        text: 'URGENT: Dear customer, your electricity power will be disconnected TONIGHT at 9:30 PM due to unpaid bill of Rs. 4,820. Call immediately to electric officer at 9876543210 or update bill: http://power-gov-pay.bill-help.top/pay',
        category: 'URGENT_UTILITY_FRAUD',
        riskLevel: 'HIGH',
        riskScore: 89,
        reasons: [
          'High coercive urgency pattern ("disconnected TONIGHT at 9:30 PM")',
          'Direct personal mobile number diversion (social engineering trap)',
          'Malicious unofficial phishing domain (.top TLD with cleartext HTTP)'
        ],
        recommendations: [
          'Do not call the unverified phone number.',
          'Never make payments through third-party unofficial links.'
        ]
      });
    }
    setTimeout(() => setActiveSimulation(null), 1800);
  };

  const handleSimulateSpywareSensor = () => {
    setActiveSimulation('spyware');
    if (onSimulateThreat) {
      onSimulateThreat({
        title: 'HIGH RISK: Unauthorized Background Sensor Capture (Pegasus-Style Spyware)',
        threatType: 'Privacy Risk',
        severity: 'HIGH',
        riskScore: 84,
        affectedItem: 'Background Optical Sensor & Acoustic Hook (libaudio_spy.so)',
        riskExplanation: 'Simulated covert audio-recording daemon attempting to capture microphone stream without user foreground presence.',
        possibleImpact: 'Surreptitious surveillance and ambient room audio harvesting.',
        recommendedAction: 'Revoke WASAPI microphone access and terminate background listener.'
      });
    }
    setTimeout(() => setActiveSimulation(null), 1800);
  };

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 via-[#030906] to-emerald-950/20 space-y-4 shadow-[0_0_30px_rgba(0,255,102,0.1)]">
      
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
            <Zap className="w-5 h-5 fill-current animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800">
                {isGujarati ? 'જૂરી પ્રેઝન્ટેશન મોડ' : 'JURY INTERACTIVE DEMO'}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                1-CLICK SIMULATOR
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white font-mono mt-0.5">
              {isGujarati ? 'લાઈવ અટેક સિમ્યુલેટર (લાઇવ ડેમો)' : 'Live Attack Simulator & Detection Suite'}
            </h3>
          </div>
        </div>

        <button
          onClick={onResetThreats}
          className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isGujarati ? 'ડેમો રિસેટ કરો' : 'Reset Scenario'}</span>
        </button>
      </div>

      <p className="text-xs text-slate-400 font-mono">
        {isGujarati
          ? 'હેકાથોન જૂરી સમક્ષ રિયલ-ટાઇમમાં સાબિત કરો કે સિસ્ટમ કેવી રીતે નવો વાયરસ, ફ્રોડ SMS કે સ્પાયવેર ડિટેક્ટ કરે છે અને સ્કોર ઘટાડે છે.'
          : 'Instantly inject real attack vectors into the on-device detection engine to demonstrate dynamic score drops, sentinel modals, and remediation.'}
      </p>

      {/* 3 Interactive Simulation Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        
        {/* Sim 1: Banking Trojan */}
        <button
          onClick={handleSimulateBankingTrojan}
          disabled={activeSimulation !== null}
          className="p-3.5 rounded-2xl bg-slate-950/90 border border-rose-500/40 hover:border-rose-400 hover:bg-rose-950/20 text-left transition group active:scale-95 cursor-pointer shadow-lg shadow-rose-950/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
              <Smartphone className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
              CRITICAL -25 PTS
            </span>
          </div>
          <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition">
            {isGujarati ? 'બેંકિંગ ટ્રોજન APK' : 'Banking Trojan APK'}
          </h4>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
            {isGujarati ? 'Accessibility & Overlay હાઇજેકનું સિમ્યુલેશન' : 'Accessibility & Overlay screen hijacking simulation.'}
          </p>
        </button>

        {/* Sim 2: Electricity Scam SMS */}
        <button
          onClick={handleSimulateElectricityScam}
          disabled={activeSimulation !== null}
          className="p-3.5 rounded-2xl bg-slate-950/90 border border-amber-500/40 hover:border-amber-400 hover:bg-amber-950/20 text-left transition group active:scale-95 cursor-pointer shadow-lg shadow-amber-950/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
              SENTINEL POPUP
            </span>
          </div>
          <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition">
            {isGujarati ? 'લાઇટ બિલ ફ્રોડ SMS' : 'Utility Power Scam SMS'}
          </h4>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
            {isGujarati ? 'લાઇવ સ્કેનર મોડલ સાથે ફિશિંગ એનાલિસિસ' : 'Live linguistic urgency parsing & trap detection.'}
          </p>
        </button>

        {/* Sim 3: Spyware Sensor Hijack */}
        <button
          onClick={handleSimulateSpywareSensor}
          disabled={activeSimulation !== null}
          className="p-3.5 rounded-2xl bg-slate-950/90 border border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-950/20 text-left transition group active:scale-95 cursor-pointer shadow-lg shadow-cyan-950/30"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <Camera className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
              HIGH RISK -15 PTS
            </span>
          </div>
          <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
            {isGujarati ? 'સ્પાયવેર સેન્સર હાઇજેક' : 'Covert Spyware Sensor'}
          </h4>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
            {isGujarati ? 'અનધિકૃત કેમેરા/માઈક વાયરસ ડીટેક્શન' : 'Unauthorized optical & acoustic stream interception.'}
          </p>
        </button>

      </div>
    </div>
  );
}
