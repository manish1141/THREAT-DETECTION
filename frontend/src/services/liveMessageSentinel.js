/**
 * ON-DEVICE THREAT GUARD - REAL-TIME MESSAGE & SMS SENTINEL
 * 
 * Provides continuous on-time text/message surveillance:
 * 1. Real-time clipboard surveillance - Immediately detects if the user copies an SMS/WhatsApp/Email message.
 * 2. Instant heuristic natural language threat evaluation (Urgency, Banking OTPs, Phishing URLs, Lottery Lures).
 * 3. Plays alarm chime & triggers an instant "SUSPICIOUS MESSAGE INTERCEPTED!" alert popup with recommendations.
 * 4. Zero Cloud Uploads: 100% computed on-device via local regex & heuristics.
 */

import { notificationService } from './notificationService';
import { threatService } from './threatService';

export const liveMessageSentinel = {
  isListening: false,
  pollingTimer: null,
  lastScannedText: '',
  threatListeners: [],

  onThreatDetected(callback) {
    this.threatListeners.push(callback);
    return () => {
      this.threatListeners = this.threatListeners.filter(cb => cb !== callback);
    };
  },

  notifyThreat(threatPayload) {
    this.threatListeners.forEach(cb => {
      try {
        cb(threatPayload);
      } catch (e) {
        console.error('Error notifying message threat:', e);
      }
    });
  },

  /**
   * Evaluates text message heuristics in real time
   */
  evaluateMessage(rawText) {
    if (!rawText || typeof rawText !== 'string' || !rawText.trim()) return null;

    const text = rawText.trim();
    const lower = text.toLowerCase();
    let score = 0;
    const reasons = [];
    const recommendations = [];

    // Rule 1: Panic & Artificial Urgency
    if (
      lower.includes('immediately') || 
      lower.includes('blocked within') || 
      lower.includes('urgent') || 
      lower.includes('suspended') || 
      lower.includes('deactivated') ||
      lower.includes('24 hours') ||
      lower.includes('last warning')
    ) {
      score += 30;
      reasons.push('Coercive Panic Tactics: Imposes short fake deadlines ("blocked within 24 hours").');
      recommendations.push('Real banks and organizations never send sudden 24-hour account deactivation threats over SMS/text.');
    }

    // Rule 2: Credential & Banking Fraud Hooks
    if (
      lower.includes('kyc') || 
      lower.includes('pan card') || 
      lower.includes('aadhaar') || 
      lower.includes('otp') || 
      lower.includes('one time password') || 
      lower.includes('netbanking') || 
      lower.includes('cvv') ||
      lower.includes('debit card') ||
      lower.includes('credit card expired')
    ) {
      score += 35;
      reasons.push('High-Value Credential Harvesting: Solicits OTP, PAN, KYC or banking authentication.');
      recommendations.push('NEVER share OTPs or enter PAN/Aadhaar on links received in messages.');
    }

    // Rule 3: Advance-Fee Lottery & Prize Lures
    if (
      lower.includes('congratulations') || 
      lower.includes('won') || 
      lower.includes('lottery') || 
      lower.includes('lucky draw') || 
      lower.includes('cash reward') || 
      lower.includes('claim bonus') ||
      lower.includes('free gift')
    ) {
      score += 35;
      reasons.push('Unsolicited Prize / Advance-Fee Scam Hook: Claims unexpected lottery or financial reward.');
      recommendations.push('Do not contact the sender. Any prize requiring a fee or link click is fraudulent.');
    }

    // Rule 4: Embedded URLs / IP addresses
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}[^\s]*)/gi;
    const urlsFound = text.match(urlRegex) || [];
    if (urlsFound.length > 0) {
      score += 25;
      reasons.push(`Embedded Hyperlink Vector: Message contains ${urlsFound.length} external URL(s): ${urlsFound[0]}`);
      recommendations.push('Do NOT tap or open the link on mobile or browser.');
    }

    // Rule 5: APK download lure
    if (lower.includes('.apk') || lower.includes('install app')) {
      score += 35;
      reasons.push('Dangerous Sideloading Lure: Urges user to download and install a raw .APK app.');
      recommendations.push('Never install unknown APKs from SMS or WhatsApp links.');
    }

    const finalScore = Math.min(100, score);
    let riskLevel = 'SAFE';
    if (finalScore >= 60) riskLevel = 'CRITICAL';
    else if (finalScore >= 35) riskLevel = 'HIGH';
    else if (finalScore > 15) riskLevel = 'MEDIUM';

    return {
      text,
      riskScore: finalScore,
      riskLevel,
      reasons,
      recommendations: recommendations.length > 0 ? recommendations : ['Message appears to meet standard operational safety profile.'],
      urlsFound,
      evaluatedAt: new Date().toLocaleTimeString()
    };
  },

  /**
   * Inspects message text and triggers alarm popup if suspicious
   */
  processIncomingMessage(text, source = 'Active Input') {
    if (!text || text === this.lastScannedText) return null;
    this.lastScannedText = text;

    const evaluation = this.evaluateMessage(text);
    if (!evaluation) return null;

    if (evaluation.riskScore >= 35 || evaluation.riskLevel === 'HIGH' || evaluation.riskLevel === 'CRITICAL') {
      this.playWarningChime();

      const threatPayload = {
        type: 'MESSAGE_SCAM',
        title: `Suspicious Message Intercepted (${source})`,
        text: evaluation.text,
        riskScore: evaluation.riskScore,
        riskLevel: evaluation.riskLevel,
        reasons: evaluation.reasons,
        recommendations: evaluation.recommendations,
        urlsFound: evaluation.urlsFound,
        detectedAt: evaluation.evaluatedAt
      };

      this.notifyThreat(threatPayload);

      notificationService.addNotification({
        title: `SCAM MESSAGE BLOCKED: ${evaluation.riskLevel}`,
        message: `On-time sentinel flagged incoming message with score ${evaluation.riskScore}/100.`,
        type: 'HIGH',
        route: 'msgScanner'
      });
    }

    return evaluation;
  },

  /**
   * Synthesize immediate audio alarm using Web Audio API
   */
  playWarningChime() {
    try {
      if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1040, ctx.currentTime + 0.35);

        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.55);
      }
    } catch {}
  },

  /**
   * Activates Real-Time Clipboard Sentinel (checks clipboard for copied messages)
   */
  async activateClipboardWatcher() {
    if (typeof navigator === 'undefined' || !navigator.clipboard || !navigator.clipboard.readText) {
      throw new Error('Clipboard access is restricted by your browser. You can type or paste any message for instant analysis.');
    }

    try {
      this.isListening = true;
      // Start polling clipboard every 2.5s if authorized
      if (this.pollingTimer) clearInterval(this.pollingTimer);

      this.pollingTimer = setInterval(async () => {
        if (!this.isListening) return;
        try {
          if (document.hasFocus()) {
            const clipText = await navigator.clipboard.readText();
            if (clipText && clipText !== this.lastScannedText && clipText.length > 10 && clipText.length < 2000) {
              this.processIncomingMessage(clipText, 'Clipboard Intercept');
            }
          }
        } catch {}
      }, 2500);

      return { success: true };
    } catch (err) {
      this.isListening = false;
      throw err;
    }
  },

  stopWatcher() {
    this.isListening = false;
    if (this.pollingTimer) clearInterval(this.pollingTimer);
    this.pollingTimer = null;
  }
};
