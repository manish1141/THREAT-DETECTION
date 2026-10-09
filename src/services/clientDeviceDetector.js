/**
 * ON-DEVICE THREAT GUARD - CLIENT DEVICE DETECTOR
 * 
 * Accurately and safely detects ONLY what the visitor's CURRENT browser / environment genuinely exposes.
 * NEVER hardcodes any hostnames, developer machine names (e.g. Dell, DESKTOP-60BRJ0F), or server details.
 * 
 * Operating Environments:
 * 1. BROWSER_WEB (Standard HTTPS/HTTP Web visitor)
 * 2. NATIVE_ANDROID (Capacitor / Android Webview with native bridge)
 * 3. LOCAL_DESKTOP_DAEMON (Local desktop host with optional authorized local companion)
 */

export const PLATFORM_ENVIRONMENTS = {
  BROWSER_WEB: 'BROWSER_WEB',
  NATIVE_ANDROID: 'NATIVE_ANDROID',
  LOCAL_DESKTOP_DAEMON: 'LOCAL_DESKTOP_DAEMON'
};

export const clientDeviceDetector = {
  /**
   * Detects current browser runtime characteristics cleanly and safely.
   */
  getBrowserDeviceInfo() {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return {
        environment: PLATFORM_ENVIRONMENTS.BROWSER_WEB,
        platformName: 'Not available in this environment',
        osName: 'Not available in this environment',
        browserName: 'Not available in this environment',
        deviceType: 'Web Client',
        cpuCores: 'Not available in this environment',
        memoryGb: 'Not available in this environment',
        networkOnline: true,
        networkType: 'Not available in this environment',
        isNativeAndroid: false,
        isLocalDaemon: false
      };
    }

    const nav = window.navigator;
    const ua = nav.userAgent || '';
    
    // Check if native Android bridge (Capacitor) exists
    const isCapacitorNative = Boolean(window.Capacitor?.isNativePlatform?.());
    const isAndroidUA = /android/i.test(ua);

    // Determine OS
    let osName = 'Unknown OS';
    if (/windows nt 10.0/i.test(ua)) osName = 'Windows 10/11';
    else if (/windows nt 6.3/i.test(ua)) osName = 'Windows 8.1';
    else if (/windows nt 6.1/i.test(ua)) osName = 'Windows 7';
    else if (/macintosh|mac os x/i.test(ua)) osName = 'macOS';
    else if (/android/i.test(ua)) osName = 'Android';
    else if (/iphone|ipad|ipod/i.test(ua)) osName = 'iOS';
    else if (/linux/i.test(ua)) osName = 'Linux';

    // Determine Browser
    let browserName = 'Browser';
    if (/edg\//i.test(ua)) browserName = 'Microsoft Edge';
    else if (/opr\/|opera/i.test(ua)) browserName = 'Opera';
    else if (/chrome|crios/i.test(ua)) browserName = 'Google Chrome';
    else if (/firefox|fxios/i.test(ua)) browserName = 'Mozilla Firefox';
    else if (/safari/i.test(ua)) browserName = 'Apple Safari';

    // Determine Form Factor
    const isMobile = /mobile|iphone|android|touch/i.test(ua);
    const isTablet = /tablet|ipad/i.test(ua);
    const deviceType = isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop / Laptop';

    // Hardware parameters if exposed by browser
    const cpuCores = nav.hardwareConcurrency ? `${nav.hardwareConcurrency} Logical Cores` : 'Not available in this environment';
    const memoryGb = nav.deviceMemory ? `${nav.deviceMemory} GB RAM (Browser exposed)` : 'Not available in this environment';

    // Network connection status
    const networkOnline = nav.onLine;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
    const networkType = conn?.effectiveType ? `${conn.effectiveType.toUpperCase()} (${conn.type || 'Connection'})` : (networkOnline ? 'Online' : 'Offline');

    // Display monikers based on verified environment
    let detectedMoniker = `${osName} (${browserName})`;
    if (nav.userAgentData?.brands?.length) {
      const topBrand = nav.userAgentData.brands.find(b => !b.brand.includes('Not') && !b.brand.includes('Brand'));
      if (topBrand) {
        browserName = `${topBrand.brand} v${topBrand.version}`;
      }
    }

    const environment = isCapacitorNative
      ? PLATFORM_ENVIRONMENTS.NATIVE_ANDROID
      : PLATFORM_ENVIRONMENTS.BROWSER_WEB;

    return {
      environment,
      isNativeAndroid: isCapacitorNative,
      platformName: detectedMoniker,
      osName,
      browserName,
      deviceType,
      cpuCores,
      memoryGb,
      networkOnline,
      networkType,
      screenResolution: `${window.screen?.width || 0} x ${window.screen?.height || 0}`,
      pixelRatio: window.devicePixelRatio || 1,
      language: nav.language || 'en',
      cookieEnabled: nav.cookieEnabled,
      hasWebCrypto: Boolean(window.crypto && window.crypto.subtle),
      hasIndexedDB: Boolean(window.indexedDB),
      hasServiceWorker: 'serviceWorker' in nav,
      // Clear distinction labels
      sourceLabel: isCapacitorNative 
        ? 'Native Android API (Capacitor Bridge)' 
        : 'Current Browser Session (Client-Side Detection)',
      privacyNotice: 'Zero developer hardware or third-party device data is accessed. All information shown is derived from your active browser context.'
    };
  },

  /**
   * Discovers whether a locally installed desktop daemon is explicitly authorized on localhost:5174.
   * If on a public web domain, this will gracefully fail and display 'Not available in this environment'.
   */
  async probeOptionalLocalDaemon() {
    // Only attempt if user is on localhost/127.0.0.1 or explicitly enabled
    if (typeof window === 'undefined') return null;
    const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalHost) {
      return null; // Public web visitors will NEVER attempt to connect to arbitrary hosts
    }

    try {
      const res = await fetch('http://127.0.0.1:5174/api/device-probe', {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(1500)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
};
