import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Sparkles,
  Info,
  Radio,
  StopCircle,
  ClipboardCheck,
  Zap
} from 'lucide-react';
import { liveMessageSentinel } from '../services/liveMessageSentinel';

export const SAMPLE_MESSAGES = [
  {
    title: 'Bank KYC / PAN Suspension Scam (CRITICAL)',
    text: 'Dear customer, your bank account will be blocked within 24 hours due to pending KYC verification. Click here immediately to update PAN: http://192.168.1.100/sbi-kyc-pan-update.php'
  },
  {
    title: 'Lottery / Prize Claim Scam (HIGH RISK)',
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
  const [isLiveListening, setIsLiveListening] = useState(liveMessageSentinel.isListening);
  const [liveFeedback, setLiveFeedback] = useState('');

  useEffect(() => {
    setIsLiveListening(liveMessageSentinel.isListening);
  }, []);

  const handleToggleLiveWatcher = async () => {
    setLiveFeedback('');
    if (!isLiveListening) {
      try {
        await liveMessageSentinel.activateClipboardWatcher();
        setIsLiveListening(true);
        setLiveFeedback('Live On-Time Message Sentinel is active! Any text copied to clipboard will be scanned automatically.');
      } catch (err) {
        setLiveFeedback(`Notice: ${err.message}`);
      }
    } else {
      liveMessageSentinel.stopWatcher();
      setIsLiveListening(false);
      setLiveFeedback('On-Time message sentinel paused.');
    }
  };

  const analyzeMessage = (textToAnalyze) => {
    const text = textToAnalyze || inputText;
    if (!text.trim()) return;

    setIsScanning(true);
    setResult(null);

    setTimeout(() => {
      // Evaluate via live sentinel logic
      const assessment = liveMessageSentinel.evaluateMessage(text);
      if (assessment) {
        setResult({
          score: assessment.riskScore,
          riskLevel: assessment.riskLevel,
          reasons: assessment.reasons.map(r => ({ factor: r, desc: r, points: 25 })),
          recommendations: assessment.recommendations,
          urlsFound: assessment.urlsFound
        });

        // Also trigger sentinel alarm if risky
        liveMessageSentinel.processIncomingMessage(text, 'Manual Input');
      }
      setIsScanning(false);
    }, 300);
  };

  const getBadge = (lvl) => {
    switch (lvl) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-[#00ff66]/15 text-[#00ff66] border-[#00ff66]/30';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 lg:pb-8">
      {/* Live On-Time Message Sentinel Banner */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isLiveListening 
          ? 'bg-gradient-to-r from-red-950/40 via-[#04140b] to-black border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.2)]'
          : 'bg-gradient-to-r from-[#04140b] via-[#020905] to-black border-[#00ff66]/30'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider ${
                isLiveListening 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                  : 'bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30'
              }`}>
                <Radio className="w-3.5 h-3.5" />
                {isLiveListening ? 'LIVE MESSAGE SENTINEL ACTIVE' : 'LIVE SENTINEL STANDBY'}
              </span>
            </div>
            <h3 className="text-xl font-black text-white flex items-center gap-2 font-mono">
              <span>On-Time Automatic Message & SMS Guard</span>
            </h3>
            <p className="text-xs text-slate-300 max-w-xl font-sans">
              Instant on-device threat interception: When you copy or receive any SMS, WhatsApp, or email message on this device, Threat Guard evaluates panic tactics, bank OTP requests, and fake lottery lures, triggering an <span className="text-red-400 font-bold">immediate alarm popup</span> if risky.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleLiveWatcher}
              className={`px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition shadow-lg ${
                isLiveListening
                  ? 'bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-800'
                  : 'bg-gradient-to-r from-[#00ff66] to-[#00f0ff] hover:from-[#00ff66] text-[#030a06] shadow-[#00ff66]/20 active:scale-95'
              }`}
            >
              {isLiveListening ? (
                <>
                  <StopCircle className="w-4 h-4" />
                  <span>Pause Sentinel</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Activate Live Clipboard Guard</span>
                </>
              )}
            </button>
          </div>
        </div>

        {liveFeedback && (
          <div className="mt-3 p-3 rounded-xl bg-[#051c0f] border border-[#00ff66]/30 text-[#00ff66] text-xs flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{liveFeedback}</span>
          </div>
        )}
      </div>

      {/* Manual Input Header */}
      <div className="glass-panel p-6 rounded-3xl border-[#00ff66]/20">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#00ff66] font-bold px-2 py-0.5 rounded bg-[#072414] border border-[#00ff66]/40 shadow-[0_0_8px_rgba(0,255,102,0.2)]">
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
            onChange={(e) => {
              const val = e.target.value;
              setInputText(val);
              // Auto-scan on typing if text exceeds 20 characters
              if (val.length > 25) {
                analyzeMessage(val);
              }
            }}
            placeholder="Paste or type suspicious SMS, WhatsApp, or email message content here..."
            className="w-full p-4 rounded-2xl bg-[#040f09] border border-emerald-950 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff66] font-mono leading-relaxed"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500 font-mono">
              Analyzed 100% locally on-device • Message is never sent to any server
            </span>
            <button
              onClick={() => analyzeMessage()}
              disabled={isScanning || !inputText.trim()}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition font-mono ${
                !inputText.trim() || isScanning
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#00ff66] to-emerald-400 hover:from-[#00ff66] hover:to-[#00f0ff] text-[#030a06] shadow-md shadow-[#00ff66]/20 active:scale-95'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>{isScanning ? 'Analyzing Heuristics...' : 'Scan Message Risk'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Test Vectors */}
      <div className="glass-panel p-4.5 rounded-2xl border-emerald-950">
        <span className="text-[11px] font-mono uppercase text-[#00ff66] font-bold block mb-2">
          SAMPLE PHISHING TEST MESSAGES (CLICK TO TRIGGER INSTANT SENTINEL):
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_MESSAGES.map((sample, idx) => (
            <div
              key={idx}
              onClick={() => {
                setInputText(sample.text);
                analyzeMessage(sample.text);
              }}
              className="p-3.5 rounded-xl bg-[#04120a] hover:bg-[#072012] border border-emerald-950/80 hover:border-[#00ff66]/40 cursor-pointer transition group"
            >
              <div className="text-xs font-bold text-slate-200 group-hover:text-[#00ff66] mb-1 font-mono">
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
        <div className="glass-panel-glow p-6 rounded-2xl border-[#00ff66]/30 space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-950">
            <div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getBadge(result.riskLevel)}`}>
                {result.riskLevel} • THREAT SCORE: {result.score}/100
              </span>
              <h3 className="text-lg font-bold text-white mt-2 font-mono">
                Heuristic Evaluation Summary
              </h3>
            </div>
            {result.urlsFound && result.urlsFound.length > 0 && (
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block font-mono">Embedded Links</span>
                <span className="text-xs font-bold text-rose-400 font-mono">
                  {result.urlsFound.length} Link(s) Detected
                </span>
              </div>
            )}
          </div>

          {/* Triggered Danger Indicators */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#00ff66] mb-2 font-mono">
              Flagged Social Engineering Vectors ({result.reasons?.length || 0})
            </h4>
            {result.reasons?.length > 0 ? (
              <div className="space-y-2">
                {result.reasons.map((r, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[#041009] border border-emerald-950 flex items-start gap-3">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 shrink-0">
                      +{r.points}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-200 font-mono">{r.factor}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#051c0f] border border-[#00ff66]/30 text-[#00ff66] text-xs flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 text-[#00ff66]" />
                <span>Message follows normal communication syntax with zero detected urgency or fraud lures.</span>
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="p-4 rounded-xl bg-[#040f09] border border-emerald-950">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1 font-mono">
              Action Recommendation:
            </span>
            <div className="text-xs text-slate-300 space-y-1 font-mono">
              {result.recommendations.map((rec, idx) => (
                <div key={idx}>• {rec}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageScannerPage;
