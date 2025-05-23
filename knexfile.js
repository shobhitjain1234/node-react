module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: "localhost",
      user: "root",
      password: "",
      database: "crud_db",
    },
    migrations: {
      directory: "./migrations",
    },
  },
};
