const ProfesorService = require("../services/ProfesorService");

class ProfesorController {
  // ? Crear nueva solicitud de permiso
  static async solicitarPermiso(req, res) {
    try {
      const permiso = await ProfesorService.solicitarPermiso(req.body);
      return res.status(201).json({
        status: true,
        message: "Permiso solicitado exitosamente",
        data: permiso,
      });
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  }

  // ? Actualizar permiso antes de validación
  static async actualizarPermiso(req, res) {
    try {
      const { id_permiso } = req.params;
      const permiso = await ProfesorService.actualizarPermiso(id_permiso, req.body);
      return res.status(200).json({
        status: true,
        message: "Permiso actualizado correctamente",
        data: permiso,
      });
    } catch (error) {
      return res.status(200).json({ status: false, message: error.message });
    }
  }

  // ? Cancelar permiso
  static async cancelarPermiso(req, res) {
    try {
      const { id_permiso } = req.params;
      console.log(id_permiso)
      const permiso = await ProfesorService.cancelarPermiso(id_permiso);
      return res.status(200).json({
        status: true,
        message: "Permiso cancelado correctamente",
        data: permiso,
      });
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  }

  // ? Consultar historial de permisos
  static async obtenerHistorial(req, res) {
    try {
      const { empleado_id } = req.params;
      const historial = await ProfesorService.obtenerHistorial(empleado_id);
      return res.status(200).json({
        status: true,
        message: "Historial obtenido correctamente",
        data: historial,
      });
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  }

  // ? Registrar reposición de horas
  static async registrarReposicion(req, res) {
    try {
      const { empleado_id, fecha, horas_recuperadas } = req.body;
      const asistencia = await ProfesorService.registrarReposicion(
        empleado_id,
        fecha,
        horas_recuperadas
      );
      return res.status(201).json({
        status: true,
        message: "Reposición registrada correctamente",
        data: asistencia,
      });
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  }
}

module.exports = ProfesorController;
