const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Director = sequelize.define("Director", {
  id_director: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  empleado_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  departamento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Director;
