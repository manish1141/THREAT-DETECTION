/**
 * ON-DEVICE THREAT GUARD - NOTIFICATION SERVICE
 * Manages device alerts, security events, and notification tray interactions.
 */

import { storageService } from './storageService';

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'HIGH RISK DETECTED',
    message: 'Suspicious security signal detected in FlashLight Ultra Pro 2026.',
    type: 'HIGH',
    timestamp: '12 min ago',
    read: false,
    route: 'threats'
  },
  {
    id: 'notif-2',
    title: 'SECURITY SCORE CHANGED',
    message: 'Device baseline security score adjusted from 92 to 84 after heuristic evaluation.',
    type: 'MEDIUM',
    timestamp: '45 min ago',
    read: false,
    route: 'dashboard'
  },
  {
    id: 'notif-3',
    title: 'SCAN COMPLETED',
    message: 'Full security check completed. 18 system components verified.',
    type: 'INFO',
    timestamp: '2 hours ago',
    read: true,
    route: 'history'
  }
];

export const notificationService = {
  getNotifications() {
    const list = storageService.getNotifications();
    if (!list || list.length === 0) {
      storageService.saveNotifications(INITIAL_NOTIFICATIONS);
      return INITIAL_NOTIFICATIONS;
    }
    return list;
  },

  addNotification(notif) {
    const list = this.getNotifications();
    const item = {
      id: 'notif-' + Date.now(),
      timestamp: 'Just now',
      read: false,
      ...notif
    };
    const updated = [item, ...list];
    storageService.saveNotifications(updated);
    return updated;
  },

  markRead(id) {
    return storageService.markNotificationRead(id);
  },

  markAllRead() {
    const list = this.getNotifications();
    const updated = list.map(n => ({ ...n, read: true }));
    storageService.saveNotifications(updated);
    return updated;
  },

  deleteNotification(id) {
    return storageService.clearNotification(id);
  }
};
