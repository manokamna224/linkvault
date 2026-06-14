/**
 * db.js — SQLite via better-sqlite3
 *
 * Provides the same rawQuery / query / testConnection interface
 * as the previous SQL Server version so all controllers work unchanged.
 */
const Database = require('better-sqlite3');
const path     = require('path');
const fs       = require('fs');

// Railway volumes mount at /data by default; fallback to local data/ for dev
const DB_DIR  = process.env.RAILWAY_VOLUME_MOUNT_PATH
  ? process.env.RAILWAY_VOLUME_MOUNT_PATH
  : path.join(__dirname, '..', '..', 'data');
const DB_PATH = path.join(DB_DIR, 'linkvault.db');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const db = new Database(DB_PATH);

// Performance pragmas
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Bootstrap schema ─────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT NOT NULL UNIQUE,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'user',
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL UNIQUE,
    slug        TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS links (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT NOT NULL,
    url          TEXT NOT NULL,
    description  TEXT,
    category_id  INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    submitted_by INTEGER REFERENCES users(id)      ON DELETE SET NULL,
    status       TEXT NOT NULL DEFAULT 'pending',
    vote_score   INTEGER NOT NULL DEFAULT 0,
    created_at   TEXT NOT NULL DEFAULT (datetime('now')),
    reviewed_at  TEXT,
    reviewed_by  INTEGER REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS tags (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS link_tags (
    link_id INTEGER NOT NULL REFERENCES links(id) ON DELETE CASCADE,
    tag_id  INTEGER NOT NULL REFERENCES tags(id),
    PRIMARY KEY (link_id, tag_id)
  );

  CREATE TABLE IF NOT EXISTS votes (
    user_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    link_id  INTEGER NOT NULL REFERENCES links(id) ON DELETE CASCADE,
    type     TEXT NOT NULL CHECK (type IN ('up','down')),
    voted_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, link_id)
  );

  CREATE INDEX IF NOT EXISTS IX_links_status     ON links(status);
  CREATE INDEX IF NOT EXISTS IX_links_vote_score ON links(vote_score DESC);
  CREATE INDEX IF NOT EXISTS IX_votes_link       ON votes(link_id);
`);

// ── Seed default data if empty ────────────────────────────────────────────
const catCount = db.prepare('SELECT COUNT(*) AS n FROM categories').get();
if (catCount.n === 0) {
  const insertCat = db.prepare(
    'INSERT OR IGNORE INTO categories (name, slug, description) VALUES (?,?,?)'
  );
  [
    ['Figma Templates for Beginners', 'figma-templates', 'Curated Figma templates perfect for beginners'],
    ['AI Prompts for Engineers',      'ai-prompts',      'Curated AI prompts tailored for software engineers'],
    ['Free Dev Tools',                'free-dev-tools',  'Free tools every developer should know about'],
    ['UI/UX Resources',               'ui-ux-resources', 'Design systems, references, and inspiration'],
    ['Learning Resources',            'learning',        'Tutorials, courses, and documentation'],
  ].forEach(r => insertCat.run(...r));
}

const userCount = db.prepare('SELECT COUNT(*) AS n FROM users').get();
if (userCount.n === 0) {
  // Password: admin123  (bcrypt 12 rounds)
  db.prepare(
    `INSERT OR IGNORE INTO users (username, email, password_hash, role)
     VALUES ('admin','admin@linkvault.dev',
     '$2b$12$09VJPYQFRsNMBTuE1Q./4eXhgEio8UKoCB9My8j79O6pBfQJ24/TO','admin')`
  ).run();
}

console.log(`[DB] SQLite connected → ${DB_PATH}`);

// ── Query helpers (same API as the old SQL Server version) ────────────────

/**
 * rawQuery(sql, paramsArray) → { recordset: rows[] }
 * Handles SELECT (returns rows) and INSERT/UPDATE/DELETE (returns affected info).
 */
function rawQuery(sql, params = []) {
  const trimmed = sql.trim().toUpperCase();

  if (trimmed.startsWith('SELECT')) {
    const rows = db.prepare(sql).all(...params);
    return Promise.resolve({ recordset: rows });
  }

  // INSERT — return the inserted row by last_insert_rowid
  if (trimmed.startsWith('INSERT')) {
    const info = db.prepare(sql).run(...params);
    const insertedId = info.lastInsertRowid;

    // Try to figure out which table was inserted into
    const tableMatch = sql.match(/INSERT\s+(?:OR\s+\w+\s+)?INTO\s+(\w+)/i);
    if (tableMatch && insertedId) {
      const table = tableMatch[1];
      try {
        const row = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(insertedId);
        return Promise.resolve({ recordset: row ? [row] : [], lastInsertRowid: insertedId });
      } catch (_) {}
    }
    return Promise.resolve({ recordset: [], lastInsertRowid: insertedId });
  }

  // UPDATE / DELETE
  const info = db.prepare(sql).run(...params);
  return Promise.resolve({ recordset: [], changes: info.changes });
}

/**
 * query(sql, namedParams) — named @param style (kept for compatibility)
 */
function query(sqlText, params = {}) {
  const values   = [];
  const converted = sqlText.replace(/@(\w+)/g, (_, name) => {
    values.push(
      Object.prototype.hasOwnProperty.call(params, name)
        ? (params[name].value ?? null)
        : null
    );
    return '?';
  });
  return rawQuery(converted, values);
}

async function testConnection() {
  db.prepare('SELECT 1').get();
}

module.exports = { db, query, rawQuery, testConnection };
