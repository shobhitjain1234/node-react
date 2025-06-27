/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("company", (table) => {
    table.increments("id").primary();
    table.text("company_name").notNullable().unique();
    table.text("emai").notNullable().unique();
    table.text("address");
    table.text("domain");
    table.boolean("is_experience_required").notNullable().defaultTo(0);
    table.text("total_experience_in_years");
    table
      .integer("company_id")
      .unsigned()
      .references("id")
      .inTable("userLogin")
      .onDelete("CASCADE"); // delete list if user is deleted
    table.timestamps(true, true); // created_at, updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("company");
};
