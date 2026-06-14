-- ============================================================
-- LinkVault Rich Seed — Real curated links, all approved
-- Run: sqlcmd -S "127.0.0.1,53333" -d linkvault -E -C -i rich_seed.sql
-- ============================================================
USE linkvault;
GO

-- ============================================================
-- CATEGORIES (extended)
-- ============================================================
MERGE categories AS target
USING (VALUES
  ('Figma Templates for Beginners',  'figma-templates',   'Curated Figma templates perfect for beginners'),
  ('AI Prompts for Engineers',       'ai-prompts',        'Curated AI prompts tailored for software engineers'),
  ('Free Dev Tools',                 'free-dev-tools',    'Free tools every developer should know about'),
  ('UI/UX Resources',                'ui-ux-resources',   'Design systems, references, and inspiration'),
  ('Learning Resources',             'learning',          'Tutorials, courses, and documentation'),
  ('Free Public APIs',               'free-apis',         'Free APIs you can use in your projects right now'),
  ('Developer Productivity',         'productivity',      'Tools and tips to ship faster'),
  ('Open Source Projects',           'open-source',       'Awesome open source repos worth starring'),
  ('CSS & Animations',               'css-animations',    'CSS tricks, animations, and visual magic'),
  ('JavaScript Resources',           'javascript',        'JS libraries, guides, and tools'),
  ('Python Resources',               'python',            'Python libraries, tutorials, and tools'),
  ('Database & Backend',             'backend',           'Backend frameworks, DB tools, and APIs'),
  ('DevOps & Cloud',                 'devops',            'CI/CD, Docker, Kubernetes, and cloud tools'),
  ('Interview Prep',                 'interview-prep',    'Coding interview practice and resources'),
  ('Design Inspiration',             'design-inspiration','Websites and galleries for design ideas')
) AS source(name, slug, description)
ON target.slug = source.slug
WHEN NOT MATCHED THEN
  INSERT (name, slug, description) VALUES (source.name, source.slug, source.description);
GO

-- ============================================================
-- TAGS (extended)
-- ============================================================
MERGE tags AS target
USING (VALUES
  ('free'),('beginner'),('advanced'),('ai'),('design'),
  ('productivity'),('open-source'),('tutorial'),('tool'),('template'),
  ('api'),('javascript'),('python'),('css'),('react'),
  ('nodejs'),('database'),('devops'),('docker'),('cloud'),
  ('interview'),('algorithm'),('animation'),('figma'),('ui'),
  ('ux'),('backend'),('frontend'),('fullstack'),('security'),
  ('testing'),('performance'),('mobile'),('web'),('cli'),
  ('git'),('linux'),('windows'),('mac'),('vscode'),
  ('chatgpt'),('llm'),('machine-learning'),('data-science'),('visualization')
) AS source(name)
ON target.name = source.name
WHEN NOT MATCHED THEN INSERT (name) VALUES (source.name);
GO

-- ============================================================
-- HELPER: insert link + tags in one go
-- ============================================================

-- FREE PUBLIC APIs
INSERT INTO links (title, url, description, category_id, submitted_by, status, vote_score)
SELECT v.title, v.url, v.description,
       (SELECT id FROM categories WHERE slug = v.slug),
       1, 'approved', v.score
