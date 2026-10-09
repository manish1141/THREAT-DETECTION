/**
 * ============================================================================
 * ANDROID_NATIVE_INTEGRATION ARCHITECTURE
 * ============================================================================
 * 
 * Target Environment: Android 10+ (API Level 29–35), Capacitor 6/7
 * 
 * 1. OVERVIEW:
 * While the web version runs high-fidelity on-device heuristics using the
 * Web Crypto API, client-side Sandboxing, and local demo datasets, this module
 * documents the exact Native Bridge plugins, Java/Kotlin classes, and permissions
 * needed when building the production Android APK.
 * 
 * 2. NATIVE CAPACITOR PLUGINS ROADMAP:
 * 
 * A. INSTALLED PACKAGES & APP METADATA:
 *    - Android API: `android.content.pm.PackageManager`
 *    - Required Permission: `<uses-permission android:name="android.permission.QUERY_ALL_PACKAGES"/>`
 *    - Implementation:
 *      ```kotlin
 *      val pm = context.packageManager
 *      val packages = pm.getInstalledPackages(PackageManager.GET_PERMISSIONS or PackageManager.GET_SIGNING_CERTIFICATES)
 *      for (pkg in packages) {
 *          val appName = pkg.applicationInfo.loadLabel(pm).toString()
 *          val installSource = pm.getInstallSourceInfo(pkg.packageName).installingPackageName
 *          val permissions = pkg.requestedPermissions
 *          // Feed directly into threatEngine.evaluateApp()
 *      }
 *      ```
 * 
 * B. ACCESSIBILITY & OVERLAY DETECTION:
 *    - Android API: `Settings.Secure.getString(contentResolver, Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES)`
 *    - Overlay API: `Settings.canDrawOverlays(context)`
 *    - Detects whether third-party apps possess malicious overlay capabilities.
 * 
 * C. GOOGLE PLAY INTEGRITY API:
 *    - Library: `com.google.android.play:integrity:1.3.0`
 *    - Verifies device hardware integrity, unlocked bootloaders, and Play Protect status.
 * 
 * D. NOTIFICATION LISTENER & SMS PHISHING GUARD:
 *    - Service: `NotificationListenerService`
 *    - Intercepts incoming SMS OTP links and WhatsApp phishing domains on-device.
 *    - Calls `urlScannerService.scanUrl(extractedUrl)` before user clicks.
 * 
 * E. ON-DEVICE FILE MONITORING:
 *    - Class: `android.os.FileObserver` watching `/storage/emulated/0/Download`
 *    - Triggers automated background SHA-256 calculation for newly downloaded APKs.
 * 
 * 3. NO FALSE CLAIMS GUARANTEE:
 * Web application explicitly marks browser-simulated metrics with "WEB DEMO / HEURISTIC"
 * to distinguish clearly from native Android OS root capabilities.
 */

export const ANDROID_INTEGRATION_STATUS = {
  platform: 'Web Client / Capacitor Ready',
  nativeBridgeAvailable: typeof window !== 'undefined' && Boolean(window.Capacitor?.isNativePlatform?.()),
  capabilities: {
    packageManager: { native: false, simulated: true, method: 'Android PackageManager (Capacitor Community)' },
    accessibilityAuditor: { native: false, simulated: true, method: 'Settings.Secure Accessibility Reader' },
    cryptoEngine: { native: true, simulated: false, method: 'Web Crypto API (SubtleCrypto SHA-256)' },
    localDatabase: { native: true, simulated: false, method: 'W3C LocalStorage & IndexedDB' },
    urlInspector: { native: true, simulated: false, method: 'Client-side Regex Heuristics & Host Parsing' },
    fileSha256Engine: { native: true, simulated: false, method: 'Streaming File ArrayBuffer Hash' },
    backgroundWorker: { native: false, simulated: true, method: 'Android WorkManager / Foreground Service' }
  }
};
