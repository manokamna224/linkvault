require('dotenv').config();
const express = require('express');
const http    = require('http');
const cors    = require('cors');
const path    = require('path');
const helmet  = require('helmet');
const compression = require('compression');
const morgan  = require('morgan');

const socketConfig     = require('./config/socket');
const { testConnection } = require('./config/db');
const authRoutes       = require('./routes/auth.routes');
const linksRoutes      = require('./routes/links.routes');
const searchRoutes     = require('./routes/search.routes');
const adminRoutes      = require('./routes/admin.routes');
const categoriesRoutes = require('./routes/categories.routes');

const app        = express();
const httpServer = http.createServer(app);

// Init Socket.io
socketConfig.init(httpServer);

// ── Security & Optimization Middleware ────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "https://www.google.com"],
      "script-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
    },
  },
}));
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Professional request logging

// Serve static frontend
app.use(express.static(path.join(__dirname, '..', 'client')));

// Health check for Railway
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// API Routes
app.use('/api/auth',       authRoutes);
app.use('/api/links',      linksRoutes);
app.use('/api/links',      searchRoutes);
app.use('/api/admin',      adminRoutes);
app.use('/api/categories', categoriesRoutes);

// Global error handler — returns JSON instead of HTML for API errors
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Fallback: serve index.html for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

const PORT = process.env.PORT || 3000;

// Start server then warm up DB connection immediately
httpServer.listen(PORT, async () => {
  console.log(`\n🔗 LinkVault running → http://localhost:${PORT}`);
  // Eagerly connect to DB so first browser request never fails
  try {
    await testConnection();
  } catch (err) {
    console.error('[DB] Could not connect on startup — will retry on first request');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => { httpServer.close(() => process.exit(0)); });
process.on('SIGINT',  () => { httpServer.close(() => process.exit(0)); });

// Catch unhandled errors so server never crashes silently
process.on('unhandledRejection', (reason) => {
  console.error('[Unhandled Rejection]', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]', err.message);
});
