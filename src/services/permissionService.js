/**
 * ON-DEVICE THREAT GUARD - PERMISSION SERVICE
 * 
 * ANDROID_NATIVE_INTEGRATION:
 * When packaged in Capacitor Android, this connects to:
 * - `android.content.pm.PackageManager.getPackageInfo(flags = GET_PERMISSIONS)`
 * - `android.app.AppOpsManager` (for background usage, camera/mic indicator dots)
 * - `android.provider.Settings.ACTION_MANAGE_OVERLAY_PERMISSION`
 * - `android.accessibilityservice.AccessibilityServiceInfo`
 * 
 * Provides permission risk ratings, explanations, and mitigation advisories.
 */

import { appRiskService } from './appRiskService';

export const PERMISSION_CATEGORIES = [
  'All',
  'Accessibility',
  'Overlay',
  'SMS',
  'Contacts',
  'Camera',
  'Microphone',
  'Location',
  'Storage',
  'Phone',
  'Notifications'
];

export const PERMISSION_DEFINITIONS = {
  Accessibility: {
    category: 'Accessibility',
    defaultSeverity: 'CRITICAL',
    description: 'Bypasses sandbox to inspect text on screen and simulate touch inputs.',
    riskReason: 'Can capture entered passwords, read bank OTP dialogs, and auto-click permissions.',
    recommendation: 'Ensure only verified assistive screen readers hold this permission.'
  },
  Overlay: {
    category: 'Overlay',
    defaultSeverity: 'HIGH',
    description: 'Permits drawing arbitrary views on top of other running applications.',
    riskReason: 'Used in Clickjacking and Cloaking attacks to trick users into tapping hidden approval buttons.',
    recommendation: 'Revoke overlay permission if the app does not strictly require floating picture-in-picture widgets.'
  },
  SMS: {
    category: 'SMS',
    defaultSeverity: 'HIGH',
    description: 'Grants access to read, send, or receive SMS messages.',
    riskReason: 'Often targeted by financial trojans to intercept 2FA one-time passwords without user awareness.',
    recommendation: 'Only default messaging applications should be permitted SMS privileges.'
  },
  Contacts: {
    category: 'Contacts',
    defaultSeverity: 'MEDIUM',
    description: 'Exposes full device address book and personal contact metadata.',
    riskReason: 'Susceptible to unauthorized contact harvesting and blackmail schemes by predatory loan apps.',
    recommendation: 'Restrict contacts access to trusted messaging and dialer utilities.'
  },
  Camera: {
    category: 'Camera',
    defaultSeverity: 'MEDIUM',
    description: 'Allows recording video or capturing still images.',
    riskReason: 'Camera access in background utilities presents a privacy intrusion risk.',
    recommendation: 'Change permission setting to "Allow only while using the app".'
  },
  Microphone: {
    category: 'Microphone',
    defaultSeverity: 'MEDIUM',
    description: 'Allows recording ambient audio and voice inputs.',
    riskReason: 'Can be misused for ambient listening and eavesdropping.',
    recommendation: 'Configure permission to "Ask every time" or "Only while using the app".'
  },
  Location: {
    category: 'Location',
    defaultSeverity: 'MEDIUM',
    description: 'Accesses GPS satellite and Wi-Fi triangulated coordinates.',
    riskReason: 'Continuous background tracking exposes user home, workplace, and behavioral patterns.',
    recommendation: 'Use "Approximate location" instead of "Precise location" for non-navigation tools.'
  },
  Storage: {
    category: 'Storage',
    defaultSeverity: 'LOW',
    description: 'Reads shared media, documents, and downloads on storage volumes.',
    riskReason: 'Could read sensitive photos, ID documents, or local backup files.',
    recommendation: 'Use scoped storage picker rather than broad legacy all-files access.'
  },
  Phone: {
    category: 'Phone',
    defaultSeverity: 'MEDIUM',
    description: 'Reads phone number, SIM state, and initiates outgoing calls.',
    riskReason: 'Can harvest IMEI / IMSI identifiers and trigger unauthorized toll calls.',
    recommendation: 'Keep restricted to system phone dialers.'
  },
  Notifications: {
    category: 'Notifications',
    defaultSeverity: 'LOW',
    description: 'Posts notification banners and alerts to status bar.',
    riskReason: 'Spam and intrusive push phishing notifications.',
    recommendation: 'Silence notifications from untrusted tools.'
  }
};

export const permissionService = {
  /**
   * Generates a unified map of permission usage across all analyzed applications
   */
  getPermissionAudits() {
    const apps = appRiskService.getAnalyzedApps();
    const audits = [];

    apps.forEach(app => {
      (app.permissions || []).forEach(perm => {
        const meta = PERMISSION_DEFINITIONS[perm] || {
          category: perm,
          defaultSeverity: 'LOW',
          description: 'Standard Android runtime permission.',
          riskReason: 'Monitored for excessive scope.',
          recommendation: 'Review application permissions in device settings.'
        };

        // Context-aware risk adjustment
        let contextRisk = meta.defaultSeverity;
        let contextReason = meta.riskReason;

        if (perm === 'Camera' && app.name.includes('FlashLight')) {
          contextRisk = 'HIGH';
          contextReason = 'A flashlight application does not need continuous camera hardware access.';
        }
        if (perm === 'Accessibility' && (app.name.includes('FlashLight') || app.name.includes('Cleaner'))) {
          contextRisk = 'CRITICAL';
          contextReason = 'High threat vector: Utility application requesting full accessibility UI automation.';
        }
        if (perm === 'SMS' && app.category === 'Finance') {
          contextRisk = 'HIGH';
          contextReason = 'Predatory finance/loan application requesting broad SMS inbox access.';
        }

        audits.push({
          id: `${app.id}-${perm}`,
          permission: perm,
          appName: app.name,
          packageName: app.packageName,
          appSource: app.source,
          appRiskLevel: app.riskLevel,
          severity: contextRisk,
          description: meta.description,
          reason: contextReason,
          recommendation: meta.recommendation
        });
      });
    });

    return audits;
  },

  /**
   * Filter permissions by category or severity
   */
  getAuditsFiltered(category = 'All', severity = 'All') {
    const audits = this.getPermissionAudits();
    return audits.filter(item => {
      const matchCat = category === 'All' || item.permission.toLowerCase() === category.toLowerCase();
      const matchSev = severity === 'All' || item.severity === severity;
      return matchCat && matchSev;
    });
  }
};
