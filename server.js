"use strict"

const express = require('express');
const sqlite3 = require('sqlite3');

const app = express();

const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database('activities.db');

db.run(`CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  type TEXT,
  time INTEGER,
  miles REAL,
  date TEXT
)`);

app.post('/api/activities', (req, res) => {
  const { name, type, time, miles, date } = req.body;

  db.run(`INSERT INTO activities (name, type, time, miles, date)
          VALUES (?, ?, ?, ?, ?)`,
          [name, type, time, miles, date],
          (err) => {
            if (err) {
              console.error(err.message);
              res.status(500).send('Server Error');
            } else {
              res.status(201).send('Activity saved successfully');
            }
          });
});

app.get('/api/activities', (req, res) => {
  db.all('SELECT * FROM activities', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    } else {
      res.json(rows);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
