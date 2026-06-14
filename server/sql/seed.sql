-- ============================================================
-- LinkVault Seed Data — SQL Server
-- ============================================================

-- Categories
INSERT INTO categories (name, slug, description)
SELECT * FROM (VALUES
  ('Figma Templates for Beginners', 'figma-templates', 'Curated Figma templates perfect for beginners'),
  ('AI Prompts for Engineers',      'ai-prompts',      'Curated AI prompts tailored for software engineers'),
  ('Free Dev Tools',                'free-dev-tools',  'Free tools every developer should know about'),
  ('UI/UX Resources',               'ui-ux-resources', 'Design systems, references, and inspiration'),
  ('Learning Resources',            'learning',        'Tutorials, courses, and documentation')
) AS v(name, slug, description)
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = v.slug);
GO

-- Tags
INSERT INTO tags (name)
SELECT v.name FROM (VALUES
  ('free'), ('beginner'), ('advanced'), ('ai'), ('design'),
  ('productivity'), ('open-source'), ('tutorial'), ('tool'), ('template')
) AS v(name)
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = v.name);
GO

-- Default admin user
-- Password: admin123
-- bcrypt hash (12 rounds) — regenerate in production!
-- Password: admin123  (hash generated fresh — do not copy-paste hashes from docs)
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@linkvault.dev')
  INSERT INTO users (username, email, password_hash, role)
  VALUES (
    'admin',
    'admin@linkvault.dev',
    '$2b$12$09VJPYQFRsNMBTuE1Q./4eXhgEio8UKoCB9My8j79O6pBfQJ24/TO',
    'admin'
  );
GO

PRINT 'Seed data inserted.';
GO
