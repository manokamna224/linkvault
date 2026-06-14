/**
 * seed_sqlite.js — Seeds all 140+ curated links into the SQLite database.
 * Run: node server/scripts/seed_sqlite.js
 */
require('dotenv').config();
const { db } = require('../config/db');

// ── Categories ────────────────────────────────────────────────────────────
const categories = [
  { name: 'Figma Templates for Beginners', slug: 'figma-templates',    description: 'Curated Figma templates perfect for beginners' },
  { name: 'AI Prompts for Engineers',      slug: 'ai-prompts',         description: 'Curated AI prompts tailored for software engineers' },
  { name: 'Free Dev Tools',                slug: 'free-dev-tools',     description: 'Free tools every developer should know about' },
  { name: 'UI/UX Resources',               slug: 'ui-ux-resources',    description: 'Design systems, references, and inspiration' },
  { name: 'Learning Resources',            slug: 'learning',           description: 'Tutorials, courses, and documentation' },
  { name: 'Free Public APIs',              slug: 'free-apis',          description: 'Free APIs you can use in your projects right now' },
  { name: 'Developer Productivity',        slug: 'productivity',       description: 'Tools and tips to ship faster' },
  { name: 'Open Source Projects',          slug: 'open-source',        description: 'Awesome open source repos worth starring' },
  { name: 'CSS & Animations',              slug: 'css-animations',     description: 'CSS tricks, animations, and visual magic' },
  { name: 'JavaScript Resources',          slug: 'javascript',         description: 'JS libraries, guides, and tools' },
  { name: 'Database & Backend',            slug: 'backend',            description: 'Backend frameworks, DB tools, and APIs' },
  { name: 'DevOps & Cloud',                slug: 'devops',             description: 'CI/CD, Docker, Kubernetes, and cloud tools' },
  { name: 'Interview Prep',                slug: 'interview-prep',     description: 'Coding interview practice and resources' },
  { name: 'Design Inspiration',            slug: 'design-inspiration', description: 'Websites and galleries for design ideas' },
];

// ── Tags ──────────────────────────────────────────────────────────────────
const tags = [
  'free','beginner','advanced','ai','design','productivity','open-source','tutorial',
  'tool','template','api','javascript','python','css','react','nodejs','database',
  'devops','docker','cloud','interview','algorithm','animation','figma','ui','ux',
  'backend','frontend','fullstack','security','testing','performance','web','cli',
  'git','linux','chatgpt','llm','machine-learning','data-science','visualization',
  'inspiration','typography','mobile',
];

