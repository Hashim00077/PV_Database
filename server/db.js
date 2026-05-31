'use strict';

/**
 * Database bootstrap.
 *
 * Opens (or creates) the SQLite database file and applies the schema.
 * better-sqlite3 is synchronous, which keeps the rest of the code simple
 * and easy to follow for teaching purposes.
 */

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = process.env.ARGUS_DB_PATH || path.join(DATA_DIR, 'argus.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

// Make sure the data directory exists before opening the file.
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

// Sensible defaults for a small self-hosted app.
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Apply the schema (all statements are idempotent via IF NOT EXISTS).
const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
db.exec(schema);

module.exports = db;
