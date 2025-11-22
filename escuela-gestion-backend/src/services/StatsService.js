const Estadistica = require("../models/Estadistica");

class StatsService {
  static async obtenerPorTipo(tipo) {
    return await Estadistica.findAll({ where: { tipo } });
  }

  static async obtenerResumenGeneral() {
    return await Estadistica.findAll({
      attributes: ["tipo", "periodo", "total_registros"],
      order: [["id_estadistica", "DESC"]],
      limit: 10,
    });
  }
}

module.exports = StatsService;
