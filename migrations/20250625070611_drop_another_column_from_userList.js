/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table("userList", (table) => {
    table.dropColumn("status"); // Drop the 'status' column
  });
};

exports.down = function (knex) {
  return knex.schema.table("userList", (table) => {
    table.string("status"); // If rolling back, re-add the 'status' column (you can adjust type or default value)
  });
};
