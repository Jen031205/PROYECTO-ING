const express = require("express");
const ProfesorController = require("../controller/ProfesorController");
const DirectorController = require("../controller/DirectorController");
const RHController = require("../controller/RHController");
const EmpleadoController = require("../controller/EmpleadoController");
const router = express.Router();
const AuthController = require("../controller/AuthController");

// * Autenticación
router.post("/auth/verify", AuthController.verify);
router.post("/auth/solicitar-reset", AuthController.requestPasswordReset);
router.post("/auth/restablecer", AuthController.resetPassword);

// * Profesor
router.post("/profesor/permiso", ProfesorController.solicitarPermiso);
router.put("/profesor/permiso/:id_permiso", ProfesorController.actualizarPermiso);
router.delete("/profesor/permiso/eliminar/:id_permiso", ProfesorController.cancelarPermiso);
router.get("/profesor/historial/:empleado_id", ProfesorController.obtenerHistorial);
router.post("/profesor/reposicion", ProfesorController.registrarReposicion);

// * Director
router.put("/director/permiso/:id_permiso", DirectorController.validarPermiso);
router.post("/director/asistencia", DirectorController.registrarAsistencia);
router.post("/director/retardo", DirectorController.registrarRetardo);
router.post("/director/reporte", DirectorController.generarReporte);
router.get("/director/pendientes", DirectorController.listarPermisosPendientes);

// * RH
router.put("/rh/permiso/:id_permiso", RHController.revisarPermiso);
router.post("/rh/evidencia", RHController.subirEvidencia);
router.get("/rh/permisos", RHController.filtrarPermisos);
router.post("/rh/estadisticas", RHController.generarEstadisticas);
router.get("/rh/aprobados", RHController.listarAprobados);
router.put("/rh/permisos/aprobar/:id_permiso", RHController.actualizarPermiso);
router.get("/rh/estadisticas/permisos", RHController.obtenerEstadisticasPermisos);
router.get("/rh/reporte-estadisticas", RHController.descargarReporteEstadisticas);

//* Empleado
router.post("/empleado/registrar", EmpleadoController.registrar);
router.post("/empleado/login", EmpleadoController.login);
router.get("/empleado/listar", EmpleadoController.listar);
router.put("/empleado/:id/estado", EmpleadoController.cambiarEstado);


module.exports = router;
