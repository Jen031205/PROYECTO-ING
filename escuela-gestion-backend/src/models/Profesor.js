const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Profesor = sequelize.define("Profesor", {
  id_profesor: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  empleado_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  area: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  horas_asignadas: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Profesor;
