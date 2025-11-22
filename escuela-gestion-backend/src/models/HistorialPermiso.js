const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Permiso = require("./Permiso");

const HistorialPermiso = sequelize.define("HistorialPermiso", {
  id_historial: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  permiso_id: { type: DataTypes.INTEGER, allowNull: false },
  accion: { type: DataTypes.STRING, allowNull: false },
  realizado_por: { type: DataTypes.STRING }, // * Director, RH o Empleado
  fecha_accion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  comentarios: { type: DataTypes.STRING },
});

Permiso.hasMany(HistorialPermiso, { foreignKey: "permiso_id" });
HistorialPermiso.belongsTo(Permiso, { foreignKey: "permiso_id" });

module.exports = HistorialPermiso;
