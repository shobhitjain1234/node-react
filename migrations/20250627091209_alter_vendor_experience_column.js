exports.up = async function (knex) {
  return knex.schema.alterTable("vendor", (table) => {
    table.integer("total_experience_in_years").alter();
  });
};

exports.down = async function (knex) {
  return knex.schema.alterTable("vendor", (table) => {
    table.text("total_experience_in_years").alter();
  });
};
