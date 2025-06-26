exports.up = function (knex) {
  return knex.schema.alterTable("userLogin", function (table) {
    table.string("image").nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("userLogin", function (table) {
    table.dropColumn("image");
  });
};
