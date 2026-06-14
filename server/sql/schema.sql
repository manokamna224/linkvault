-- ============================================================
-- LinkVault Database Schema — SQL Server 2022/2025
-- Run against the 'linkvault' database:
--   sqlcmd -S localhost\MSSQLSERVER01 -d linkvault -i schema.sql
-- ============================================================

-- Create database if running from master (optional)
-- CREATE DATABASE linkvault;
-- GO
-- USE linkvault;
-- GO

-- ---- users ----
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
CREATE TABLE users (
  id            INT IDENTITY(1,1) PRIMARY KEY,
  username      NVARCHAR(50)  NOT NULL UNIQUE,
  email         NVARCHAR(255) NOT NULL UNIQUE,
  password_hash NVARCHAR(MAX) NOT NULL,
  role          NVARCHAR(20)  NOT NULL DEFAULT 'user',
  -- 'user' | 'moderator' | 'admin'
  created_at    DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
GO

-- ---- categories ----
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='categories' AND xtype='U')
CREATE TABLE categories (
  id          INT IDENTITY(1,1) PRIMARY KEY,
  name        NVARCHAR(100) NOT NULL UNIQUE,
  slug        NVARCHAR(100) NOT NULL UNIQUE,
  description NVARCHAR(MAX),
  created_at  DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
GO

-- ---- links ----
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='links' AND xtype='U')
CREATE TABLE links (
  id           INT IDENTITY(1,1) PRIMARY KEY,
  title        NVARCHAR(255) NOT NULL,
  url          NVARCHAR(MAX) NOT NULL,
  description  NVARCHAR(MAX),
  category_id  INT REFERENCES categories(id) ON DELETE SET NULL,
  submitted_by INT REFERENCES users(id)      ON DELETE SET NULL,
  status       NVARCHAR(20)  NOT NULL DEFAULT 'pending',
  -- 'pending' | 'approved' | 'rejected'
  vote_score   INT           NOT NULL DEFAULT 0,
  created_at   DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
  reviewed_at  DATETIMEOFFSET,
  reviewed_by  INT REFERENCES users(id)
);
GO

-- ---- tags ----
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='tags' AND xtype='U')
CREATE TABLE tags (
  id   INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(50) NOT NULL UNIQUE
);
GO

-- ---- link_tags ----
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='link_tags' AND xtype='U')
CREATE TABLE link_tags (
  link_id INT NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  tag_id  INT NOT NULL REFERENCES tags(id),
  PRIMARY KEY (link_id, tag_id)
);
GO

-- ---- votes ----
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='votes' AND xtype='U')
CREATE TABLE votes (
  user_id  INT           NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  link_id  INT           NOT NULL REFERENCES links(id),
  type     NVARCHAR(4)   NOT NULL CHECK (type IN ('up', 'down')),
  voted_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
  PRIMARY KEY (user_id, link_id)  -- one vote per user per link
);
GO

-- ---- Indexes ----
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_links_status' AND object_id = OBJECT_ID('links'))
  CREATE INDEX IX_links_status ON links(status);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_links_vote_score' AND object_id = OBJECT_ID('links'))
  CREATE INDEX IX_links_vote_score ON links(vote_score DESC);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_votes_link' AND object_id = OBJECT_ID('votes'))
  CREATE INDEX IX_votes_link ON votes(link_id);
GO

PRINT 'LinkVault schema created successfully.';
GO
