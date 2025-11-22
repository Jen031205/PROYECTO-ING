import Api from "../api/Api";

const DirectorService = {
  validarPermiso: async (id_permiso, estatus, observaciones) => {
    const res = await Api.put(`/director/permiso/${id_permiso}`, { estatus, observaciones });
    return res.data;
  },

  registrarAsistencia: async (data) => {
    const res = await Api.post("/director/asistencia", data);
    return res.data;
  },

  registrarRetardo: async (data) => {
    const res = await Api.post("/director/retardo", data);
    return res.data;
  },

  generarReporte: async (data) => {
    const res = await Api.post("/director/reporte", data);
    return res.data;
  },

  listarPermisosPendientes: async () => {
    const res = await Api.get("/director/pendientes");
    return res.data;
  },
};

export default DirectorService;
