const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.findUserByColumn = (column, columnName, tableName, cb) => {
  db.query(`SELECT * FROM ${tableName} WHERE ${columnName} = ?`, [column], cb);
};

exports.findUserByContact = (contact, cb) => {
  db.query("SELECT * FROM employee WHERE contact = ?", [contact], cb);
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

exports.createUserList = (item, cb) => {
  db.query("INSERT INTO userList SET ?", item, cb);
};

exports.getUserListByUserId = (user_id, cb) => {
  db.query("SELECT * FROM userList WHERE user_id = ?", [user_id], cb);
};

exports.createEmployeeList = (item, cb) => {
  db.query("INSERT INTO employee SET ?", item, cb);
};
