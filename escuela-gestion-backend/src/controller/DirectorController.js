const DirectorService = require("../services/DirectorService");
const stream = require("stream")

class DirectorController {
  // ? Validar permiso (aprobar o rechazar)
  static async validarPermiso(req, res) {
    try {
      const { id_permiso } = req.params;
      const { estatus, observaciones } = req.body;
      const permiso = await DirectorService.validarPermiso(id_permiso, estatus, observaciones);
      return res.status(200).json({
        status: true,
        message: `Permiso ${estatus} correctamente`,
        data: permiso,
      });
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  }

  // ? Registrar asistencia
  static async registrarAsistencia(req, res) {
    try {
      const { empleado_id, fecha, hora_entrada, hora_salida } = req.body;
      const asistencia = await DirectorService.registrarAsistencia(
        empleado_id,
        fecha,
        hora_entrada,
        hora_salida
      );
      return res.status(201).json({
        status: true,
        message: "Asistencia registrada exitosamente",
        data: asistencia,
      });
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  }

  // ? Registrar retardo y aplicar multa
  static async registrarRetardo(req, res) {
    try {
      const { empleado_id, fecha, minutos_retraso } = req.body;
      const resultado = await DirectorService.registrarRetardo(
        empleado_id,
        fecha,
        minutos_retraso
      );
      return res.status(201).json({
        status: true,
        message: "Retardo registrado y multa aplicada",
        data: resultado,
      });
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  }

  // ? Generar reporte
  static async generarReporte(req, res) {
    try {
      const { stream, reporte } = await DirectorService.generarReporte(req.body);
      reporte
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=reporte_${reporte.tipo}_${Date.now()}.pdf`
      );

      // ? Enviar los datos del stream manualmente
      stream.on("data", (chunk) => res.write(chunk));
      stream.on("end", () => res.end());
      stream.on("error", (err) => {
        console.error("Error al enviar el PDF:", err);
        res.status(500).json({ status: false, message: "Error al generar PDF" });
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ status: false, message: error.message });
    }
  }


  // ? Listar permisos pendientes
  static async listarPermisosPendientes(req, res) {
    try {
      const permisos = await DirectorService.listarPermisosPendientes();
      return res.status(200).json({
        status: true,
        message: "Permisos pendientes obtenidos correctamente",
        data: permisos,
      });
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  }
}

module.exports = DirectorController;
