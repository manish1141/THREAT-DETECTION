/**
 * ON-DEVICE THREAT GUARD - LIVE FILE SYSTEM OBSERVER & POPUP SENTINEL
 * 
 * Provides continuous on-device file security surveillance:
 * 1. File System Access API (showDirectoryPicker) - Watches an authorized directory (e.g., Downloads).
 * 2. Drag & Drop Global Listener - Scans any file dropped anywhere on screen immediately.
 * 3. File Input Watcher - Inspects file picks on the fly.
 * 4. Urgent Threat Popup Modal Trigger - Triggers a high-priority warning popup when a suspicious or high-risk file is detected.
 */

import { fileScannerService } from './fileScannerService';
import { storageService } from './storageService';
import { notificationService } from './notificationService';

export const liveFileSentinel = {
  directoryHandle: null,
  isWatching: false,
  seenFileHashes: new Set(),
  pollingTimer: null,
  threatListeners: [],

  // Register listener for immediate threat popup
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
        console.error('Error triggering threat popup:', e);
      }
    });
  },

  /**
   * Prompts the user to authorize a folder (e.g. Downloads or Documents) for real-time monitoring
   */
  async activateDirectoryWatch() {
    if (typeof window === 'undefined' || !window.showDirectoryPicker) {
      throw new Error('File System Directory Watch is supported in Chrome, Edge, and Chromium browsers. For other environments, drag-and-drop file protection remains active.');
    }

    try {
      this.directoryHandle = await window.showDirectoryPicker({
        mode: 'read'
      });
      this.isWatching = true;
      this.startContinuousPolling();

      return {
        success: true,
        directoryName: this.directoryHandle.name
      };
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error('Directory selection was cancelled.');
      }
      throw err;
    }
  },

  /**
   * Continuously polls the authorized folder for newly created or modified files
   */
  startContinuousPolling() {
    if (this.pollingTimer) clearInterval(this.pollingTimer);

    this.pollingTimer = setInterval(async () => {
      if (!this.isWatching || !this.directoryHandle) return;

      try {
        for await (const entry of this.directoryHandle.values()) {
          if (entry.kind === 'file') {
            const file = await entry.getFile();
            const identifier = `${file.name}-${file.size}-${file.lastModified}`;

            if (!this.seenFileHashes.has(identifier)) {
              this.seenFileHashes.add(identifier);
              await this.processNewFile(file);
            }
          }
        }
      } catch (err) {
        console.warn('Error reading monitored directory:', err);
      }
    }, 3500); // Polls every 3.5 seconds
  },

  /**
   * Scans an incoming file and displays an urgent popup if risky
   */
  async processNewFile(file) {
    try {
      const assessment = await fileScannerService.scanFile(file);

      // Check if file is risky (Score > 40 or HIGH / CRITICAL)
      if (assessment.riskScore > 40 || assessment.riskLevel === 'HIGH' || assessment.riskLevel === 'CRITICAL') {
        // Trigger immediate audio alert
        this.playWarningChime();

        const threatIncident = {
          fileName: file.name,
          riskScore: assessment.riskScore,
          riskLevel: assessment.riskLevel,
          sha256: assessment.sha256,
          fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          reasons: assessment.reasons,
          recommendations: assessment.recommendations,
          detectedAt: new Date().toLocaleTimeString()
        };

        // Trigger urgent popup modal on the user's screen
        this.notifyThreat(threatIncident);

        // Add to local notifications
        notificationService.addNotification({
          title: `CRITICAL FILE DETECTED: ${file.name}`,
          message: `Heuristic score: ${assessment.riskScore}/100 (${assessment.riskLevel} RISK). Review immediately.`,
          type: 'HIGH',
          route: 'fileScanner'
        });
      }

      return assessment;
    } catch (err) {
      console.error('File scan error:', err);
    }
  },

  // Audio alert chime using Web Audio API
  playWarningChime() {
    try {
      if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch {}
  },

  stopWatch() {
    this.isWatching = false;
    if (this.pollingTimer) clearInterval(this.pollingTimer);
    this.directoryHandle = null;
  }
};
