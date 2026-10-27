const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");

// The whole database is a single local file, created on first start
const DB_FILE =
  process.env.DB_FILE || path.join(__dirname, "..", "data", "visited.db");
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

const db = new DatabaseSync(DB_FILE);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    image TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS places (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    address TEXT NOT NULL,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    creator TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS places_creator_idx ON places(creator);
`);

module.exports = db;
