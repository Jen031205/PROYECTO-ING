const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Asistencia = require("./Asistencia");

const Multa = sequelize.define("Multa", {
  id_multa: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  asistencia_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  motivo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  estatus: {
    type: DataTypes.ENUM("pendiente", "pagada"),
    defaultValue: "pendiente",
  },
});

Asistencia.hasOne(Multa, { foreignKey: "asistencia_id" });
Multa.belongsTo(Asistencia, { foreignKey: "asistencia_id" });

module.exports = Multa;
