/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table("userList", (table) => {
    table.string("actice").defaultTo("1"); // Re-add 'example_column'
    table.integer("verify").defaultTo("0"); // Re-add 'another_column'
  });
};

exports.down = function (knex) {
  return knex.schema.table("userList", (table) => {
    table.dropColumn("example_column"); // Drop 'example_column'
    table.dropColumn("another_column"); // Drop 'another_column'
  });
};
