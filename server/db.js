'use strict';

/**
 * Database bootstrap using sql.js (pure JavaScript SQLite).
 *
 * sql.js loads asynchronously (it compiles WebAssembly), so this module
 * exports a getDb() promise. Once resolved, the wrapper provides a
 * synchronous-style API similar to better-sqlite3:
 *   db.prepare(sql)    -> statement with .run(...), .get(...), .all(...)
 *   db.exec(sql)       -> run raw SQL (DDL, multi-statement)
 *   db.transaction(fn) -> wrap fn in BEGIN/COMMIT with rollback on error
 *   db.pragma(str)     -> execute PRAGMA
 *   db.save()          -> persist database to disk
 */

const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = process.env.ARGUS_DB_PATH || path.join(DATA_DIR, 'argus.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

// Ensure data directory exists.
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

/**
 * Thin wrapper around sql.js Database that mimics better-sqlite3's API.
 */
class DatabaseWrapper {
  constructor(sqlDb) {
    this._db = sqlDb;
    this._inTransaction = false;
  }

  save() {
    const data = this._db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }

  exec(sql) {
    this._db.run(sql);
    if (!this._inTransaction) this.save();
  }

  pragma(str) {
    this._db.run(`PRAGMA ${str}`);
  }

  prepare(sql) {
    const dbWrapper = this;
    const rawDb = this._db;

    return {
      run(...params) {
        const stmt = rawDb.prepare(sql);
        if (params.length === 1 && typeof params[0] === 'object' && params[0] !== null && !Array.isArray(params[0])) {
          const bound = {};
          for (const [k, v] of Object.entries(params[0])) {
            bound[`@${k}`] = v === undefined ? null : v;
          }
          stmt.bind(bound);
        } else if (params.length > 0) {
          stmt.bind(params);
        }
        stmt.step();
        stmt.free();

        // Get last_insert_rowid and changes count.
        const idResult = rawDb.exec("SELECT last_insert_rowid() as id");
        const chResult = rawDb.exec("SELECT changes() as c");
        const lastInsertRowid = idResult.length > 0 ? idResult[0].values[0][0] : 0;
        const changes = chResult.length > 0 ? chResult[0].values[0][0] : 0;

        // Only persist to disk if not inside a transaction.
        if (!dbWrapper._inTransaction) dbWrapper.save();

        return { lastInsertRowid, changes };
      },

      get(...params) {
        const stmt = rawDb.prepare(sql);
        if (params.length === 1 && typeof params[0] === 'object' && params[0] !== null && !Array.isArray(params[0])) {
          const bound = {};
          for (const [k, v] of Object.entries(params[0])) {
            bound[`@${k}`] = v === undefined ? null : v;
          }
          stmt.bind(bound);
        } else if (params.length > 0) {
          stmt.bind(params);
        }
        let result = undefined;
        if (stmt.step()) {
          const cols = stmt.getColumnNames();
          const vals = stmt.get();
          result = {};
          cols.forEach((col, i) => { result[col] = vals[i]; });
        }
        stmt.free();
        return result;
      },

      all(...params) {
        const stmt = rawDb.prepare(sql);
        if (params.length === 1 && typeof params[0] === 'object' && params[0] !== null && !Array.isArray(params[0])) {
          const bound = {};
          for (const [k, v] of Object.entries(params[0])) {
            bound[`@${k}`] = v === undefined ? null : v;
          }
          stmt.bind(bound);
        } else if (params.length > 0) {
          stmt.bind(params);
        }
        const results = [];
        const cols = stmt.getColumnNames();
        while (stmt.step()) {
          const vals = stmt.get();
          const row = {};
          cols.forEach((col, i) => { row[col] = vals[i]; });
          results.push(row);
        }
        stmt.free();
        return results;
      },
    };
  }

  transaction(fn) {
    const self = this;
    const txFn = (...args) => {
      self._inTransaction = true;
      self._db.run('BEGIN');
      try {
        const result = fn(...args);
        self._db.run('COMMIT');
        self._inTransaction = false;
        self.save();
        return result;
      } catch (err) {
        self._db.run('ROLLBACK');
        self._inTransaction = false;
        throw err;
      }
    };
    return txFn;
  }
}

// Singleton instance.
let _dbInstance = null;

async function getDb() {
  if (_dbInstance) return _dbInstance;

  const SQL = await initSqlJs();

  let sqlDb;
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    sqlDb = new SQL.Database(fileBuffer);
  } else {
    sqlDb = new SQL.Database();
  }

  _dbInstance = new DatabaseWrapper(sqlDb);

  // Apply pragmas.
  _dbInstance.pragma('foreign_keys = ON');

  // Apply schema (idempotent via IF NOT EXISTS).
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  _dbInstance._db.run(schema);
  _dbInstance.save();

  return _dbInstance;
}

module.exports = { getDb };
