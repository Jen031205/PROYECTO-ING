const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Permiso = require("./Permiso");

const Evidencia = sequelize.define("Evidencia", {
  id_evidencia: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  permiso_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  url_archivo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo_archivo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Permiso.hasMany(Evidencia, { foreignKey: "permiso_id" });
Evidencia.belongsTo(Permiso, { foreignKey: "permiso_id" });

module.exports = Evidencia;
