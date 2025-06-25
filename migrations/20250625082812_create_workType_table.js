/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("workType", (table) => {
    table.increments("id").primary();
    table.text("worktype").notNullable();
    table.text("payroll").notNullable();
    table
      .integer("work_id")
      .unsigned()
      .references("id")
      .inTable("employee")
      .onDelete("CASCADE"); // delete list if user is deleted
    table.timestamps(true, true); // created_at, updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("workType");
};
