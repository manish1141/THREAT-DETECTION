import React, { useState } from 'react';
import { 
  Smartphone, 
  Search, 
  Filter, 
  ShieldAlert, 
  AlertTriangle, 
  ShieldCheck, 
  PlusCircle, 
  RefreshCw,
  Laptop,
  Upload,
  FileCode,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { AppRiskCard } from '../components/AppRiskCard';
import { AppDetailModal } from '../components/AppDetailModal';
import { clientPackageInspector } from '../services/clientPackageInspector';

export function AppsPage({ apps, onRefreshApps }) {
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState(null);
  const [isAnalyzingFile, setIsAnalyzingFile] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState('');
  const [showManualForm, setShowManualForm] = useState(false);

  // Manual package audit form state
  const [manualName, setManualName] = useState('');
  const [manualSource, setManualSource] = useState('Unknown / Sideloaded');
  const [selectedPerms, setSelectedPerms] = useState(['Camera']);

  const permsOptions = ['Accessibility', 'Overlay', 'SMS', 'Contacts', 'Camera', 'Microphone', 'Location', 'Storage'];

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingFile(true);
    setUploadFeedback('');

    try {
      const audited = await clientPackageInspector.inspectPackageFile(file);
      setUploadFeedback(`Successfully audited "${audited.name}"! Risk Score: ${audited.riskScore}/100 (${audited.riskLevel}).`);
      onRefreshApps();
    } catch (err) {
      setUploadFeedback(`Inspection error: ${err.message}`);
    } finally {
      setIsAnalyzingFile(false);
    }
  };

  const handleManualAudit = (e) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    clientPackageInspector.auditCustomPackage({
      name: manualName,
      source: manualSource,
      permissions: selectedPerms
    });

    setManualName('');
    setShowManualForm(false);
    setUploadFeedback(`Added "${manualName}" to your audited packages list!`);
    onRefreshApps();
  };

  const togglePerm = (perm) => {
    setSelectedPerms(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const filtered = apps.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(search.toLowerCase()) || 
      app.packageName?.toLowerCase().includes(search.toLowerCase());
    
    if (filterLevel === 'ALL') return matchesSearch;
    return matchesSearch && app.riskLevel === filterLevel;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-16 lg:pb-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border-cyan-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
                REAL-TIME PACKAGE & APPLICATION ANALYZER
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Active Application Risk Analyzer ({apps.length} Audited)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
              Inspect any APK, desktop executable, or custom package directly in your browser without uploading private binaries to external servers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Real File Upload Trigger */}
            <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition shadow-md shadow-cyan-950">
              <Upload className="w-4 h-4" />
              <span>{isAnalyzingFile ? 'Auditing Package...' : 'Upload APK / File to Audit'}</span>
              <input 
                type="file" 
                accept=".apk,.exe,.msi,.zip,.jar" 
                className="hidden" 
                onChange={handleFileUpload} 
                disabled={isAnalyzingFile} 
              />
            </label>

            <button
              onClick={() => setShowManualForm(!showManualForm)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Audit Custom App</span>
            </button>
          </div>
        </div>

        {uploadFeedback && (
          <div className="mt-4 p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800 text-cyan-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{uploadFeedback}</span>
          </div>
        )}

        {/* Manual Custom App Audit Drawer */}
        {showManualForm && (
          <form onSubmit={handleManualAudit} className="mt-5 p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-4 animate-fadeIn">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              Audit a Custom Application or Suspected APK
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Application Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Video Downloader Pro"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Installation Source</label>
                <select
                  value={manualSource}
                  onChange={(e) => setManualSource(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="Google Play Store">Google Play Store (Verified)</option>
                  <option value="Unknown / Sideloaded">Unknown / Sideloaded (Web APK)</option>
                  <option value="Third-party APK">Third-party APK Store</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Requested Permissions (Click to Toggle):
              </label>
              <div className="flex flex-wrap gap-2">
                {permsOptions.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePerm(p)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition border ${
                      selectedPerms.includes(p)
                        ? 'bg-rose-950/80 text-rose-300 border-rose-700'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {selectedPerms.includes(p) ? `✓ ${p}` : `+ ${p}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowManualForm(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase"
              >
                Run Risk Evaluation
              </button>
            </div>
          </form>
        )}

        {/* Search & Filter Bar */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search audited packages by name or package..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'SAFE'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  filterLevel === lvl
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Apps */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(app => (
            <AppRiskCard
              key={app.id || app.packageName}
              app={app}
              onInspect={(a) => setSelectedApp(a)}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-2xl text-center border-slate-800 space-y-3">
          <Smartphone className="w-8 h-8 text-slate-600 mx-auto" />
          <h4 className="text-sm font-bold text-white">No applications match your filter</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Upload an APK or click "Audit Custom App" above to run real-time heuristic evaluations on any package.
          </p>
        </div>
      )}

      {/* Inspect Modal */}
      {selectedApp && (
        <AppDetailModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
}