FROM (VALUES
  ('Public APIs Directory',       'https://publicapis.dev',                    'Searchable directory of 1400+ free public APIs',                                    'free-apis', 95),
  ('JSONPlaceholder',             'https://jsonplaceholder.typicode.com',       'Free fake REST API for testing and prototyping',                                    'free-apis', 88),
  ('Open-Meteo Weather API',      'https://open-meteo.com',                    'Free weather API — no API key required',                                            'free-apis', 82),
  ('REST Countries',              'https://restcountries.com',                 'Get country data via REST API — completely free',                                   'free-apis', 79),
  ('PokeAPI',                     'https://pokeapi.co',                        'Free RESTful Pokémon API — great for learning',                                     'free-apis', 74),
  ('Open Library API',            'https://openlibrary.org/developers/api',    'Free book data API from Internet Archive',                                          'free-apis', 68),
  ('NASA Open APIs',              'https://api.nasa.gov',                      'Free NASA APIs — APOD, Mars Rover, Near Earth Objects',                             'free-apis', 91),
  ('CoinGecko API',               'https://www.coingecko.com/en/api',          'Free crypto price and market data API',                                             'free-apis', 77),
  ('The Dog API',                 'https://thedogapi.com',                     'Free dog images and breed data API',                                                'free-apis', 65),
  ('Quotable API',                'https://quotable.io',                       'Free random quotes API — no key needed',                                            'free-apis', 61)
) AS v(title, url, description, slug, score);
GO

-- FREE DEV TOOLS
INSERT INTO links (title, url, description, category_id, submitted_by, status, vote_score)
SELECT v.title, v.url, v.description,
       (SELECT id FROM categories WHERE slug = v.slug),
       1, 'approved', v.score
FROM (VALUES
  ('Excalidraw',                  'https://excalidraw.com',                    'Free open-source virtual whiteboard for sketching diagrams',                        'free-dev-tools', 97),
  ('Ray.so',                      'https://ray.so',                            'Create beautiful images of your code — free',                                       'free-dev-tools', 93),
  ('Carbon',                      'https://carbon.now.sh',                     'Create and share beautiful images of source code',                                  'free-dev-tools', 89),
  ('Regex101',                    'https://regex101.com',                      'Online regex tester and debugger with explanation',                                  'free-dev-tools', 94),
  ('Crontab Guru',                'https://crontab.guru',                      'The quick and simple cron schedule expression editor',                               'free-dev-tools', 86),
  ('Transform Tools',             'https://transform.tools',                   'Convert JSON to TypeScript, GraphQL, and more',                                     'free-dev-tools', 83),
  ('Squoosh',                     'https://squoosh.app',                       'Free image compression tool by Google',                                             'free-dev-tools', 80),
  ('Bundlephobia',                'https://bundlephobia.com',                  'Find the cost of adding an npm package to your bundle',                             'free-dev-tools', 78),
  ('DevDocs',                     'https://devdocs.io',                        'All developer docs in one place — works offline',                                   'free-dev-tools', 96),
  ('Hoppscotch',                  'https://hoppscotch.io',                     'Open source API development ecosystem — Postman alternative',                       'free-dev-tools', 91),
  ('Warp Terminal',               'https://www.warp.dev',                      'Modern AI-powered terminal for developers',                                         'free-dev-tools', 75),
  ('tldr pages',                  'https://tldr.sh',                           'Simplified man pages with practical examples',                                      'free-dev-tools', 84)
) AS v(title, url, description, slug, score);
GO

-- LEARNING RESOURCES
INSERT INTO links (title, url, description, category_id, submitted_by, status, vote_score)
SELECT v.title, v.url, v.description,
       (SELECT id FROM categories WHERE slug = v.slug),
       1, 'approved', v.score
FROM (VALUES
  ('The Odin Project',            'https://www.theodinproject.com',            'Free full-stack web development curriculum',                                        'learning', 98),
  ('freeCodeCamp',                'https://www.freecodecamp.org',              'Free coding bootcamp with certifications',                                          'learning', 97),
  ('CS50 by Harvard',             'https://cs50.harvard.edu/x',                'Harvard free intro to computer science — legendary course',                         'learning', 99),
  ('Roadmap.sh',                  'https://roadmap.sh',                        'Developer roadmaps for every tech stack',                                           'learning', 96),
  ('MDN Web Docs',                'https://developer.mozilla.org',             'The definitive web development reference by Mozilla',                                'learning', 95),
  ('JavaScript.info',             'https://javascript.info',                   'The modern JavaScript tutorial — from basics to advanced',                          'learning', 94),
  ('Fireship.io',                 'https://fireship.io',                       'Fast-paced, fun web dev tutorials and courses',                                     'learning', 90),
  ('Scrimba',                     'https://scrimba.com',                       'Interactive coding screencasts — learn by doing',                                   'learning', 85),
  ('Exercism',                    'https://exercism.org',                      'Free coding exercises with mentorship in 60+ languages',                            'learning', 88),
  ('MIT OpenCourseWare',          'https://ocw.mit.edu',                       'Free MIT course materials — CS, math, engineering',                                 'learning', 92)
) AS v(title, url, description, slug, score);
GO

