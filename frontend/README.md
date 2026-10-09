# ON-DEVICE THREAT GUARD - FRONTEND CLIENT
> **React + Vite + Tailwind CSS Cybersecurity Dashboard**

---

## 🎯 Architecture
Contains all React components, dashboard views, heuristic threat engines, and local Web Crypto SHA-256 calculation workers.

- `/src/components`: UI components (Score meter, threat modals, navigation bars)
- `/src/pages`: 11 security view modules (Dashboard, Monitoring, Apps, Perms, URL, File, Threats, History, Reports, Safety Academy, Settings)
- `/src/services`: Decoupled threat engine & risk scoring services
- `/src/security`: Capacitor Android Native bridge documentation

## 🚀 How to Run Frontend Independently:
```bash
cd frontend
npm install
npm run dev
```
Access at: `http://localhost:5173/`
