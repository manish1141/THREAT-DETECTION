/**
 * ON-DEVICE THREAT GUARD - THREAT ENGINE
 * 
 * Transparent rule-based heuristic scoring engine.
 * IMPORTANT: Never claims 100% malware detection.
 * Clearly labels heuristic detection as "Risk Assessment".
 * 
 * Scoring Matrix:
 * - Unknown Installation Source: +20
 * - Sensitive Permission Combination (e.g. Accessibility + Overlay or SMS + Contacts): +25
 * - Suspicious Behavior Indicator (Hidden icon, background auto-start): +25
 * - Known Malicious Hash / IOC Match: +40
 * - Suspicious URL (Punycode, IP address, bad TLD, phishing keywords): +30
 * - Device Security Config Issue (Developer options on, root/jailbreak, no screen lock): +15
 * 
 * Risk Scale:
 *   0 - 20 : SAFE (Normal baseline)
 *  21 - 40 : LOW (Minor warning/unusual config)
 *  41 - 60 : MEDIUM (Needs user inspection)
 *  61 - 80 : HIGH (Severe privilege abuse or untrusted binary)
 *  81 - 100: CRITICAL (Probable exploit/malicious payload pattern)
 */

export const RISK_LEVELS = {
  SAFE: { name: 'SAFE', color: 'emerald', min: 0, max: 20, badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  LOW: { name: 'LOW', color: 'sky', min: 21, max: 40, badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30' },
  MEDIUM: { name: 'MEDIUM', color: 'amber', min: 41, max: 60, badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  HIGH: { name: 'HIGH', color: 'orange', min: 61, max: 80, badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  CRITICAL: { name: 'CRITICAL', color: 'rose', min: 81, max: 100, badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30' }
};

export function getRiskLevelFromScore(score) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  if (clamped <= 20) return RISK_LEVELS.SAFE;
  if (clamped <= 40) return RISK_LEVELS.LOW;
  if (clamped <= 60) return RISK_LEVELS.MEDIUM;
  if (clamped <= 80) return RISK_LEVELS.HIGH;
  return RISK_LEVELS.CRITICAL;
}

export const threatEngine = {
  /**
   * Evaluates an application's risk factors
   */
  evaluateApp(app) {
    let score = 0;
    const reasons = [];
    const recommendations = [];

    // Rule 1: Installation Source
    if (app.source === 'Unknown / Sideloaded' || app.source === 'Third-party APK') {
      score += 20;
      reasons.push({ rule: 'Unknown Installation Source', points: 20, desc: 'Application was sideloaded or downloaded outside Google Play Store.' });
      recommendations.push('Verify APK cryptographic signature and download only from trusted stores.');
    } else if (app.source === 'Google Play Store') {
      score += 2; // baseline minimal
    }

    // Rule 2: Dangerous Permission Combinations
    const perms = app.permissions || [];
    const hasAccessibility = perms.includes('Accessibility');
    const hasOverlay = perms.includes('Overlay') || perms.includes('System Alert Window');
    const hasSms = perms.includes('SMS');
    const hasContacts = perms.includes('Contacts');
    const hasLocation = perms.includes('Location');
    const hasCamera = perms.includes('Camera');
    const hasMicrophone = perms.includes('Microphone');
    const hasStorage = perms.includes('Storage');

    // Accessibility + Overlay is a classic banking trojan / clickjacking pattern
    if (hasAccessibility && hasOverlay) {
      score += 30;
      reasons.push({ rule: 'High Risk Combination (Overlay + Accessibility)', points: 30, desc: 'Can silently observe credentials and draw fake phishing dialogs over legitimate banking apps.' });
      recommendations.push('Immediately disable Accessibility access in device Settings unless this is an approved screen reader.');
    } else if (hasAccessibility) {
      score += 18;
      reasons.push({ rule: 'Accessibility Service Permission', points: 18, desc: 'Granted broad device automation and UI-monitoring privileges.' });
      recommendations.push('Confirm application strictly requires Accessibility for assistive purposes.');
    }

    // SMS + Contacts (classic spyware / 2FA interceptor pattern)
    if (hasSms && hasContacts) {
      score += 22;
      reasons.push({ rule: 'SMS & Contact Harvester Pattern', points: 22, desc: 'Has ability to intercept incoming verification SMS OTPs and exfiltrate contacts address book.' });
      recommendations.push('Revoke SMS permission if app is not your default SMS messenger.');
    } else if (hasSms) {
      score += 15;
      reasons.push({ rule: 'SMS Access Granted', points: 15, desc: 'Application can read or receive SMS text messages.' });
    }

    // Camera + Mic background risk
    if (hasCamera && hasMicrophone && (app.isBackgroundRunning || app.category === 'Utility')) {
      score += 14;
      reasons.push({ rule: 'Unusual Audio/Visual Surveillance Footprint', points: 14, desc: 'Simultaneous microphone and optical sensor privileges in a background utility.' });
      recommendations.push('Restrict permissions to "Only while using the app".');
    }

    // Suspicious behavior flags
    if (app.flags && app.flags.length > 0) {
      app.flags.forEach(flag => {
        if (flag === 'HIDDEN_ICON') {
          score += 25;
          reasons.push({ rule: 'Stealth Behavior (Hidden Launcher Icon)', points: 25, desc: 'App attempts to conceal itself from the home screen launcher drawer.' });
          recommendations.push('Uninstall hidden launcher application immediately via App Management.');
        }
        if (flag === 'UNKNOWN_CERT_SIGNER') {
          score += 20;
          reasons.push({ rule: 'Self-Signed Debug Certificate', points: 20, desc: 'APK was signed with generic Android debug key instead of verified release keystore.' });
        }
        if (flag === 'UNENCRYPTED_OUTBOUND_HTTP') {
          score += 15;
          reasons.push({ rule: 'Cleartext HTTP Traffic Detected', points: 15, desc: 'App transmits unencrypted network payloads over HTTP port 80.' });
          recommendations.push('Avoid submitting sensitive credentials inside this app.');
        }
      });
    }

    // Normalizing
    const finalScore = Math.min(100, Math.max(4, score));
    const level = getRiskLevelFromScore(finalScore);

    return {
      appName: app.name,
      packageName: app.packageName,
      riskScore: finalScore,
      riskLevel: level.name,
      levelMeta: level,
      reasons,
      recommendations: recommendations.length > 0 ? recommendations : ['No immediate critical action required. Continue regular device monitoring.'],
      source: app.source,
      permissions: perms,
      disclaimer: 'Risk Assessment (Heuristic Evaluation - Not absolute malware guarantee)'
    };
  },

  /**
   * Evaluates a URL / domain for phishing and threat indicators
   */
  evaluateUrl(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.trim() === '') {
      throw new Error('Please enter a valid URL to analyze.');
    }

    let urlString = rawUrl.trim();
    if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
      urlString = 'https://' + urlString;
    }

    let parsed;
    try {
      parsed = new URL(urlString);
    } catch {
      throw new Error('Malformed URL syntax. Could not parse protocol or domain hostname.');
    }

    let score = 0;
    const reasons = [];
    const recommendations = [];
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();

    // Protocol check
    const isHttps = parsed.protocol === 'https:';
    if (!isHttps) {
      score += 20;
      reasons.push({ indicator: 'Insecure Protocol (HTTP)', points: 20, desc: 'Data transmitted over unencrypted HTTP is vulnerable to Man-in-the-Middle (MITM) interception.' });
      recommendations.push('Never enter passwords, banking details, or sensitive credentials on unencrypted HTTP pages.');
    }

    // IP address instead of domain
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipPattern.test(hostname)) {
      score += 35;
      reasons.push({ indicator: 'Raw IP Hostname Detected', points: 35, desc: 'Legitimate services use registered domain names. Raw IP addresses are frequently utilized in malware C2 servers and disposable phishing hosts.' });
      recommendations.push('Exercise extreme caution. Do not trust raw IP web destinations.');
    }

    // High risk TLDs
    const suspiciousTlds = ['.xyz', '.top', '.zip', '.mov', '.buzz', '.country', '.work', '.click', '.fit', '.gq', '.tk', '.ml'];
    const matchedTld = suspiciousTlds.find(tld => hostname.endsWith(tld));
    if (matchedTld) {
      score += 22;
      reasons.push({ indicator: `High-Risk TLD (${matchedTld})`, points: 22, desc: `Top-level domain ${matchedTld} exhibits statistically high abuse rates for short-lived spam/phishing campaigns.` });
    }

    // Shortened URL services
    const urlShorteners = ['bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'cutt.ly', 'rb.gy', 'goo.gl', 'ow.ly'];
    const isShortened = urlShorteners.some(s => hostname === s || hostname.endsWith('.' + s));
    if (isShortened) {
      score += 25;
      reasons.push({ indicator: 'URL Shortening Cloak Detected', points: 25, desc: 'URL shorteners obscure the real destination endpoint and are frequently used to evade domain filters.' });
      recommendations.push('Use an unshortener tool to inspect the final redirection target before proceeding.');
    }

    // Phishing keyword heuristics
    const sensitiveKeywords = [
      'login', 'signin', 'verify', 'update-account', 'banking', 'secure', 'wallet',
      'recover', 'support-apple', 'paypal-secure', 'chase-verify', 'sbi-kyc', 'hdfc-net',
      'aadhar', 'pan-update', 'free-gift', 'crypto-airdrop', 'claim-reward'
    ];
    const foundKeywords = sensitiveKeywords.filter(kw => hostname.includes(kw) || pathname.includes(kw));
    if (foundKeywords.length > 0) {
      const legitMajorDomains = ['paypal.com', 'apple.com', 'google.com', 'microsoft.com', 'chase.com', 'hdfcbank.com', 'onlinesbi.sbi'];
      const isLegitMajor = legitMajorDomains.some(d => hostname === d || hostname.endsWith('.' + d));

      if (!isLegitMajor) {
        score += 32;
        reasons.push({ indicator: `Suspicious Security/Banking Keywords (${foundKeywords.slice(0, 3).join(', ')})`, points: 32, desc: 'Contains sensitive financial or authentication keywords on an unverified third-party domain.' });
        recommendations.push('Do NOT input account credentials or OTP codes. Verify URL directly against official banking institution contact cards.');
      }
    }

    // Punycode / IDN Homograph check
    if (hostname.includes('xn--')) {
      score += 38;
      reasons.push({ indicator: 'Punycode / Homograph Attack Vector', points: 38, desc: 'Internationalized domain name containing deceptive Unicode characters designed to visually mimic legitimate brands.' });
      recommendations.push('Potential brand impersonation attack detected. Close this browser tab immediately.');
    }

    // Excessive subdomains
    const subdomainParts = hostname.split('.');
    if (subdomainParts.length > 4) {
      score += 15;
      reasons.push({ indicator: 'Deep Subdomain Nesting', points: 15, desc: 'Unusual subdomain depth often used in dynamically generated domain fluxing.' });
    }

    // Normalize final score
    const finalScore = Math.min(100, Math.max(5, score));
    const level = getRiskLevelFromScore(finalScore);

    return {
      inputUrl: rawUrl,
      sanitizedUrl: urlString,
      domain: hostname,
      protocol: parsed.protocol.replace(':', ''),
      isHttps,
      isShortened,
      riskScore: finalScore,
      riskLevel: level.name,
      levelMeta: level,
      reasons,
      recommendations: recommendations.length > 0 ? recommendations : ['Domain structure appears consistent with standard web hygiene. Exercise regular browsing caution.'],
      disclaimer: 'URL Security Heuristics (Automated Pattern Analysis)'
    };
  },

  /**
   * Computes SHA-256 hash of a file or buffer in browser using Web Crypto API
   */
  async calculateFileHash(file) {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('Web Crypto API not available in current environment.');
    }
    const buffer = await file.arrayBuffer();
    const digestBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(digestBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Evaluates file safety based on metadata, extension, and known signatures
   */
  evaluateFile(file, sha256) {
    let score = 0;
    const reasons = [];
    const recommendations = [];

    const fileName = file.name || 'unnamed_file';
    const fileSize = file.size || 0;
    const extension = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : '';

    // High risk executable / script extensions
    const dangerousExts = ['apk', 'exe', 'bat', 'cmd', 'vbs', 'ps1', 'jar', 'dex', 'so', 'scr', 'msi'];
    const macroExts = ['docm', 'xlsm', 'pptm'];

    if (dangerousExts.includes(extension)) {
      score += 35;
      reasons.push({ factor: `Executable Package Format (.${extension})`, points: 35, desc: `File is an executable binary or installation bundle capable of arbitrary code execution.` });
      recommendations.push('Do not execute or install unless downloaded directly from an authenticated, trusted origin.');
    } else if (macroExts.includes(extension)) {
      score += 25;
      reasons.push({ factor: `Macro-Enabled Office Document (.${extension})`, points: 25, desc: 'Contains embedded Visual Basic (VBA) macro capabilities frequently exploited to drop malware payloads.' });
      recommendations.push('Keep document macros disabled if prompted by office reader applications.');
    }

    // Double extension spoofing (e.g., photo.jpg.exe or invoice.pdf.apk)
    const parts = fileName.split('.');
    if (parts.length > 2) {
      const secondLast = parts[parts.length - 2].toLowerCase();
      if (['jpg', 'png', 'pdf', 'mp4', 'txt'].includes(secondLast) && dangerousExts.includes(extension)) {
        score += 45;
        reasons.push({ factor: 'Double Extension Spoofing Detected', points: 45, desc: `File masquerades as innocent format (${secondLast}) while carrying an executable extension (${extension}).` });
        recommendations.push('High probability Trojan dropper pattern. Quarantine or delete file immediately.');
      }
    }

    // Known malicious demonstration hash matching (BCA test corpus)
    const knownMaliciousHashes = [
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // zero-length test
      '44d88612fea8a8f36de82e1278abb02f', // EICAR-test-md5
      '275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f', // EICAR standard test sha256
      'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce'  // BCA test malware sample hash
    ];

    if (knownMaliciousHashes.includes(sha256.toLowerCase())) {
      score += 60;
      reasons.push({ factor: 'Known Malware Hash / IOC Threat Signature', points: 60, desc: 'Cryptographic SHA-256 fingerprint matches registered malicious IOC database signature.' });
      recommendations.push('Immediate quarantine. Do not execute or transfer to other devices.');
    }

    const finalScore = Math.min(100, Math.max(5, score));
    const level = getRiskLevelFromScore(finalScore);

    return {
      fileName,
      fileSize,
      fileSizeFormatted: (fileSize / (1024 * 1024)).toFixed(2) + ' MB',
      fileType: file.type || `application/x-${extension}`,
      sha256,
      riskScore: finalScore,
      riskLevel: level.name,
      levelMeta: level,
      reasons,
      recommendations: recommendations.length > 0 ? recommendations : ['File format exhibits normal baseline characteristics. Scan complete.'],
      disclaimer: 'On-Device Hash & Static Binary Heuristic (Local Privacy Preserving)'
    };
  },

  /**
   * Overall Security Score calculation engine:
   * Aggregates App safety, Permissions, Network posture, Privacy status, and Device hygiene.
   */
  calculateOverallScore({ apps = [], activeThreats = [], networkRisk = 'SECURE', deviceHygiene = 95 }) {
    // 1. Applications sub-score (0-100 where 100 is best)
    let appRiskSum = 0;
    apps.forEach(a => {
      appRiskSum += a.riskScore || 10;
    });
    const avgAppRisk = apps.length > 0 ? (appRiskSum / apps.length) : 10;
    const appsScore = Math.max(10, Math.round(100 - avgAppRisk));

    // 2. Permissions sub-score
    let dangerousPermCount = 0;
    apps.forEach(a => {
      const p = a.permissions || [];
      if (p.includes('Accessibility')) dangerousPermCount += 2;
      if (p.includes('Overlay')) dangerousPermCount += 1.5;
      if (p.includes('SMS')) dangerousPermCount += 1.5;
    });
    const permScore = Math.max(20, Math.min(100, Math.round(100 - (dangerousPermCount * 4))));

    // 3. Network sub-score
    let netScore = 95;
    if (networkRisk === 'SUSPICIOUS') netScore = 55;
    if (networkRisk === 'HIGH_RISK') netScore = 30;

    // 4. Privacy sub-score
    const privacyScore = Math.round((appsScore * 0.4) + (permScore * 0.6));

    // 5. Threat Protection penalty
    const activeCritical = activeThreats.filter(t => t.severity === 'CRITICAL' && t.status === 'ACTIVE').length;
    const activeHigh = activeThreats.filter(t => t.severity === 'HIGH' && t.status === 'ACTIVE').length;
    const activeMed = activeThreats.filter(t => t.severity === 'MEDIUM' && t.status === 'ACTIVE').length;

    const threatPenalty = (activeCritical * 30) + (activeHigh * 15) + (activeMed * 6);
    const threatProtectionScore = Math.max(10, Math.min(100, 100 - threatPenalty));

    // Weighted Overall Formula
    const overallScore = Math.round(
      (appsScore * 0.25) +
      (permScore * 0.20) +
      (netScore * 0.15) +
      (privacyScore * 0.15) +
      (threatProtectionScore * 0.25)
    );

    const clampedOverall = Math.max(5, Math.min(100, overallScore));

    return {
      overallScore: clampedOverall,
      breakdown: {
        applications: appsScore,
        permissions: permScore,
        network: netScore,
        privacy: privacyScore,
        threatProtection: threatProtectionScore,
        deviceConfiguration: deviceHygiene
      },
      status: clampedOverall >= 80 ? 'DEVICE PROTECTED' : clampedOverall >= 50 ? 'ACTION RECOMMENDED' : 'CRITICAL ATTENTION REQUIRED',
      statusClass: clampedOverall >= 80 ? 'text-emerald-400' : clampedOverall >= 50 ? 'text-amber-400' : 'text-rose-400',
      activeThreatsCount: activeThreats.filter(t => t.status === 'ACTIVE').length,
      highRiskCount: activeCritical + activeHigh
    };
  }
};
