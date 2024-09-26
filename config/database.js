// server/config/database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database ' + err.message);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS user (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS todo (
      id TEXT PRIMARY KEY,
      userId TEXT,
      title TEXT,
      status TEXT,
      FOREIGN KEY (userId) REFERENCES user(id)
    )`);
  }
});

module.exports = db;