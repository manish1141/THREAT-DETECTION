import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

// Services
import { storageService } from './services/storageService';
import { authService } from './services/authService';
import { clientDeviceDetector } from './services/clientDeviceDetector';
import { securityService } from './services/securityService';
import { appRiskService } from './services/appRiskService';
import { clientPackageInspector } from './services/clientPackageInspector';
import { threatService } from './services/threatService';
import { notificationService } from './services/notificationService';
import { liveFileSentinel } from './services/liveFileSentinel';
import { liveMessageSentinel } from './services/liveMessageSentinel';

// Components
import { TopNav } from './components/TopNav';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AuthModal } from './components/AuthModal';
import { ConsentModal } from './components/ConsentModal';
import { ThreatDetailsModal } from './components/ThreatDetailsModal';
import { UrgentThreatModal } from './components/UrgentThreatModal';
import { DynamicMessageScannerModal } from './components/DynamicMessageScannerModal';
import { ThreatRemediationModal } from './components/ThreatRemediationModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { MonitoringPage } from './pages/MonitoringPage';
import { AppsPage } from './pages/AppsPage';
import { PermissionsPage } from './pages/PermissionsPage';
import { UrlScannerPage } from './pages/UrlScannerPage';
import { MessageScannerPage } from './pages/MessageScannerPage';
import { FileScannerPage } from './pages/FileScannerPage';
import { ThreatCenterPage } from './pages/ThreatCenterPage';
import { HistoryPage } from './pages/HistoryPage';
import { ReportPage } from './pages/ReportPage';
import { EducationPage } from './pages/EducationPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedThreatModal, setSelectedThreatModal] = useState(null);
  const [activeUrgentThreat, setActiveUrgentThreat] = useState(null);
  const [dynamicMessageJob, setDynamicMessageJob] = useState(null);
  const [remediationJob, setRemediationJob] = useState(null);

  // Authentication & Session
  const [session, setSession] = useState(() => authService.getCurrentSession());
  const [isAuthOpen, setIsAuthOpen] = useState(() => !authService.getCurrentSession());

  // Informed Consent
  const [isConsentOpen, setIsConsentOpen] = useState(() => {
    const s = authService.getCurrentSession();
    return Boolean(s && !storageService.getConsent()?.hasGivenConsent);
  });

  // Genuine Current Visitor Device Info
  const [deviceInfo, setDeviceInfo] = useState(() => clientDeviceDetector.getBrowserDeviceInfo());

  // Per-User Scoped State
  const [profile, setProfile] = useState(() => storageService.getProfile());
  const [settings, setSettings] = useState(() => storageService.getSettings());
  const [dashboardData, setDashboardData] = useState(() => securityService.getDashboardState());
  const [notifications, setNotifications] = useState(() => notificationService.getNotifications());
  const [apps, setApps] = useState(() => {
    const custom = clientPackageInspector.getAuditedPackages();
    return custom.length > 0 ? custom : appRiskService.getAnalyzedApps();
  });
  const [threats, setThreats] = useState(() => threatService.getThreats());

  // Deep Scan State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState({ step: 0, text: '', progress: 0 });

  // Update client device detection on mount & subscribe to Live File Sentinel
  useEffect(() => {
    const info = clientDeviceDetector.getBrowserDeviceInfo();
    setDeviceInfo(info);

    // Subscribe to File Sentinel for immediate threat popup alerts
    const unsubscribeFile = liveFileSentinel.onThreatDetected((threat) => {
      setActiveUrgentThreat(threat);
      threatService.addThreat({
        title: `Monitored File Threat: ${threat.fileName}`,
        severity: threat.riskLevel || 'HIGH',
        category: 'FILE_MALWARE',
        description: `Active Sentinel intercepted risky file with score ${threat.riskScore}/100. Checksum: ${threat.sha256?.substring(0, 16)}...`,
        evidence: threat.reasons?.join('; ') || 'Heuristic rules exceeded danger thresholds.',
        remediation: threat.recommendations?.[0] || 'Delete file immediately and quarantine storage.'
      });
      refreshAllState();
    });

    // Subscribe to Message Sentinel for on-time scam message interception
    const unsubscribeMessage = liveMessageSentinel.onThreatDetected((threat) => {
      // Trigger dynamic interactive scanning modal
      setDynamicMessageJob(threat);
      threatService.addThreat({
        title: `Interception Alert: ${threat.riskLevel} Scam Message`,
        severity: threat.riskLevel || 'HIGH',
        category: 'PHISHING_MESSAGE',
        description: `Live message sentinel detected phishing/fraud vectors in text: "${threat.text?.substring(0, 60)}..."`,
        evidence: threat.reasons?.join('; ') || 'Social engineering heuristics triggered.',
        remediation: threat.recommendations?.[0] || 'Do not click links or share credentials.'
      });
      refreshAllState();
    });

    // Global drag-and-drop listener: Any file dropped onto the browser window is immediately inspected
    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          liveFileSentinel.processNewFile(e.dataTransfer.files[i]);
        }
      }
    };

    // Global Paste Listener: When user pastes text anywhere in browser, immediately audit for scams
    const handlePaste = (e) => {
      const pastedText = e.clipboardData?.getData('text');
      if (pastedText && pastedText.length > 10 && pastedText.length < 3500) {
        liveMessageSentinel.processIncomingMessage(pastedText, 'Clipboard Paste');
      }
    };

    // Window Focus Listener: When user copies a message in WhatsApp / SMS and clicks back onto our web app, auto-check
    const handleWindowFocus = () => {
      if (liveMessageSentinel.isListening) {
        liveMessageSentinel.checkClipboardNow('Window Return Intercept');
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);
    window.addEventListener('paste', handlePaste);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      unsubscribeFile();
      unsubscribeMessage();
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  // Sync state when session changes
  const handleAuthenticated = (newSession) => {
    setSession(newSession);
    setIsAuthOpen(false);

    // Refresh scoped user store
    const userProfile = storageService.getProfile();
    setProfile(userProfile);
    setSettings(storageService.getSettings());
    setDashboardData(securityService.getDashboardState());
    setNotifications(notificationService.getNotifications());
    setApps(appRiskService.getAnalyzedApps());
    setThreats(threatService.getThreats());

    // Check if consent has been given by this user
    const userConsent = storageService.getConsent();
    if (!userConsent?.hasGivenConsent) {
      setIsConsentOpen(true);
    }
  };

  const handleSignOut = () => {
    authService.signOut();
    setSession(null);
    setIsAuthOpen(true);
  };

  const handleAcceptConsent = (consentOptions) => {
    storageService.saveConsent(consentOptions);
    setIsConsentOpen(false);
    refreshAllState();
  };

  const handleDeclineConsent = () => {
    storageService.saveConsent({ hasGivenConsent: true, restrictedMode: true });
    setIsConsentOpen(false);
  };

  // Refresh dashboard metrics
  const refreshAllState = () => {
    const updatedDashboard = securityService.getDashboardState();
    setDashboardData(updatedDashboard);
    const custom = clientPackageInspector.getAuditedPackages();
    setApps(custom.length > 0 ? custom : appRiskService.getAnalyzedApps());
    setThreats(threatService.getThreats());
    setNotifications(notificationService.getNotifications());
  };

  // Full Security Check Execution
  const handleRunScan = async () => {
    setIsScanning(true);
    setScanProgress({ step: 1, text: 'Auditing Client Browser Security Sandbox...', progress: 10 });

    try {
      const result = await securityService.runFullSecurityCheck((p) => {
        setScanProgress(p);
      });
      refreshAllState();

      if (result.score >= 80) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {}
      }
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Threat resolution handler with realistic remediation delay
  const handleStatusChange = (id, newStatus) => {
    if (newStatus === 'RESOLVED') {
      const t = threatService.getThreatById(id);
      setRemediationJob({ threat: t, isAll: false });
    } else {
      threatService.updateStatus(id, newStatus);
      refreshAllState();
    }
  };

  // Resolve all threats with batch remediation modal
  const handleResolveAllThreats = () => {
    setRemediationJob({ threat: null, isAll: true });
  };

  // Remediation completed handler
  const handleRemediationComplete = (threatId) => {
    if (remediationJob?.isAll) {
      const list = threatService.getThreats();
      list.forEach(t => {
        if (t.status === 'ACTIVE') {
          threatService.updateStatus(t.id, 'RESOLVED');
        }
      });
    } else if (threatId) {
      threatService.updateStatus(threatId, 'RESOLVED');
    }
    setRemediationJob(null);
    refreshAllState();

    try {
      confetti({
        particleCount: 150,
        spread: 85,
        origin: { y: 0.55 }
      });
    } catch {}
  };

  // Reset user data to baseline
  const handleResetAll = () => {
    storageService.clearUserData();
    appRiskService.resetApps();
    threatService.resetThreats();
    setProfile(storageService.getProfile());
    setSettings(storageService.getSettings());
    refreshAllState();
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#030705] text-slate-100 cyber-grid-bg flex flex-col selection:bg-[#00ff66] selection:text-black">
      {/* Top Navbar */}
      <TopNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        profile={profile}
        unreadCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        deviceInfo={deviceInfo}
        onSignOut={handleSignOut}
        currentUser={session}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-[1700px] w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {currentTab === 'dashboard' && (
            <DashboardPage
              dashboardData={dashboardData}
              onRunScan={handleRunScan}
              isScanning={isScanning}
              scanProgress={scanProgress}
              onNavigate={setCurrentTab}
              onInspectThreat={(t) => setSelectedThreatModal(t)}
              onResolveThreat={handleStatusChange}
              onResolveAllThreats={handleResolveAllThreats}
              deviceInfo={deviceInfo}
              currentUser={session}
            />
          )}

          {currentTab === 'monitoring' && (
            <MonitoringPage deviceInfo={deviceInfo} />
          )}

          {currentTab === 'apps' && (
            <AppsPage
              apps={apps}
              onRefreshApps={refreshAllState}
            />
          )}

          {currentTab === 'permissions' && (
            <PermissionsPage />
          )}

          {currentTab === 'urlScanner' && (
            <UrlScannerPage />
          )}

          {currentTab === 'msgScanner' && (
            <MessageScannerPage />
          )}

          {currentTab === 'fileScanner' && (
            <FileScannerPage />
          )}

          {currentTab === 'threatCenter' && (
            <ThreatCenterPage
              threats={threats}
              onStatusChange={handleStatusChange}
              onResolveAllThreats={handleResolveAllThreats}
              onResetThreats={() => {
                threatService.resetThreats();
                refreshAllState();
              }}
            />
          )}

          {currentTab === 'history' && (
            <HistoryPage />
          )}

          {currentTab === 'report' && (
            <ReportPage
              dashboardData={dashboardData}
              profile={profile}
            />
          )}

          {currentTab === 'education' && (
            <EducationPage />
          )}

          {currentTab === 'settings' && (
            <SettingsPage
              profile={profile}
              settings={settings}
              currentUser={session}
              onSignOut={handleSignOut}
              onUpdateProfile={(p) => {
                storageService.saveProfile(p);
                setProfile(p);
              }}
              onUpdateSettings={(s) => {
                storageService.saveSettings(s);
                setSettings(s);
              }}
              onResetAll={handleResetAll}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
      />

      {/* Slide-out Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkRead={(id) => {
          notificationService.markRead(id);
          refreshAllState();
        }}
        onMarkAllRead={() => {
          notificationService.markAllRead();
          refreshAllState();
        }}
        onDelete={(id) => {
          notificationService.deleteNotification(id);
          refreshAllState();
        }}
        onNavigate={(route) => setCurrentTab(route)}
      />

      {/* Authentication Modal (Requirement #2) */}
      <AuthModal
        isOpen={isAuthOpen}
        onAuthenticated={handleAuthenticated}
      />

      {/* Granular Consent Modal (Requirement #3) */}
      <ConsentModal
        isOpen={isConsentOpen}
        onAcceptConsent={handleAcceptConsent}
        onDeclineConsent={handleDeclineConsent}
      />

      {/* Global Threat Details Modal */}
      {selectedThreatModal && (
        <ThreatDetailsModal
          threat={selectedThreatModal}
          onClose={() => setSelectedThreatModal(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Urgent Risky File Detection Alert Modal */}
      {activeUrgentThreat && (
        <UrgentThreatModal
          threat={activeUrgentThreat}
          onClose={() => setActiveUrgentThreat(null)}
          onQuarantine={() => {
            setActiveUrgentThreat(null);
            refreshAllState();
            setTimeout(() => setCurrentTab('threatCenter'), 50);
          }}
        />
      )}

      {/* Dynamic Interactive On-Time Message Sentinel Modal */}
      {dynamicMessageJob && (
        <DynamicMessageScannerModal
          scanJob={dynamicMessageJob}
          onClose={() => setDynamicMessageJob(null)}
          onQuarantine={() => {
            setDynamicMessageJob(null);
            refreshAllState();
            setTimeout(() => setCurrentTab('threatCenter'), 50);
          }}
        />
      )}

      {/* 1-Minute Realistic On-Device Remediation Modal */}
      {remediationJob && (
        <ThreatRemediationModal
          threat={remediationJob.threat}
          isAll={remediationJob.isAll}
          onClose={() => setRemediationJob(null)}
          onComplete={handleRemediationComplete}
        />
      )}
    </div>
  );
}

export default App;
