'use strict';

/**
 * Argus Safety Clone - application entry point.
 *
 * A single Express server that exposes the JSON API under /api and serves
 * the static frontend (HTML/CSS/vanilla JS) from /public. This makes the
 * project trivial to self-host: `npm install` then `npm start`.
 */

const path = require('path');
const express = require('express');
const repo = require('./repository');

async function start() {
  // Initialize the database (sql.js is async on first load).
  await repo.init();

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: '5mb' }));

  // JSON API
  const apiRoutes = require('./routes');
  app.use('/api', apiRoutes);

  // Static frontend
  const PUBLIC_DIR = path.join(__dirname, '..', 'public');
  app.use(express.static(PUBLIC_DIR));

  // SPA fallback: send index.html for any non-API GET route.
  app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`\n  Argus Safety Clone running at http://localhost:${PORT}\n`);
  });
}

start().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
