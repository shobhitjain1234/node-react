/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table("userList", (table) => {
    table.string("isactive").defaultTo("1"); // Add a new 'status' column with a default value of 'active'
  });
};

exports.down = function (knex) {
  return knex.schema.table("userList", (table) => {
    table.dropColumn("isactive"); // Drop the 'status' column if rolling back the migration
  });
};
