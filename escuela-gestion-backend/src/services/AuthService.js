const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const Empleado = require("../models/Empleado");
const MailService = require("./MailService");

class AuthService {

  /**
   * Generar código de verificación aleatorio (6 dígitos)
   */
  static generarCodigo() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Verificar código de login y activar cuenta
   */
  static async verify({ correo, loginCode, password }) {
    if (!correo || !loginCode || !password) {
      throw new Error("Todos los campos son obligatorios.");
    }

    // * Buscar empleado por correo y código
    const empleado = await Empleado.findOne({
      where: { correo, loginCode },
    });

    if (!empleado) {
      throw new Error("Código de confirmación incorrecto o usuario no encontrado.");
    }

    // * Activar cuenta y limpiar código
    empleado.activo = true;
    empleado.loginCode = null;
    empleado.password = await bcrypt.hash(password, 10);
    await empleado.save();

    // * Crear token JWT
    const token = jwt.sign(
      {
        id_empleado: empleado.id_empleado,
        rol: empleado.rol,
        nombre: empleado.nombre,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return {
      token,
      empleado: {
        id_empleado: empleado.id_empleado,
        nombre: empleado.nombre,
        correo: empleado.correo,
        rol: empleado.rol,
      },
    };
  }

  /**
   * Solicitud de restablecimiento de contraseña (envía correo)
   */
  static async requestPasswordReset(correo) {
    const empleado = await Empleado.findOne({ where: { correo } });

    if (!empleado) {
      throw new Error("Usuario no encontrado.");
    }

    const resetToken = jwt.sign(
      { id_empleado: empleado.id_empleado },
      process.env.JWT_SECRET || "clave_secreta",
      { expiresIn: "1h" }
    );

    const resetLink = `${process.env.FRONTEND_URL}/recuperar/${resetToken}`;

    await MailService.sendEmail({
      to: correo,
      subject: "Recuperación de Contraseña - Sistema de Permisos",
      template: "recuperarPassword",
      variables: {
        nombre: empleado.nombre,
        reset_link: resetLink,
      },
    });

    return { message: "Enlace de recuperación enviado correctamente.", resetLink };
  }

  /**
   * Restablecer contraseña con token JWT
   */
  static async resetPassword(token, nuevaPassword) {
    let decoded;

    console.log(token, nuevaPassword)
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "clave_secreta");
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        console.log("Es el token que expira jaja")
        throw new Error("El token ha expirado.");
      }
      throw new Error("Token inválido.");
    }

    const empleado = await Empleado.findByPk(decoded.id_empleado);

    if (!empleado) {
      throw new Error("Usuario no encontrado.");
    }

    empleado.password = await bcrypt.hash(nuevaPassword, 10);
    await empleado.save();

    return { message: "Contraseña restablecida exitosamente." };
  }
}

module.exports = AuthService;
