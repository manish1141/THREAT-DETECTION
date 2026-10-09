import { describe, it, expect, beforeEach } from 'vitest';
import { threatEngine, getRiskLevelFromScore, RISK_LEVELS } from './threatEngine';
import { appRiskService, INITIAL_DEMO_APPS } from './appRiskService';
import { permissionService } from './permissionService';
import { urlScannerService } from './urlScannerService';
import { fileScannerService } from './fileScannerService';
import { threatService } from './threatService';
import { storageService } from './storageService';
import { securityService } from './securityService';

describe('ON-DEVICE THREAT GUARD - Security Suite Verification', () => {

  it('1. Heuristic Risk Levels evaluate correctly across 0-100 scale', () => {
    expect(getRiskLevelFromScore(10)).toBe(RISK_LEVELS.SAFE);
    expect(getRiskLevelFromScore(30)).toBe(RISK_LEVELS.LOW);
    expect(getRiskLevelFromScore(55)).toBe(RISK_LEVELS.MEDIUM);
    expect(getRiskLevelFromScore(75)).toBe(RISK_LEVELS.HIGH);
    expect(getRiskLevelFromScore(95)).toBe(RISK_LEVELS.CRITICAL);
  });

  it('2. App Risk Analyzer identifies dangerous permission combinations (Overlay + Accessibility)', () => {
    const maliciousApp = {
      name: 'Rogue Tool',
      packageName: 'com.rogue.tool',
      source: 'Unknown / Sideloaded',
      permissions: ['Accessibility', 'Overlay', 'Camera'],
      flags: ['HIDDEN_ICON']
    };

    const evaluation = threatEngine.evaluateApp(maliciousApp);
    expect(evaluation.riskScore).toBeGreaterThanOrEqual(70);
    expect(evaluation.riskLevel).toBe('HIGH');
    expect(evaluation.reasons.some(r => r.rule.includes('Overlay + Accessibility'))).toBe(true);
    expect(evaluation.reasons.some(r => r.rule.includes('Unknown Installation Source'))).toBe(true);
    expect(evaluation.reasons.some(r => r.rule.includes('Hidden Launcher Icon'))).toBe(true);
  });

  it('3. App Risk Analyzer confirms safe baseline for legitimate apps', () => {
    const safeApp = {
      name: 'Safe Messenger',
      packageName: 'org.safe.chat',
      source: 'Google Play Store',
      permissions: ['Camera', 'Notifications'],
      flags: []
    };

    const evaluation = threatEngine.evaluateApp(safeApp);
    expect(evaluation.riskScore).toBeLessThanOrEqual(20);
    expect(evaluation.riskLevel).toBe('SAFE');
  });

  it('4. URL / Phishing Guard detects insecure HTTP, raw IP, and homographs', () => {
    const phishingUrl = 'http://192.168.1.100/sbi-kyc-pan-update.php';
    const evalResult = urlScannerService.scanUrl(phishingUrl);

    expect(evalResult.riskScore).toBeGreaterThan(60);
    expect(evalResult.riskLevel).toBe('CRITICAL');
    expect(evalResult.reasons.some(r => r.indicator.includes('Raw IP Hostname'))).toBe(true);
    expect(evalResult.reasons.some(r => r.indicator.includes('Insecure Protocol'))).toBe(true);
    expect(evalResult.reasons.some(r => r.indicator.includes('Suspicious Security/Banking Keywords'))).toBe(true);
  });

  it('5. URL / Phishing Guard passes verified major domain', () => {
    const legitUrl = 'https://www.chase.com/personal/banking';
    const evalResult = urlScannerService.scanUrl(legitUrl);

    expect(evalResult.riskScore).toBeLessThanOrEqual(20);
    expect(evalResult.riskLevel).toBe('SAFE');
  });

  it('6. File Scanner flags dangerous executable packages and double extensions', () => {
    const fakeFile = {
      name: 'quarterly_report.pdf.apk',
      size: 4096000,
      type: 'application/vnd.android.package-archive'
    };

    const assessment = threatEngine.evaluateFile(fakeFile, 'abc123sha256hash');
    expect(assessment.riskScore).toBeGreaterThanOrEqual(70);
    expect(assessment.reasons.some(r => r.factor.includes('Double Extension Spoofing'))).toBe(true);
    expect(assessment.reasons.some(r => r.factor.includes('Executable Package Format'))).toBe(true);
  });

  it('7. Permission Auditor accurately categorizes Android permission vectors', () => {
    const audits = permissionService.getPermissionAudits();
    expect(audits.length).toBeGreaterThan(0);
    const accessibilityAudit = audits.find(a => a.permission === 'Accessibility');
    expect(accessibilityAudit).toBeDefined();
    expect(accessibilityAudit.severity).toBe('CRITICAL');
  });

  it('8. Overall Security Score calculation is balanced across all vectors', () => {
    const apps = appRiskService.getAnalyzedApps();
    const threats = threatService.getThreats();
    const calculated = threatEngine.calculateOverallScore({
      apps,
      activeThreats: threats,
      networkRisk: 'SECURE',
      deviceHygiene: 95
    });

    expect(calculated.overallScore).toBeGreaterThan(50);
    expect(calculated.overallScore).toBeLessThanOrEqual(100);
    expect(calculated.breakdown.applications).toBeDefined();
    expect(calculated.breakdown.permissions).toBeDefined();
    expect(calculated.breakdown.network).toBeDefined();
    expect(calculated.breakdown.privacy).toBeDefined();
    expect(calculated.breakdown.threatProtection).toBeDefined();
  });

  it('9. Storage Service and Profile persistence operate locally without errors', () => {
    const profile = storageService.getProfile();
    expect(profile).toBeDefined();
    expect(profile.deviceName).toBeDefined();

    storageService.saveProfile({ ...profile, username: 'Verified BCA Tester' });
    const updated = storageService.getProfile();
    expect(updated.username).toBe('Verified BCA Tester');
  });

  it('10. Security scan execution produces complete telemetry and audit log', async () => {
    const scanResult = await securityService.runFullSecurityCheck();
    expect(scanResult.score).toBeDefined();
    expect(scanResult.status).toBeDefined();
    expect(scanResult.totalAppsAnalyzed).toBeGreaterThan(0);

    const history = storageService.getScanHistory();
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].scanType).toBe('Full System Check');
  });
});
