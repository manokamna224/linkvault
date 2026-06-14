const { db } = require('../config/db');
const socketConfig = require('../config/socket');

exports.castVote = async (req, res) => {
  const linkId = parseInt(req.params.id);
  const { type } = req.body;
  const userId = req.user.id;

  if (!['up', 'down'].includes(type))
    return res.status(400).json({ error: "type must be 'up' or 'down'" });

  try {
    const existing = db.prepare(
      'SELECT type FROM votes WHERE user_id = ? AND link_id = ?'
    ).get(userId, linkId);

    if (!existing) {
      db.prepare('INSERT INTO votes (user_id, link_id, type) VALUES (?, ?, ?)').run(userId, linkId, type);
    } else if (existing.type === type) {
      // Toggle off — remove vote
      db.prepare('DELETE FROM votes WHERE user_id = ? AND link_id = ?').run(userId, linkId);
    } else {
      db.prepare('UPDATE votes SET type = ? WHERE user_id = ? AND link_id = ?').run(type, userId, linkId);
    }

    // Recalculate score
    const { ups }   = db.prepare(`SELECT COUNT(*) AS ups   FROM votes WHERE link_id = ? AND type = 'up'`).get(linkId);
    const { downs } = db.prepare(`SELECT COUNT(*) AS downs FROM votes WHERE link_id = ? AND type = 'down'`).get(linkId);
    const newScore  = ups - downs;

    db.prepare('UPDATE links SET vote_score = ? WHERE id = ?').run(newScore, linkId);

    try { socketConfig.getIO().emit('vote_update', { linkId, score: newScore }); } catch (_) {}

    res.json({ success: true, score: newScore });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
