const userModel = require("../models/userModel");

const checkEmailUnique = (req, res, next) => {
  const email = req.body.email;

  userModel.findUserByEmail(email, (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length > 0) {
      //   return res.status(400).json({ message: "Email already exists" });
      return res.json({ message: "Email already exists", code: 105 });
    }
    next();
  });
};

module.exports = { checkEmailUnique };
