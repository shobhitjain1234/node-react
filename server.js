const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5000; // Port for the backend server

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Default user for XAMPP
  password: "", // Default password is empty
  database: "crud_db", // Name of your database
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

// CRUD API Routes

// ============================USERS=================================================
// Get all users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

// Get a single user
app.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results[0]);
  });
});

// Add a new user
app.post("/user", (req, res) => {
  const { name, email, age } = req.body;
  db.query(
    "INSERT INTO users (name, email, age) VALUES (?, ?, ?)",
    [name, email, age],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json({ id: results.insertId, name, email, age });
    }
  );
});

// Update an existing user
app.put("/user/:id", (req, res) => {
  const userId = req.params.id;
  const { name, email, age } = req.body;

  db.query(
    "UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?",
    [name, email, age, userId],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json({ message: "User updated successfully" });
    }
  );
});

// Delete a user
app.delete("/user/:id", (req, res) => {
  const userId = req.params.id;
  db.query("DELETE FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json({ message: "User deleted successfully" });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
