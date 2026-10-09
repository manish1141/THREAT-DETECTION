/**
 * ON-DEVICE THREAT GUARD - URL SCANNER SERVICE
 * 
 * Local-First Phishing, Cloaking, & Malicious Link Evaluator.
 * Does NOT auto-visit dangerous links.
 * 
 * ANDROID_NATIVE_INTEGRATION:
 * When packaged in Capacitor Android, this connects to:
 * - Android AccessibilityService / NotificationListener to inspect incoming SMS/WhatsApp URLs.
 * - Android NetworkSecurityConfig and VPN/DNS inspection proxy.
 */

import { threatEngine } from './threatEngine';

export const SAMPLE_URLS = [
  {
    label: 'Legitimate Banking (SAFE)',
    url: 'https://www.chase.com/personal/banking',
    expected: 'SAFE'
  },
  {
    label: 'Suspicious Domain TLD (SUSPICIOUS)',
    url: 'http://fast-crypto-airdrop.xyz/verify-wallet',
    expected: 'HIGH'
  },
  {
    label: 'Phishing OTP Interceptor (DANGEROUS)',
    url: 'http://192.168.1.105/sbi-kyc-pan-update.php?claim=instant',
    expected: 'CRITICAL'
  },
  {
    label: 'Shortened Link Cloak (SUSPICIOUS)',
    url: 'https://bit.ly/claim-free-iphone-2026',
    expected: 'MEDIUM'
  }
];

export const urlScannerService = {
  scanUrl(rawUrl) {
    return threatEngine.evaluateUrl(rawUrl);
  },

  getSampleUrls() {
    return SAMPLE_URLS;
  }
};
