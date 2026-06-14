const { db } = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT c.id, c.name, c.slug, c.description,
             COUNT(l.id) AS link_count
      FROM categories c
      LEFT JOIN links l ON l.category_id = c.id AND l.status = 'approved'
      GROUP BY c.id
      ORDER BY link_count DESC, c.name ASC
    `).all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
