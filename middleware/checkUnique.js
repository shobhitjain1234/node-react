const userModel = require("../models/userModel");

// Factory function that returns middleware
const checkUniqueInWholeTable = (options = {}) => {
  return (req, res, next) => {
    const { columnName, tableName } = options;

    const column = req.body[columnName];

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

const checkUniqueInCompanyScope = (options = {}) => {
  return (req, res, next) => {
    const { columnName, tableName } = options;

    const columnValue = req.body[columnName];
    const companyId = req.body.company_id;

    if (!companyId) {
      return res.status(400).json({
        message: "company_id is required for uniqueness check",
        code: 106,
      });
    }

    userModel.findUserByColumnAndCompany(
      columnValue,
      columnName,
      tableName,
      companyId,
      (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length > 0) {
          return res.json({
            message: `${columnName} already exists in the same company`,
            code: 105,
          });
        }
        next();
      }
    );
  };
};

module.exports = { checkUniqueInWholeTable, checkUniqueInCompanyScope };
