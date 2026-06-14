/**
 * Fills the 3 empty categories with real curated links.
 * Run: node server/scripts/seed_empty_cats.js
 */
require('dotenv').config();
const { rawQuery, testConnection } = require('../config/db');

// [title, url, description, category_slug, vote_score, tags[]]
const links = [

  // ── JAVASCRIPT RESOURCES ──────────────────────────────────────────────
  ['You Don\'t Know JS (Book Series)', 'https://github.com/getify/You-Dont-Know-JS',
   'Free book series diving deep into JavaScript mechanics — 180k+ stars',
   'javascript', 98, ['javascript','tutorial','free','open-source','advanced']],

  ['Node.js Official Docs',           'https://nodejs.org/en/docs',
   'Official Node.js documentation — APIs, guides, and changelogs',
   'javascript', 91, ['javascript','nodejs','tutorial','backend']],

  ['Vue.js Docs',                     'https://vuejs.org',
   'The progressive JavaScript framework — excellent documentation',
   'javascript', 90, ['javascript','frontend','tutorial','free']],

  ['React Official Docs',             'https://react.dev',
   'The new official React documentation with interactive examples',
   'javascript', 96, ['javascript','react','frontend','tutorial']],

  ['Next.js Docs',                    'https://nextjs.org/docs',
   'The React framework for production — official docs',
   'javascript', 94, ['javascript','react','frontend','fullstack']],

  ['Svelte',                          'https://svelte.dev',
   'Cybernetically enhanced web apps — no virtual DOM',
   'javascript', 89, ['javascript','frontend','tool','free']],

  ['Vite',                            'https://vitejs.dev',
   'Next generation frontend tooling — blazing fast dev server',
   'javascript', 93, ['javascript','frontend','tool','performance']],

  ['Lodash',                          'https://lodash.com',
   'A modern JavaScript utility library delivering modularity and performance',
   'javascript', 85, ['javascript','tool','frontend','backend']],

  ['Axios',                           'https://axios-http.com',
   'Promise-based HTTP client for the browser and Node.js',
   'javascript', 87, ['javascript','api','frontend','nodejs']],

  ['TypeScript Handbook',             'https://www.typescriptlang.org/docs/handbook',
   'The official TypeScript handbook — from basics to advanced types',
   'javascript', 95, ['javascript','tutorial','frontend','backend']],

  ['Zod',                             'https://zod.dev',
   'TypeScript-first schema validation with static type inference',
   'javascript', 88, ['javascript','tool','backend','frontend']],

  ['Bun',                             'https://bun.sh',
   'All-in-one JavaScript runtime — faster than Node.js',
   'javascript', 91, ['javascript','nodejs','tool','performance']],

  ['Deno',                            'https://deno.com',
   'A modern runtime for JavaScript and TypeScript — secure by default',
   'javascript', 86, ['javascript','nodejs','tool','security']],

  ['Socket.io Docs',                  'https://socket.io/docs',
   'Official Socket.io documentation for real-time web apps',
   'javascript', 83, ['javascript','nodejs','backend','web']],

  ['npm Trends',                      'https://npmtrends.com',
   'Compare npm package download stats over time',
   'javascript', 82, ['javascript','tool','free','web']],

  // ── DATABASE & BACKEND ────────────────────────────────────────────────
  ['PostgreSQL Docs',                 'https://www.postgresql.org/docs',
   'Official PostgreSQL documentation — the world\'s most advanced open source database',
   'backend', 93, ['database','backend','tutorial','free']],

  ['Prisma',                          'https://www.prisma.io',
   'Next-generation Node.js and TypeScript ORM',
   'backend', 92, ['database','backend','nodejs','tool']],

  ['Drizzle ORM',                     'https://orm.drizzle.team',
   'Lightweight TypeScript ORM that feels like writing SQL',
   'backend', 88, ['database','backend','javascript','tool']],

  ['Redis Docs',                      'https://redis.io/docs',
   'Official Redis documentation — in-memory data store',
   'backend', 90, ['database','backend','performance','tool']],

  ['MongoDB Docs',                    'https://www.mongodb.com/docs',
   'Official MongoDB documentation — NoSQL document database',
   'backend', 87, ['database','backend','tutorial']],

  ['Supabase Docs',                   'https://supabase.com/docs',
   'Open source Firebase alternative — Postgres + Auth + Storage',
   'backend', 94, ['database','backend','free','open-source']],

  ['PlanetScale',                     'https://planetscale.com',
   'MySQL-compatible serverless database platform — free tier',
   'backend', 85, ['database','backend','cloud','free']],

  ['Neon DB',                         'https://neon.tech',
   'Serverless Postgres with a generous free tier',
   'backend', 86, ['database','backend','cloud','free']],

  ['Express.js Guide',                'https://expressjs.com/en/guide/routing.html',
   'Official Express.js routing and middleware guide',
   'backend', 88, ['backend','nodejs','tutorial','javascript']],

  ['Fastify',                         'https://fastify.dev',
   'Fast and low overhead web framework for Node.js',
   'backend', 87, ['backend','nodejs','javascript','performance']],

  ['Hono',                            'https://hono.dev',
   'Ultrafast web framework for the Edges — works on Cloudflare Workers',
   'backend', 85, ['backend','javascript','performance','cloud']],

  ['tRPC',                            'https://trpc.io',
   'End-to-end typesafe APIs made easy — no code generation',
   'backend', 89, ['backend','javascript','typescript','fullstack']],

  ['GraphQL Docs',                    'https://graphql.org/learn',
   'Official GraphQL learning guide — query language for APIs',
   'backend', 86, ['backend','api','tutorial','javascript']],

  ['DB Diagram',                      'https://dbdiagram.io',
   'Free online database diagram tool — design your schema visually',
   'backend', 84, ['database','tool','free','visualization']],

  ['SQL Zoo',                         'https://sqlzoo.net',
   'Learn SQL interactively — free exercises for all levels',
   'backend', 82, ['database','tutorial','free','beginner']],

  ['Turso',                           'https://turso.tech',
   'SQLite for production — edge database with free tier',
   'backend', 83, ['database','backend','cloud','free']],

  // ── DESIGN INSPIRATION ────────────────────────────────────────────────
  ['Awwwards',                        'https://www.awwwards.com',
   'Award-winning website designs — the best of web design inspiration',
   'design-inspiration', 95, ['design','ui','web','inspiration']],

  ['Dribbble',                        'https://dribbble.com',
   'Design inspiration from the world\'s top designers',
   'design-inspiration', 93, ['design','ui','ux','inspiration']],

  ['Behance',                         'https://www.behance.net',
   'Showcase and discover creative work — Adobe\'s design platform',
   'design-inspiration', 91, ['design','ui','ux','inspiration']],

  ['Land-book',                       'https://land-book.com',
   'Curated gallery of the best landing page designs',
   'design-inspiration', 88, ['design','ui','web','inspiration']],

  ['Lapa Ninja',                      'https://www.lapa.ninja',
   'The best landing page design inspiration — 6000+ examples',
   'design-inspiration', 87, ['design','ui','web','inspiration']],

  ['Godly Website',                   'https://godly.website',
   'Astronomically good web design inspiration',
   'design-inspiration', 86, ['design','ui','web','inspiration']],

  ['Muzli Design Inspiration',        'https://muz.li',
   'Designer\'s go-to source for design inspiration — browser extension',
   'design-inspiration', 85, ['design','ui','tool','inspiration']],

  ['Collect UI',                      'https://collectui.com',
   'Daily UI inspiration from dribbble — filtered by component',
   'design-inspiration', 84, ['design','ui','inspiration']],

  ['UI Patterns',                     'https://ui-patterns.com',
   'User interface design patterns library',
   'design-inspiration', 83, ['design','ui','ux','inspiration']],

  ['Screenlane',                      'https://screenlane.com',
   'Web and mobile UI design inspiration — updated daily',
   'design-inspiration', 82, ['design','ui','mobile','inspiration']],

  ['Pttrns',                          'https://www.pttrns.com',
   'Mobile UI patterns and design inspiration',
   'design-inspiration', 80, ['design','ui','mobile','inspiration']],

  ['SaaS Landing Page',               'https://saaslandingpage.com',
   'Discover the best landing page examples created by top-class SaaS companies',
   'design-inspiration', 81, ['design','ui','web','inspiration']],

  ['Minimal Gallery',                 'https://minimal.gallery',
   'Hand-picked collection of minimal website designs',
   'design-inspiration', 79, ['design','ui','web','inspiration']],

  ['Dark Design',                     'https://www.dark.design',
   'The best dark-themed website designs for inspiration',
   'design-inspiration', 83, ['design','ui','web','inspiration']],

  ['Fonts In Use',                    'https://fontsinuse.com',
   'A searchable archive of typographic design — real-world font usage',
   'design-inspiration', 78, ['design','typography','inspiration']],
];

