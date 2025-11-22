import { useEffect, useState } from "react";
import { Typography, Box, Grid, Paper, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import ListaPeticiones from "../components/Director/ListaPeticiones";
import ControlAsistencia from "../components/Director/ControlAsistencia";
import GeneradorReportesPDFUI from "../components/Director/GeneradorReportesPDFUI";
import DirectorService from "../services/DirectorSevice";

export default function DirectorPage() {
  const [permisos, setPermisos] = useState([]);
  const [stats, setStats] = useState({
    pendientes: 0,
    totalPermisos: 0,
  });

  const fetchPermisos = async () => {
    try {
      const response = await DirectorService.listarPermisosPendientes();
      setPermisos(response.data);
      setStats({
        pendientes: response.data.length,
        totalPermisos: response.data.length,
      });
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  useEffect(() => {
    fetchPermisos();
  }, []);

  const handleValidarPermiso = async (id_permiso, estatus) => {
    await DirectorService.validarPermiso(id_permiso, estatus, "");
    fetchPermisos();
  };

  const handleRegistrarAsistencia = async (data) => {
    await DirectorService.registrarAsistencia(data);
    alert("Asistencia registrada");
  };

  const handleRegistrarRetardo = async (data) => {
    await DirectorService.registrarRetardo(data);
    alert("Retardo registrado");
  };

  const handleGenerarReporte = async (data) => {
    const reporte = await DirectorService.generarReporte(data);
    alert(`Reporte generado con ID: ${reporte.id}`);
  };

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
        p: 4,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
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
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h3"
              fontWeight="700"
              sx={{
                background: "linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.9) 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                mb: 1,
              }}
            >
              Panel del Director
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                mb: 3,
              }}
            >
              Gestión integral de permisos, asistencia y reportes
            </Typography>
          </Box>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              { label: "Permisos Pendientes", value: stats.pendientes },
              { label: "Total de Solicitudes", value: stats.totalPermisos },
            ].map((item, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <Card
                  sx={{
                    borderRadius: 4,
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Typography
                      variant="h2"
                      fontWeight="700"
                      sx={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                        mb: 1,
                      }}
                    >
                      {item.value}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" fontWeight="500">
                      {item.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Lista de Permisos */}
          <Grid item xs={12} lg={6}>
            <motion.div variants={itemVariants}>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                  minHeight: 400,
                }}
              >
                <ListaPeticiones permisos={permisos} onValidar={handleValidarPermiso} />
              </Paper>
            </motion.div>
          </Grid>

          {/* Asistencia y Reportes lado a lado */}
          <Grid item xs={12} lg={6}>
            <motion.div variants={itemVariants}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                      height: "100%",
                    }}
                  >
                    <ControlAsistencia
                      onRegistrar={handleRegistrarAsistencia}
                      onRetardo={handleRegistrarRetardo}
                    />
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                      height: "100%",
                    }}
                  >
                    <GeneradorReportesPDFUI onGenerar={handleGenerarReporte} />
                  </Paper>
                </Grid>
              </Grid>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
}
