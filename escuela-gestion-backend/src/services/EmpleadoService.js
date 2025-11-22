const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Empleado = require("../models/Empleado");

class EmpleadoService {
  /**
   * Registrar nuevo empleado
   */
  static async registrarEmpleado(data) {
    const { nombre, correo, password, rol } = data;

    const existente = await Empleado.findOne({ where: { correo } });
    if (existente) throw new Error("El correo ya está registrado");

    const hash = await bcrypt.hash(password, 10);
    const empleado = await Empleado.create({
      nombre,
      correo,
      password: hash,
      rol,
    });

    return empleado;
  }

  /**
   * Login y generación de token JWT
   */
  static async loginEmpleado(correo, password) {
    const empleado = await Empleado.findOne({ where: { correo } });
    if (!empleado) throw new Error("Correo o contraseña incorrectos");

    const valido = await bcrypt.compare(password, empleado.password);
    if (!valido) throw new Error("Correo o contraseña incorrectos");

    if (!empleado.activo) throw new Error("Cuenta deshabilitada");

    const token = jwt.sign(
      {
        id_empleado: empleado.id_empleado,
        rol: empleado.rol,
        nombre: empleado.nombre,
      },
      process.env.JWT_SECRET || "clave_secreta",
      { expiresIn: "8h" }
    );

    return { token, empleado };
  }

  /**
   * Listar todos los empleados
   */
  static async listarEmpleados() {
    return await Empleado.findAll({
      attributes: ["id_empleado", "nombre", "correo", "rol", "activo"],
    });
  }

  /**
   * Deshabilitar o activar empleado
   */
  static async cambiarEstado(id_empleado, estado) {
    const empleado = await Empleado.findByPk(id_empleado);
    if (!empleado) throw new Error("Empleado no encontrado");

    empleado.activo = estado;
    await empleado.save();

    return empleado;
  }
}

module.exports = EmpleadoService;
