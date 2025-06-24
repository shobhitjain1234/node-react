const userModel = require("../models/userModel");

// Factory function that returns middleware
const checkUnique = (options = {}) => {
  return (req, res, next) => {
    const { columnName, tableName } = options;

    const column = req.body[columnName];

    console.log("checkEmailUnique middleware called with columnName:", column);

    userModel.findUserByColumn(
      column,
      columnName,
      tableName,
      (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length > 0) {
          return res.json({
            message: `${columnName} already exists`,
            code: 105,
          });
        }
        next();
      }
    );
  };
};

const checkContactUnique = (req, res, next) => {
  const contact = req.body.contact;

  userModel.findUserByContact(contact, (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length > 0) {
      //   return res.status(400).json({ message: "contact already exists" });
      return res.json({ message: "contact already exists", code: 176 });
    }
    next();
  });
};

module.exports = { checkUnique, checkContactUnique };
