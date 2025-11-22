const Permiso = require("../models/Permiso");
const HistorialPermiso = require("../models/HistorialPermiso");
const Evidencia = require("../models/Evidencia");
const Estadistica = require("../models/Estadistica");
const { Op } = require("sequelize");
const Empleado = require("../models/Empleado");
const MailService = require("./MailService");
const PDFDocument = require("pdfkit");
const { PassThrough } = require("stream");

class RHService {
    /**
    * Revisar permiso (aprobar o rechazar)
    */
    static async revisarPermiso(id_permiso, estatus, comentario = "") {
        try {
            // * Validar que el estatus sea correcto
            if (!["aprobado", "rechazado"].includes(estatus)) {
                throw new Error("Estatus inválido. Solo se permite 'aprobado' o 'rechazado'.");
            }

            // * Buscar el permiso con relación al empleado
            const permiso = await Permiso.findByPk(id_permiso, {
                include: [{ model: Empleado, attributes: ["nombre", "correo", "rol"] }],
            });
            if (!permiso) throw new Error("Permiso no encontrado");

            // * Actualizar estatus y observaciones
            permiso.estatus_rh = estatus;
            permiso.observaciones = comentario;
            await permiso.save();

            // * Registrar historial
            await HistorialPermiso.create({
                permiso_id: id_permiso,
                accion: `Permiso ${estatus} por Recursos Humanos`,
                realizado_por: "rh",
                comentarios: comentario,
            });

            // * Obtener datos del empleado y director
            const empleado = permiso.Empleado;
            const director = await Empleado.findOne({
                where: { rol: "director" },
                attributes: ["nombre", "correo"]
            });

            // * Variables compartidas
            const variables = {
                nombreEmpleado: empleado.nombre,
                tipoPermiso: permiso.tipo,
                fechaSolicitud: permiso.fecha_solicitud.toLocaleDateString(),
                fechaInicio: permiso.fecha_inicio.toLocaleDateString(),
                motivo: permiso.motivo || "No especificado",
                comentario: comentario || "Sin comentarios",
                estatus,
                estatusClass: estatus,
            };

            // * Notificar al empleado
            await MailService.sendEmail({
                to: empleado.correo,
                subject: `Tu permiso fue ${estatus.toUpperCase()} por Recursos Humanos`,
                template: "permisoRevisadoRH",
                variables,
            });

            // * Notificar al director
            await MailService.sendEmail({
                to: director.correo,
                subject: `Permiso de ${empleado.nombre} ${estatus.toUpperCase()} por RH`,
                template: "permisoResueltoDirector",
                variables,
            });

            return permiso;
        } catch (error) {
            console.error("Error al revisar permiso:", error);
            throw new Error("Error al revisar el permiso");
        }
    }

    /**
     * Adjuntar evidencia a permiso
     */
    static async subirEvidencia(id_permiso, url_archivo, tipo_archivo) {
        const evidencia = await Evidencia.create({
            permiso_id: id_permiso,
            url_archivo,
            tipo_archivo,
        });

        await HistorialPermiso.create({
            permiso_id: id_permiso,
            accion: "Evidencia subida",
            realizado_por: "rh",
        });

        return evidencia;
    }

    /**
     * Obtener permisos filtrados por criterios
     */
    static async filtrarPermisos({ tipo, mes, empleado_id }) {
        const where = {};
        if (tipo) where.tipo = tipo;
        if (empleado_id) where.empleado_id = empleado_id;
        if (mes) {
            where.fecha_inicio = {
                [Op.between]: [
                    new Date(`${mes}-01`),
                    new Date(`${mes}-31`),
                ],
            };
        }

        return await Permiso.findAll({
            where, include: [
                {
                    model: Empleado,
                    attributes: ["nombre", "correo", "id_empleado"],
                },
            ],
        });
    }

    /**
     * Generar estadísticas globales
     */
    static async generarEstadisticas(tipo, periodo, detalles) {
        const estadistica = await Estadistica.create({
            tipo,
            periodo,
            total_registros: detalles?.total || 0,
            detalles,
        });

        return estadistica;
    }

    /**
     * Listar permisos globales aprobados
    */
    static async listarAprobados() {
        return await Permiso.findAll({
            where: { estatus_rh: "aprobado" },
        });
    }

