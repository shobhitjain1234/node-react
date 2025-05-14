function validateFields(data, rules) {
  const errors = {};

  for (const field in rules) {
    const rule = rules[field];
    const value = data[field];
    const label = rule.label || field;

    // Required check
    if (rule.required && (!value || value.toString().trim() === "")) {
      errors[field] = `${label} is required`;
      continue;
    }

    if (!value) continue; // If not required and not present, skip further validation

    const strValue = value.toString();

    // Type check
    if (rule.type === "int" && isNaN(parseInt(strValue))) {
      errors[field] = `${label} must be a number`;
      continue;
    }

    if (rule.type === "string" && typeof strValue !== "string") {
      errors[field] = `${label} must be a string`;
      continue;
    }

    // Min length check
    if (rule.min && strValue.length < rule.min) {
      errors[field] = `${label} must be at least ${rule.min} characters`;
      continue;
    }

    // Max length check
    if (rule.max && strValue.length > rule.max) {
      errors[field] = `${label} should not be more than ${rule.max} characters`;
      continue;
    }

    // Regex check
    if (rule.regex && !rule.regex.test(strValue)) {
      errors[field] = `${label} format is invalid`;
    }
  }

  return errors;
}

function checkDuplicate(db, tableName, columnName, value) {
  return new Promise((resolve, reject) => {
    const query = `SELECT id FROM ?? WHERE ?? = ?`;
    db.query(query, [tableName, columnName, value], (err, results) => {
      if (err) return reject(err);
      resolve(results.length > 0);
    });
  });
}

module.exports = {
  checkDuplicate,
  validateFields,
};
