require('dotenv').config();
const { rawQuery, query } = require('../config/db');

async function test() {
  console.log('\n🧪 Testing DB connection...\n');

  // Test 1: basic
  const r1 = await rawQuery("SELECT TOP 3 id, title FROM links WHERE status = 'approved'", []);
  console.log('✅ Test 1 — basic query:', r1.recordset.map(x => x.title));

  // Test 2: category filter
  const r2 = await rawQuery(
    "SELECT TOP 3 l.title FROM links l JOIN categories c ON c.id = l.category_id WHERE c.slug = ? AND l.status = 'approved'",
    ['javascript']
  );
  console.log('✅ Test 2 — category filter (javascript):', r2.recordset.map(x => x.title));

  // Test 3: categories list
  const r3 = await rawQuery('SELECT name, slug, COUNT(l.id) AS cnt FROM categories c LEFT JOIN links l ON l.category_id = c.id AND l.status = \'approved\' GROUP BY c.name, c.slug ORDER BY cnt DESC', []);
  console.log('✅ Test 3 — categories:', r3.recordset.length, 'found');
  r3.recordset.forEach(c => console.log(`   ${c.cnt} — ${c.slug}`));

  // Test 4: named params via rawQuery with OFFSET
  const r4 = await rawQuery(
    "SELECT title FROM links WHERE status = 'approved' ORDER BY vote_score DESC OFFSET ? ROWS FETCH NEXT ? ROWS ONLY",
    [0, 2]
  );
  console.log('✅ Test 4 — pagination:', r4.recordset.map(x => x.title));

  console.log('\n✅ All tests passed!\n');
  process.exit(0);
}

test().catch(err => {
  console.error('\n❌ Test failed:', err.message);
  process.exit(1);
});