    /**
   * Actualizar el estatus de un permiso (aprobar o rechazar)
   * - Este método es llamado desde el frontend por RH
   * - Registra el cambio en el historial
   * - Notifica al empleado y al director
   */
    static async actualizarPermiso(id_permiso, { comentario = "", estatus }) {
        try {
            // * Validar existencia
            const permiso = await Permiso.findByPk(id_permiso, {
                include: [{ model: Empleado, attributes: ["nombre", "correo", "rol"] }],
            });
            if (!permiso) throw new Error("Permiso no encontrado");

            // * Validar que el director ya haya aprobado
            if (permiso.estatus_director !== "aprobado") {
                throw new Error("Solo permisos aprobados por el director pueden ser revisados por RH");
            }

            // * Validar estatus permitido
            const estatusValidos = ["aprobado", "rechazado"];
            if (!estatusValidos.includes(estatus)) {
                throw new Error("Estatus inválido. Use 'aprobado' o 'rechazado'.");
            }

            // * Actualizar permiso
            permiso.estatus_rh = estatus;
            permiso.observaciones = comentario;
            await permiso.save();

            // * Registrar en historial
            await HistorialPermiso.create({
                permiso_id: id_permiso,
                accion: `Permiso ${estatus} por RH`,
                realizado_por: "rh",
                comentarios: comentario,
            });

            // * Obtener empleado y director
            const empleado = permiso.Empleado;
            const director = await Empleado.findOne({
                where: { rol: "director" },
                attributes: ["nombre", "correo"]
            });

            // * Variables para los templates
            const variables = {
                nombreEmpleado: empleado.nombre,
                tipoPermiso: permiso.tipo,
                fechaSolicitud: permiso.fecha_solicitud.toLocaleDateString(),
                fechaInicio: permiso.fecha_inicio.toLocaleDateString(),
                motivo: permiso.motivo || "No especificado",
                comentario: comentario || "Sin comentarios",
                estatus,
                estatusClass: estatus,
            };

            // * Notificar al empleado
            await MailService.sendEmail({
                to: empleado.correo,
                subject: `Tu permiso fue ${estatus.toUpperCase()} por Recursos Humanos`,
                template: "permisoRevisadoRH",
                variables,
            });

            // * Notificar al director
            await MailService.sendEmail({
                to: director.correo,
                subject: `Permiso de ${empleado.nombre} ${estatus.toUpperCase()} por RH`,
                template: "permisoResueltoDirector",
                variables,
            });

            return {
                message: `Permiso ${estatus} correctamente`,
                permiso,
            };
        } catch (error) {
            console.error("Error al actualizar permiso por RH:", error);
            throw new Error(error.message || "Error al actualizar permiso por RH");
        }
    }

    /**
     * Obtener estadísticas completas de permisos
     * - Devuelve un resumen global y detalle por profesor
    */
    static async obtenerEstadisticasPermisos() {
        try {
            // * Obtener todos los permisos
            const permisos = await Permiso.findAll({
                include: [
                    { model: Empleado, attributes: ["nombre", "id_empleado"] }
                ]
            });

            if (!permisos.length) return { resumen: {}, porEmpleado: [] };

            // * Inicializar contadores
            const resumen = {
                total: permisos.length,
                porTipo: { temporal: 0, economico: 0, cumpleaños: 0 },
                porEstatusRH: { pendiente: 0, aprobado: 0, rechazado: 0 },
                promedioDiasTemporal: 0,
                porMes: {}, // ej: "2025-10": 5
            };

            const porEmpleadoMap = {};

            let totalDiasTemporal = 0;
            let countTemporal = 0;

            permisos.forEach(p => {
                // * Normalización segura
                const tipo = p.tipo?.toLowerCase() || "desconocido";
                const estatus = p.estatus_rh?.toLowerCase() || "pendiente";

                // * Tipo de permiso
                resumen.porTipo[tipo] = (resumen.porTipo[tipo] || 0) + 1;

                // * Estatus RH
                resumen.porEstatusRH[estatus] = (resumen.porEstatusRH[estatus] || 0) + 1;

                // * Por mes
                const mes = p.fecha_inicio?.toISOString().slice(0, 7) || "sin_fecha";
                resumen.porMes[mes] = (resumen.porMes[mes] || 0) + 1;

                // * Calcular días promedio para permisos temporales
                if (tipo === "temporal" && p.fecha_inicio && p.fecha_solicitud) {
                    const dias = Math.ceil(
                        (p.fecha_inicio - p.fecha_solicitud) / (1000 * 60 * 60 * 24)
                    );
                    totalDiasTemporal += dias;
                    countTemporal++;
                }

                // * Agrupar por empleado
                const empId = p.Empleado.id_empleado;
                if (!porEmpleadoMap[empId]) {
                    porEmpleadoMap[empId] = {
                        nombre: p.Empleado.nombre,
                        total: 0,
                        aprobados: 0,
                        rechazados: 0,
                        pendientes: 0,
                    };
                }

                porEmpleadoMap[empId].total++;

                // * Clasificación explícita del estatus
                if (estatus === "aprobado") porEmpleadoMap[empId].aprobados++;
                else if (estatus === "rechazado") porEmpleadoMap[empId].rechazados++;
                else porEmpleadoMap[empId].pendientes++;
            });


            resumen.promedioDiasTemporal = countTemporal ? (totalDiasTemporal / countTemporal).toFixed(1) : 0;

            // * Convertir map a array para front
            const porEmpleado = Object.values(porEmpleadoMap);

            return {
                resumen,
                porEmpleado,
                recientes: permisos
                    .sort((a, b) => b.fecha_solicitud - a.fecha_solicitud)
                    .slice(0, 10)
                    .map(p => ({
                        nombre: p.Empleado.nombre,
                        tipo: p.tipo,
                        estatus: p.estatus_rh,
                        fechaInicio: p.fecha_inicio,
                        fechaSolicitud: p.fecha_solicitud,
                        motivo: p.motivo || "No especificado",
                    }))
            };
        } catch (error) {
            console.error("Error al generar estadísticas de permisos:", error);
            throw new Error("Error al generar estadísticas de permisos");
        }
    }

