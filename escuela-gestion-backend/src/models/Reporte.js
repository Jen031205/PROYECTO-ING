const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Reporte = sequelize.define("Reporte", {
  id_reporte: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  generado_por: {
    type: DataTypes.ENUM("director", "rh"),
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM("asistencia", "permisos", "multas", "general", "retardos"),
    allowNull: false,
  },
  periodo_inicio: { type: DataTypes.DATE, allowNull: false },
  periodo_fin: { type: DataTypes.DATE, allowNull: false },
  path_pdf: { type: DataTypes.STRING },
});

module.exports = Reporte;
