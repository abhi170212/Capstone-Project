const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'tourism.db');
const db = new Database(dbPath, { verbose: console.log });

// Create itineraries table
db.exec(`
  CREATE TABLE IF NOT EXISTS itineraries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    days TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;