    static async generarReporteEstadisticas() {
        try {
            // * Obtener permisos con empleados
            const permisos = await Permiso.findAll({
                include: [{ model: Empleado, attributes: ["nombre", "id_empleado"] }],
            });

            if (!permisos.length) throw new Error("No hay datos de permisos.");

            // * Calcular estadísticas
            const resumen = {
                total: permisos.length,
                porTipo: { temporal: 0, economico: 0, cumpleaños: 0 },
                porEstatusRH: { pendiente: 0, aprobado: 0, rechazado: 0 },
            };
            const porEmpleadoMap = {};

            permisos.forEach((p) => {
                // * Contadores globales
                const tipo = p.tipo?.toLowerCase() || "desconocido";
                const estatus = p.estatus_rh?.toLowerCase() || "pendiente";

                resumen.porTipo[tipo] = (resumen.porTipo[tipo] || 0) + 1;
                resumen.porEstatusRH[estatus] = (resumen.porEstatusRH[estatus] || 0) + 1;

                // * Por empleado
                const id = p.Empleado.id_empleado;
                if (!porEmpleadoMap[id]) {
                    porEmpleadoMap[id] = {
                        nombre: p.Empleado.nombre,
                        total: 0,
                        aprobados: 0,
                        rechazados: 0,
                        pendientes: 0,
                    };
                }

                porEmpleadoMap[id].total++;

                // * Normalizar estatus y sumar correctamente
                if (estatus === "aprobado") porEmpleadoMap[id].aprobados++;
                else if (estatus === "rechazado") porEmpleadoMap[id].rechazados++;
                else porEmpleadoMap[id].pendientes++;
            });


            const porEmpleado = Object.values(porEmpleadoMap);

            // * Crear PDF
            const doc = new PDFDocument({ margin: 50 });
            const stream = new PassThrough();
            doc.pipe(stream);

            // * Encabezado corporativo
            doc.fontSize(20).fillColor("#333").text("Reporte Estadístico de Permisos", { align: "center" }).moveDown(0.5);
            doc.fontSize(12).fillColor("#666").text(`Generado el ${new Date().toLocaleString()}`, { align: "center" }).moveDown(1);

            // * Resumen general
            doc.fontSize(14).fillColor("#000").text("Resumen General", { underline: true }).moveDown(0.5);
            doc.fontSize(12)
                .text(`Total de permisos: ${resumen.total}`)
                .text(`Pendientes: ${resumen.porEstatusRH.pendiente}`)
                .text(`Aprobados: ${resumen.porEstatusRH.aprobado}`)
                .text(`Rechazados: ${resumen.porEstatusRH.rechazado}`)
                .moveDown(0.5);

            // * Tipos
            doc.text("Distribución por tipo:");
            Object.entries(resumen.porTipo).forEach(([tipo, cantidad]) => {
                doc.text(`  - ${tipo}: ${cantidad}`);
            });
            doc.moveDown(1);

            // * Tabla por empleado
            doc.fontSize(14).text("Detalle por Empleado", { underline: true }).moveDown(0.5);
            const tableTop = doc.y;

            doc.fontSize(10).text("Empleado", 50, tableTop);
            doc.text("Total", 250, tableTop);
            doc.text("Aprobados", 310, tableTop);
            doc.text("Pendientes", 390, tableTop);
            doc.text("Rechazados", 470, tableTop);
            doc.moveDown(0.5);
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke("#aaa").moveDown(0.3);

            porEmpleado.forEach((e) => {
                doc.text(e.nombre, 50, doc.y);
                doc.text(e.total.toString(), 250, doc.y);
                doc.text(e.aprobados.toString(), 310, doc.y);
                doc.text(e.pendientes.toString(), 390, doc.y);
                doc.text(e.rechazados.toString(), 470, doc.y);
                doc.moveDown(0.3);
            });

            // * Pie de página
            doc.moveDown(1);
            doc.fontSize(10).fillColor("#555")
                .text("Documento generado automáticamente por el Sistema de Gestión Escolar.", { align: "center" });

            doc.end();
            return stream;
        } catch (error) {
            console.error("Error al generar reporte estadístico:", error);
            throw new Error("Error al generar reporte estadístico");
        }
    }
}

module.exports = RHService;
