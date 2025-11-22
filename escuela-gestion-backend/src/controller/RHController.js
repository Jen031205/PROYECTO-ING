const RHService = require("../services/RHService");

class RHController {
  // ? Revisar permiso (aprobar/rechazar)
  static async revisarPermiso(req, res) {
    try {
      const { id_permiso } = req.params;
      const { estatus, comentario } = req.body;
      const permiso = await RHService.revisarPermiso(id_permiso, estatus, comentario);
      return res.status(200).json({
        status: true,
        message: `Permiso ${estatus} por RH correctamente`,
        data: permiso,
      });
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  }

  // ? Subir evidencia
  static async subirEvidencia(req, res) {
    try {
      const { id_permiso, url_archivo, tipo_archivo } = req.body;
      const evidencia = await RHService.subirEvidencia(id_permiso, url_archivo, tipo_archivo);
      return res.status(201).json({
        status: true,
        message: "Evidencia subida correctamente",
        data: evidencia,
      });
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  }

  // ? Filtrar permisos 
  // * ****************************************************************************************************************
  static async filtrarPermisos(req, res) {
    try {
      const permisos = await RHService.filtrarPermisos(req.query);
      return res.status(200).json({
        status: true,
        message: "Permisos filtrados correctamente",
        data: permisos,
      });
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  }
  // * ****************************************************************************************************************

  // ? Generar estadísticas
  static async generarEstadisticas(req, res) {
    try {
      const { tipo, periodo, detalles } = req.body;
      const estadistica = await RHService.generarEstadisticas(tipo, periodo, detalles);
      return res.status(201).json({
        status: true,
        message: "Estadísticas generadas correctamente",
        data: estadistica,
      });
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  }

  // ? Listar permisos aprobados globalmente
  static async listarAprobados(req, res) {
    try {
      const permisos = await RHService.listarAprobados();
      return res.status(200).json({
        status: true,
        message: "Permisos aprobados obtenidos correctamente",
        data: permisos,
      });
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  }

  // ? Actualizar permiso (aprobar o rechazar)
  static async actualizarPermiso(req, res) {
    try {
      const { id_permiso } = req.params;
      const { estatus, comentario } = req.body;

      const resultado = await RHService.actualizarPermiso(id_permiso, {
        estatus,
        comentario,
      });

      return res.status(200).json({
        status: true,
        message: resultado.message,
        data: resultado.permiso,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  // ? Obtener estadísticas completas de permisos
  static async obtenerEstadisticasPermisos(req, res) {
    try {
      const estadisticas = await RHService.obtenerEstadisticasPermisos();
      return res.status(200).json({
        status: true,
        message: "Estadísticas de permisos obtenidas correctamente",
        data: estadisticas,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  static async descargarReporteEstadisticas(req, res) {
    try {
      const stream = await RHService.generarReporteEstadisticas();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=reporte_estadisticas.pdf");
      stream.pipe(res);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }

}

module.exports = RHController;
