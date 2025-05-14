// fieldRules.js

module.exports = {
  email: {
    required: true,
    min: 6,
    max: 20,
    label: "Email",
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  name: {
    required: true,
    min: 3,
    max: 30,
    label: "Name",
    type: "string",
  },
  age: {
    required: false,
    label: "Age",
    type: "int",
  },
  address: {
    required: false,
    min: 5,
    max: 10,
    label: "Address",
    type: "string",
  },

  // Add other fields as needed...
};
