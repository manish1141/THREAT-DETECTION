/**
 * ON-DEVICE THREAT GUARD - STORAGE SERVICE
 * Local-First IndexedDB and LocalStorage wrapper for zero-cloud persistence.
 * Safe fallback for Node / Vitest test environments.
 */

const STORAGE_KEYS = {
  PROFILE: 'threatguard_profile',
  SETTINGS: 'threatguard_settings',
  SCAN_HISTORY: 'threatguard_scan_history',
  THREAT_EVENTS: 'threatguard_threat_events',
  CUSTOM_APPS: 'threatguard_custom_apps',
  NOTIFICATIONS: 'threatguard_notifications',
  IS_INITIALIZED: 'threatguard_initialized_v1',
};

// In-memory fallback if localStorage is undefined (e.g., in node runtime/testing)
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
  // Get item with default fallback
  get(key, defaultValue = null) {
    try {
      const storage = getStorage();
      const data = storage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (err) {
      console.error(`Storage error reading ${key}:`, err);
      return defaultValue;
    }
  },

  // Save item
  set(key, value) {
    try {
      const storage = getStorage();
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`Storage error saving ${key}:`, err);
      return false;
    }
  },

  // Remove item
  remove(key) {
    try {
      const storage = getStorage();
      storage.removeItem(key);
    } catch (err) {
      console.error(`Storage error deleting ${key}:`, err);
    }
  },

  // Profile operations
  getProfile() {
    return this.get(STORAGE_KEYS.PROFILE, {
      username: 'Security Officer',
      deviceName: 'Pixel 9 Pro / BCA Security Node',
      deviceType: 'Android 15 (Emulated Node)',
      securityLevel: 'MAXIMUM',
      notificationsEnabled: true,
      demoMode: true,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    });
  },

  saveProfile(profile) {
    return this.set(STORAGE_KEYS.PROFILE, {
      ...this.getProfile(),
      ...profile,
      lastActive: new Date().toISOString()
    });
  },

  // Settings operations
  getSettings() {
    return this.get(STORAGE_KEYS.SETTINGS, {
      autoMonitoring: true,
      scanFrequency: 'every_6h', // 'realtime' | 'every_6h' | 'daily' | 'manual'
      heuristicAggressiveness: 'balanced', // 'relaxed' | 'balanced' | 'strict'
      notifyHighRiskOnly: false,
      enableSimulatedNetworkFeeds: true,
      localHashLookup: true,
      cloudReputationServiceEnabled: false, // Privacy first: disabled by default
      cloudApiUrl: import.meta.env?.VITE_THREAT_INTELLIGENCE_API_URL || '',
      cloudApiKeyConfigured: Boolean(import.meta.env?.VITE_THREAT_INTELLIGENCE_API_KEY)
    });
  },

  saveSettings(settings) {
    return this.set(STORAGE_KEYS.SETTINGS, settings);
  },

  // Scan History operations
  getScanHistory() {
    return this.get(STORAGE_KEYS.SCAN_HISTORY, []);
  },

  addScanRecord(record) {
    const history = this.getScanHistory();
    const newRecord = {
      id: 'scan-' + Date.now(),
      timestamp: new Date().toISOString(),
      ...record
    };
    // keep latest 50 scans
    const updated = [newRecord, ...history].slice(0, 50);
    this.set(STORAGE_KEYS.SCAN_HISTORY, updated);
    return newRecord;
  },

  // Threat events
  getThreatEvents() {
    return this.get(STORAGE_KEYS.THREAT_EVENTS, []);
  },

  saveThreatEvents(threats) {
    return this.set(STORAGE_KEYS.THREAT_EVENTS, threats);
  },

  updateThreatStatus(threatId, newStatus) {
    const list = this.getThreatEvents();
    const updated = list.map(item => item.id === threatId ? { ...item, status: newStatus, resolvedAt: newStatus === 'RESOLVED' ? new Date().toISOString() : null } : item);
    this.saveThreatEvents(updated);
    return updated;
  },

  // Notifications
  getNotifications() {
    return this.get(STORAGE_KEYS.NOTIFICATIONS, []);
  },

  saveNotifications(notifs) {
    return this.set(STORAGE_KEYS.NOTIFICATIONS, notifs);
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

  // Reset entire database to default demo state
  resetToDemo() {
    Object.values(STORAGE_KEYS).forEach(k => this.remove(k));
  }
};
