/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  return knex.schema.alterTable("vendor", (table) => {
    table.dropUnique(["email"]);
  });
};

exports.down = async function (knex) {
  return knex.schema.alterTable("vendor", (table) => {
    table.unique(["email"]);
  });
};
