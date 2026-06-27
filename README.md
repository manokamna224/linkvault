# LinkVault — Crowdsourced Link Repository

Lightweight full-stack web application for discovering, submitting, and voting on curated links.

**Stack:** Node.js · Express · SQLite · Vanilla JS · Socket.io

## Features
- **Curated Links:** 150+ hand-picked developer and designer resources.
- **Real-time Voting:** Upvote and downvote links with live updates via WebSockets.
- **Search & Filter:** Multi-layer search by keyword, category, or tag.
- **Moderation:** Submission queue for quality control.
- **Dark Mode:** Built-in theme support with persistent preferences.

## Prerequisites
- Node.js 20+
- SQLite (auto-configured via `better-sqlite3`)

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` to set your `JWT_SECRET`.

3. **Start the server**
   ```bash
   npm start
   ```
   The database will be automatically created and seeded on the first run.

4. **Access the app**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Default | Description |
|---|---:|---|
| PORT | 3000 | HTTP port |
| JWT_SECRET | — | Secret for signing JWTs |
| JWT_EXPIRES_IN | `7d` | JWT expiry |

## Default Admin Account
- **Email:** `admin@linkvault.dev`
- **Password:** `admin123`

## License
MIT

link - https://linkvault-production-ba6e.up.railway.app/
