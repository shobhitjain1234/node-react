const userSchema = {
  type: "object",
  required: ["name", "email", "password", "address"],
  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 20,
      errorMessage: {
        type: "Name must be a text value",
        minLength: "Name must be at least 3 characters long",
        maxLength: "Name should not be more than 20 characters",
      },
    },
    email: {
      type: "string",
      minLength: 10,
      format: "email",
      errorMessage: {
        type: "Email must be a string",
        minLength: "Email must be at least 10 characters long",
        format: "Email must be a valid email address",
      },
    },
    password: {
      type: "string",
      minLength: 6,
      maxLength: 12,
      errorMessage: {
        type: "Password must be a string",
        minLength: "Password must be at least 6 characters",
        maxLength: "Password should not be more than 12 characters",
      },
    },
  },
  additionalProperties: true,
  errorMessage: {
    required: {
      name: "Name is required",
      email: "Email is required",
      password: "Password is required",
      address: "Address is required",
    },
    _: "Invalid data", // fallback message
  },
};

const createUserList = {
  type: "object",
  required: ["title", "description"],
  properties: {
    title: {
      type: "string",
      minLength: 3,
      maxLength: 20,
      errorMessage: {
        type: "title must be a text value",
        minLength: "title must be at least 3 characters",
        maxLength: "title must not exceed 20 characters",
      },
    },
  },

  additionalProperties: true,
  errorMessage: {
    required: {
      title: "title is required",
      description: "description is required",
    },
  },
};

module.exports = { userSchema, createUserList };
