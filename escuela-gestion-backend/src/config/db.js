const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("dbescuelagestion", "postgres", "2004", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

module.exports = sequelize;