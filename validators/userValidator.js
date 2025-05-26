const userSchema = {
  type: "object",
  required: ["name", "email", "password"],
  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 20,
      errorMessage: {
        type: "Name must be a text value",
        minLength: "Name must be at least 3 characters long",
        maxLength: "Name should not be more than 20 characters"
      }
    },
    email: {
      type: "string",
      minLength: 10,
      format: "email",
      errorMessage: {
        type: "Email must be a string",
        minLength: "Email must be at least 10 characters long",
        format: "Email must be a valid email address"
      }
    },
    password: {
      type: "string",
      minLength: 6,
      maxLength: 12,
      errorMessage: {
        type: "Password must be a string",
        minLength: "Password must be at least 6 characters",
        maxLength: "Password should not be more than 12 characters"
      }
    },

  },
  additionalProperties: true,
  errorMessage: {
    required: {
      name: "Name is required",
      email: "Email is required",
      password: "Password is required"
    },
    _: "Invalid data" // fallback message
  }
};


const companySchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 20,
      errorMessage: {
        type: "Name must be a text value",
        minLength: "Company name must be at least 3 characters",
        maxLength: "Company name must not exceed 20 characters"
      }
    }
  },
  required: ["name"],
  additionalProperties: false,
  errorMessage: {
    required: {
      name: "Company name is required"
    }
  }
};

module.exports = { userSchema, companySchema };
