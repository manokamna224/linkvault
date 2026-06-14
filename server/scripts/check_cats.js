require('dotenv').config();
const { rawQuery } = require('../config/db');

rawQuery(
  "SELECT c.name, c.slug, COUNT(l.id) AS cnt FROM categories c LEFT JOIN links l ON l.category_id = c.id AND l.status = 'approved' GROUP BY c.name, c.slug ORDER BY cnt ASC",
  []
).then(r => {
  r.recordset.forEach(c => console.log(`${c.cnt} links | ${c.slug} | ${c.name}`));
  process.exit(0);
}).catch(e => { console.error(e.message); process.exit(1); });
