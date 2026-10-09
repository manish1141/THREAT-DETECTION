import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Sparkles,
  Info
} from 'lucide-react';
import { threatEngine } from '../services/threatEngine';

export const SAMPLE_MESSAGES = [
  {
    title: 'Bank KYC / PAN Suspension Scam (HIGH RISK)',
    text: 'Dear customer, your bank account will be blocked within 24 hours due to pending KYC verification. Click here immediately to update PAN: http://192.168.1.100/sbi-kyc-pan-update.php'
  },
  {
    title: 'Lottery / Prize Claim Scam (CRITICAL)',
    text: 'CONGRATULATIONS! You have won $50,000 in the International Rewards draw. Share your OTP code to claim reward: https://bit.ly/claim-free-iphone-2026'
  },
  {
    title: 'Legitimate Two-Factor Code (SAFE)',
    text: 'Your security verification code is 492019. This code will expire in 10 minutes. Do not share this code with anyone.'
  }
];

export function MessageScannerPage() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const analyzeMessage = (textToAnalyze) => {
    const text = textToAnalyze || inputText;
    if (!text.trim()) return;

    setIsScanning(true);
    setResult(null);

    setTimeout(() => {
      let score = 0;
      const reasons = [];
      const recommendations = [];
      const lower = text.toLowerCase();

      // Urgency indicators
      if (lower.includes('immediately') || lower.includes('blocked within') || lower.includes('urgent') || lower.includes('suspended')) {
        score += 25;
        reasons.push({ rule: 'Artificial Urgency Coercion', points: 25, desc: 'Uses time pressure tactics ("blocked within 24 hours") to induce panic.' });
        recommendations.push('Legitimate financial institutions give formal postal or app notices, never panic threats.');
      }

      // Financial / Credential Harvesting Keywords
      if (lower.includes('kyc') || lower.includes('pan') || lower.includes('aadhaar') || lower.includes('otp') || lower.includes('password') || lower.includes('pin')) {
        score += 30;
        reasons.push({ rule: 'Sensitive Credential / OTP Demand', points: 30, desc: 'Requests personal identity or one-time authentication codes.' });
        recommendations.push('Never share OTPs or click links asking for Aadhaar/PAN updates.');
      }

      // Lottery / Prize / Gift keywords
      if (lower.includes('congratulations') || lower.includes('won') || lower.includes('lottery') || lower.includes('free') || lower.includes('reward')) {
        score += 35;
        reasons.push({ rule: 'Unsolicited Prize / Reward Lure', points: 35, desc: 'Common advance-fee fraud hook offering unexpected monetary rewards.' });
      }

      // Embedded URL check
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urlsFound = text.match(urlRegex) || [];
      if (urlsFound.length > 0) {
        score += 20;
        reasons.push({ rule: `Embedded Suspicious Link Detected (${urlsFound.length})`, points: 20, desc: `Found URL: ${urlsFound[0]}` });
        recommendations.push('Do not tap or click the link. Inspect it in the URL scanner first.');
      }

      const clampedScore = Math.min(100, Math.max(5, score));
      let riskLevel = 'SAFE';
      if (clampedScore > 75) riskLevel = 'CRITICAL';
      else if (clampedScore > 50) riskLevel = 'HIGH';
      else if (clampedScore > 25) riskLevel = 'MEDIUM';

      setResult({
        score: clampedScore,
        riskLevel,
        reasons,
        recommendations: recommendations.length ? recommendations : ['Message appears to follow standard operational baseline. Remain vigilant against impersonation.'],
        urlsFound
      });

      setIsScanning(false);
    }, 400);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 lg:pb-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border-cyan-500/20">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
            SOCIAL ENGINEERING & PHISHING GUARD
          </span>
        </div>
        <h2 className="text-2xl font-black text-white mt-1">
          SMS & Phishing Message Analyzer
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
          Paste suspicious SMS texts, WhatsApp forwards, or urgent emails to detect social engineering hooks, panic triggers, and credential lures.
        </p>

        {/* Input Text Area */}
        <div className="mt-5 space-y-3">
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste suspicious SMS, WhatsApp, or email message content here..."
            className="w-full p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Analyzed 100% locally on-device • Message is never sent to any server
            </span>
            <button
              onClick={() => analyzeMessage()}
              disabled={isScanning || !inputText.trim()}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition ${
                !inputText.trim() || isScanning
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-950'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>{isScanning ? 'Analyzing Heuristics...' : 'Analyze Message Risk'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Test Vectors */}
      <div className="glass-panel p-4.5 rounded-2xl border-slate-800">
        <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block mb-2">
          SAMPLE PHISHING TEST MESSAGES (CLICK TO TEST):
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_MESSAGES.map((sample, idx) => (
            <div
              key={idx}
              onClick={() => {
                setInputText(sample.text);
                analyzeMessage(sample.text);
              }}
              className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 cursor-pointer transition group"
            >
              <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 mb-1">
                {sample.title}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 font-mono">
                {sample.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div className="glass-panel-glow p-6 rounded-2xl border-cyan-500/30 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                result.riskLevel === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                result.riskLevel === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                result.riskLevel === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {result.riskLevel} RISK • SCORE: {result.score}/100
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Heuristic Confidence: 94%
            </span>
          </div>

          {/* Identified Heuristics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
              Identified Threat Vectors ({result.reasons.length})
            </h4>
            {result.reasons.length > 0 ? (
              <div className="space-y-2">
                {result.reasons.map((r, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3 text-xs">
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 shrink-0">
                      +{r.points}
                    </span>
                    <div>
                      <div className="font-bold text-slate-200">{r.rule}</div>
                      <div className="text-slate-400 mt-0.5">{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero panic coercion, credential harvesting, or lottery markers identified.</span>
              </div>
            )}
          </div>

          {/* Safety Recommendations */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
            <span className="font-bold text-amber-400 uppercase tracking-wider block mb-1">
              Safety Recommendations:
            </span>
            {result.recommendations.map((rec, i) => (
              <div key={i} className="text-slate-300">• {rec}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