-- AI PROMPTS FOR ENGINEERS
INSERT INTO links (title, url, description, category_id, submitted_by, status, vote_score)
SELECT v.title, v.url, v.description,
       (SELECT id FROM categories WHERE slug = v.slug),
       1, 'approved', v.score
FROM (VALUES
  ('Awesome ChatGPT Prompts',     'https://prompts.chat',                      'Curated list of ChatGPT prompts for developers and creators',                       'ai-prompts', 93),
  ('PromptHero',                  'https://prompthero.com',                    'Search millions of AI art and text prompts',                                        'ai-prompts', 87),
  ('FlowGPT',                     'https://flowgpt.com',                       'Community platform for sharing and discovering AI prompts',                         'ai-prompts', 82),
  ('GitHub Copilot Docs',         'https://docs.github.com/en/copilot',        'Official GitHub Copilot documentation and prompt tips',                             'ai-prompts', 88),
  ('OpenAI Cookbook',             'https://cookbook.openai.com',               'Examples and guides for using the OpenAI API',                                      'ai-prompts', 91),
  ('LangChain Docs',              'https://python.langchain.com',              'Build LLM-powered apps with LangChain',                                             'ai-prompts', 86),
  ('Hugging Face',                'https://huggingface.co',                    'The AI community — models, datasets, and spaces',                                   'ai-prompts', 94),
  ('Ollama',                      'https://ollama.com',                        'Run LLMs locally on your machine — free and open source',                           'ai-prompts', 89)
) AS v(title, url, description, slug, score);
GO

-- FIGMA TEMPLATES
INSERT INTO links (title, url, description, category_id, submitted_by, status, vote_score)
SELECT v.title, v.url, v.description,
       (SELECT id FROM categories WHERE slug = v.slug),
       1, 'approved', v.score
FROM (VALUES
  ('Figma Community',             'https://www.figma.com/community',           'Official Figma community — thousands of free templates',                            'figma-templates', 96),
  ('UI8',                         'https://ui8.net/free',                      'Free premium UI kits and Figma templates',                                          'figma-templates', 84),
  ('Freebiesbug',                 'https://freebiesbug.com',                   'Free Figma, Sketch, and PSD resources',                                             'figma-templates', 79),
  ('Figma Freebies',              'https://www.figmafreebies.com',             'Curated free Figma resources and UI kits',                                          'figma-templates', 77),
  ('Untitled UI',                 'https://www.untitledui.com',                'Largest Figma UI kit and design system — free tier available',                      'figma-templates', 88)
) AS v(title, url, description, slug, score);
GO

-- UI/UX RESOURCES
INSERT INTO links (title, url, description, category_id, submitted_by, status, vote_score)
SELECT v.title, v.url, v.description,
       (SELECT id FROM categories WHERE slug = v.slug),
       1, 'approved', v.score
