const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// test route
app.get("/api/questions", (req, res) => {
  db.all("SELECT * FROM questions", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post("/api/questions", (req, res) => {

  console.log("HEADERS:", req.headers);
  console.log("BODY:", req.body);

  const { title, body, tags } = req.body;

  const sql = `
    INSERT INTO questions (title, body, tags)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [title, body, tags], function (err) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json({
        id: this.lastID,
        title,
        body,
        tags,
        votes: 0
      });
    }
  });
});

app.post("/api/questions/:id/answers", (req, res) => {
  const { id } = req.params;
  const { body } = req.body;

  if (!body || body.trim().length === 0) {
    return res.status(400).json({ error: "answer body required" });
  }

  const sql = `
    INSERT INTO answers (question_id, body)
    VALUES (?, ?)
  `;

  db.run(sql, [id, body], function (err) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json({
        id: this.lastID,
        question_id: id,
        body,
        votes: 0
      });
    }
  });
});

app.get("/api/questions/:id/answers", (req, res) => {
  const { id } = req.params;

  db.all(
    "SELECT * FROM answers WHERE question_id = ?",
    [id],
    (err, rows) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(rows);
      }
    }
  );
});




app.listen(3000, () => {
  console.log("🔥 forum backend running on http://localhost:3000");
});
