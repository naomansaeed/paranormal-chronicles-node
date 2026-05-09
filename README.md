# 🌑 Midnight Logs: Vanilla Node Supernatural Encounters Site

A structured learning project for mastering core Node.js fundamentals by building a routed site that serves static assets, exposes a JSON API, accepts user-submitted encounter logs, and streams real-time updates via Server-Sent Events (SSE).

## 📌 Project Objectives
- [x] Initialize vanilla Node HTTP server
- [ ] Serve static assets (`fs` + `path` + MIME mapping)
- [ ] Build `/api/encounters` REST endpoints (GET/POST)
- [ ] Parse & sanitize user input
- [ ] Implement `EventEmitter` + SSE for live feed
- [ ] Add error boundaries, logging, and graceful shutdown

## 🛠️ Tech Stack
- **Runtime:** Node.js (v20+)
- **Modules:** `http`, `fs`, `path`, `url`, `events`, `crypto`
- **Dependencies:** `sanitize-html` (for input safety), `mime-types` (optional)
- **No Express:** Pure vanilla architecture for deep runtime familiarity

## 📂 Directory Structure