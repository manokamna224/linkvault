const { db } = require('../config/db');

const QUEUE_SELECT = `
  SELECT l.id, l.title, l.url, l.description, l.category_id,
         l.submitted_by, l.status, l.vote_score,
         l.created_at, l.reviewed_at, l.reviewed_by,
         u.username AS submitted_by_username,
         c.name AS category_name,
         GROUP_CONCAT(DISTINCT t.name) AS tags
  FROM links l
  LEFT JOIN users      u  ON u.id  = l.submitted_by
  LEFT JOIN categories c  ON c.id  = l.category_id
  LEFT JOIN link_tags  lt ON lt.link_id = l.id
  LEFT JOIN tags       t  ON t.id  = lt.tag_id`;

function parseTags(row) {
  return { ...row, tags: row.tags ? row.tags.split(',').filter(Boolean) : [] };
}

exports.getQueue = async (req, res) => {
  const page   = Math.max(1, parseInt(req.query.page)  || 1);
  const limit  = Math.min(parseInt(req.query.limit) || 20, 50);
  const offset = (page - 1) * limit;

  try {
    const rows = db.prepare(`
      ${QUEUE_SELECT}
      WHERE l.status = 'pending'
      GROUP BY l.id
      ORDER BY l.created_at ASC
      LIMIT ? OFFSET ?
    `).all(limit, offset);

    const { total } = db.prepare(
      `SELECT COUNT(*) AS total FROM links WHERE status = 'pending'`
    ).get();

    res.json({ results: rows.map(parseTags), page, limit, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approveLink = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const info = db.prepare(
      `UPDATE links SET status = 'approved', reviewed_at = datetime('now'), reviewed_by = ?
       WHERE id = ? AND status = 'pending'`
    ).run(req.user.id, id);

    if (info.changes === 0)
      return res.status(404).json({ error: 'Link not found or already reviewed' });

    const link = db.prepare('SELECT id, title, status FROM links WHERE id = ?').get(id);
    res.json({ message: 'Link approved', link });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.rejectLink = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const info = db.prepare(
      `UPDATE links SET status = 'rejected', reviewed_at = datetime('now'), reviewed_by = ?
       WHERE id = ? AND status = 'pending'`
    ).run(req.user.id, id);

    if (info.changes === 0)
      return res.status(404).json({ error: 'Link not found or already reviewed' });

    const link = db.prepare('SELECT id, title, status FROM links WHERE id = ?').get(id);
    res.json({ message: 'Link rejected', link });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteLink = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const info = db.prepare('DELETE FROM links WHERE id = ?').run(id);
    if (info.changes === 0) return res.status(404).json({ error: 'Link not found' });
    res.json({ message: 'Link deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT
        SUM(CASE WHEN status = 'pending'  THEN 1 ELSE 0 END) AS pending_count,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approved_count,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejected_count
      FROM links
    `).get();

    const { total_users } = db.prepare('SELECT COUNT(*) AS total_users FROM users').get();
    const { total_votes } = db.prepare('SELECT COUNT(*) AS total_votes FROM votes').get();

    res.json({ ...stats, total_users, total_votes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
