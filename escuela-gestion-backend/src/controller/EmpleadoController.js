const { EmptyResultError } = require("sequelize");
const EmpleadoService = require("../services/EmpleadoService");
const MailService = require("../services/MailService")
require("dotenv").config();

class EmpleadoController {
    /**
   * Registro de usuario
   */
    static async registrar(req, res) {
        try {
            const empleado = req.body
            await EmpleadoService.registrarEmpleado(req.body);

            // * Enviar correo de bienvenida  AAAA
            await MailService.sendEmail({
                to: empleado.correo,
                subject: "¡Bienvenido al Panel de Gestión de Permisos!",
                template: "bienvenida",
                variables: {
                    nombre: empleado.nombre,
                    correo: empleado.correo,
                    url_sistema: "http://localhost:3000",
                },
            });

            res.status(201).json({
                status: true,
                message: "Empleado registrado y correo enviado correctamente",
                empleado,
            });
        } catch (error) {
            console.error("Error en registrar empleado:", error);
            res.status(400).json({ status: false, message: error.message });
        }
    }

    /**
     * Login
     */
    static async login(req, res) {
        try {
            const { correo, password } = req.body;
            if (!correo || !password)
                return res
                    .status(400)
                    .json({ message: "Correo y contraseña son obligatorios" });

            const { token, empleado } = await EmpleadoService.loginEmpleado(
                correo,
                password
            );

            res.json({
                status: true,
                message: "Inicio de sesión exitoso",
                token,
                empleado: {
                    id_empleado: empleado.id_empleado,
                    nombre: empleado.nombre,
                    correo: empleado.correo,
                    rol: empleado.rol,
                },
            });
        } catch (error) {
            res.status(401).json({ status: false, message: error.message });
        }
    }

    /**
     * Listar empleados
     */
    static async listar(req, res) {
        try {
            const empleados = await EmpleadoService.listarEmpleados();
            res.json(empleados);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
     * Cambiar estado activo/inactivo
     */
    static async cambiarEstado(req, res) {
        try {
            const { id } = req.params;
            const { activo } = req.body;

            const empleado = await EmpleadoService.cambiarEstado(id, activo);
            res.json({
                status: true,
                message: `Empleado ${activo ? "activado" : "desactivado"} correctamente`,
                empleado,
            });
        } catch (error) {
            res.status(400).json({ status: false, message: error.message });
        }
    }
}

module.exports = EmpleadoController;