// ── Links: [title, url, description, category_slug, vote_score, tags[]] ──
const links = [
  // FREE PUBLIC APIs
  ['Public APIs Directory',    'https://publicapis.dev',                      'Searchable directory of 1400+ free public APIs',                 'free-apis', 95, ['api','free','tool']],
  ['JSONPlaceholder',          'https://jsonplaceholder.typicode.com',         'Free fake REST API for testing and prototyping',                 'free-apis', 88, ['api','free','beginner','tool']],
  ['Open-Meteo Weather API',   'https://open-meteo.com',                      'Free weather API — no API key required',                         'free-apis', 82, ['api','free','web']],
  ['REST Countries',           'https://restcountries.com',                   'Get country data via REST API — completely free',                'free-apis', 79, ['api','free','beginner']],
  ['PokeAPI',                  'https://pokeapi.co',                          'Free RESTful Pokémon API — great for learning',                  'free-apis', 74, ['api','free','beginner','tutorial']],
  ['Open Library API',         'https://openlibrary.org/developers/api',      'Free book data API from Internet Archive',                       'free-apis', 68, ['api','free']],
  ['NASA Open APIs',           'https://api.nasa.gov',                        'Free NASA APIs — APOD, Mars Rover, Near Earth Objects',          'free-apis', 91, ['api','free','data-science']],
  ['CoinGecko API',            'https://www.coingecko.com/en/api',            'Free crypto price and market data API',                          'free-apis', 77, ['api','free','data-science']],
  ['The Dog API',              'https://thedogapi.com',                       'Free dog images and breed data API',                             'free-apis', 65, ['api','free','beginner']],
  ['Quotable API',             'https://quotable.io',                         'Free random quotes API — no key needed',                         'free-apis', 61, ['api','free','beginner']],
  ['IP Geolocation API',       'https://ipapi.co',                            'Free IP geolocation API — 1000 req/day free',                    'free-apis', 70, ['api','free','web']],
  ['ExchangeRate API',         'https://www.exchangerate-api.com',            'Free currency exchange rates API',                               'free-apis', 72, ['api','free']],

  // FREE DEV TOOLS
  ['Excalidraw',               'https://excalidraw.com',                      'Free open-source virtual whiteboard for sketching diagrams',     'free-dev-tools', 97, ['tool','free','open-source','design']],
  ['Ray.so',                   'https://ray.so',                              'Create beautiful images of your code — free',                    'free-dev-tools', 93, ['tool','free','design']],
  ['Carbon',                   'https://carbon.now.sh',                       'Create and share beautiful images of source code',               'free-dev-tools', 89, ['tool','free','design']],
  ['Regex101',                 'https://regex101.com',                        'Online regex tester and debugger with explanation',               'free-dev-tools', 94, ['tool','free','web']],
  ['Crontab Guru',             'https://crontab.guru',                        'The quick and simple cron schedule expression editor',            'free-dev-tools', 86, ['tool','free','devops']],
  ['Transform Tools',          'https://transform.tools',                     'Convert JSON to TypeScript, GraphQL, and more',                  'free-dev-tools', 83, ['tool','free','javascript']],
  ['Squoosh',                  'https://squoosh.app',                         'Free image compression tool by Google',                          'free-dev-tools', 80, ['tool','free','performance']],
  ['Bundlephobia',             'https://bundlephobia.com',                    'Find the cost of adding an npm package to your bundle',          'free-dev-tools', 78, ['tool','free','javascript','performance']],
  ['DevDocs',                  'https://devdocs.io',                          'All developer docs in one place — works offline',                'free-dev-tools', 96, ['tool','free','tutorial']],
  ['Hoppscotch',               'https://hoppscotch.io',                       'Open source API development ecosystem — Postman alternative',    'free-dev-tools', 91, ['tool','free','open-source','api']],
  ['tldr pages',               'https://tldr.sh',                             'Simplified man pages with practical examples',                   'free-dev-tools', 84, ['tool','free','cli','linux']],
  ['JSON Crack',               'https://jsoncrack.com',                       'Visualize JSON data as interactive graphs',                      'free-dev-tools', 87, ['tool','free','visualization']],
  ['Wappalyzer',               'https://www.wappalyzer.com',                  'Identify technologies used on any website',                      'free-dev-tools', 76, ['tool','free','web']],
  ['OverAPI',                  'https://overapi.com',                         'Collecting all cheat sheets in one place',                       'free-dev-tools', 82, ['tool','free','tutorial']],

  // LEARNING RESOURCES
  ['The Odin Project',         'https://www.theodinproject.com',              'Free full-stack web development curriculum',                     'learning', 98, ['tutorial','free','fullstack','beginner']],
  ['freeCodeCamp',             'https://www.freecodecamp.org',                'Free coding bootcamp with certifications',                       'learning', 97, ['tutorial','free','beginner','fullstack']],
  ['CS50 by Harvard',          'https://cs50.harvard.edu/x',                  'Harvard free intro to computer science — legendary course',      'learning', 99, ['tutorial','free','beginner','algorithm']],
  ['Roadmap.sh',               'https://roadmap.sh',                          'Developer roadmaps for every tech stack',                        'learning', 96, ['tutorial','free','fullstack']],
  ['MDN Web Docs',             'https://developer.mozilla.org',               'The definitive web development reference by Mozilla',            'learning', 95, ['tutorial','free','web','frontend']],
  ['JavaScript.info',          'https://javascript.info',                     'The modern JavaScript tutorial — from basics to advanced',       'learning', 94, ['tutorial','free','javascript']],
  ['Fireship.io',              'https://fireship.io',                         'Fast-paced, fun web dev tutorials and courses',                  'learning', 90, ['tutorial','web','javascript']],
  ['Exercism',                 'https://exercism.org',                        'Free coding exercises with mentorship in 60+ languages',         'learning', 88, ['tutorial','free','beginner']],
  ['MIT OpenCourseWare',       'https://ocw.mit.edu',                         'Free MIT course materials — CS, math, engineering',             'learning', 92, ['tutorial','free','advanced','algorithm']],
  ['Khan Academy Computing',   'https://www.khanacademy.org/computing',       'Free computer science courses for all levels',                   'learning', 86, ['tutorial','free','beginner']],
  ['Codecademy',               'https://www.codecademy.com',                  'Interactive coding lessons — free tier available',               'learning', 85, ['tutorial','beginner']],
  ['W3Schools',                'https://www.w3schools.com',                   'Web development tutorials and references',                       'learning', 83, ['tutorial','free','beginner','web']],

  // AI PROMPTS FOR ENGINEERS
  ['Awesome ChatGPT Prompts',  'https://prompts.chat',                        'Curated list of ChatGPT prompts for developers and creators',    'ai-prompts', 93, ['ai','chatgpt','free','tool']],
  ['OpenAI Cookbook',          'https://cookbook.openai.com',                 'Examples and guides for using the OpenAI API',                   'ai-prompts', 91, ['ai','api','chatgpt','tutorial']],
  ['LangChain Docs',           'https://python.langchain.com',                'Build LLM-powered apps with LangChain',                          'ai-prompts', 86, ['ai','llm','python','tutorial']],
  ['Hugging Face',             'https://huggingface.co',                      'The AI community — models, datasets, and spaces',                'ai-prompts', 94, ['ai','llm','machine-learning','free']],
  ['Ollama',                   'https://ollama.com',                          'Run LLMs locally on your machine — free and open source',        'ai-prompts', 89, ['ai','llm','free','open-source','tool']],
  ['PromptHero',               'https://prompthero.com',                      'Search millions of AI art and text prompts',                     'ai-prompts', 87, ['ai','chatgpt','design']],
  ['Google AI Studio',         'https://aistudio.google.com',                 'Free access to Gemini models via Google AI Studio',              'ai-prompts', 88, ['ai','llm','free','api']],
  ['Perplexity AI',            'https://www.perplexity.ai',                   'AI-powered search engine — free to use',                         'ai-prompts', 85, ['ai','tool','free']],

  // FIGMA TEMPLATES
  ['Figma Community',          'https://www.figma.com/community',             'Official Figma community — thousands of free templates',         'figma-templates', 96, ['figma','template','free','design']],
  ['Untitled UI',              'https://www.untitledui.com',                  'Largest Figma UI kit and design system — free tier',             'figma-templates', 88, ['figma','template','ui','design']],
  ['Figma Freebies',           'https://www.figmafreebies.com',               'Curated free Figma resources and UI kits',                       'figma-templates', 77, ['figma','template','free','design']],
  ['UI8 Free',                 'https://ui8.net/free',                        'Free premium UI kits and Figma templates',                       'figma-templates', 84, ['figma','template','free','ui']],
  ['Freebiesbug',              'https://freebiesbug.com',                     'Free Figma, Sketch, and PSD resources',                          'figma-templates', 79, ['figma','template','free','design']],

  // UI/UX RESOURCES
  ['Laws of UX',               'https://lawsofux.com',                        'Best practices for UX design based on psychology',               'ui-ux-resources', 93, ['ux','design','beginner']],
  ['Mobbin',                   'https://mobbin.com',                          'Real-world mobile and web UI patterns library',                  'ui-ux-resources', 90, ['ui','ux','design','mobile']],
  ['Coolors',                  'https://coolors.co',                          'Super fast color palette generator',                             'ui-ux-resources', 91, ['design','tool','free','ui']],
  ['Google Fonts',             'https://fonts.google.com',                    'Free, open-source fonts from Google',                            'ui-ux-resources', 94, ['design','free','web','ui']],
  ['Heroicons',                'https://heroicons.com',                       'Beautiful hand-crafted SVG icons by Tailwind CSS team',          'ui-ux-resources', 89, ['design','free','ui','frontend']],
  ['Phosphor Icons',           'https://phosphoricons.com',                   'Flexible icon family for interfaces — free',                     'ui-ux-resources', 85, ['design','free','ui','frontend']],
  ['Unsplash',                 'https://unsplash.com',                        'Free high-resolution photos for any project',                    'ui-ux-resources', 92, ['design','free','tool']],
  ['Lottie Files',             'https://lottiefiles.com',                     'Free lightweight animations for web and mobile',                 'ui-ux-resources', 87, ['design','animation','free','tool']],

  // OPEN SOURCE PROJECTS
  ['Awesome Lists',            'https://github.com/sindresorhus/awesome',     'The original awesome list — curated lists of everything',        'open-source', 99, ['open-source','tool','free']],
  ['public-apis on GitHub',    'https://github.com/public-apis/public-apis',  'Collective list of free APIs — 300k+ stars',                     'open-source', 98, ['open-source','api','free']],
  ['System Design Primer',     'https://github.com/donnemartin/system-design-primer', 'Learn how to design large-scale systems — 250k+ stars', 'open-source', 98, ['open-source','backend','advanced','interview']],
  ['Supabase GitHub',          'https://github.com/supabase/supabase',        'Open source Firebase alternative',                               'open-source', 94, ['open-source','database','backend','free']],
  ['Appwrite',                 'https://github.com/appwrite/appwrite',        'Open source backend server for web and mobile apps',             'open-source', 91, ['open-source','backend','free']],
  ['Mermaid.js',               'https://github.com/mermaid-js/mermaid',       'Generate diagrams from markdown-like text',                      'open-source', 88, ['open-source','tool','visualization']],
  ['Tauri',                    'https://github.com/tauri-apps/tauri',         'Build desktop apps with web tech — Rust-powered',                'open-source', 90, ['open-source','tool','frontend']],

  // DEVELOPER PRODUCTIVITY
  ['Obsidian',                 'https://obsidian.md',                         'Private, flexible note-taking app with graph view',              'productivity', 89, ['productivity','tool','free']],
  ['Conventional Commits',     'https://www.conventionalcommits.org',         'Specification for human and machine readable commit messages',    'productivity', 85, ['productivity','git','tool']],
  ['Oh My Zsh',                'https://ohmyz.sh',                            'Framework for managing your Zsh configuration',                  'productivity', 88, ['productivity','cli','linux','free']],
  ['GitLens VS Code',          'https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens', 'Supercharge Git in VS Code',            'productivity', 87, ['productivity','git','vscode','free']],
  ['Warp Terminal',            'https://www.warp.dev',                        'Modern AI-powered terminal for developers',                       'productivity', 75, ['productivity','cli','tool','ai']],
  ['Raycast',                  'https://www.raycast.com',                     'Blazingly fast macOS launcher with developer tools',             'productivity', 91, ['productivity','tool']],

  // CSS & ANIMATIONS
  ['Tailwind CSS',             'https://tailwindcss.com',                     'Utility-first CSS framework',                                    'css-animations', 98, ['css','frontend','tool','free']],
  ['Animate.css',              'https://animate.style',                       'Just-add-water CSS animations library',                          'css-animations', 92, ['css','animation','free','frontend']],
  ['CSS Tricks',               'https://css-tricks.com',                      'Tips, tricks, and techniques on using CSS',                      'css-animations', 96, ['css','tutorial','frontend']],
  ['Animista',                 'https://animista.net',                        'CSS animations on demand — copy and paste',                      'css-animations', 88, ['css','animation','free','tool']],
  ['CSS Grid Generator',       'https://cssgrid-generator.netlify.app',       'Visual CSS grid layout generator',                               'css-animations', 84, ['css','tool','free','frontend']],
  ['Cubic Bezier',             'https://cubic-bezier.com',                    'Visual cubic-bezier curve generator for CSS transitions',        'css-animations', 85, ['css','animation','tool','free']],
  ['Glassmorphism CSS',        'https://ui.glass/generator',                  'Generate glassmorphism CSS effects',                             'css-animations', 82, ['css','design','tool','free']],
  ['Neumorphism.io',           'https://neumorphism.io',                      'Generate soft UI CSS code',                                      'css-animations', 80, ['css','design','tool','free']],

  // INTERVIEW PREP
  ['LeetCode',                 'https://leetcode.com',                        'The platform for coding interview preparation',                  'interview-prep', 97, ['interview','algorithm','tool']],
  ['NeetCode',                 'https://neetcode.io',                         'Curated LeetCode problems with video solutions',                 'interview-prep', 96, ['interview','algorithm','tutorial','free']],
  ['Tech Interview Handbook',  'https://www.techinterviewhandbook.org',       'Free curated interview prep materials by ex-Googler',            'interview-prep', 95, ['interview','free','tutorial']],
  ['Big-O Cheat Sheet',        'https://www.bigocheatsheet.com',              'Time and space complexity cheat sheet',                          'interview-prep', 91, ['interview','algorithm','free','beginner']],
  ['Pramp',                    'https://www.pramp.com',                       'Free peer-to-peer mock technical interviews',                    'interview-prep', 87, ['interview','free','tool']],
  ['Blind 75 List',            'https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions', 'The famous Blind 75 LeetCode problem list', 'interview-prep', 94, ['interview','algorithm','free']],

  // DEVOPS & CLOUD
  ['Play with Docker',         'https://labs.play-with-docker.com',           'Free Docker playground in the browser',                          'devops', 88, ['docker','devops','free','beginner']],
  ['GitHub Actions Docs',      'https://docs.github.com/en/actions',          'Automate your workflow with GitHub Actions',                     'devops', 90, ['devops','git','cloud','free']],
  ['Fly.io',                   'https://fly.io',                              'Deploy apps globally — generous free tier',                      'devops', 86, ['devops','cloud','free','tool']],
  ['Railway',                  'https://railway.app',                         'Deploy anything — free tier available',                          'devops', 84, ['devops','cloud','free','tool']],
  ['Render',                   'https://render.com',                          'Cloud platform with free tier for web services',                 'devops', 83, ['devops','cloud','free','tool']],
  ['Cloudflare Workers',       'https://workers.cloudflare.com',              'Serverless functions at the edge — free tier',                   'devops', 89, ['devops','cloud','free','performance']],
  ['Vercel',                   'https://vercel.com',                          'Deploy frontend apps instantly — free tier',                     'devops', 95, ['devops','cloud','free','frontend']],
  ['Netlify',                  'https://www.netlify.com',                     'Build, deploy, and scale web apps — free tier',                  'devops', 93, ['devops','cloud','free','frontend']],

  // JAVASCRIPT RESOURCES
  ["You Don't Know JS",        'https://github.com/getify/You-Dont-Know-JS',  'Free book series diving deep into JavaScript mechanics',         'javascript', 98, ['javascript','tutorial','free','open-source','advanced']],
  ['Node.js Official Docs',    'https://nodejs.org/en/docs',                  'Official Node.js documentation — APIs and guides',               'javascript', 91, ['javascript','nodejs','tutorial','backend']],
  ['React Official Docs',      'https://react.dev',                           'The new official React documentation with interactive examples', 'javascript', 96, ['javascript','react','frontend','tutorial']],
  ['Next.js Docs',             'https://nextjs.org/docs',                     'The React framework for production — official docs',             'javascript', 94, ['javascript','react','frontend','fullstack']],
  ['Svelte',                   'https://svelte.dev',                          'Cybernetically enhanced web apps — no virtual DOM',              'javascript', 89, ['javascript','frontend','tool','free']],
  ['Vite',                     'https://vitejs.dev',                          'Next generation frontend tooling — blazing fast dev server',     'javascript', 93, ['javascript','frontend','tool','performance']],
  ['TypeScript Handbook',      'https://www.typescriptlang.org/docs/handbook','The official TypeScript handbook',                               'javascript', 95, ['javascript','tutorial','frontend','backend']],
  ['Zod',                      'https://zod.dev',                             'TypeScript-first schema validation with static type inference',  'javascript', 88, ['javascript','tool','backend','frontend']],
  ['Bun',                      'https://bun.sh',                              'All-in-one JavaScript runtime — faster than Node.js',            'javascript', 91, ['javascript','nodejs','tool','performance']],
  ['Deno',                     'https://deno.com',                            'A modern runtime for JavaScript and TypeScript',                 'javascript', 86, ['javascript','nodejs','tool','security']],
  ['npm Trends',               'https://npmtrends.com',                       'Compare npm package download stats over time',                   'javascript', 82, ['javascript','tool','free','web']],
  ['Vue.js Docs',              'https://vuejs.org',                           'The progressive JavaScript framework',                           'javascript', 90, ['javascript','frontend','tutorial','free']],

  // DATABASE & BACKEND
  ['PostgreSQL Docs',          'https://www.postgresql.org/docs',             'Official PostgreSQL documentation',                              'backend', 93, ['database','backend','tutorial','free']],
  ['Prisma',                   'https://www.prisma.io',                       'Next-generation Node.js and TypeScript ORM',                     'backend', 92, ['database','backend','nodejs','tool']],
  ['Drizzle ORM',              'https://orm.drizzle.team',                    'Lightweight TypeScript ORM that feels like writing SQL',         'backend', 88, ['database','backend','javascript','tool']],
  ['Redis Docs',               'https://redis.io/docs',                       'Official Redis documentation — in-memory data store',            'backend', 90, ['database','backend','performance','tool']],
  ['MongoDB Docs',             'https://www.mongodb.com/docs',                'Official MongoDB documentation — NoSQL document database',       'backend', 87, ['database','backend','tutorial']],
  ['Supabase Docs',            'https://supabase.com/docs',                   'Open source Firebase alternative — Postgres + Auth + Storage',   'backend', 94, ['database','backend','free','open-source']],
  ['PlanetScale',              'https://planetscale.com',                     'MySQL-compatible serverless database platform',                  'backend', 85, ['database','backend','cloud','free']],
  ['Neon DB',                  'https://neon.tech',                           'Serverless Postgres with a generous free tier',                  'backend', 86, ['database','backend','cloud','free']],
  ['Express.js Guide',         'https://expressjs.com/en/guide/routing.html', 'Official Express.js routing and middleware guide',               'backend', 88, ['backend','nodejs','tutorial','javascript']],
  ['Fastify',                  'https://fastify.dev',                         'Fast and low overhead web framework for Node.js',                'backend', 87, ['backend','nodejs','javascript','performance']],
  ['tRPC',                     'https://trpc.io',                             'End-to-end typesafe APIs — no code generation',                  'backend', 89, ['backend','javascript','fullstack']],
  ['DB Diagram',               'https://dbdiagram.io',                        'Free online database diagram tool',                              'backend', 84, ['database','tool','free','visualization']],
  ['SQL Zoo',                  'https://sqlzoo.net',                          'Learn SQL interactively — free exercises for all levels',        'backend', 82, ['database','tutorial','free','beginner']],

  // DESIGN INSPIRATION
  ['Awwwards',                 'https://www.awwwards.com',                    'Award-winning website designs — the best of web design',         'design-inspiration', 95, ['design','ui','web','inspiration']],
  ['Dribbble',                 'https://dribbble.com',                        'Design inspiration from the world\'s top designers',             'design-inspiration', 93, ['design','ui','ux','inspiration']],
  ['Behance',                  'https://www.behance.net',                     'Showcase and discover creative work — Adobe\'s platform',        'design-inspiration', 91, ['design','ui','ux','inspiration']],
  ['Land-book',                'https://land-book.com',                       'Curated gallery of the best landing page designs',               'design-inspiration', 88, ['design','ui','web','inspiration']],
  ['Lapa Ninja',               'https://www.lapa.ninja',                      'The best landing page design inspiration — 6000+ examples',      'design-inspiration', 87, ['design','ui','web','inspiration']],
  ['Godly Website',            'https://godly.website',                       'Astronomically good web design inspiration',                     'design-inspiration', 86, ['design','ui','web','inspiration']],
  ['Muzli',                    'https://muz.li',                              "Designer's go-to source for design inspiration",                 'design-inspiration', 85, ['design','ui','tool','inspiration']],
  ['Collect UI',               'https://collectui.com',                       'Daily UI inspiration from dribbble — filtered by component',     'design-inspiration', 84, ['design','ui','inspiration']],
  ['Screenlane',               'https://screenlane.com',                      'Web and mobile UI design inspiration — updated daily',           'design-inspiration', 82, ['design','ui','mobile','inspiration']],
  ['Dark Design',              'https://www.dark.design',                     'The best dark-themed website designs for inspiration',           'design-inspiration', 83, ['design','ui','web','inspiration']],
  ['Fonts In Use',             'https://fontsinuse.com',                      'A searchable archive of typographic design',                     'design-inspiration', 78, ['design','typography','inspiration']],
  ['SaaS Landing Page',        'https://saaslandingpage.com',                 'Best landing page examples from top SaaS companies',             'design-inspiration', 81, ['design','ui','web','inspiration']],
];

