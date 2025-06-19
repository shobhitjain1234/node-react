const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.getAllUsers = (cb) => {
  db.query("SELECT * FROM student", cb);
};

exports.createUser = (user, cb) => {
  db.query("INSERT INTO student SET ?", user, cb);
};

exports.updateUser = (id, user, cb) => {
  db.query("UPDATE student SET ? WHERE id = ?", [user, id], cb);
};

exports.deleteUser = (id, cb) => {
  db.query("DELETE FROM student WHERE id = ?", [id], cb);
};

exports.findUserByEmail = (email, cb) => {
  db.query("SELECT * FROM student WHERE email = ?", [email], cb);
};

exports.createCompany = (user, cb) => {
  db.query("INSERT INTO company SET ?", user, cb);
};

exports.findUserByEmailSign = (email, cb) => {
  db.query("SELECT * FROM userLogin WHERE email = ?", [email], cb);
};

exports.createUserSignup = (user, cb) => {
  db.query("INSERT INTO userLogin SET ?", user, cb);
};

exports.checkUserCredentials = (email, password, cb) => {
  db.query(
    "SELECT * FROM userLogin WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return cb(err);
      if (results.length === 0) return cb(null, null); // User not found

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password); // Check password hash

      if (!isMatch) return cb(null, null); // Invalid password

      return cb(null, user); // Successful login
    }
  );
};
