/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("company", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("address");
    table.timestamps(true, true); // created_at and updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("company");
};
