const { db } = require('../config/db');

const LINK_SELECT = `
  SELECT l.id, l.title, l.url, l.description, l.category_id,
         l.submitted_by, l.status, l.vote_score,
         l.created_at, l.reviewed_at, l.reviewed_by,
         c.name AS category_name, c.slug AS category_slug,
         GROUP_CONCAT(DISTINCT t.name) AS tags
  FROM links l
  LEFT JOIN categories c  ON c.id  = l.category_id
  LEFT JOIN link_tags  lt ON lt.link_id = l.id
  LEFT JOIN tags       t  ON t.id  = lt.tag_id`;

function parseTags(row) {
  return { ...row, tags: row.tags ? row.tags.split(',').filter(Boolean) : [] };
}

// GET /api/links
exports.getAll = async (req, res) => {
  const page   = Math.max(1, parseInt(req.query.page)  || 1);
  const limit  = Math.min(parseInt(req.query.limit) || 20, 50);
  const offset = (page - 1) * limit;

  try {
    const rows = db.prepare(`
      ${LINK_SELECT}
      WHERE l.status = 'approved'
      GROUP BY l.id
      ORDER BY l.vote_score DESC, l.created_at DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset);

    const { total } = db.prepare(
      `SELECT COUNT(*) AS total FROM links WHERE status = 'approved'`
    ).get();

    res.json({ results: rows.map(parseTags), page, limit, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/links/:id
exports.getOne = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const row = db.prepare(`
      ${LINK_SELECT}
      WHERE l.id = ?
      GROUP BY l.id
    `).get(id);
    if (!row) return res.status(404).json({ error: 'Link not found' });
    res.json(parseTags(row));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/links
exports.submit = async (req, res) => {
  const { title, url, description, category_id, tags } = req.body;
  const submitted_by = req.user.id;
  if (!title || !url)
    return res.status(400).json({ error: 'title and url are required' });

  try {
    const info = db.prepare(
      `INSERT INTO links (title, url, description, category_id, submitted_by)
       VALUES (?, ?, ?, ?, ?)`
    ).run(title, url, description || null, category_id ? parseInt(category_id) : null, submitted_by);

    const link = db.prepare(
      'SELECT id, title, url, status, created_at FROM links WHERE id = ?'
    ).get(info.lastInsertRowid);

    if (Array.isArray(tags) && tags.length > 0) {
      const upsertTag  = db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)');
      const getTag     = db.prepare('SELECT id FROM tags WHERE name = ?');
      const insertLT   = db.prepare('INSERT OR IGNORE INTO link_tags (link_id, tag_id) VALUES (?, ?)');

      for (const tagName of tags) {
        const clean = tagName.toLowerCase().trim();
        upsertTag.run(clean);
        const tag = getTag.get(clean);
        if (tag) insertLT.run(link.id, tag.id);
      }
    }

    res.status(201).json({ message: 'Link submitted and pending review', link });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
