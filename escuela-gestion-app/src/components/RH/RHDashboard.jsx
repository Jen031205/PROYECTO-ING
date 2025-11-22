import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Paper, Typography, Grid, Box } from "@mui/material";
import RHService from "../../services/RHService";
import Filtros from "./Filtros";
import CalendarioGlobal from "./CalendarioGlobal";
import ModalAprobatorio from "./ModalAprobatorio";

export default function RHDashboard() {
  const [permisos, setPermisos] = useState([]);
  const [permisoSeleccionado, setPermisoSeleccionado] = useState(null);

  const fetchPermisos = async (params = {}) => {
    const response = await RHService.filtrarPermisos(params);
    setPermisos(response.data);
  };

  useEffect(() => {
    fetchPermisos();
  }, []);

  const handleConfirmar = async (id_permiso, comentario, estatus = "aprobado") => {
    await RHService.revisarPermiso(id_permiso, estatus, comentario);
    fetchPermisos();
    setPermisoSeleccionado(null);
  };

  return (
    <Box sx={{ minHeight: "100vh", p: 4, bgcolor: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Typography variant="h4" color="white" fontWeight="bold" gutterBottom>
          Dashboard de Recursos Humanos
        </Typography>

        <Filtros onFiltrar={fetchPermisos} />
        <Box mt={3}>
          <CalendarioGlobal permisos={permisos} />
        </Box>

        <Paper sx={{ mt: 4, p: 3, bgcolor: "primary.dark", color: "white", borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>
            Permisos Registrados
          </Typography>
          <Grid container spacing={2}>
            {permisos.map((permiso) => (
              <Grid item xs={12} md={6} key={permiso.id_permiso}>
                <Paper
                  onClick={() => setPermisoSeleccionado(permiso)}
                  sx={{
                    p: 2,
                    bgcolor: "secondary.main",
                    color: "white",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "secondary.light" },
                    borderRadius: 2,
                  }}
                >
                  {permiso.Empleado?.nombre} - {permiso.tipo} ({permiso.estatus_rh})
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {permisoSeleccionado && (
          <ModalAprobatorio
            permiso={permisoSeleccionado}
            onCerrar={() => setPermisoSeleccionado(null)}
            onConfirmar={handleConfirmar}
          />
        )}
      </motion.div>
    </Box>
  );
}
