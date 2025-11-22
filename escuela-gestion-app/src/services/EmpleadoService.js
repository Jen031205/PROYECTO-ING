import Api from "../api/Api";
import axios from "axios";

const API_URL = process.env.API_URL || "http://localhost:4000/api"

const EmpleadoService = {
  loginEmpleado: async (correo, password) => {
    const res = await Api.post("/empleado/login", { correo, password });
    return res.data;
  },

  listarEmpleados: async () => {
    const res = await Api.get("/empleado/listar");
    return res.data;
  },

  cambiarEstado: async (id_empleado, estado) => {
    const res = await Api.put(`/empleado/${id_empleado}/estado`, { activo: estado });
    return res.data;
  },

  registrarEmpleado: async (data) => {
    const res = await Api.post("/empleado/registrar", data);
    return res.data;
  },

  async solicitarReset(correo) {
    const { data } = await axios.post(`${API_URL}/auth/solicitar-reset`, { correo });
    if (!data.status) throw new Error(data.message);
    return data;
  },

  async resetPassword(token, nuevaPassword) {
    const { data } = await axios.post(`${API_URL}/auth/restablecer`, { token, nuevaPassword });
    if (!data.status) throw new Error(data.message);
    return data;
  },

  async verifyCuenta(correo, loginCode, password) {
    const { data } = await axios.post(`${API_URL}/auth/verify`, { correo, loginCode, password });
    if (!data.status) throw new Error(data.message);
    return data;
  }
};

export default EmpleadoService;
