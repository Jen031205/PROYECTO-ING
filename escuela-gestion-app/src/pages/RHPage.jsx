import { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { motion } from "framer-motion";
import RHService from "../services/RHService";
import Filtros from "../components/RH/Filtros";
import CalendarioGlobal from "../components/RH/CalendarioGlobal";
import ModalAprobatorio from "../components/RH/ModalAprobatorio";
import EstadisticasPermisos from "../components/RH/Estadistico";

export default function RHPage() {
  const [permisos, setPermisos] = useState([]);
  const [filtro, setFiltro] = useState({});
  const [permisoSeleccionado, setPermisoSeleccionado] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    aprobados: 0,
    rechazados: 0
  });
  const [estadisticas, setEstadisticas] = useState({});

  // * --- Obtener permisos filtrados
  const fetchPermisos = async (criterios = {}) => {
    try {
      const response = await RHService.filtrarPermisos(criterios);
      setPermisos(response.data);

      const total = response.data.length;
      const pendientes = response.data.filter(p => p.estatus_rh === "pendiente").length;
      const aprobados = response.data.filter(p => p.estatus_rh === "aprobado").length;
      const rechazados = response.data.filter(p => p.estatus_rh === "rechazado").length;

      setStats({ total, pendientes, aprobados, rechazados });
    } catch (err) {
      console.error("Error al obtener permisos:", err.message);
    }
  };

  // * --- Obtener estadísticas completas
  const fetchEstadisticas = async () => {
    try {
      const response = await RHService.obtenerEstadisticasPermisos();
      setEstadisticas(response.data);
    } catch (err) {
      console.error("Error al obtener estadísticas:", err.message);
    }
  };

  useEffect(() => {
    fetchPermisos(filtro);
    fetchEstadisticas();
  }, [filtro]);

  const handleAbrirModal = (permiso) => setPermisoSeleccionado(permiso);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 3,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        overflow: "auto",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 80% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
        },
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h4"
              fontWeight="700"
              sx={{
                background:
                  "linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.9) 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                mb: 0.5,
              }}
            >
              Panel de Recursos Humanos
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              Gestión centralizada de permisos y asistencia
            </Typography>
          </Box>
        </motion.div>

        {/* KPIs rápidos */}
        <motion.div variants={itemVariants}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: "Total Permisos", value: stats.total, color: "#667eea" },
              { label: "Pendientes RH", value: stats.pendientes, color: "#ffa726" },
              { label: "Aprobados", value: stats.aprobados, color: "#66bb6a" },
              { label: "Rechazados", value: stats.rechazados, color: "#ef5350" },
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    fontWeight="700"
                    sx={{
                      background: `linear-gradient(135deg, ${item.color} 0%, ${item.color} 100%)`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                      mb: 0.5,
                    }}
                  >
                    {item.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight="500">
                    {item.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Filtros */}
        <motion.div variants={itemVariants}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              mb: 3,
            }}
          >
            <Filtros onFiltrar={(criterios) => setFiltro(criterios)} />
          </Paper>
        </motion.div>

        {/* Nuevo Dashboard con estadísticas */}
        {estadisticas && (
          <motion.div variants={itemVariants}>
            <EstadisticasPermisos data={estadisticas} />
          </motion.div>
        )}

        {/* Calendario */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CalendarioGlobal permisos={permisos} onAbrirModal={handleAbrirModal} />
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Modal aprobatorio */}
        <ModalAprobatorio
          permiso={permisoSeleccionado}
          onCerrar={() => setPermisoSeleccionado(null)}
          onActualizado={() => fetchPermisos(filtro)}
        />
      </motion.div>
    </Box>
  );
}
