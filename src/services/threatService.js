/**
 * ON-DEVICE THREAT GUARD - THREAT SERVICE & REPOSITORY
 * 
 * Manages active security incidents, severity rankings, and status resolutions.
 */

import { storageService } from './storageService';

export const INITIAL_DEMO_THREATS = [
  {
    id: 'THR-8802',
    name: 'Suspicious Application Configuration (Accessibility Hijack)',
    threatType: 'Dangerous Permission Combination',
    severity: 'HIGH',
    riskScore: 74,
    detectedTime: '12 minutes ago',
    source: 'App Risk Analyzer',
    affectedItem: 'FlashLight Ultra Pro 2026 (com.tool.superflashlight.util)',
    status: 'ACTIVE',
    riskExplanation: 'The application possesses both Screen Overlay and Accessibility Service rights while concealing its launcher icon. This pattern is commonly exploited to execute clickjacking and read banking credentials without detection.',
    possibleImpact: 'Credential exfiltration, automated bank OTP hijacking, unauthorized app installations.',
    recommendedAction: 'Revoke Accessibility permission immediately in Android Accessibility Settings or uninstall the APK.'
  },
  {
    id: 'THR-8803',
    name: 'Predatory Data Harvesting Indicator',
    threatType: 'Privacy Risk',
    severity: 'MEDIUM',
    riskScore: 58,
    detectedTime: '45 minutes ago',
    source: 'Permission Auditor',
    affectedItem: 'Instant Quick Loan 5-Min (com.finance.instantcredit.loanpay)',
    status: 'ACTIVE',
    riskExplanation: 'Unverified financial APK requests simultaneous SMS reading and full contact book permissions alongside cleartext HTTP network beacons.',
    possibleImpact: 'Extortion via contact book exfiltration and intercepting private OTP SMS messages.',
    recommendedAction: 'Restrict SMS access and review installation origin.'
  },
  {
    id: 'THR-8799',
    name: 'Unencrypted Wi-Fi Captive Portal Detected',
    threatType: 'Network Risk',
    severity: 'LOW',
    riskScore: 28,
    detectedTime: '3 hours ago',
    source: 'Network Sentinel',
    affectedItem: 'Airport-Public-Free-WiFi (SSID: 802.11 Open)',
    status: 'RESOLVED',
    riskExplanation: 'Connected access point does not enforce WPA2/WPA3 encryption, allowing packet sniffing by adjacent radio devices.',
    possibleImpact: 'Eavesdropping on non-HTTPS network requests and DNS poisoning.',
    recommendedAction: 'Enable device VPN and avoid entering unencrypted credentials.'
  }
];

export const threatService = {
  getThreats() {
    const threats = storageService.getThreatEvents();
    if (!threats || threats.length === 0) {
      storageService.saveThreatEvents(INITIAL_DEMO_THREATS);
      return INITIAL_DEMO_THREATS;
    }
    return threats;
  },

  getThreatById(id) {
    const list = this.getThreats();
    return list.find(t => t.id === id) || null;
  },

  updateStatus(id, newStatus) {
    return storageService.updateThreatStatus(id, newStatus);
  },

  addThreat(threat) {
    const list = this.getThreats();
    const newThreat = {
      id: 'THR-' + Math.floor(1000 + Math.random() * 9000),
      detectedTime: 'Just now',
      status: 'ACTIVE',
      name: threat.title || threat.name || 'Detected Threat Incident',
      threatType: threat.category || threat.threatType || 'Security Vector',
      severity: threat.severity || 'HIGH',
      riskScore: threat.riskScore || 85,
      affectedItem: threat.affectedItem || threat.text?.substring(0, 40) || threat.fileName || 'Client Device Context',
      riskExplanation: threat.description || threat.riskExplanation || threat.evidence || 'Threat indicators exceeded safety heuristic baseline.',
      possibleImpact: threat.possibleImpact || 'Potential unauthorized credential access or fraudulent diversion.',
      recommendedAction: threat.remediation || threat.recommendedAction || 'Quarantine and do not interact with the vector.',
      ...threat
    };
    const updated = [newThreat, ...list];
    storageService.saveThreatEvents(updated);
    return updated;
  },

  resetThreats() {
    storageService.saveThreatEvents(INITIAL_DEMO_THREATS);
    return INITIAL_DEMO_THREATS;
  }
};
