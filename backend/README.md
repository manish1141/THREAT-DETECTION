# ON-DEVICE THREAT GUARD - BACKEND SERVICE
> **Local Hardware & OS Telemetry Daemon**

---

## 🎯 Purpose
The backend runs locally on port `5174` and provides an on-device HTTP endpoint (`/api/device-probe`) that queries:
- **Real Windows Registry Software:** Inspects user and machine `Uninstall` keys.
- **Active System Processes:** Streams running Windows task executables (tasklist).
- **Listening TCP Sockets:** Monitored via `netstat -ano`.
- **System Metrics:** Hostname, RAM usage, CPU core counts, and platform uptime.

## 🚀 How to Run Backend Independently:
```bash
cd backend
npm start
```
Endpoint: `http://127.0.0.1:5174/api/device-probe`
