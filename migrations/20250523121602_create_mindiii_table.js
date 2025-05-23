/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("mindiii", (table) => {
    table.increments("id").primary();
    table.string("employee_count").notNullable();
    table.string("tech_count").unique().notNullable();
    table.timestamps(true, true); // created_at and updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("mindiii");
};
