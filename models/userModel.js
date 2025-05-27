const db = require("../config/db");

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
