import Api from "../api/Api";

const ProfesorService = {
  solicitarPermiso: async (data) => {
    const res = await Api.post("/profesor/permiso", data);
    return res.data;
  },

  actualizarPermiso: async (id_permiso, data) => {
    const res = await Api.put(`/profesor/permiso/${id_permiso}`, data);
    return res.data;
  },

  cancelarPermiso: async (id_permiso) => {
    const res = await Api.delete(`/profesor/permiso/eliminar/${id_permiso}`);
    return res.data;
  },

  obtenerHistorial: async (empleado_id) => {
    const res = await Api.get(`/profesor/historial/${empleado_id}`);
    return res.data;
  },

  registrarReposicion: async (data) => {
    const res = await Api.post("/profesor/reposicion", data);
    return res.data;
  },
};

export default ProfesorService;
