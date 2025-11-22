const Permiso = require("../models/Permisos.js");
const HistorialPermiso = require("../models/HistorialPermiso.js");

class PermisoService {
  static async crearPermiso(data) {
    if (!data.empleado_id) throw new Error("Empleado no especificado");
    if (!data.tipo_permiso) throw new Error("Tipo de permiso requerido");

    const permiso = await Permiso.create({
      ...data,
      estatus: "pendiente",
      fecha_solicitud: new Date(),
    });

    await HistorialPermiso.create({
      permiso_id: permiso.id_permiso,
      accion: "Solicitud creada",
    });

    return permiso;
  }

  static async actualizarPermiso(id, data) {
    const permiso = await Permiso.findByPk(id);
    if (!permiso) throw new Error("Permiso no encontrado");

    if (permiso.estatus === "cancelado")
      throw new Error("No se puede modificar un permiso cancelado");

    await permiso.update(data);

    await HistorialPermiso.create({
      permiso_id: permiso.id_permiso,
      accion: "Solicitud actualizada",
    });

    return permiso;
  }

  static async cancelarPermiso(id) {
    const permiso = await Permiso.findByPk(id);
    if (!permiso) throw new Error("Permiso no encontrado");

    permiso.estatus = "cancelado";
    await permiso.save();

    await HistorialPermiso.create({
      permiso_id: permiso.id_permiso,
      accion: "Solicitud cancelada",
    });

    return permiso;
  }

  static async listarPorEmpleado(empleado_id) {
    return await Permiso.findAll({
      where: { empleado_id },
      order: [["fecha_solicitud", "DESC"]],
    });
  }
}

module.exports = PermisoService;
