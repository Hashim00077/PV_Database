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
const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '5mb' }));

// JSON API
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
