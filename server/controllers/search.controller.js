const { db } = require('../config/db');

exports.search = async (req, res) => {
  const { q, category, tag, sort, from, to, page = 1, limit = 20 } = req.query;

  const parsedLimit = Math.min(parseInt(limit) || 20, 50);
  const parsedPage  = Math.max(1, parseInt(page) || 1);
  const offset      = (parsedPage - 1) * parsedLimit;

  const where  = ["l.status = 'approved'"];
  const values = [];

  if (q) {
    where.push(`(l.title LIKE ? OR l.description LIKE ?)`);
    values.push(`%${q}%`, `%${q}%`);
  }
  if (category) {
    where.push(`c.slug = ?`);
    values.push(category);
  }
  if (tag) {
    where.push(`EXISTS (
      SELECT 1 FROM link_tags lt2
      JOIN tags t2 ON t2.id = lt2.tag_id
      WHERE lt2.link_id = l.id AND t2.name = ?
    )`);
    values.push(tag);
  }
  if (from) { where.push(`l.created_at >= ?`); values.push(from); }
  if (to)   { where.push(`l.created_at <= ?`); values.push(to); }

  const orderMap = {
    newest:        'l.created_at DESC',
    top:           'l.vote_score DESC',
    controversial: 'ABS(l.vote_score) ASC, l.created_at DESC',
  };
  const orderBy    = orderMap[sort] || 'l.vote_score DESC';
  const whereClause = where.join(' AND ');

  const baseSql = `
    FROM links l
    LEFT JOIN categories c  ON c.id  = l.category_id
    LEFT JOIN link_tags  lt ON lt.link_id = l.id
    LEFT JOIN tags       t  ON t.id  = lt.tag_id
    WHERE ${whereClause}`;

  try {
    const { total } = db.prepare(
      `SELECT COUNT(DISTINCT l.id) AS total ${baseSql}`
    ).get(...values);

    const rows = db.prepare(`
      SELECT l.id, l.title, l.url, l.description, l.category_id,
             l.submitted_by, l.status, l.vote_score,
             l.created_at, l.reviewed_at, l.reviewed_by,
             c.name AS category_name, c.slug AS category_slug,
             GROUP_CONCAT(DISTINCT t.name) AS tags
      ${baseSql}
      GROUP BY l.id
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `).all(...values, parsedLimit, offset);

    const results = rows.map(r => ({
      ...r, tags: r.tags ? r.tags.split(',').filter(Boolean) : [],
    }));

    res.json({ results, page: parsedPage, limit: parsedLimit, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
