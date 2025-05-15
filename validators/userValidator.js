// validators/userValidator.js
const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    "string.base": "Name must be a text value",
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters long",
    "string.max": "Name should not be more then 20 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
});

module.exports = { userSchema };
