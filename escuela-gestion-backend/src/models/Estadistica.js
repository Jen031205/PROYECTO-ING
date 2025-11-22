const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Estadistica = sequelize.define("Estadistica", {
  id_estadistica: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tipo: {
    type: DataTypes.ENUM("permiso", "asistencia", "departamento", "general"),
    allowNull: false,
  },
  periodo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total_registros: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  detalles: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

module.exports = Estadistica;
