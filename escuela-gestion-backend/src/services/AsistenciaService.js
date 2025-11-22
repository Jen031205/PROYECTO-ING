const Asistencia = require("../models/Asistencia");

class AsistenciaService {
  static async obtenerAsistenciaPorEmpleado(empleado_id) {
    return await Asistencia.findAll({
      where: { empleado_id },
      order: [["fecha", "DESC"]],
    });
  }

  static async obtenerFaltas(fecha_inicio, fecha_fin) {
    return await Asistencia.findAll({
      where: {
        estado: "falta",
        fecha: {
          [Op.between]: [fecha_inicio, fecha_fin],
        },
      },
    });
  }
}

module.exports = AsistenciaService;
