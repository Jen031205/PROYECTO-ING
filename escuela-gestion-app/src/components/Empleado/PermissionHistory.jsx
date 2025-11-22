import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  Button,
  Stack,
  Chip,
  Alert,
} from "@mui/material";
import ProfesorService from "../../services/ProfesorService";

export default function PermissionHistory({ permisos, onSeleccionar, onActualizar }) {
  const [filtro, setFiltro] = useState("todos");

  const handleCancelar = async (id_permiso) => {
    if (window.confirm("¿Estás seguro de que deseas cancelar este permiso?")) {
      try {
        await ProfesorService.cancelarPermiso(id_permiso);
        onActualizar();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleEditar = async (permiso) => {
    const nuevoMotivo = prompt("Modificar motivo del permiso:", permiso.motivo);
    if (!nuevoMotivo || nuevoMotivo === permiso.motivo) return;
    try {
      await ProfesorService.actualizarPermiso(permiso.id_permiso, { motivo: nuevoMotivo });
      onActualizar();
    } catch (err) {
      alert(err.message);
    }
  };

  const permisosFiltrados = permisos.filter((permiso) => {
    if (filtro === "todos") return true;
    if (filtro === "pendientes") return permiso.estatus_director === "pendiente";
    if (filtro === "aprobados") return permiso.estatus_director === "aprobado";
    if (filtro === "rechazados") return permiso.estatus_director === "rechazado";
    return true;
  });

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
          Historial de Permisos
        </Typography>

        {/* Filtros */}
        <Stack direction="row" spacing={1} mb={3} flexWrap="wrap" gap={1}>
          {[
            { value: "todos", label: "Todos" },
            { value: "pendientes", label: "Pendientes" },
            { value: "aprobados", label: "Aprobados" },
            { value: "rechazados", label: "Rechazados" }
          ].map((estado) => (
            <Chip
              key={estado.value}
              label={estado.label}
              variant={filtro === estado.value ? "filled" : "outlined"}
              onClick={() => setFiltro(estado.value)}
              sx={{
                background: filtro === estado.value ? 
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent",
                color: filtro === estado.value ? "white" : "#667eea",
                borderColor: "#667eea",
                fontWeight: "500",
                "&:hover": {
                  backgroundColor: filtro === estado.value ? 
                    "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)" : "rgba(102, 126, 234, 0.1)",
                }
              }}
            />
          ))}
        </Stack>

        <AnimatePresence>
          {permisosFiltrados.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                No hay permisos para este filtro.
              </Alert>
            </motion.div>
          ) : (
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {permisosFiltrados.map((permiso, index) => (
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
                      
                      <Typography variant="caption" color="text.secondary">
                        Solicitado: {formatDate(permiso.fecha_solicitud)}
                      </Typography>
                    </Box>

                    <Stack direction="column" spacing={1} sx={{ ml: 2 }}>
                      {permiso.estatus_director === "pendiente" && (
                        <>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => handleEditar(permiso)}
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: "500",
                              minWidth: 80
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleCancelar(permiso.id_permiso)}
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: "500",
                              minWidth: 80
                            }}
                          >
                            Cancelar
                          </Button>
                        </>
                      )}
                    </Stack>
                  </ListItem>

                  {index < permisosFiltrados.length - 1 && (
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