async function run() {
  console.log('🌱 Seeding empty categories...\n');
  await testConnection();

  // Ensure all tags exist
  const allTags = [...new Set(links.flatMap(l => l[5]))];
  for (const tag of allTags) {
    await rawQuery(
      "IF NOT EXISTS (SELECT 1 FROM tags WHERE name = ?) INSERT INTO tags (name) VALUES (?)",
      [tag, tag]
    );
  }
  console.log(`✓ ${allTags.length} tags ensured`);

  let inserted = 0;
  let skipped  = 0;

  for (const [title, url, description, catSlug, score, linkTags] of links) {
    // Skip duplicates
    const exists = await rawQuery('SELECT id FROM links WHERE url = ?', [url]);
    if (exists.recordset.length > 0) { skipped++; continue; }

    // Get category id
    const catResult = await rawQuery('SELECT id FROM categories WHERE slug = ?', [catSlug]);
    const categoryId = catResult.recordset[0]?.id || null;

    // Insert link
    const linkResult = await rawQuery(
      `INSERT INTO links (title, url, description, category_id, submitted_by, status, vote_score)
       OUTPUT INSERTED.id
       VALUES (?, ?, ?, ?, 1, 'approved', ?)`,
      [title, url, description, categoryId, score]
    );
    const linkId = linkResult.recordset[0].id;

    // Insert tags
    for (const tagName of linkTags) {
      await rawQuery(
        "IF NOT EXISTS (SELECT 1 FROM tags WHERE name = ?) INSERT INTO tags (name) VALUES (?)",
        [tagName, tagName]
      );
      await rawQuery(
        `INSERT INTO link_tags (link_id, tag_id)
         SELECT ?, id FROM tags WHERE name = ?
         AND NOT EXISTS (
           SELECT 1 FROM link_tags
           WHERE link_id = ? AND tag_id = (SELECT id FROM tags WHERE name = ?)
         )`,
        [linkId, tagName, linkId, tagName]
      );
    }

    inserted++;
    process.stdout.write(`\r   ✓ ${inserted} inserted, ${skipped} skipped`);
  }

  console.log(`\n\n✅ Done! ${inserted} links added across 3 categories.\n`);

  // Final count per category
  const result = await rawQuery(
    "SELECT c.name, COUNT(l.id) AS cnt FROM categories c LEFT JOIN links l ON l.category_id = c.id AND l.status = 'approved' GROUP BY c.name ORDER BY cnt DESC",
    []
  );
  console.log('📊 Final category counts:');
  result.recordset.forEach(r => console.log(`   ${r.cnt.toString().padStart(3)} links — ${r.name}`));

  process.exit(0);
}

run().catch(err => {
  console.error('\n❌ Failed:', err.message);
  process.exit(1);
});
