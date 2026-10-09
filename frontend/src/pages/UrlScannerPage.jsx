import React, { useState } from 'react';
import { 
  Globe2, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  ExternalLink, 
  CheckCircle2, 
  Info,
  Lock,
  Unlock,
  Sparkles
} from 'lucide-react';
import { urlScannerService } from '../services/urlScannerService';

export function UrlScannerPage() {
  const [urlInput, setUrlInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const sampleUrls = urlScannerService.getSampleUrls();

  const handleScan = (targetUrl) => {
    const toScan = targetUrl || urlInput;
    if (!toScan || toScan.trim() === '') {
      setError('Please enter or select a valid URL to analyze.');
      return;
    }

    setError('');
    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      try {
        const res = urlScannerService.scanUrl(toScan);
        setResult(res);
      } catch (err) {
        setError(err.message || 'Error parsing target URL format.');
      } finally {
        setIsAnalyzing(false);
      }
    }, 600);
  };

  const getBadge = (lvl) => {
    switch (lvl) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'LOW':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 lg:pb-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border-cyan-500/20">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
            NETWORK HEURISTIC ENGINE
          </span>
        </div>
        <h2 className="text-2xl font-black text-white mt-1">
          URL & Phishing Link Analyzer
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
          Evaluates links for homograph attacks, shortened cloaks, deceptive financial keywords, and unencrypted transport without visiting dangerous endpoints.
        </p>

        {/* Search input bar */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe2 className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Paste URL to inspect (e.g. https://domain.xyz/login)..."
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <button
            onClick={() => handleScan()}
            disabled={isAnalyzing}
            className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition ${
              isAnalyzing 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-950 active:scale-95'
            }`}
          >
            {isAnalyzing ? (
              <span>ANALYZING...</span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>ANALYZE URL</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}
      </div>

      {/* Preset Test Vectors (Requirement #7) */}
      <div className="glass-panel p-4.5 rounded-2xl border-slate-800">
        <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block mb-2">
          QUICK TEST VECTORS (SAFE / SUSPICIOUS / DANGEROUS SAMPLES):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {sampleUrls.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setUrlInput(sample.url);
                handleScan(sample.url);
              }}
              className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-left transition group"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-1">
                <span>{sample.label}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${getBadge(sample.expected)}`}>
                  {sample.expected}
                </span>
              </div>
              <div className="text-[11px] font-mono text-cyan-400 truncate group-hover:underline">
                {sample.url}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Result Display Card (Requirement #7) */}
      {result && (
        <div className="glass-panel-glow p-6 rounded-2xl border-cyan-500/30 space-y-5 animate-fadeIn">
          {/* Top Result Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getBadge(result.riskLevel)}`}>
                  {result.riskLevel} • RISK SCORE: {result.riskScore}/100
                </span>
                {result.isHttps ? (
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> HTTPS Encrypted
                  </span>
                ) : (
                  <span className="text-xs font-mono text-rose-400 flex items-center gap-1">
                    <Unlock className="w-3.5 h-3.5" /> Insecure HTTP
                  </span>
                )}
              </div>
              <div className="text-sm font-mono text-white mt-2 break-all">
                {result.sanitizedUrl}
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
              <span className="text-[11px] text-slate-400 block">Extracted Domain</span>
              <span className="text-base font-black font-mono text-cyan-300">{result.domain}</span>
            </div>
          </div>

          {/* Identified Indicators */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
              Heuristic Threat Indicators Detected ({result.reasons?.length || 0})
            </h4>
            {result.reasons?.length > 0 ? (
              <div className="space-y-2">
                {result.reasons.map((r, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 shrink-0">
                      +{r.points}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-200">{r.indicator}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Domain syntax and protocol exhibit standard safe hygiene.</span>
              </div>
            )}
          </div>

          {/* Recommendation */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
              Safety Recommendation:
            </span>
            <div className="text-xs text-slate-300 space-y-1">
              {result.recommendations.map((rec, idx) => (
                <div key={idx}>• {rec}</div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 text-center font-mono">
            {result.disclaimer} • Automated evaluation without visiting host
          </div>
        </div>
      )}
    </div>
  );
}
