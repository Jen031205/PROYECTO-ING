import Api from "../api/Api";

const RHService = {
  /**
   * ✅ Aprobar o rechazar permiso
   * @param {number} id_permiso - ID del permiso
   * @param {string} estatus - 'aprobado' | 'rechazado'
   * @param {string} comentario - Comentario opcional del RH
  */
  actualizarPermiso: async (id_permiso, estatus, comentario) => {
    const res = await Api.put(`/rh/permisos/aprobar/${id_permiso}`, {
      estatus,
      comentario,
    });
    return res.data;
  },

  /**
   * ✅ Subir evidencia de permiso
   * @param {object} data - { permiso_id, file }
   */
  subirEvidencia: async (data) => {
    const formData = new FormData();
    formData.append("id_permiso", data.permiso_id);
    formData.append("file", data.file);

    const res = await Api.post("/rh/evidencias", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  /**
   * ✅ Filtrar permisos (por tipo, mes, empleado_id)
   * @param {object} params - Filtros
   */
  filtrarPermisos: async (params) => {
    const res = await Api.get("/rh/permisos", { params });
    return res.data;
  },

  /**
   * ✅ Generar estadísticas
   * @param {object} data - { tipo, periodo, detalles }
   */
  generarEstadisticas: async (data) => {
    const res = await Api.post("/rh/estadisticas", data);
    return res.data;
  },

  /**
   * ✅ Listar permisos aprobados
   */
  listarAprobados: async () => {
    const res = await Api.get("/rh/permisos/aprobados");
    return res.data;
  },

  /**
   * ✅ Dashboard maton 
   */
  obtenerEstadisticasPermisos: async () => {
    const res = await Api.get("/rh/estadisticas/permisos");
    return res.data;
  },
};

export default RHService;
