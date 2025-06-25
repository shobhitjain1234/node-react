const userModel = require("../models/userModel");

// Middleware to check if work_id exists in employee table
const checkIfIdExists = (columnName, tableName) => {
  console.log("+++++++++++++++", columnName);
  return (req, res, next) => {
    const columnId = req.body[columnName]; // Get the ID from the request body

    if (!columnId) {
      return res.status(400).json({
        message: `${columnName} is required`,
        code: 101,
      });
    }

    // Call the model to check if the ID exists in the specified table
    userModel
      .checkEmployeeExists(columnId, tableName)
      .then((result) => {
        if (!result) {
          return res.json({
            message: `${columnName} not found in ${tableName}`,
            code: 106,
          });
        }
        next(); // Proceed to the next middleware or controller
      })
      .catch((err) => {
        return res.status(500).send({
          message: "Error checking ID existence",
          error: err,
          code: 500,
        });
      });
  };
};

module.exports = { checkIfIdExists };