// ── Run seed ──────────────────────────────────────────────────────────────
console.log('\n🌱 Seeding SQLite database with all links...\n');

// Upsert categories
const upsertCat = db.prepare(
  'INSERT OR IGNORE INTO categories (name, slug, description) VALUES (?, ?, ?)'
);
for (const c of categories) upsertCat.run(c.name, c.slug, c.description);
console.log(`✓ ${categories.length} categories ready`);

// Upsert tags
const upsertTag = db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)');
for (const t of tags) upsertTag.run(t);
console.log(`✓ ${tags.length} tags ready`);

// Insert links + link_tags in a transaction
const getCategory = db.prepare('SELECT id FROM categories WHERE slug = ?');
const getTag      = db.prepare('SELECT id FROM tags WHERE name = ?');
const checkLink   = db.prepare('SELECT id FROM links WHERE url = ?');
const insertLink  = db.prepare(
  `INSERT OR IGNORE INTO links (title, url, description, category_id, submitted_by, status, vote_score)
   VALUES (?, ?, ?, ?, 1, 'approved', ?)`
);
const insertLT = db.prepare(
  'INSERT OR IGNORE INTO link_tags (link_id, tag_id) VALUES (?, ?)'
);

let inserted = 0;
let skipped  = 0;

const seedAll = db.transaction(() => {
  for (const [title, url, description, catSlug, score, linkTags] of links) {
    if (checkLink.get(url)) { skipped++; continue; }

    const cat = getCategory.get(catSlug);
    const info = insertLink.run(title, url, description, cat ? cat.id : null, score);

    if (info.lastInsertRowid) {
      const linkId = info.lastInsertRowid;
      // Also ensure extra tags exist and link them
      for (const tagName of linkTags) {
        upsertTag.run(tagName);
        const tag = getTag.get(tagName);
        if (tag) insertLT.run(linkId, tag.id);
      }
      inserted++;
    } else {
      skipped++;
    }
  }
});

seedAll();

console.log(`✓ ${inserted} links inserted, ${skipped} skipped (already existed)\n`);

// Print summary
const rows = db.prepare(`
  SELECT c.name, COUNT(l.id) AS cnt
  FROM categories c
  LEFT JOIN links l ON l.category_id = c.id AND l.status = 'approved'
  GROUP BY c.id ORDER BY cnt DESC
`).all();

console.log('📊 Links per category:');
rows.forEach(r => console.log(`   ${String(r.cnt).padStart(3)}  ${r.name}`));
console.log(`\n✅ Total: ${db.prepare("SELECT COUNT(*) AS n FROM links WHERE status='approved'").get().n} approved links`);
console.log('🚀 Restart the server and open http://localhost:3000\n');
