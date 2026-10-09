import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

// Services
import { storageService } from './services/storageService';
import { authService } from './services/authService';
import { clientDeviceDetector } from './services/clientDeviceDetector';
import { securityService } from './services/securityService';
import { appRiskService } from './services/appRiskService';
import { threatService } from './services/threatService';
import { notificationService } from './services/notificationService';

// Components
import { TopNav } from './components/TopNav';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AuthModal } from './components/AuthModal';
import { ConsentModal } from './components/ConsentModal';
import { ThreatDetailsModal } from './components/ThreatDetailsModal';

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
  const [apps, setApps] = useState(() => appRiskService.getAnalyzedApps());
  const [threats, setThreats] = useState(() => threatService.getThreats());

  // Deep Scan State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState({ step: 0, text: '', progress: 0 });

  // Update client device detection on mount
  useEffect(() => {
    const info = clientDeviceDetector.getBrowserDeviceInfo();
    setDeviceInfo(info);
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
    setApps(appRiskService.getAnalyzedApps());
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

  // Threat resolution handler
  const handleStatusChange = (id, newStatus) => {
    threatService.updateStatus(id, newStatus);
    refreshAllState();
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
    <div className="min-h-screen bg-[#07090e] text-slate-100 cyber-grid-bg flex flex-col selection:bg-cyan-500 selection:text-black">
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
    </div>
  );
}

export default App;
