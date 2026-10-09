/**
 * ON-DEVICE THREAT GUARD - STORAGE SERVICE (PER-USER ISOLATED)
 * 
 * Guarantees that every user's scans, settings, profile, and threats
 * are strictly isolated and keyed by their unique account ID (`userId`).
 * 
 * Never mixes developer laptop data with visitor data.
 */

import { authService } from './authService';

const memoryStore = new Map();

const getStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return {
    getItem: (key) => memoryStore.get(key) || null,
    setItem: (key, val) => memoryStore.set(key, String(val)),
    removeItem: (key) => memoryStore.delete(key),
    clear: () => memoryStore.clear()
  };
};

export const storageService = {
  // Generates per-user isolated storage key
  getUserKey(baseKey) {
    const session = authService.getCurrentSession();
    const userId = session?.userId || 'guest_session';
    return `tg_${userId}_${baseKey}`;
  },

  get(baseKey, defaultValue = null) {
    try {
      const storage = getStorage();
      const scopedKey = this.getUserKey(baseKey);
      const data = storage.getItem(scopedKey);
      return data ? JSON.parse(data) : defaultValue;
    } catch (err) {
      console.error(`Storage error reading ${baseKey}:`, err);
      return defaultValue;
    }
  },

  set(baseKey, value) {
    try {
      const storage = getStorage();
      const scopedKey = this.getUserKey(baseKey);
      storage.setItem(scopedKey, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`Storage error saving ${baseKey}:`, err);
      return false;
    }
  },

  remove(baseKey) {
    try {
      const storage = getStorage();
      const scopedKey = this.getUserKey(baseKey);
      storage.removeItem(scopedKey);
    } catch (err) {
      console.error(`Storage error deleting ${baseKey}:`, err);
    }
  },

  // Isolated Profile operations
  getProfile() {
    const session = authService.getCurrentSession();
    return this.get('profile', {
      username: session?.name || 'Security Analyst',
      email: session?.email || 'analyst@endpoint.local',
      deviceName: session?.deviceName || 'Verified Client Device',
      securityLevel: 'BALANCED',
      notificationsEnabled: true,
      hasGivenConsent: false,
      createdAt: new Date().toISOString()
    });
  },

  saveProfile(profile) {
    return this.set('profile', {
      ...this.getProfile(),
      ...profile,
      lastUpdated: new Date().toISOString()
    });
  },

  // Consent & Permissions
  getConsent() {
    return this.get('user_consent', {
      hasGivenConsent: false,
      allowBrowserDiagnostics: false,
      allowFileHashCalculation: false,
      allowUrlHeuristics: false,
      allowNotifications: false,
      timestamp: null
    });
  },

  saveConsent(consent) {
    return this.set('user_consent', {
      ...consent,
      hasGivenConsent: true,
      timestamp: new Date().toISOString()
    });
  },

  // Isolated Scan History operations
  getScanHistory() {
    return this.get('scan_history', []);
  },

  addScanRecord(record) {
    const history = this.getScanHistory();
    const newRecord = {
      id: 'scan-' + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      ...record
    };
    const updated = [newRecord, ...history].slice(0, 50);
    this.set('scan_history', updated);
    return newRecord;
  },

  // Isolated Threats
  getThreatEvents() {
    return this.get('threat_events', []);
  },

  saveThreatEvents(threats) {
    return this.set('threat_events', threats);
  },

  updateThreatStatus(threatId, newStatus) {
    const list = this.getThreatEvents();
    const updated = list.map(item => item.id === threatId ? {
      ...item,
      status: newStatus,
      resolvedAt: newStatus === 'RESOLVED' ? new Date().toISOString() : null
    } : item);
    this.saveThreatEvents(updated);
    return updated;
  },

  // Isolated Settings
  getSettings() {
    return this.get('settings', {
      autoMonitoring: true,
      scanFrequency: 'every_6h',
      heuristicAggressiveness: 'balanced',
      notifyHighRiskOnly: false,
      localHashLookup: true,
      cloudReputationServiceEnabled: false,
      cloudApiUrl: import.meta.env?.VITE_THREAT_INTELLIGENCE_API_URL || '',
      cloudApiKeyConfigured: Boolean(import.meta.env?.VITE_THREAT_INTELLIGENCE_API_KEY)
    });
  },

  saveSettings(settings) {
    return this.set('settings', settings);
  },

  // Isolated Notifications
  getNotifications() {
    return this.get('notifications', []);
  },

  saveNotifications(notifs) {
    return this.set('notifications', notifs);
  },

  markNotificationRead(id) {
    const notifs = this.getNotifications();
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    this.saveNotifications(updated);
    return updated;
  },

  clearNotification(id) {
    const notifs = this.getNotifications();
    const updated = notifs.filter(n => n.id !== id);
    this.saveNotifications(updated);
    return updated;
  },

  // Clear current user's isolated data
  clearUserData() {
    const keys = ['profile', 'user_consent', 'scan_history', 'threat_events', 'settings', 'notifications'];
    keys.forEach(k => this.remove(k));
  }
};
