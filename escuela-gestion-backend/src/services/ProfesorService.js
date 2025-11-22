const Permiso = require("../models/Permiso");
const HistorialPermiso = require("../models/HistorialPermiso");
const Asistencia = require("../models/Asistencia");
const { Op } = require("sequelize");
const Empleado = require("../models/Empleado");
const MailService = require("../services/MailService")

class ProfesorService {
  /**
   * Crear un nuevo permiso
   * Retorna { mensaje } si hay validaciones de negocio
   */
  static async solicitarPermiso(data) {
    try {
      if (!data.empleado_id || !data.tipo)
        return { mensaje: "Datos incompletos para generar el permiso", valiadtion_error: true };

      // * Validar que no tenga más de 3 permisos pendientes
      const pendientes = await Permiso.count({
        where: {
          empleado_id: data.empleado_id,
          estatus_director: "pendiente",
        },
      });

      if (pendientes >= 3) {
        return { mensaje: "No se pueden tener más de 3 permisos pendientes al mismo tiempo", valiadtion_error: true };
      }

      // * Validar que solo haya un permiso de cumpleaños pendiente o aprobado
      if (data.tipo === "cumpleaños") {
        const cumplePendiente = await Permiso.count({
          where: {
            empleado_id: data.empleado_id,
            tipo: "cumpleaños",
            estatus_director: { [Op.in]: ["pendiente", "aprobado"] },
          },
        });
        if (cumplePendiente > 0) {
          return { mensaje: "Solo se puede tener un permiso de cumpleaños activo a la vez", valiadtion_error: true };
        }
      }

      // * Crear permiso
      const permiso = await Permiso.create({
        ...data,
        estatus_director: "pendiente",
        estatus_rh: "pendiente",
        fecha_solicitud: new Date(),
      });

      await HistorialPermiso.create({
        permiso_id: permiso.id_permiso,
        accion: "Permiso solicitado",
        realizado_por: "empleado",
      });

      const empleado = await Empleado.findOne({
        where: {
          id_empleado:data.empleado_id
        }
      })

      const director = await Empleado.findOne({
        where: {
          rol: "director" 
        }
      })

      await MailService.sendEmail({
        to: director.correo,
        subject: "Nueva Solicitud de Permiso",
        template: "solicitudPermiso",
        variables: {
          nombreEmpleado: empleado.nombre,
          tipoPermiso: data.tipo,
          fechaSolicitud: permiso.fecha_solicitud.toLocaleDateString(),
          motivo: data.motivo,
          estatus: "pendiente"
        }
      });


      return permiso;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Actualizar permiso antes de validación
   * Retorna { mensaje } si no se puede modificar
   */
  static async actualizarPermiso(id_permiso, data) {
    try {
      const permiso = await Permiso.findByPk(id_permiso);
      if (!permiso) return { mensaje: "Permiso no encontrado" };
      if (permiso.estatus_director !== "pendiente")
        return { mensaje: "No se puede modificar un permiso ya revisado", valiadtion_error: true };

      await permiso.update(data);

      await HistorialPermiso.create({
        permiso_id: id_permiso,
        accion: "Permiso actualizado por el empleado",
        realizado_por: "empleado",
      });

      return permiso;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Cancelar permiso
   * Retorna { mensaje } si no se encuentra
   */
  static async cancelarPermiso(id_permiso) {
    try {
      const permiso = await Permiso.findByPk(id_permiso);
      if (!permiso) return { mensaje: "Permiso no encontrado", valiadtion_error: true };

      permiso.estatus_director = "rechazado";
      permiso.estatus_rh = "rechazado";
      await permiso.save();

      await HistorialPermiso.create({
        permiso_id: id_permiso,
        accion: "Permiso cancelado",
        realizado_por: "empleado",
      });

      return permiso;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Consultar historial de permisos del empleado
   */
  static async obtenerHistorial(empleado_id) {
    try {
      return await Permiso.findAll({
        where: { empleado_id },
        order: [["fecha_solicitud", "DESC"]],
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Registrar reposición de horas
   */
  static async registrarReposicion(empleado_id, fecha, horas_recuperadas) {
    try {
      const asistencia = await Asistencia.create({
        empleado_id,
        fecha,
        estado: "puntual",
      });

      await HistorialPermiso.create({
        permiso_id: null,
        accion: `Reposición de ${horas_recuperadas} horas registrada`,
        realizado_por: "empleado",
      });

      return asistencia;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = ProfesorService;