FROM (VALUES
  ('Refactoring UI',              'https://www.refactoringui.com',             'Learn UI design from the creators of Tailwind CSS',                                 'ui-ux-resources', 95),
  ('Laws of UX',                  'https://lawsofux.com',                      'Best practices for UX design based on psychology',                                  'ui-ux-resources', 93),
  ('Mobbin',                      'https://mobbin.com',                        'Real-world mobile and web UI patterns library',                                     'ui-ux-resources', 90),
  ('Dribbble',                    'https://dribbble.com',                      'Design inspiration from the world''s top designers',                                'ui-ux-resources', 88),
  ('Awwwards',                    'https://www.awwwards.com',                  'Award-winning website designs for inspiration',                                     'ui-ux-resources', 86),
  ('Coolors',                     'https://coolors.co',                        'Super fast color palette generator',                                                'ui-ux-resources', 91),
  ('Google Fonts',                'https://fonts.google.com',                  'Free, open-source fonts from Google',                                               'ui-ux-resources', 94),
  ('Heroicons',                   'https://heroicons.com',                     'Beautiful hand-crafted SVG icons by Tailwind CSS team',                             'ui-ux-resources', 89)
) AS v(title, url, description, slug, score);
GO

-- OPEN SOURCE PROJECTS
INSERT INTO links (title, url, description, category_id, submitted_by, status, vote_score)
SELECT v.title, v.url, v.description,
       (SELECT id FROM categories WHERE slug = v.slug),
       1, 'approved', v.score
FROM (VALUES
  ('Awesome Lists',               'https://github.com/sindresorhus/awesome',   'The original awesome list — curated lists of everything',                           'open-source', 99),
  ('public-apis on GitHub',       'https://github.com/public-apis/public-apis','Collective list of free APIs — 300k+ stars',                                        'open-source', 98),
  ('freeCodeCamp GitHub',         'https://github.com/freeCodeCamp/freeCodeCamp','Open source codebase for freeCodeCamp.org',                                       'open-source', 96),
  ('VS Code',                     'https://github.com/microsoft/vscode',       'Microsoft Visual Studio Code — open source',                                        'open-source', 97),
  ('Supabase',                    'https://github.com/supabase/supabase',      'Open source Firebase alternative',                                                  'open-source', 94),
  ('Appwrite',                    'https://github.com/appwrite/appwrite',      'Open source backend server for web and mobile apps',                                'open-source', 91),
  ('Mermaid.js',                  'https://github.com/mermaid-js/mermaid',     'Generate diagrams from markdown-like text',                                         'open-source', 88),
  ('Tauri',                       'https://github.com/tauri-apps/tauri',       'Build desktop apps with web tech — Rust-powered',                                   'open-source', 90)
) AS v(title, url, description, slug, score);
GO

-- DEVELOPER PRODUCTIVITY
INSERT INTO links (title, url, description, category_id, submitted_by, status, vote_score)
SELECT v.title, v.url, v.description,
       (SELECT id FROM categories WHERE slug = v.slug),
       1, 'approved', v.score
FROM (VALUES
  ('Notion',                      'https://www.notion.so',                     'All-in-one workspace for notes, docs, and projects',                                'productivity', 92),
  ('Linear',                      'https://linear.app',                        'The issue tracker built for modern software teams',                                 'productivity', 90),
  ('Fig (now Amazon Q)',          'https://fig.io',                            'Autocomplete for your terminal',                                                    'productivity', 83),
  ('Raycast',                     'https://www.raycast.com',                   'Blazingly fast macOS launcher with developer tools',                                'productivity', 91),
  ('Obsidian',                    'https://obsidian.md',                       'Private, flexible note-taking app with graph view',                                 'productivity', 89),
  ('GitLens for VS Code',         'https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens', 'Supercharge Git in VS Code',                             'productivity', 87),
  ('Conventional Commits',        'https://www.conventionalcommits.org',       'A specification for adding human and machine readable meaning to commit messages',   'productivity', 85),
  ('Oh My Zsh',                   'https://ohmyz.sh',                          'Framework for managing your Zsh configuration',                                     'productivity', 88)
) AS v(title, url, description, slug, score);
GO

-- CSS & ANIMATIONS
INSERT INTO links (title, url, description, category_id, submitted_by, status, vote_score)
SELECT v.title, v.url, v.description,
       (SELECT id FROM categories WHERE slug = v.slug),
       1, 'approved', v.score
