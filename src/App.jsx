import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

// Services
import { storageService } from './services/storageService';
import { securityService } from './services/securityService';
import { appRiskService } from './services/appRiskService';
import { threatService } from './services/threatService';
import { notificationService } from './services/notificationService';
import { realDeviceService } from './services/realDeviceService';

// Components
import { TopNav } from './components/TopNav';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { NotificationDrawer } from './components/NotificationDrawer';
import { LoginSetupModal } from './components/LoginSetupModal';
import { ThreatDetailsModal } from './components/ThreatDetailsModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { MonitoringPage } from './pages/MonitoringPage';
import { AppsPage } from './pages/AppsPage';
import { PermissionsPage } from './pages/PermissionsPage';
import { UrlScannerPage } from './pages/UrlScannerPage';
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

  // Real Hardware Mode
  const [isRealMode, setIsRealMode] = useState(true);
  const [realHostData, setRealHostData] = useState(null);

  // Core state
  const [profile, setProfile] = useState(() => storageService.getProfile());
  const [settings, setSettings] = useState(() => storageService.getSettings());
  const [dashboardData, setDashboardData] = useState(() => securityService.getDashboardState());
  const [notifications, setNotifications] = useState(() => notificationService.getNotifications());
  const [apps, setApps] = useState(() => appRiskService.getAnalyzedApps());
  const [threats, setThreats] = useState(() => threatService.getThreats());

  // Setup modal for first-time launch
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  // Deep Scan State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState({ step: 0, text: '', progress: 0 });

  // Initial Fetch of Real Laptop Telemetry
  useEffect(() => {
    async function loadRealHost() {
      try {
        const data = await realDeviceService.fetchRealDeviceData();
        setRealHostData(data);
        if (data.installedApps && data.installedApps.length > 0) {
          const auditedRealApps = realDeviceService.transformRealApps(data.installedApps);
          setApps(auditedRealApps);
        }
        if (data.host) {
          setProfile(prev => ({
            ...prev,
            deviceName: `${data.host.hostname} (${data.host.username})`,
            deviceType: `${data.host.platform.toUpperCase()} ${data.host.release}`
          }));
        }
      } catch (e) {
        console.error('Error querying real device telemetry:', e);
      }
    }
    loadRealHost();
  }, []);

  // Refresh dashboard metrics
  const refreshAllState = async () => {
    try {
      const data = await realDeviceService.fetchRealDeviceData();
      setRealHostData(data);
      if (data.installedApps && data.installedApps.length > 0) {
        const auditedRealApps = realDeviceService.transformRealApps(data.installedApps);
        setApps(auditedRealApps);
      }
    } catch {}
    const updatedDashboard = securityService.getDashboardState();
    setDashboardData(updatedDashboard);
    setThreats(threatService.getThreats());
    setNotifications(notificationService.getNotifications());
  };

  // Full Real-Time Security Check Execution
  const handleRunScan = async () => {
    setIsScanning(true);
    setScanProgress({ step: 1, text: 'Querying Windows Registry & Tasklist Subsystems...', progress: 10 });

    try {
      // Refresh live real hardware
      const freshHost = await realDeviceService.fetchRealDeviceData();
      setRealHostData(freshHost);

      const result = await securityService.runFullSecurityCheck((p) => {
        setScanProgress(p);
      });
      await refreshAllState();

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

  // Reset demo state
  const handleResetAll = () => {
    storageService.resetToDemo();
    appRiskService.resetApps();
    threatService.resetThreats();
    setProfile(storageService.getProfile());
    setSettings(storageService.getSettings());
    refreshAllState();
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 cyber-grid-bg flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <TopNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        profile={profile}
        unreadCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        realHostInfo={realHostData?.host}
        isRealMode={isRealMode}
        onToggleRealMode={() => setIsRealMode(!isRealMode)}
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
              realHostData={realHostData}
            />
          )}

          {currentTab === 'monitoring' && (
            <MonitoringPage realHostData={realHostData} />
          )}

          {currentTab === 'apps' && (
            <AppsPage
              apps={apps}
              onRefreshApps={refreshAllState}
              isRealMode={isRealMode}
            />
          )}

          {currentTab === 'permissions' && (
            <PermissionsPage />
          )}

          {currentTab === 'urlScanner' && (
            <UrlScannerPage />
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

      {/* Setup / Onboarding Modal */}
      <LoginSetupModal
        isOpen={isSetupOpen}
        initialProfile={profile}
        onComplete={(newProfile) => {
          storageService.saveProfile(newProfile);
          storageService.set('threatguard_profile_configured', true);
          setProfile(newProfile);
          setIsSetupOpen(false);
          refreshAllState();
        }}
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
