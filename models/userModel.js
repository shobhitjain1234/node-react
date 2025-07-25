const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.findUserByColumn = (column, columnName, tableName, cb) => {
  db.query(`SELECT * FROM ${tableName} WHERE ${columnName} = ?`, [column], cb);
};

(exports.findUserByColumnAndCompany = (
  value,
  columnName,
  tableName,
  companyId,
  callback
) => {
  const query = `SELECT * FROM ?? WHERE ?? = ? AND company_id = ? LIMIT 1`;
  const params = [tableName, columnName, value, companyId];

  db.query(query, params, callback);
}),
  (exports.findUserByContact = (contact, cb) => {
    db.query("SELECT * FROM employee WHERE contact = ?", [contact], cb);
  });

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

exports.getAllLoggedUser = (cb) => {
  db.query("SELECT * FROM userLogin ", cb);
};

exports.deleteLoggedUser = (userId, cb) => {
  db.query("DELETE FROM userLogin WHERE id = ?", [userId], cb);
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

exports.getWorkDetailById = (work_id, cb) => {
  db.query("SELECT * FROM workDetail WHERE work_id = ?", [work_id], cb);
};

exports.createCompanyList = (item, cb) => {
  db.query("INSERT INTO company SET ?", item, cb);
};

exports.getCompanyList = (company_id, cb) => {
  db.query("SELECT * FROM company WHERE company_id = ?", [company_id], cb);
};

exports.getCompanyDetail = (id, cb) => {
  db.query("SELECT * FROM company WHERE id = ?", [id], cb);
};

exports.getCompanySearch = (
  is_experience_required,
  total_experience_in_years,
  cb
) => {
  db.query(
    "SELECT * FROM company WHERE is_experience_required = ? && total_experience_in_years = ?",
    [is_experience_required, total_experience_in_years],

    cb
  );
};

exports.createVendorList = (item, cb) => {
  db.query("INSERT INTO vendor SET ?", item, cb);
};

exports.getVendorsByCompany = (company_id, cb) => {
  db.query("SELECT * FROM vendor WHERE company_id = ?", [company_id], cb);
};

exports.getVendorListWithCompany = (cb) => {
  const query = `
    SELECT 
      vendor.id AS vendor_id,
      vendor.name AS vendor_name,
      vendor.email,
      vendor.total_experience_in_years,
      vendor.company_id,
      company.company_name,
      company.address,
      company.domain
    FROM vendor
    INNER JOIN company ON vendor.company_id = company.id
  `;

  db.query(query, cb);
};

exports.createProductList = (item, cb) => {
  db.query("INSERT INTO product SET ?", item, cb);
};

exports.getProductListByUserId = (user_id, searchText, priceText, cb) => {
  let query = `SELECT * FROM product WHERE user_id = ?`;
  let params = [user_id];

  if (searchText && priceText) {
    query += ` AND (name LIKE ? AND price LIKE ?)`;
    params.push(`%${searchText}%`, `%${priceText}%`);
  } else if (searchText) {
    query += ` AND name LIKE ?`;
    params.push(`%${searchText}%`);
  } else if (priceText) {
    query += ` AND price LIKE ?`;
    params.push(`%${priceText}%`);
  }

  db.query(query, params, cb);
};

exports.getProductTypeTotalByUserId = (user_id, cb) => {
  const query = `
    SELECT type, SUM(CAST(price AS DECIMAL)) AS total_price
    FROM product
    WHERE user_id = ?
    GROUP BY type
  `;
  db.query(query, [user_id], cb);
};
