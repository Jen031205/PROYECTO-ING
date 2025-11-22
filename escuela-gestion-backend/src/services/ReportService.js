const Reporte = require("../models/Reporte");
const Permiso = require("../models/Permiso");
const Asistencia = require("../models/Asistencia");
const { Op } = require("sequelize");

class ReportService {
  static async obtenerDatosReporte(tipo, inicio, fin) {
    switch (tipo) {
      case "asistencia":
        return await Asistencia.findAll({
          where: {
            fecha: { [Op.between]: [inicio, fin] },
            estado: { [Op.is]: "puntual" }
          },
        });
      case "permisos":
        return await Permiso.findAll({
          where: {
            fecha_solicitud: { [Op.between]: [inicio, fin] },
          },
        });
      case "retardos":
        return await Asistencia.findAll({
          where: {
            fecha: { [Op.between]: [inicio, fin] },
            estado: { [Op.is]: "retardo" }
          },
        });
      default:
        return [];
    }
  }

  static async guardarReporteGenerado(id, path_pdf) {
    const reporte = await Reporte.findByPk(id);
    if (!reporte) throw new Error("Reporte no encontrado");
    reporte.path_pdf = path_pdf;
    await reporte.save();
    return reporte;
  }
}

module.exports = ReportService;
