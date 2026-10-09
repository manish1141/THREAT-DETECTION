/**
 * ON-DEVICE THREAT GUARD - SECURITY SERVICE
 * Core aggregation hub orchestrating dashboard metrics, deep scans, and telemetry.
 */

import { storageService } from './storageService';
import { appRiskService } from './appRiskService';
import { threatService } from './threatService';
import { threatEngine } from './threatEngine';
import { notificationService } from './notificationService';

export const securityService = {
  /**
   * Retrieves live computed dashboard metrics
   */
  getDashboardState() {
    const apps = appRiskService.getAnalyzedApps();
    const threats = threatService.getThreats();
    const settings = storageService.getSettings();

    // Default network status simulation
    const networkRisk = 'SECURE'; // 'SECURE' | 'SUSPICIOUS' | 'HIGH_RISK'
    const networkDetail = {
      ssid: 'SecNet-WPA3-Private',
      encryption: 'WPA3 Personal (SAE)',
      dnsSecurity: 'DoH (DNS-over-HTTPS)',
      vpnActive: true,
      captivePortal: false
    };

    const overall = threatEngine.calculateOverallScore({
      apps,
      activeThreats: threats,
      networkRisk,
      deviceHygiene: 94
    });

    // Privacy count calculation
    const privacyRisksCount = apps.reduce((count, app) => {
      const sensitive = ['Camera', 'Microphone', 'Location', 'Contacts', 'SMS'];
      const hasSensitive = (app.permissions || []).some(p => sensitive.includes(p));
      return hasSensitive && app.riskScore > 35 ? count + 1 : count;
    }, 0);

    return {
      score: overall.overallScore,
      status: overall.status,
      statusClass: overall.statusClass,
      breakdown: overall.breakdown,
      threatsCount: overall.activeThreatsCount,
      highRiskCount: overall.highRiskCount,
      privacyRisksCount,
      networkStatus: 'Secure (WPA3 + DoH)',
      networkDetail,
      totalAppsAnalyzed: apps.length,
      lastCheck: storageService.get('threatguard_last_check', 'Today, 12:41 PM'),
      isMonitoringActive: settings.autoMonitoring,
      apps,
      threats
    };
  },

  /**
   * Simulates full system security scan with step-by-step progress callbacks
   */
  async runFullSecurityCheck(onProgress) {
    const steps = [
      { step: 1, text: 'Scanning Installed System & Third-Party Packages...', progress: 15 },
      { step: 2, text: 'Auditing High-Risk Permissions (Accessibility, Overlay, SMS)...', progress: 35 },
      { step: 3, text: 'Verifying Cryptographic Signatures & Developer Keystores...', progress: 55 },
      { step: 4, text: 'Checking Local IOC Hash Database & Blacklists...', progress: 75 },
      { step: 5, text: 'Analyzing Network Stack & TLS Configuration...', progress: 90 },
      { step: 6, text: 'Finalizing Local Risk Assessment Heuristics...', progress: 100 }
    ];

    for (const item of steps) {
      if (onProgress) onProgress(item);
      await new Promise(r => setTimeout(r, 450));
    }

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateFormatted = now.toLocaleDateString();

    const result = this.getDashboardState();

    // Store record in local scan history
    storageService.addScanRecord({
      scanType: 'Full System Check',
      threatsFound: result.threatsCount,
      securityScore: result.score,
      status: result.status,
      date: dateFormatted,
      time: timeFormatted,
      summary: `Analyzed ${result.totalAppsAnalyzed} apps, ${result.threatsCount} active threats found.`
    });

    storageService.set('threatguard_last_check', `Today, ${timeFormatted}`);

    // Trigger local completion notification
    notificationService.addNotification({
      title: 'SCAN COMPLETED',
      message: `Full security check completed. Score: ${result.score}/100 with ${result.threatsCount} active risks detected.`,
      type: result.threatsCount > 0 ? 'MEDIUM' : 'INFO',
      route: 'history'
    });

    return result;
  }
};
