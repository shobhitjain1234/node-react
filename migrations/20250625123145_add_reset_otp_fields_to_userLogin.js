exports.up = function (knex) {
  return knex.schema.alterTable("userLogin", function (table) {
    table.string("reset_otp", 10);
    table.dateTime("reset_otp_expires");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("userLogin", function (table) {
    table.dropColumn("reset_otp");
    table.dropColumn("reset_otp_expires");
  });
};
