import { motion } from "framer-motion";
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Tooltip,
  Chip 
} from "@mui/material";

export default function CalendarComponent({ permisos }) {
  const getStatusColor = (estatus) => {
    switch (estatus) {
      case "aprobado": return "#66bb6a";
      case "rechazado": return "#ef5350";
      case "pendiente": return "#ffa726";
      default: return "#9e9e9e";
    }
  };

  const getStatusText = (estatus) => {
    switch (estatus) {
      case "aprobado": return "Aprobado";
      case "rechazado": return "Rechazado";
      case "pendiente": return "Pendiente";
      default: return estatus;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  // * Agrupar permisos por fecha para evitar duplicados en la misma fecha
  const permisosUnicos = permisos.reduce((acc, permiso) => {
    const fecha = permiso.fecha_inicio?.split('T')[0];
    if (fecha && !acc.find(p => p.fecha_inicio?.split('T')[0] === fecha)) {
      acc.push(permiso);
    }
    return acc;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box>
        <Typography 
          variant="h5" 
          fontWeight="600" 
          sx={{ 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            mb: 3
          }}
        >
          Vista de Calendario
        </Typography>

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
          {permisosUnicos.length === 0 ? (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 4,
                color: 'text.secondary'
              }}
            >
              <Typography variant="body1">
                No hay permisos para mostrar en el calendario.
              </Typography>
            </Box>
          ) : (
            <>
              <Grid container spacing={1}>
                {permisosUnicos.map((permiso) => {
                  const fecha = permiso.fecha_inicio?.split('T')[0];
                  const hoy = new Date().toISOString().split('T')[0] === fecha;
                  
                  return (
                    <Grid item xs={6} sm={4} md={3} lg={2.4} key={permiso.id_permiso}>
                      <Tooltip
                        title={
                          <Box>
                            <Typography variant="subtitle2" fontWeight="600">
                              {permiso.empleado?.nombre || "Desconocido"}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Tipo:</strong> {permiso.tipo}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Motivo:</strong> {permiso.motivo}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Estado:</strong> {getStatusText(permiso.estatus_director)}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Fecha:</strong> {formatDate(permiso.fecha_inicio)}
                            </Typography>
                          </Box>
                        }
                        arrow
                        placement="top"
                      >
                        <Paper
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            background: getStatusColor(permiso.estatus_director),
                            color: "white",
                            textAlign: "center",
                            cursor: "default",
                            border: hoy ? "2px solid #667eea" : "none",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                            },
                          }}
                        >
                          <Typography 
                            variant="caption" 
                            fontWeight="600"
                            sx={{ 
                              display: 'block',
                              fontSize: '0.7rem',
                              opacity: 0.9
                            }}
                          >
                            {formatDate(permiso.fecha_inicio)}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            fontWeight="500"
                            sx={{ 
                              fontSize: '0.75rem',
                              lineHeight: 1.2,
                              mt: 0.5
                            }}
                          >
                            {permiso.tipo?.charAt(0).toUpperCase() + permiso.tipo?.slice(1)}
                          </Typography>
                        </Paper>
                      </Tooltip>
                    </Grid>
                  );
                })}
              </Grid>

              {/* Leyenda */}
              <Box sx={{ mt: 3, display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
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
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </motion.div>
  );
}