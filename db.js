const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database("./database.db")

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      body TEXT,
      tags TEXT,
      votes INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER,
      body TEXT,
      votes INTEGER DEFAULT 0
    )
  `);
});

module.exports = db;