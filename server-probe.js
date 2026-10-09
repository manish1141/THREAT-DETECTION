/**
 * ON-DEVICE THREAT GUARD - LOCAL HARDWARE & OS PROBE SERVER
 * 
 * Provides an on-device local HTTP telemetry endpoint (port 5174)
 * that queries your real Windows laptop host signals:
 * - Real Device Moniker, CPU, Memory, Hostname, and Windows Build
 * - Real Installed Applications (queried directly from Windows Registry)
 * - Real Running System Processes & Background Daemons (tasklist)
 * - Real Active Network Listening Sockets (netstat)
 * - Real Battery & Power state
 */

import http from 'http';
import os from 'os';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);
const PORT = 5174;

// Helper to sanitize command outputs safely
async function safeExec(cmd) {
  try {
    const { stdout } = await execAsync(cmd, { timeout: 3500 });
    return stdout;
  } catch (err) {
    return '';
  }
}

// 1. Query Real Installed Windows Apps via Registry
async function getRealInstalledApps() {
  const apps = [];
  try {
    const out = await safeExec('reg query HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall /s /v DisplayName');
    const lines = out.split('\n');
    const seen = new Set();

    for (const line of lines) {
      if (line.includes('DisplayName') && line.includes('REG_SZ')) {
        const parts = line.split('REG_SZ');
        if (parts.length > 1) {
          const appName = parts[1].trim();
          if (appName && !seen.has(appName)) {
            seen.add(appName);
            apps.push({
              name: appName,
              source: 'Verified Windows User Installation',
              category: 'Installed Application',
              version: 'Installed on Host',
              isRealHostApp: true
            });
          }
        }
      }
    }
  } catch (e) {
    console.error('Error fetching registry apps:', e);
  }

  // Also query 64-bit machine registry
  try {
    const out64 = await safeExec('reg query HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall /s /v DisplayName');
    const lines64 = out64.split('\n');
    for (const line of lines64) {
      if (line.includes('DisplayName') && line.includes('REG_SZ')) {
        const parts = line.split('REG_SZ');
        if (parts.length > 1) {
          const appName = parts[1].trim();
          if (appName && apps.length < 25 && !apps.some(a => a.name === appName)) {
            apps.push({
              name: appName,
              source: 'Windows System Program',
              category: 'System / Utility',
              version: 'Current',
              isRealHostApp: true
            });
          }
        }
      }
    }
  } catch (e) {}

  return apps;
}

// 2. Query Real Running Processes (tasklist)
async function getRealProcesses() {
  const procs = [];
  try {
    const out = await safeExec('tasklist /fo csv /nh');
    const lines = out.split('\n');
    const seen = new Set();

    for (const line of lines) {
      if (!line.trim()) continue;
      // Format: "Image Name","PID","Session Name","Session#","Mem Usage"
      const match = line.match(/^"([^"]+)","([^"]+)","([^"]+)","([^"]+)","([^"]+)"/);
      if (match) {
        const [_, name, pid, session, sessionNum, mem] = match;
        if (!seen.has(name) && procs.length < 30) {
          seen.add(name);
          procs.push({
            name,
            pid,
            session,
            memory: mem.trim()
          });
        }
      }
    }
  } catch (e) {
    console.error('Error fetching processes:', e);
  }
  return procs;
}

// 3. Query Real Network Sockets (netstat)
async function getRealNetworkSockets() {
  const sockets = [];
  try {
    const out = await safeExec('netstat -ano');
    const lines = out.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('TCP') && trimmed.includes('LISTENING')) {
        const parts = trimmed.split(/\s+/);
        if (parts.length >= 5 && sockets.length < 15) {
          sockets.push({
            protocol: parts[0],
            localAddress: parts[1],
            state: parts[3],
            pid: parts[4]
          });
        }
      }
    }
  } catch (e) {}
  return sockets;
}

const server = http.createServer(async (req, res) => {
  // CORS Headers for browser client
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/api/device-probe') {
    try {
      const [installedApps, processes, networkSockets] = await Promise.all([
        getRealInstalledApps(),
        getRealProcesses(),
        getRealNetworkSockets()
      ]);

      const totalMemBytes = os.totalmem();
      const freeMemBytes = os.freemem();
      const usedMemBytes = totalMemBytes - freeMemBytes;

      const payload = {
        timestamp: new Date().toISOString(),
        host: {
          hostname: os.hostname(),
          platform: os.platform(),
          release: os.release(),
          type: os.type(),
          arch: os.arch(),
          username: os.userInfo().username,
          cpusCount: os.cpus().length,
          cpuModel: os.cpus()[0]?.model || 'Processor',
          uptimeHours: (os.uptime() / 3600).toFixed(1),
          totalMemoryGb: (totalMemBytes / (1024 ** 3)).toFixed(1),
          freeMemoryGb: (freeMemBytes / (1024 ** 3)).toFixed(1),
          memoryUsagePct: Math.round((usedMemBytes / totalMemBytes) * 100)
        },
        installedApps,
        processes,
        networkSockets,
        realMode: true
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(payload));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[REAL HOST SENTINEL PROBE] Running on http://127.0.0.1:${PORT}/api/device-probe`);
});
