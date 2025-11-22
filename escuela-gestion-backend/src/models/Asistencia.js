const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Empleado = require("./Empleado");

const Asistencia = sequelize.define("Asistencia", {
  id_asistencia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  empleado_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hora_entrada: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  hora_salida: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  estado: {
    type: DataTypes.ENUM("puntual", "retardo", "falta", "permiso"),
    allowNull: false,
    defaultValue: "puntual",
  },
});

Empleado.hasMany(Asistencia, { foreignKey: "empleado_id" });
Asistencia.belongsTo(Empleado, { foreignKey: "empleado_id" });

module.exports = Asistencia;
