function validateFields(data, rules) {
  const errors = [];

  for (const field in rules) {
    const rule = rules[field];
    const value = data[field];
    const label = rule.label || field;

    // Required check
    if (rule.required && (!value || value.toString().trim() === "")) {
      errors.push(`${label} is required`);
      continue;
    }

    if (!value) continue; // If not required and not present, skip further validation

    const strValue = value.toString();

    // Type check
    if (rule.type === "int" && isNaN(parseInt(strValue))) {
      errors.push(`${label} must be a number`);
      continue;
    }

    if (rule.type === "string" && typeof strValue !== "string") {
      errors.push(`${label} must be a string`);
      continue;
    }

    // Min length check
    if (rule.min && strValue.length < rule.min) {
      errors.push(`${label} must be at least ${rule.min} characters`);
      continue;
    }

    // Max length check
    if (rule.max && strValue.length > rule.max) {
      errors.push(`${label} should not be more than ${rule.max} characters`);
      continue;
    }

    // Regex check
    if (rule.regex && !rule.regex.test(strValue)) {
      errors.push(`${label} format is invalid`);
    }
  }

  return errors;
}

function checkDuplicate(db, tableName, conditions) {
  return new Promise((resolve, reject) => {
    const fields = Object.keys(conditions);
    const values = Object.values(conditions);

    if (fields.length === 0) return resolve(null);

    const whereClause = fields.map((field) => `?? = ?`).join(" OR ");
    const queryParams = fields.flatMap((field, idx) => [field, values[idx]]);

    const query = `SELECT * FROM ?? WHERE ${whereClause} LIMIT 1`;

    db.query(query, [tableName, ...queryParams], (err, results) => {
      if (err) return reject(err);

      if (results.length > 0) {
        const duplicateFields = {};
        for (let key of fields) {
          if (results[0][key] === conditions[key]) {
            duplicateFields[key] = true;
          }
        }
        resolve(duplicateFields); // e.g., { email: true }
      } else {
        resolve(null);
      }
    });
  });
}

module.exports = {
  checkDuplicate,
  validateFields,
};
