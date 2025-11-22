const Permiso = require("../models/Permiso");
const HistorialPermiso = require("../models/HistorialPermiso");
const Asistencia = require("../models/Asistencia");
const Multa = require("../models/Multa");
const Reporte = require("../models/Reporte");
const { Op } = require("sequelize");
const Empleado = require("../models/Empleado");
const PDFDocument = require("pdfkit")
const { PassThrough } = require("stream");
const MailService = require("./MailService");

class DirectorService {
  /**
   * Validar permiso (aprobar o rechazar)
   */
  static async validarPermiso(id_permiso, estatus, observaciones = "") {
    try {
      // * Buscar permiso
      const permiso = await Permiso.findByPk(id_permiso, {
        include: [{ model: Empleado, attributes: ["nombre", "correo", "rol"] }]
      });
      if (!permiso) throw new Error("Permiso no encontrado");

      // * Actualizar estado
      permiso.estatus_director = estatus;
      permiso.observaciones = observaciones;
      await permiso.save();

      // * Registrar en historial
      await HistorialPermiso.create({
        permiso_id: id_permiso,
        accion: `Permiso ${estatus} por director`,
        realizado_por: "director",
        comentarios: observaciones,
      });

      // * Buscar al empleado y RH
      const empleado = permiso.Empleado;
      const rh = await Empleado.findOne({ where: { rol: "rh" } });

      // * Variables del correo
      const variables = {
        nombreEmpleado: empleado.nombre,
        tipoPermiso: permiso.tipo,
        fechaSolicitud: permiso.fecha_solicitud.toLocaleDateString(),
        fechaInicio: permiso.fecha_inicio.toLocaleDateString(),
        motivo: permiso.motivo || "No especificado",
        observaciones: observaciones || "Sin observaciones",
        estatus: estatus,
        estatusClass: estatus
      };

      // * Enviar correos
      const destinatarios = [empleado.correo, rh.correo];

      for (const to of destinatarios) {
        await MailService.sendEmail({
          to,
          subject: `Permiso ${estatus.toUpperCase()} - ${permiso.tipo}`,
          template: "permisoActualizado",
          variables
        });
      }

      return permiso;
    } catch (error) {
      console.error("Error al validar permiso:", error);
      throw new Error("Error al validar el permiso");
    }
  }

  /**
   * Registrar asistencia
   */
  static async registrarAsistencia(empleado_id, fecha, hora_entrada, hora_salida) {
    const asistencia = await Asistencia.create({
      empleado_id,
      fecha,
      hora_entrada,
      hora_salida,
      estado: "puntual",
    });

    return asistencia;
  }

  /**
   * Registrar un retardo y aplicar sanciones/multas según los minutos de retraso.
   * 
   * Reglas tentativas (personalizables más adelante):
   * - 1–5 min: Advertencia sin multa
   * - 6–15 min: Multa leve
   * - 16–30 min: Multa moderada
   * - 31+ min: Multa grave + notificación a RH
   */
  static async registrarRetardo(empleado_id, fecha, minutos_retraso) {
    try {
      if (!empleado_id || !fecha || minutos_retraso == null) {
        throw new Error("Datos incompletos para registrar retardo");
      }

      // * Registrar la asistencia con estado 'retardo'
      const asistencia = await Asistencia.create({
        empleado_id,
        fecha,
        estado: "retardo",
      });

      // * Determinar el tipo de sanción según minutos de retraso
      let tipo = "advertencia";
      let monto = 0;
      let descripcion = "";

      if (minutos_retraso >= 1 && minutos_retraso <= 5) {
        tipo = "advertencia";
        descripcion = "Retardo leve, sin sanción económica.";
      } else if (minutos_retraso <= 15) {
        tipo = "leve";
        monto = 50;
        descripcion = "Retardo leve, multa simbólica aplicada.";
      } else if (minutos_retraso <= 30) {
        tipo = "moderada";
        monto = 100;
        descripcion = "Retardo moderado, multa estándar aplicada.";
      } else {
        tipo = "grave";
        monto = 200;
        descripcion = "Retardo grave, se notificará a RH.";
      }

      // * Crear multa (si aplica)
      const multa = monto > 0
        ? await Multa.create({
          asistencia_id: asistencia.id_asistencia,
          motivo: `Retardo de ${minutos_retraso} minutos (${tipo})`,
          monto,
        })
        : null;

      // * Notificar al empleado (y a RH si el retardo fue grave)
      const empleado = await Empleado.findByPk(empleado_id, {
        attributes: ["nombre", "correo"],
      });

      const rh = await Empleado.findOne({
        where: { rol: "rh" },
        attributes: ["nombre", "correo"],
      });

      // * En tu service antes de enviar el correo
      const tieneMulta = monto > 0;

      await MailService.sendEmail({
        to: empleado.correo,
        subject: "Registro de Retardo",
        template: "registroRetardo",
        variables: {
          nombreEmpleado: empleado.nombre,
          minutosRetraso: minutos_retraso,
          tipo,
          descripcion,
          montoTexto: tieneMulta ? `$${monto} MXN` : "Sin sanción económica",
          fecha,
        },
      });

      // * Si es grave, notificar también a RH
      if (tipo === "grave") {
        await MailService.sendEmail({
          to: rh.correo,
          subject: "Alerta de Retardo Grave",
          template: "alertaRetardoRH",
          variables: {
            nombreEmpleado: empleado.nombre,
            minutosRetraso: minutos_retraso,
            fecha,
            descripcion,
            monto,
          },
        });
      }

      return {
        message: `Retardo registrado correctamente (${tipo})`,
        asistencia,
        multa,
      };
    } catch (error) {
      console.error("Error al registrar retardo:", error);
      throw new Error("Error al registrar retardo");
    }
  }

