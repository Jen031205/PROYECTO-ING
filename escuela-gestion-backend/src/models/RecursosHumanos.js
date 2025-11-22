const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const RecursosHumanos = sequelize.define("RecursosHumanos", {
  id_rh: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  empleado_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  area_responsable: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = RecursosHumanos;
