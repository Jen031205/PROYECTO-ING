import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Alert,
  Stack,
} from "@mui/material";

export default function ListaPeticiones({ permisos, onValidar }) {
  const getStatusColor = (estatus) => {
    switch (estatus) {
      case "aprobado": return "success";
      case "rechazado": return "error";
      case "pendiente": return "warning";
      default: return "default";
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
    return new Date(dateString).toLocaleDateString('es-ES');
  };

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
          Permisos Pendientes
        </Typography>

        <AnimatePresence>
          {permisos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                No hay permisos pendientes de revisión.
              </Alert>
            </motion.div>
          ) : (
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {permisos.map((permiso, index) => (
                <motion.div
                  key={permiso.id_permiso}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ListItem
                    sx={{
                      bgcolor: "rgba(102, 126, 234, 0.05)",
                      borderRadius: 3,
                      mb: 2,
                      border: "1px solid rgba(102, 126, 234, 0.1)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: "rgba(102, 126, 234, 0.08)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
                      }
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="600">
                          {permiso.tipo?.charAt(0).toUpperCase() + permiso.tipo?.slice(1)}
                        </Typography>
                        <Chip
                          label={getStatusText(permiso.estatus_director)}
                          color={getStatusColor(permiso.estatus_director)}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {permiso.motivo}
                      </Typography>
                      
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          Solicitado: {formatDate(permiso.fecha_solicitud)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Por: {permiso.Empleado?.nombre || "Desconocido"}
                        </Typography>
                      </Stack>
                    </Box>

                    <Stack direction="column" spacing={1} sx={{ ml: 2 }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => onValidar(permiso.id_permiso, "aprobado")}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: "500",
                          minWidth: 100,
                          background: "linear-gradient(135deg, #00b894 0%, #00a085 100%)",
                          boxShadow: "0 2px 8px rgba(0, 184, 148, 0.3)",
                          "&:hover": {
                            boxShadow: "0 4px 12px rgba(0, 184, 148, 0.4)",
                          }
                        }}
                      >
                        Aprobar
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => onValidar(permiso.id_permiso, "rechazado")}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: "500",
                          minWidth: 100,
                          background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                          boxShadow: "0 2px 8px rgba(255, 107, 107, 0.3)",
                          "&:hover": {
                            boxShadow: "0 4px 12px rgba(255, 107, 107, 0.4)",
                          }
                        }}
                      >
                        Rechazar
                      </Button>
                    </Stack>
                  </ListItem>

                  {index < permisos.length - 1 && (
                    <Divider sx={{ my: 1, opacity: 0.3 }} />
                  )}
                </motion.div>
              ))}
            </List>
          )}
        </AnimatePresence>
      </Box>
    </motion.div>
  );
}