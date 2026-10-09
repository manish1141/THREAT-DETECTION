import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  Upload, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Hash, 
  HardDrive, 
  FileCode, 
  CheckCircle2, 
  Info,
  Copy,
  Check,
  FolderSync,
  Radio,
  StopCircle,
  FolderOpen
} from 'lucide-react';
import { fileScannerService } from '../services/fileScannerService';
import { liveFileSentinel } from '../services/liveFileSentinel';

export function FileScannerPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Sentinel Folder Watcher State
  const [isWatchingFolder, setIsWatchingFolder] = useState(liveFileSentinel.isWatching);
  const [watchedFolderName, setWatchedFolderName] = useState(
    liveFileSentinel.directoryHandle?.name || ''
  );
  const [folderWatchError, setFolderWatchError] = useState('');

  useEffect(() => {
    setIsWatchingFolder(liveFileSentinel.isWatching);
    if (liveFileSentinel.directoryHandle) {
      setWatchedFolderName(liveFileSentinel.directoryHandle.name);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setResult(null);
      setError('');
      // Also pass to sentinel for real-time check
      liveFileSentinel.processNewFile(file);
    }
  };

  const handleScan = async () => {
    if (!selectedFile) {
      setError('Please select a file to scan.');
      return;
    }

    setIsScanning(true);
    setError('');

    try {
      const assessment = await fileScannerService.scanFile(selectedFile);
      setResult(assessment);
    } catch (err) {
      setError(err.message || 'Error occurred while computing SHA-256 hash.');
    } finally {
      setIsScanning(false);
    }
  };

  // Directory Watch activation
  const handleStartWatch = async () => {
    setFolderWatchError('');
    try {
      const res = await liveFileSentinel.activateDirectoryWatch();
      setIsWatchingFolder(true);
      setWatchedFolderName(res.directoryName);
    } catch (err) {
      setFolderWatchError(err.message || 'Failed to start folder surveillance.');
    }
  };

  const handleStopWatch = () => {
    liveFileSentinel.stopWatch();
    setIsWatchingFolder(false);
    setWatchedFolderName('');
  };

  const copyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBadge = (lvl) => {
    switch (lvl) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 lg:pb-8">
      {/* Real-time File Surveillance Sentinel Banner */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isWatchingFolder 
          ? 'bg-gradient-to-r from-red-950/40 via-slate-900 to-black border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.2)]'
          : 'bg-gradient-to-r from-cyan-950/30 via-slate-900 to-black border-cyan-500/30'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider ${
                isWatchingFolder 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                  : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              }`}>
                <Radio className="w-3.5 h-3.5" />
                {isWatchingFolder ? 'LIVE SENTINEL ACTIVE' : 'LIVE SENTINEL STANDBY'}
              </span>
            </div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <span>Real-Time Downloads & System File Watcher</span>
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Continuous on-device surveillance: When any new file drops or arrives in your monitored folder, Threat Guard immediately calculates its hash, verifies heuristic indicators, and triggers an <span className="text-red-400 font-bold">urgent popup alarm</span> if risky.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            {!isWatchingFolder ? (
              <button
                onClick={handleStartWatch}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition active:scale-98"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Select Folder to Monitor (e.g. Downloads)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-800">
                  📁 Watching: <b className="text-white">{watchedFolderName}</b>
                </span>
                <button
                  onClick={handleStopWatch}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <StopCircle className="w-4 h-4" />
                  <span>Stop</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {folderWatchError && (
          <div className="mt-3 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{folderWatchError}</span>
          </div>
        )}
      </div>

      {/* Manual File Inspector Header */}
      <div className="glass-panel p-6 rounded-3xl border-cyan-500/20">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
            LOCAL HASH ENGINE & STATIC BINARY AUDITOR
          </span>
        </div>
        <h2 className="text-2xl font-black text-white mt-1">
          On-Device File & APK Hash Inspector
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
          Generates cryptographic SHA-256 signatures entirely in-browser using Web Crypto Subtle API. Never uploads file contents to external cloud servers.
        </p>

        {/* File Dropzone Area */}
        <div className="mt-5 border-2 border-dashed border-slate-700/80 hover:border-cyan-500/60 rounded-2xl p-6 sm:p-8 text-center transition bg-slate-950/40">
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="fileInput" className="cursor-pointer block">
            <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center mb-3 text-cyan-400">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-white block">
              {selectedFile ? selectedFile.name : 'Choose a file or APK package to inspect'}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Supports .apk, .exe, .zip, .pdf, or documents (processed locally)
            </span>
          </label>

          {selectedFile && (
            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3">
              <span className="text-xs font-mono text-cyan-400">
                Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </span>
              <button
                onClick={handleScan}
                disabled={isScanning}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition ${
                  isScanning 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-950'
                }`}
              >
                <FileCheck2 className="w-4 h-4" />
                <span>{isScanning ? 'COMPUTING SHA-256...' : 'SCAN FILE NOW'}</span>
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block mb-0.5">
            Zero-Knowledge Privacy Architecture
          </span>
          <span>
            Unlike third-party multi-engine scanners that upload full file binaries to public data streams, Threat Guard operates 100% locally on-device. Your documents, photos, and proprietary packages never leave this device.
          </span>
        </div>
      </div>

      {/* Scan Results Card */}
      {result && (
        <div className="glass-panel-glow p-6 rounded-2xl border-cyan-500/30 space-y-5 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getBadge(result.riskLevel)}`}>
                  {result.riskLevel} • RISK SCORE: {result.riskScore}/100
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {result.fileSizeFormatted}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-2 font-mono">
                {result.fileName}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-mono">MIME Type</span>
              <span className="text-xs font-semibold text-slate-300 font-mono">{result.fileType}</span>
            </div>
          </div>

          {/* SHA-256 Hash Display */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-cyan-400">
                <Hash className="w-3.5 h-3.5" /> Cryptographic SHA-256 Hash
              </span>
              <button
                onClick={() => copyHash(result.sha256)}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-slate-200 break-all select-all">
              {result.sha256}
            </div>
          </div>

          {/* Identified Heuristics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
              Static Risk Indicators ({result.reasons?.length || 0})
            </h4>
            {result.reasons?.length > 0 ? (
              <div className="space-y-2">
                {result.reasons.map((r, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 shrink-0">
                      +{r.points}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-200">{r.factor}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Binary signature exhibits regular non-malicious packaging patterns.</span>
              </div>
            )}
          </div>

          {/* Recommendations */}
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
        </div>
      )}
    </div>
  );
}
export default FileScannerPage;
