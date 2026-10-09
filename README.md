# ON-DEVICE THREAT GUARD (SEPARATED ARCHITECTURE)
> **"Your Device. Your Security. Your Control."**  
> *Production-Style Modular Architecture for BCA Cybersecurity Project & Viva Presentation*

---

## 📁 Clean Separated Directory Structure

```text
on-device-threat-guard/
│
├── 📂 frontend/                  <--- [FRONTEND REPOSITORY]
│   ├── index.html                # HTML5 root with security shield branding
│   ├── package.json              # Frontend dependencies (React 19, Lucide, Tailwind, Vitest)
│   ├── vite.config.js            # Vite + Tailwind compiler configuration
│   ├── README.md                 # Frontend-specific architecture documentation
│   ├── public/                   # Static assets & cyber icons
│   └── src/
│       ├── components/           # Reusable UI widgets (Score meters, modals, navigation)
│       ├── pages/                # 11 Modular security views (Dashboard, Apps, Perms, URL, File, etc.)
│       ├── services/             # Client-side heuristic rules, threat engine & local storage
│       ├── security/             # Capacitor Android Native bridge blueprint
│       ├── App.jsx               # Root client controller
│       ├── main.jsx              # Application bootstrap
│       └── index.css             # Glassmorphic dark cyber theme
│
├── 📂 backend/                   <--- [BACKEND REPOSITORY]
│   ├── server.js                 # Local Hardware & OS Telemetry Daemon (Port 5174)
│   ├── package.json              # Backend metadata & start scripts
│   └── README.md                 # Backend API documentation
│
├── 📂 docs/                      <--- [DOCUMENTATION & REPORTS]
│   ├── PROJECT_REPORT.md         # Comprehensive project documentation & defense dossier
│   └── VIVA_QUESTIONS.md         # Common viva examiner questions & answers
│
├── 📂 scripts/                   <--- [LAUNCHERS & UTILITIES]
│   ├── start-all.bat             # 1-Click launcher for both services
│   └── stop-all.bat              # 1-Click service terminator
│
└── README.md                     # Master project overview
```

---

## ⚡ How to Run Each Service Separately

### 1. Run the Backend Only
```bash
cd backend
npm start
```
- Listens on `http://127.0.0.1:5174/api/device-probe`
- Queries live Windows Registry software, running processes, and network sockets.

### 2. Run the Frontend Only
```bash
cd frontend
npm run dev
```
- Accessible at `http://localhost:5173`
- Evaluates threats, runs Web Crypto SHA-256 in browser, and provides full dashboard UI.

### 3. Run Everything in 1-Click
Simply double-click **`START_THREAT_GUARD.bat`** on your **Desktop**.
