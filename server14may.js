require("dotenv").config(); //if we want to extract value from env then we have to install dotenv package
const express = require("express");
const mysql = require("mysql2");

// this is for multipart form data
const multer = require("multer");
const upload = multer(); // Memory storage

const cors = require("cors");
const bodyParser = require("body-parser");

//common functon for check validation
const { validateFields } = require("./validation/validators"); // adjust path as needed

//common functon for check duplicate
const { checkDuplicate } = require("./validation/validators");

//constant for messages
const messages = require("./common/message");

//constant for error code
const errorCode = require("./common/errorCode");

// we define rule
const fieldRules = require("./validation/fieldRules");

const app = express();
const port = 5000; // Port for the backend server

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    // error is kai case ma a sakti ha jesi ki xampp server start nhi ha, db name galat ha, network problem ha, etc. ye error direct terminal pe show hogi
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

// CRUD API Routes

// ============================USERS=================================================
// Get all users
app.get("/students", (req, res) => {
  // when we have to fetch all the columns of the tabel then we have to use * and if we want perticular column then then clumn name for ex, name, email in place of *
  db.query("SELECT * FROM student", (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

// Get a single user
app.get("/students/:id", (req, res) => {
  const userId = req.params.id;
  db.query("SELECT * FROM student WHERE id = ?", [userId], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results[0]);
  });
});

// Add a new user

app.post("/students", upload.none(), async (req, res) => {
  // hamne ek js file bana li ha fieldRules.js jisme validation define karr dia hn harr ek field ke jisse ham ek baar ma sari fields ke validation rules full fill ho rahe hn ki nhi wo check krr lenge
  const errors = validateFields(req.body, fieldRules);

  if (errors.length > 0) {
    return res.status(400).json({
      code: errorCode.validation_err,
      errors,
    });
  }

  const { name, email, age, address } = req.body;

  try {
    // it is an common function which help us to find that duplicate is present or Notification. jis kisi field ka duplicate dekhna ho wo field pass kardo common function ma
    const duplicates = await checkDuplicate(db, "student", { email, name });

    if (duplicates) {
      const errors = {};
      if (duplicates.email) errors.email = messages.email_pre;
      if (duplicates.name) errors.name = messages.name_pre;

      return res.status(400).json({
        code: errorCode.duplicate_entry,
        errors,
      });
    }

    // jab sari conditions (duplicate ha nhi nhi, validation rule full fill ho rahe ha ki nhi jab ye chalega)
    db.query(
      "INSERT INTO student (name, email, age, address) VALUES (?, ?, ?, ?)",
      [name, email, age, address],
      (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({
          id: results.insertId,
          code: errorCode.success,
          Status: messages.success,
        });
      }
    );
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update an existing user
app.put("/students/:id", upload.none(), (req, res) => {
  const errors = validateFields(req.body, fieldRules);

  if (errors.length > 0) {
    return res.status(400).json({
      code: errorCode.validation_err,
      errors,
    });
  }

  const userId = req.params.id;
  const { name, email, age, address } = req.body;

  db.query(
    "UPDATE student SET name = ?, email = ?, age = ?, address = ? WHERE id = ?",
    [name, email, age, address, userId],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json({
        id: results.insertId,
        code: errorCode.success,
        Status: messages.success,
      });
    }
  );
});

// Update only perticular key of the row
app.patch("/students/:id", upload.none(), (req, res) => {
  const userId = req.params.id;
  const { email, address } = req.body;

  db.query(
    "UPDATE student SET email = ?, address = ? WHERE id = ?",
    [email, address, userId],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.json({
        id: results.insertId,
        code: errorCode.success,
        Status: messages.success,
      });
    }
  );
});

// Delete a user
app.delete("/students/:id", (req, res) => {
  const userId = req.params.id;
  db.query("DELETE FROM student WHERE id = ?", [userId], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json({ message: messages.user_deleted });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
