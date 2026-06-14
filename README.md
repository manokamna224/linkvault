# LinkVault — Crowdsourced Link Repository

Lightweight full-stack web application for discovering, submitting, and voting on curated links.

Stack: Node.js · Express · SQL Server · Vanilla JS · Socket.io

Prerequisites
- Node.js 18+
- SQL Server (2019/2022/2025) with instance `localhost\MSSQLSERVER01`
- Windows Authentication or a SQL login

Quick start
1. Install dependencies
```
npm install
```
2. Create the database (example using sqlcmd or SSMS)
```
CREATE DATABASE linkvault;
```
3. Apply the schema
```
sqlcmd -S localhost\MSSQLSERVER01 -d linkvault -i server/sql/schema.sql
```
4. (Optional) Seed sample data
```
sqlcmd -S localhost\MSSQLSERVER01 -d linkvault -i server/sql/seed.sql
```
5. Configure environment
```
copy .env.example .env
```
Edit `.env` to match your SQL authentication mode and JWT secret.

6. Start the server
```
npm start
```
For development with auto-reload:
```
npm run dev
```

Open the app in your browser at:
```
http://localhost:3000
```

Environment variables (`.env`)

| Variable | Default | Description |
|---|---:|---|
| PORT | 3000 | HTTP port |
| DB_SERVER | `localhost\MSSQLSERVER01` | SQL Server instance |
| DB_DATABASE | `linkvault` | Database name |
| DB_TRUSTED_CONNECTION | `true` | Use Windows Auth |
| DB_USER | — | SQL login (if not using Windows Auth) |
| DB_PASSWORD | — | SQL password (if not using Windows Auth) |
| JWT_SECRET | — | Secret for signing JWTs |
| JWT_EXPIRES_IN | `7d` | JWT expiry |

API (selected endpoints)

| Method | Endpoint | Auth | Description |
|---:|:---|:---:|:---|
| POST | /api/auth/register | None | Register a new user |
| POST | /api/auth/login | None | Login and receive JWT |
| GET | /api/auth/me | JWT | Get current user profile |
| GET | /api/links | None | Get all approved links (paginated) |
| POST | /api/links | JWT (User) | Submit a new link |
| POST | /api/links/:id/vote | JWT (User) | Cast upvote or downvote |
| GET | /api/links/search | None | Multi-layer search |
| GET | /api/admin/queue | JWT (Admin/Mod) | View pending queue |

Default admin account (when using provided seed)
- Email: admin@linkvault.dev
- Password: admin123

Contributing
- Fork the repository, create a feature branch, commit changes, and open a Pull Request.
- Keep commits focused and include tests for new behavior where appropriate.

License
- MIT

