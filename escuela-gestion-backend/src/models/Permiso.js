const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Empleado = require("./Empleado");

const Permiso = sequelize.define("Permiso", {
  id_permiso: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  empleado_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM("temporal", "economico", "cumpleaños"),
    allowNull: false,
  },
  motivo: { type: DataTypes.STRING, allowNull: true },
  fecha_solicitud: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  fecha_inicio: { type: DataTypes.DATE, allowNull: false },
  estatus_director: {
    type: DataTypes.ENUM("pendiente", "aprobado", "rechazado"),
    defaultValue: "pendiente",
  },
  estatus_rh: {
    type: DataTypes.ENUM("pendiente", "aprobado", "rechazado"),
    defaultValue: "pendiente",
  },
  evidencia: { type: DataTypes.STRING },
  observaciones: { type: DataTypes.STRING },
});

Empleado.hasMany(Permiso, { foreignKey: "empleado_id" });
Permiso.belongsTo(Empleado, { foreignKey: "empleado_id" });

module.exports = Permiso;
