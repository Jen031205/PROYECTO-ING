const Evidencia = require("../models/Evidencia");

class EvidenciasService {
  static async listarPorPermiso(permiso_id) {
    return await Evidencia.findAll({ where: { permiso_id } });
  }

  static async eliminarEvidencia(id_evidencia) {
    const evidencia = await Evidencia.findByPk(id_evidencia);
    if (!evidencia) throw new Error("Evidencia no encontrada");
    await evidencia.destroy();
    return true;
  }
}

module.exports = EvidenciasService;
