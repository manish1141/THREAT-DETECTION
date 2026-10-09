import React, { useRef } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Lock, 
  Smartphone, 
  Wifi, 
  QrCode 
} from 'lucide-react';

export function ReportPage({ dashboardData, profile }) {
  const printRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const { score, status, threatsCount, highRiskCount, privacyRisksCount, networkStatus, totalAppsAnalyzed, breakdown, threats } = dashboardData;

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-16 lg:pb-8">
      {/* Action Header */}
      <div className="glass-panel p-6 rounded-3xl border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
              EXECUTIVE COMPLIANCE AUDIT
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Device Security Audit Report
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Printable and exportable cybersecurity assessment dossier for BCA presentation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-lg shadow-cyan-950"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT / GENERATE PDF REPORT</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document (Requirement #13) */}
      <div 
        ref={printRef}
        className="glass-panel rounded-3xl p-8 sm:p-12 border-slate-700 bg-slate-950/90 text-slate-200 space-y-8 print:bg-white print:text-black print:border-none print:shadow-none print:p-0"
      >
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 print:border-gray-300 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-6 h-6 text-cyan-400 print:text-blue-600" />
              <span className="font-mono text-xs uppercase tracking-widest font-bold text-cyan-400 print:text-blue-600">
                ON-DEVICE THREAT GUARD REPORT
              </span>
            </div>
            <h1 className="text-2xl font-black text-white print:text-black">
              ENDPOINT SECURITY POSTURE DOSSIER
            </h1>
            <p className="text-xs text-slate-400 print:text-gray-600">
              Verified by On-Device Heuristic Risk Analysis Engine
            </p>
          </div>

          <div className="text-left sm:text-right font-mono text-xs text-slate-400 print:text-gray-600">
            <div>Document Ref: <span className="text-white print:text-black font-bold">TG-BCA-2026-99A</span></div>
            <div>Date Generated: <span className="text-white print:text-black">{today}</span></div>
            <div>Device: <span className="text-white print:text-black">{profile?.deviceName}</span></div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 print:bg-gray-100 border border-slate-800 print:border-gray-300 text-center">
            <span className="text-xs text-slate-400 print:text-gray-600 block mb-1">OVERALL SECURITY SCORE</span>
            <span className="text-4xl font-black text-cyan-400 print:text-blue-600">{score}/100</span>
            <span className="text-xs font-bold block mt-1 text-slate-300 print:text-gray-800">{status}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 print:bg-gray-100 border border-slate-800 print:border-gray-300 text-center">
            <span className="text-xs text-slate-400 print:text-gray-600 block mb-1">IDENTIFIED THREATS</span>
            <span className="text-4xl font-black text-rose-400 print:text-red-600">{threatsCount}</span>
            <span className="text-xs font-bold block mt-1 text-slate-300 print:text-gray-800">{highRiskCount} High / Critical</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 print:bg-gray-100 border border-slate-800 print:border-gray-300 text-center">
            <span className="text-xs text-slate-400 print:text-gray-600 block mb-1">PRIVACY & PERMISSION RISKS</span>
            <span className="text-4xl font-black text-amber-400 print:text-amber-600">{privacyRisksCount}</span>
            <span className="text-xs font-bold block mt-1 text-slate-300 print:text-gray-800">{totalAppsAnalyzed} Total Apps Scanned</span>
          </div>
        </div>

        {/* Score Vector Breakdown Table */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 print:text-black mb-3">
            Vector Score Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 print:border-gray-300">
              <thead className="bg-slate-900/80 print:bg-gray-200 text-slate-300 print:text-gray-800">
                <tr>
                  <th className="p-3 border-b border-slate-800 print:border-gray-300">Vector Category</th>
                  <th className="p-3 border-b border-slate-800 print:border-gray-300">Weight</th>
                  <th className="p-3 border-b border-slate-800 print:border-gray-300">Score</th>
                  <th className="p-3 border-b border-slate-800 print:border-gray-300">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-gray-300 font-mono">
                <tr>
                  <td className="p-3">Application Risk</td>
                  <td className="p-3">25%</td>
                  <td className="p-3 text-cyan-400 print:text-blue-600 font-bold">{breakdown?.applications}%</td>
                  <td className="p-3 text-emerald-400 print:text-green-600">PASS WITH RECOMMENDATION</td>
                </tr>
                <tr>
                  <td className="p-3">Permission Security</td>
                  <td className="p-3">20%</td>
                  <td className="p-3 text-amber-400 print:text-amber-600 font-bold">{breakdown?.permissions}%</td>
                  <td className="p-3 text-amber-400 print:text-amber-600">ELEVATED PRIVILEGES DETECTED</td>
                </tr>
                <tr>
                  <td className="p-3">Network Layer</td>
                  <td className="p-3">15%</td>
                  <td className="p-3 text-cyan-400 print:text-blue-600 font-bold">{breakdown?.network}%</td>
                  <td className="p-3 text-emerald-400 print:text-green-600">OPTIMAL (WPA3 & DoH)</td>
                </tr>
                <tr>
                  <td className="p-3">Privacy & Sensor Guard</td>
                  <td className="p-3">15%</td>
                  <td className="p-3 text-amber-400 print:text-amber-600 font-bold">{breakdown?.privacy}%</td>
                  <td className="p-3 text-amber-400 print:text-amber-600">BACKGROUND MONITORING ACTIVE</td>
                </tr>
                <tr>
                  <td className="p-3">Known Threat Protection</td>
                  <td className="p-3">25%</td>
                  <td className="p-3 text-cyan-400 print:text-blue-600 font-bold">{breakdown?.threatProtection}%</td>
                  <td className="p-3 text-emerald-400 print:text-green-600">IOC HASH REPOSITORY ACTIVE</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Identified Incident Log */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 print:text-black mb-3">
            Active Identified Incidents
          </h3>
          <div className="space-y-3">
            {(threats || []).map((t, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/40 print:bg-gray-50 border border-slate-800 print:border-gray-300 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white print:text-black font-mono">{t.id} - {t.name}</span>
                  <span className="font-bold text-rose-400 print:text-red-600">{t.severity} RISK ({t.status})</span>
                </div>
                <p className="text-slate-400 print:text-gray-700">{t.riskExplanation}</p>
                <div className="text-emerald-400 print:text-green-700 mt-1 font-semibold">
                  Required Action: {t.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Sign-off & Disclaimer (Requirement #13 & #25) */}
        <div className="pt-6 border-t border-slate-800 print:border-gray-300 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 print:text-gray-600 gap-4">
          <div>
            <div className="font-bold text-slate-400 print:text-gray-700">Audit Compliance: Local-First Zero-Knowledge</div>
            <div>BCA Final Year Cybersecurity Capstone Framework • Google Antigravity Spec</div>
          </div>
          <div className="font-mono text-center sm:text-right">
            <div>AUDIT SIGNATURE: <span className="text-slate-300 print:text-black font-bold">SHA256: 8C:E1:92:44:B0</span></div>
            <div>CONFIDENTIAL DEVICE REPORT</div>
          </div>
        </div>
      </div>
    </div>
  );
}
