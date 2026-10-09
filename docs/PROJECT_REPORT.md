# ON-DEVICE THREAT GUARD
> **"Your Device. Your Security. Your Control."**  
> *A Production-Grade Local-First Cybersecurity Application & Threat Assessment Engine for BCA Capstone & Hackathons.*

---

## 🛡️ Project Overview & Objective

**ON-DEVICE THREAT GUARD** is an advanced endpoint cybersecurity system designed to audit, monitor, and assess security vulnerabilities on personal devices without transmitting sensitive data or private telemetry to external cloud servers.

Built specifically to meet modern cyber defense standards and BCA (Bachelor of Computer Applications) cybersecurity capstone guidelines, the application replaces black-box guarantees with a **transparent rule-based heuristic scoring engine**. It assesses installed application risks, dangerous permission vectors (e.g., Accessibility & Overlay abuse), suspicious URLs/phishing hooks, and on-device cryptographic file signatures.

---

## ⚡ Key Highlights & Core Capabilities

1. **Local-First Zero-Knowledge Architecture**
   - 100% on-device risk assessment.
   - Files and personal telemetry are never uploaded to remote servers.
   - Uses browser **Web Crypto API (SubtleCrypto)** to calculate SHA-256 hashes locally.
   - Local storage persistence for audit history, incidents, and security posture logs.

2. **Heuristic Threat Engine (Transparent Scoring Matrix)**
   - Transparent scoring scale:
     - `0 - 20`: **SAFE**
     - `21 - 40`: **LOW**
     - `41 - 60`: **MEDIUM**
     - `61 - 80`: **HIGH**
     - `81 - 100`: **CRITICAL**
   - Granular rule penalties:
     - Unknown / Sideloaded APK Origin: `+20`
     - High-Risk Privilege Chaining (Accessibility + Overlay): `+30`
     - Trojan Indicator (SMS + Contacts harvester): `+22`
     - Stealth Mode (Concealed launcher icon): `+25`
     - Unencrypted Cleartext HTTP Beacons: `+15`
     - Known IOC Threat Hash Match: `+40` / `+60`
     - Homograph / Punycode / Raw IP Phishing URL: `+32` to `+38`

3. **Multi-Vector Security Modules**
   - **Main Security Dashboard**: Overall Security Score (0–100), device integrity status, incident cards, and vector breakdowns.
   - **Real-Time Sentinel Stream**: Continuous event logging stream with active subsystem diagnostics.
   - **Application Risk Analyzer**: Deep inspection with *"WHY IS THIS RISKY?"* modal breakdowns, code-signing details, and mitigation advisories.
   - **Permission Security Auditor**: Matrix evaluating sensitive Android permission combinations (Camera, Mic, SMS, Contacts, Location, Accessibility, Overlay).
   - **URL / Phishing Guard**: Static analyzer inspecting Punycode attacks, shorteners, high-risk TLDs, and sensitive banking keywords without visiting harmful sites.
   - **File Hash Inspector**: On-device drag-and-drop scanner calculating cryptographic SHA-256 checksums and double-extension spoofing detection.
   - **Threat Incident Center**: Severity filtering (Critical, High, Medium, Low, Resolved) with one-click resolution triage.
   - **Security History & Analytics**: Interactive charts showing score trends, threat count frequency, and risk vector distribution.
   - **Executive Compliance Report**: Print/PDF-ready formal dossier format for college evaluations.
   - **Cyber Safety Academy**: 10 educational modules covering Phishing, Fake Apps, OTP Scams, QR/Quishing, Public Wi-Fi, and Session Hijacking.
   - **Notification Center & Device Setup**: Quick alert tray, device onboarding, and governance controls.

---

## 🗂️ Clean Component & Service Architecture

