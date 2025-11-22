const permisoSchema = require("../validators/permisoValidator.js");
const PermisoService = require("../services/PermisoService.js");

class PermisoController {
    static async crear(req, res) {
        try {
            const { error, value } = permisoSchema.validate(req.body);
            if (error)
                return res.status(400).json({ message: "Error de validación", details: error.details });

            const permiso = await PermisoService.crearPermiso(value);
            return res.status(201).json({ status: true, permiso });
        } catch (err) {
            return res.status(500).json({ status: false, message: err.message });
        }
    }

    static async listar(req, res) {
        try {
            const permisos = await PermisoService.listarPorEmpleado(req.params.empleado_id);
            res.json(permisos);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async actualizar(req, res) {
        try {
            const permiso = await PermisoService.actualizarPermiso(req.params.id, req.body);
            res.json({ status: true, permiso });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    static async cancelar(req, res) {
        try {
            const permiso = await PermisoService.cancelarPermiso(req.params.id);
            res.json({ status: true, permiso });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = PermisoController;