FROM (VALUES
  ('Animate.css',                 'https://animate.style',                     'Just-add-water CSS animations library',                                             'css-animations', 92),
  ('CSS Tricks',                  'https://css-tricks.com',                    'Tips, tricks, and techniques on using CSS',                                         'css-animations', 96),
  ('Tailwind CSS',                'https://tailwindcss.com',                   'Utility-first CSS framework',                                                       'css-animations', 98),
  ('Neumorphism.io',              'https://neumorphism.io',                    'Generate soft UI CSS code',                                                         'css-animations', 80),
  ('Glassmorphism CSS',           'https://ui.glass/generator',                'Generate glassmorphism CSS effects',                                                'css-animations', 82),
  ('Cubic Bezier',                'https://cubic-bezier.com',                  'Visual cubic-bezier curve generator for CSS transitions',                           'css-animations', 85),
  ('Animista',                    'https://animista.net',                      'CSS animations on demand — copy and paste',                                         'css-animations', 88),
  ('CSS Grid Generator',          'https://cssgrid-generator.netlify.app',     'Visual CSS grid layout generator',                                                  'css-animations', 84)
) AS v(title, url, description, slug, score);
GO

-- INTERVIEW PREP
INSERT INTO links (title, url, description, category_id, submitted_by, status, vote_score)
SELECT v.title, v.url, v.description,
       (SELECT id FROM categories WHERE slug = v.slug),
       1, 'approved', v.score
FROM (VALUES
  ('LeetCode',                    'https://leetcode.com',                      'The platform for coding interview preparation',                                     'interview-prep', 97),
  ('NeetCode',                    'https://neetcode.io',                       'Curated LeetCode problems with video solutions',                                    'interview-prep', 96),
  ('Tech Interview Handbook',     'https://www.techinterviewhandbook.org',     'Free curated interview prep materials by ex-Googler',                               'interview-prep', 95),
  ('System Design Primer',        'https://github.com/donnemartin/system-design-primer', 'Learn how to design large-scale systems — 250k+ stars',                  'interview-prep', 98),
  ('Blind 75',                    'https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions', 'The famous Blind 75 LeetCode list',       'interview-prep', 94),
  ('Big-O Cheat Sheet',           'https://www.bigocheatsheet.com',            'Time and space complexity cheat sheet',                                             'interview-prep', 91),
  ('Pramp',                       'https://www.pramp.com',                     'Free peer-to-peer mock technical interviews',                                       'interview-prep', 87),
  ('interviewing.io',             'https://interviewing.io',                   'Practice technical interviews with engineers from top companies',                   'interview-prep', 89)
) AS v(title, url, description, slug, score);
GO

-- DEVOPS & CLOUD
INSERT INTO links (title, url, description, category_id, submitted_by, status, vote_score)
SELECT v.title, v.url, v.description,
       (SELECT id FROM categories WHERE slug = v.slug),
       1, 'approved', v.score
FROM (VALUES
  ('Docker Docs',                 'https://docs.docker.com',                   'Official Docker documentation',                                                     'devops', 93),
  ('Play with Docker',            'https://labs.play-with-docker.com',         'Free Docker playground in the browser',                                             'devops', 88),
  ('Kubernetes Docs',             'https://kubernetes.io/docs',                'Official Kubernetes documentation',                                                 'devops', 91),
  ('GitHub Actions Docs',         'https://docs.github.com/en/actions',        'Automate your workflow with GitHub Actions',                                        'devops', 90),
  ('Fly.io',                      'https://fly.io',                            'Deploy apps globally — generous free tier',                                         'devops', 86),
  ('Railway',                     'https://railway.app',                       'Deploy anything — free tier available',                                             'devops', 84),
  ('Render',                      'https://render.com',                        'Cloud platform with free tier for web services',                                    'devops', 83),
  ('Cloudflare Workers',          'https://workers.cloudflare.com',            'Serverless functions at the edge — free tier',                                      'devops', 89)
) AS v(title, url, description, slug, score);
GO

PRINT 'Rich seed data inserted successfully!';
GO
