// middleware/validate.js
const checkValidation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.json({ message: error.details[0].message, code: 104 });
    }
    next();
  };
};

module.exports = {
  checkValidation,
};
