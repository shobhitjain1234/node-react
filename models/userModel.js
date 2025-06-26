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

exports.getEmployeeListByUserId = (user_id, cb) => {
  db.query("SELECT * FROM employee WHERE user_id = ?", [user_id], cb);
};

exports.getUserUserId = (user_id, cb) => {
  db.query("SELECT * FROM userLogin WHERE id = ?", [user_id], cb);
};

exports.createEmployeeList = (item, cb) => {
  db.query("INSERT INTO employee SET ?", item, cb);
};

exports.createWorkTypeList = (item, cb) => {
  db.query("INSERT INTO workType SET ?", item, cb);
};

exports.getWorkTypeById = (work_id, cb) => {
  db.query("SELECT * FROM workType WHERE work_id = ?", [work_id], cb);
};

exports.checkEmployeeExists = (work_id, tableName) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [work_id],
      (err, result) => {
        if (err) return reject(err);
        if (result.length === 0) return resolve(null); // No employee found with this work_id
        resolve(result[0]); // Return employee record
      }
    );
  });
};

exports.storeResetOtp = (email, otp, expires, cb) => {
  db.query(
    "UPDATE userLogin SET reset_otp = ?, reset_otp_expires = ? WHERE email = ?",
    [otp, expires, email],
    cb
  );
};

exports.verifyResetOtp = (email, otp, cb) => {
  db.query(
    "SELECT * FROM userLogin WHERE email = ? AND reset_otp = ? AND reset_otp_expires > NOW()",
    [email, otp],
    (err, results) => {
      if (err) return cb(err);
      if (results.length === 0) return cb(null, false);
      cb(null, true);
    }
  );
};

exports.updatePassword = (email, hashedPassword, cb) => {
  db.query(
    "UPDATE userLogin SET password = ?, reset_otp = NULL, reset_otp_expires = NULL WHERE email = ?",
    [hashedPassword, email],
    cb
  );
};

exports.createWorkDetailList = (item, cb) => {
  db.query("INSERT INTO workDetail SET ?", item, cb);
};
