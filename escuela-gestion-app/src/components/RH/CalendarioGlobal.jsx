import { useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tooltip,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import dayjs from "dayjs";

export default function CalendarioGlobal({ permisos, onAbrirModal }) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const startOfMonth = currentMonth.startOf("month");
  const startDay = startOfMonth.day();
  const daysInMonth = currentMonth.daysInMonth();

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const handlePrevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  const getPermisosDelDia = (dia) => {
    const fecha = currentMonth.date(dia).format("YYYY-MM-DD");
    return permisos.filter((p) => p.fecha_inicio?.startsWith(fecha));
  };

  const handlePermisoClick = (permiso) => {
    if (permiso.estatus_rh === "pendiente" && onAbrirModal) {
      onAbrirModal(permiso);
    }
  };

  const getStatusColor = (estatus) => {
    switch (estatus) {
      case "aprobado": return "#66bb6a";
      case "rechazado": return "#ef5350";
      case "pendiente": return "#ffa726";
      default: return "#9e9e9e";
    }
  };

  // Calcular altura dinámica basada en el viewport
  const getCalendarHeight = () => {
    if (isMobile) return 'calc(100vh - 200px)';
    if (isTablet) return 'calc(100vh - 180px)';
    return 'calc(100vh - 160px)';
  };

  const getCellHeight = () => {
    if (isMobile) return 80;
    if (isTablet) return 100;
    return 120;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ height: '100%' }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header del calendario */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            p: 2,
            borderRadius: 2,
            background: "rgba(102, 126, 234, 0.1)",
            border: "1px solid rgba(102, 126, 234, 0.2)",
            mb: 2,
          }}
        >
          <IconButton 
            onClick={handlePrevMonth}
            sx={{ 
              color: "#667eea",
              "&:hover": { backgroundColor: "rgba(102, 126, 234, 0.1)" }
            }}
          >
            <ArrowBack />
          </IconButton>
          
          <Typography variant="h5" fontWeight="600" color="#667eea">
            {currentMonth.format("MMMM YYYY").toUpperCase()}
          </Typography>
          
          <IconButton 
            onClick={handleNextMonth}
            sx={{ 
              color: "#667eea",
              "&:hover": { backgroundColor: "rgba(102, 126, 234, 0.1)" }
            }}
          >
            <ArrowForward />
          </IconButton>
        </Box>

        {/* Contenedor principal del calendario */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* Encabezado días */}
          <Grid container spacing={0.5} sx={{ mb: 1, flexShrink: 0 }}>
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
              <Grid item xs={12 / 7} key={d}>
                <Paper
                  sx={{
                    p: 1,
                    textAlign: "center",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="600">
                    {d}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Celdas del mes - Contenedor scrollable */}
          <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
            <Grid container spacing={0.5} sx={{ height: '100%' }}>
              {days.map((dia, index) => {
                if (!dia)
                  return (
                    <Grid item xs={12 / 7} key={`empty-${index}`}>
                      <Box sx={{ 
                        height: getCellHeight(),
                        borderRadius: 1,
                        background: 'rgba(0,0,0,0.02)',
                      }} />
                    </Grid>
                  );

                const permisosDelDia = getPermisosDelDia(dia);
                const hoy = dayjs().format("YYYY-MM-DD") === currentMonth.date(dia).format("YYYY-MM-DD");
                const esFinDeSemana = [0, 6].includes(currentMonth.date(dia).day());

                return (
                  <Grid item xs={12 / 7} key={dia}>
                    <Paper
                      sx={{
                        height: getCellHeight(),
                        borderRadius: 2,
                        p: 1,
                        position: "relative",
                        border: hoy ? "2px solid #667eea" : "1px solid rgba(0, 0, 0, 0.08)",
                        background: hoy 
                          ? "rgba(102, 126, 234, 0.05)" 
                          : esFinDeSemana 
                            ? "rgba(0, 0, 0, 0.02)"
                            : "white",
                        transition: "all 0.2s ease",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        },
                      }}
                    >
                      {/* Número del día */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                        <Typography
                          variant={isMobile ? "caption" : "body2"}
                          sx={{
                            fontWeight: "600",
                            color: hoy ? "#667eea" : esFinDeSemana ? "text.secondary" : "text.primary",
                          }}
                        >
                          {dia}
                        </Typography>
                        {permisosDelDia.length > 0 && (
                          <Chip
                            label={permisosDelDia.length}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.6rem',
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              color: "white",
                            }}
                          />
                        )}
                      </Box>

                      {/* Permisos del día */}
                      <Box sx={{ 
                        flex: 1, 
                        overflow: "auto",
                        '&::-webkit-scrollbar': {
                          width: 4,
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: 'rgba(0,0,0,0.2)',
                          borderRadius: 2,
                        },
                      }}>
                        {permisosDelDia.map((p, idx) => {
                          const esPendiente = p.estatus_rh === "pendiente";
                          
                          return (
                            <Tooltip
                              key={p.id_permiso}
                              title={
                                <Box>
                                  <Typography variant="subtitle2" fontWeight="600">
                                    {p.empleado?.nombre || "Desconocido"}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Tipo:</strong> {p.tipo}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Estado:</strong> {p.estatus_rh}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Motivo:</strong> {p.motivo}
                                  </Typography>
                                </Box>
                              }
                              arrow
                              placement="top"
                            >
                              <Box
                                onClick={() => esPendiente && handlePermisoClick(p)}
                                sx={{
                                  backgroundColor: getStatusColor(p.estatus_rh),
                                  borderRadius: 1,
                                  px: 0.5,
                                  py: 0.3,
                                  mb: 0.3,
                                  fontSize: isMobile ? "0.5rem" : "0.6rem",
                                  color: "white",
                                  fontWeight: "500",
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                  cursor: esPendiente ? "pointer" : "default",
                                  opacity: esPendiente ? 1 : 0.8,
                                  transition: "all 0.2s ease",
                                  border: esPendiente ? '1px solid rgba(255,255,255,0.3)' : 'none',
                                  "&:hover": {
                                    transform: esPendiente ? "scale(1.05)" : "none",
                                    boxShadow: esPendiente ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
                                  },
                                }}
                              >
                                {isMobile ? (
                                  p.tipo?.charAt(0).toUpperCase()
                                ) : (
                                  `${p.tipo?.charAt(0).toUpperCase()} - ${p.empleado?.nombre?.split(' ')[0] || 'N/A'}`
                                )}
                              </Box>
                            </Tooltip>
                          );
                        })}
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Box>

        {/* Leyenda */}
        <Box sx={{ 
          mt: 2, 
          display: "flex", 
          gap: 1, 
          flexWrap: "wrap", 
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <Chip 
            label="Pendiente" 
            size="small" 
            sx={{ 
              backgroundColor: "#ffa726", 
              color: "white",
              fontWeight: "500"
            }} 
          />
          <Chip 
            label="Aprobado" 
            size="small" 
            sx={{ 
              backgroundColor: "#66bb6a", 
              color: "white",
              fontWeight: "500"
            }} 
          />
          <Chip 
            label="Rechazado" 
            size="small" 
            sx={{ 
              backgroundColor: "#ef5350", 
              color: "white",
              fontWeight: "500"
            }} 
          />
          <Chip 
            label="Hoy" 
            size="small" 
            variant="outlined" 
            sx={{ 
              borderColor: "#667eea", 
              color: "#667eea",
              fontWeight: "500"
            }} 
          />
          <Chip 
            label="Fin de semana" 
            size="small" 
            variant="outlined"
            sx={{ 
              borderColor: "text.secondary", 
              color: "text.secondary",
              fontWeight: "500"
            }} 
          />
        </Box>
      </Box>
    </motion.div>
  );
}