```
on-device-threat-guard/
├── src/
│   ├── components/               # Professional Glassmorphism UI
│   │   ├── AppDetailModal.jsx    # "Why is this risky?" analysis modal
│   │   ├── AppRiskCard.jsx       # Application risk badge card
│   │   ├── LoginSetupModal.jsx   # First-run setup and device naming
│   │   ├── MobileBottomNav.jsx   # Responsive mobile ergonomics
│   │   ├── NotificationDrawer.jsx# Real-time alert tray
│   │   ├── SecurityScoreCircle.jsx# Animated SVG radial gauge
│   │   ├── Sidebar.jsx           # Desktop navigation suite
│   │   ├── ThreatCard.jsx        # Security incident triage card
│   │   ├── ThreatDetailsModal.jsx# Deep impact & remediation modal
│   │   └── TopNav.jsx            # Brand bar with Demo Mode badge
│   │
│   ├── pages/                    # Core Cybersecurity Pages
│   │   ├── DashboardPage.jsx     # Main Security Score & vector overview
│   │   ├── MonitoringPage.jsx    # Live sentinel telemetry stream
│   │   ├── AppsPage.jsx          # Package auditor and search
│   │   ├── PermissionsPage.jsx   # Runtime permission matrix
│   │   ├── UrlScannerPage.jsx    # Phishing & link risk heuristic analyzer
│   │   ├── FileScannerPage.jsx   # On-device Web Crypto SHA-256 scanner
│   │   ├── ThreatCenterPage.jsx  # Incident response & resolution triage
│   │   ├── HistoryPage.jsx       # Historical logs & trend charts
│   │   ├── ReportPage.jsx        # Printable/PDF executive report
│   │   ├── EducationPage.jsx     # Cyber Safety Academy (10 topics)
│   │   └── SettingsPage.jsx      # Device settings, policies & API hooks
│   │
│   ├── services/                 # Decoupled Security Services
│   │   ├── threatEngine.js       # Rule-based heuristic scoring engine
│   │   ├── securityService.js    # Scan orchestration & metric aggregation
│   │   ├── appRiskService.js     # Package evaluation repository
│   │   ├── permissionService.js  # Runtime permission matrix audit
│   │   ├── urlScannerService.js  # URL pattern & homograph heuristics
│   │   ├── fileScannerService.js # Local SHA-256 & IOC checker
│   │   ├── threatService.js      # Incident resolution repository
│   │   ├── notificationService.js# Local alert generation & tray
│   │   └── storageService.js     # Local-first persistence wrapper
│   │
│   ├── security/
│   │   └── androidNativeBridge.js# ANDROID_NATIVE_INTEGRATION blueprint
│   │
│   ├── App.jsx                   # Root application state & router
│   ├── main.jsx                  # React 19 entrypoint
│   └── index.css                 # Dark Cyber Navy theme & Tailwind styles
```

---

## 🤖 Android Native Integration (Capacitor Roadmap)

The codebase is prepared for direct conversion into an Android APK using [Capacitor](https://capacitorjs.com/).

### Documented Native Bridges (`androidNativeBridge.js`):
1. **Installed Applications:**
   - Android API: `android.content.pm.PackageManager` (`GET_PERMISSIONS`, `GET_SIGNING_CERTIFICATES`)
   - Native Hook: `pm.getInstalledPackages()` feeds directly into `threatEngine.evaluateApp()`.
2. **Accessibility & Overlays:**
   - Android API: `Settings.Secure.getString(contentResolver, ENABLED_ACCESSIBILITY_SERVICES)`
   - Checks `Settings.canDrawOverlays(context)`.
3. **Google Play Integrity:**
   - Library: `com.google.android.play:integrity:1.3.0` for bootloader lock and hardware attestation.
4. **SMS / Notification Phishing Interceptor:**
   - Android `NotificationListenerService` parses incoming SMS/WhatsApp URLs into `urlScannerService.scanUrl()` prior to user navigation.
5. **Background Monitoring:**
   - Android `WorkManager` & `ForegroundService` with low-power wakelocks.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ or 20+ LTS
- npm 9+

### 2. Local Development
```bash
# Navigate to project directory
cd on-device-threat-guard

# Install dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev
```
Open your browser to `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
```
The optimized bundle will be compiled to `dist/`.

### 4. Android APK Packaging with Capacitor
To convert into an installable Android APK:
```bash
# 1. Install Capacitor CLI and Android platform
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize Capacitor project
npx cap init "On-Device Threat Guard" "com.bca.threatguard" --web-dir dist

# 3. Build production web bundle
npm run build

# 4. Add Android native platform
npx cap add android

# 5. Sync web code into Android Studio project
npx cap sync android

# 6. Open project in Android Studio to build APK
npx cap open android
```

---

## 🔒 Security & Privacy Ethics

- **No False Claims:** We explicitly refrain from claiming *"100% virus protection"* or *"Absolute immunity"*. Detection is accurately characterized as **"Heuristic Risk Assessment"**.
- **No Cloud Exfiltration:** User files, device contacts, or URLs are never transmitted without explicit user consent.
- **Demo Mode Transparency:** Demo data sets are clearly marked with an active **`DEMO MODE ACTIVE`** header badge so evaluation data is not mistaken for live system root privileges.

---

## 🎓 BCA Project Defense & Presentation Tips
- **Demonstrate the "Why is this risky?" feature:** Show the examiners how the app breaks down the combination of *Accessibility + Screen Overlay* in flashlight tools as a common banking trojan tactic.
- **Test URL Scanner with the presets:** Click the *Phishing OTP Interceptor* sample to showcase how homographs and unencrypted raw IPs trigger alerts.
- **Run the On-Device File Scanner:** Select any test file or APK to show local SHA-256 calculation happening instantly in browser memory without network traffic.
- **Generate the Security Report:** Click *Print / Generate PDF Report* to demonstrate compliance-ready reporting for academic grading.