  /**
   * Obtener los datos del reporte según el tipo
   */
  static async obtenerDatosReporte(tipo, inicio, fin) {
    switch (tipo) {
      case "asistencia":
        return await Asistencia.findAll({
          include: [{ model: Empleado, attributes: ["nombre"] }],
          where: {
            fecha: { [Op.between]: [inicio, fin] },
            estado: "puntual",
          },
          order: [["fecha", "ASC"]],
        });

      case "permisos":
        return await Permiso.findAll({
          include: [{ model: Empleado, attributes: ["nombre"] }],
          where: {
            fecha_solicitud: { [Op.between]: [inicio, fin] },
          },
          order: [["fecha_solicitud", "ASC"]],
        });

      case "retardos":
        return await Asistencia.findAll({
          include: [{ model: Empleado, attributes: ["nombre"] }],
          where: {
            fecha: { [Op.between]: [inicio, fin] },
            estado: "retardo",
          },
          order: [["fecha", "ASC"]],
        });

      default:
        return [];
    }
  }

  /**
   * Generar reporte PDF dinámico según el tipo
   */
  static async generarReporte({ tipo, periodo_inicio, periodo_fin, generado_por }) {
    // * Crear registro del reporte
    const reporte = await Reporte.create({
      tipo,
      periodo_inicio,
      periodo_fin,
      generado_por: generado_por || "sistema",
    });

    // * Obtener datos según tipo de reporte
    const registros = await this.obtenerDatosReporte(tipo, periodo_inicio, periodo_fin);

    // * Crear documento PDF
    const doc = new PDFDocument({ margin: 50 });
    const stream = new PassThrough();
    doc.pipe(stream);

    // * Encabezado principal
    doc
      .fontSize(22)
      .fillColor("#333")
      .text("Reporte de Recursos Humanos", { align: "center" })
      .moveDown();

    doc
      .fontSize(14)
      .fillColor("#000")
      .text(`Tipo de Reporte: ${tipo.toUpperCase()}`)
      .text(`Periodo: ${periodo_inicio} a ${periodo_fin}`)
      .text(`Generado por: ${reporte.generado_por}`)
      .text(`Fecha de generación: ${new Date().toLocaleString()}`)
      .moveDown();

    doc
      .fontSize(12)
      .fillColor("#000")
      .text(
        "Este documento fue generado automáticamente por el sistema de control interno.",
        { align: "justify" }
      )
      .moveDown(1);

    // * Validar si hay datos
    if (registros.length === 0) {
      doc
        .fontSize(12)
        .fillColor("#666")
        .text("No se encontraron registros en el rango de fechas especificado.", {
          align: "center",
        });
      doc.end();
      return { stream, reporte };
    }

    // * Encabezado de tabla según tipo
    doc
      .fontSize(16)
      .fillColor("#333")
      .text(`Detalle de ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`, {
        underline: true,
      })
      .moveDown(0.5);

    const headerY = doc.y;
    doc
      .fontSize(12)
      .fillColor("#000")
      .text("Empleado", 50, headerY);

    if (tipo === "permisos") {
      doc
        .text("Tipo", 200, headerY)
        .text("Estatus Dir.", 280, headerY)
        .text("Estatus RH", 390, headerY)
        .text("Fecha Solicitud", 480, headerY);
    } else {
      doc.text("Fecha", 250, headerY).text("Estado", 400, headerY);
    }

    doc.moveDown(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke("#aaa").moveDown(0.5);

    // * Renderizar filas
    for (const item of registros) {
      const empleado = item.Empleado?.nombre || "Desconocido";

      if (tipo === "permisos") {
        doc
          .fontSize(10)
          .fillColor("#000")
          .text(empleado, 50, doc.y)
          .text(item.tipo, 200, doc.y)
          .text(item.estatus_director, 280, doc.y)
          .text(item.estatus_rh, 390, doc.y)
          .text(new Date(item.fecha_solicitud).toLocaleDateString(), 480, doc.y)
          .moveDown(0.3);

        if (item.motivo) {
          doc
            .fontSize(9)
            .fillColor("#555")
            .text(`Motivo: ${item.motivo}`, 60, doc.y)
            .moveDown(0.3);
        }
      } else {
        doc
          .fontSize(10)
          .fillColor("#000")
          .text(empleado, 50, doc.y)
          .text(new Date(item.fecha).toLocaleDateString(), 250, doc.y)
          .text(item.estado, 400, doc.y)
          .moveDown(0.3);
      }

      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke("#eee").moveDown(0.3);
    }

    // * Finalizar documento
    doc.end();

    return { stream, reporte };
  }

  /**
   * Listar permisos pendientes por revisar
   */
  static async listarPermisosPendientes() {
    return await Permiso.findAll({
      where: { estatus_director: "pendiente" },
      order: [["fecha_solicitud", "DESC"]],
      include: [
        {
          model: Empleado,
          attributes: ["nombre", "correo", "id_empleado"],
        },
      ],
    });
  }
}

module.exports = DirectorService;
