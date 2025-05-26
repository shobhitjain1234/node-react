// middleware/validate.js
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajvErrors = require("ajv-errors");

const ajv = new Ajv({ allErrors: true, strict: false, $data: true });
addFormats(ajv);
ajvErrors(ajv);

const checkValidation = (schema) => {
  const validate = ajv.compile(schema); // compile schema with AJV
  return (req, res, next) => {
  // Remove empty strings before validating
  Object.keys(req.body).forEach(key => {
    if (req.body[key] === "") delete req.body[key];
  });

  const valid = validate(req.body);
  if (!valid) {
    const error = validate.errors[0];
    return res.json({
      message: error.message,
      code: 104
    });
  }
  next();
};
};

module.exports = { checkValidation };
