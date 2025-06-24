/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("employee", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.text("address").notNullable();
    table.text("contact").notNullable();
    table.text("email").notNullable();
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("userLogin")
      .onDelete("CASCADE"); // delete list if user is deleted
    table.timestamps(true, true); // created_at, updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("employee");
};
