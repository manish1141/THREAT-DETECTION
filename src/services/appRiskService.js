/**
 * ON-DEVICE THREAT GUARD - APP RISK SERVICE
 * 
 * ANDROID_NATIVE_INTEGRATION:
 * When packaged in Capacitor Android, this service will connect to:
 * - Android PackageManager (`pm.getInstalledPackages(PackageManager.GET_PERMISSIONS)`)
 * - Android Play Integrity API / SafetyNet Attestation
 * - Android PackageInstaller (`pm.getInstallSourceInfo(packageName)`)
 * 
 * In this web preview & development mode, a high-fidelity simulated device package pool
 * is provided with transparent demo toggles.
 */

import { threatEngine } from './threatEngine';
import { storageService } from './storageService';

// Default initial dataset (5 rich applications matching requirement #23 & #5)
export const INITIAL_DEMO_APPS = [
  {
    id: 'app-01',
    name: 'WhatsApp Messenger',
    packageName: 'com.whatsapp',
    category: 'Communication',
    source: 'Google Play Store',
    version: '2.24.18.79',
    lastUpdated: '3 days ago',
    permissions: ['Camera', 'Microphone', 'Contacts', 'Storage', 'Notifications', 'Phone'],
    flags: [],
    isBackgroundRunning: true,
    signature: 'SHA256: 38:A2:91:E4:... (Verified Meta Verified Keystore)'
  },
  {
    id: 'app-02',
    name: 'FlashLight Ultra Pro 2026',
    packageName: 'com.tool.superflashlight.util',
    category: 'Utility',
    source: 'Unknown / Sideloaded',
    version: '1.0.4',
    lastUpdated: '1 month ago',
    permissions: ['Camera', 'Accessibility', 'Overlay', 'Storage', 'Notifications'],
    flags: ['HIDDEN_ICON', 'UNKNOWN_CERT_SIGNER'],
    isBackgroundRunning: true,
    signature: 'SHA256: 9F:11:42:... (Self-Signed Debug Certificate)'
  },
  {
    id: 'app-03',
    name: 'Instant Quick Loan 5-Min',
    packageName: 'com.finance.instantcredit.loanpay',
    category: 'Finance',
    source: 'Third-party APK',
    version: '3.1.0',
    lastUpdated: '2 weeks ago',
    permissions: ['SMS', 'Contacts', 'Location', 'Storage', 'Phone', 'Notifications'],
    flags: ['UNENCRYPTED_OUTBOUND_HTTP'],
    isBackgroundRunning: true,
    signature: 'SHA256: 77:2B:E9:... (Untrusted Developer Identity)'
  },
  {
    id: 'app-04',
    name: 'Signal Private Messenger',
    packageName: 'org.thoughtcrime.securesms',
    category: 'Communication',
    source: 'Google Play Store',
    version: '7.12.0',
    lastUpdated: '1 week ago',
    permissions: ['Camera', 'Microphone', 'Contacts', 'Notifications'],
    flags: [],
    isBackgroundRunning: true,
    signature: 'SHA256: 18:67:8B:... (Verified Signal Foundation)'
  },
  {
    id: 'app-05',
    name: 'Video Speed Booster & Cleaner',
    packageName: 'com.speed.videocleaner.booster',
    category: 'Tools',
    source: 'Unknown / Sideloaded',
    version: '2.0.1',
    lastUpdated: 'Yesterday',
    permissions: ['Accessibility', 'Storage', 'Notifications'],
    flags: ['UNKNOWN_CERT_SIGNER'],
    isBackgroundRunning: false,
    signature: 'SHA256: A0:91:3C:... (Unknown Signer)'
  }
];

export const appRiskService = {
  // Returns evaluated applications with threat engine scoring
  getAnalyzedApps() {
    const customApps = storageService.get('threatguard_custom_apps', INITIAL_DEMO_APPS);
    return customApps.map(app => {
      const evaluation = threatEngine.evaluateApp(app);
      return {
        ...app,
        ...evaluation
      };
    });
  },

  getAppById(id) {
    const apps = this.getAnalyzedApps();
    return apps.find(a => a.id === id || a.packageName === id) || null;
  },

  addOrScanApp(newApp) {
    const current = storageService.get('threatguard_custom_apps', INITIAL_DEMO_APPS);
    const updated = [newApp, ...current];
    storageService.set('threatguard_custom_apps', updated);
    return this.getAnalyzedApps();
  },

  deleteApp(id) {
    const current = storageService.get('threatguard_custom_apps', INITIAL_DEMO_APPS);
    const updated = current.filter(a => a.id !== id);
    storageService.set('threatguard_custom_apps', updated);
    return this.getAnalyzedApps();
  },

  resetApps() {
    storageService.set('threatguard_custom_apps', INITIAL_DEMO_APPS);
    return this.getAnalyzedApps();
  }
};
