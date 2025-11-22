import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import RHService from "../../services/RHService";

export default function ModalAprobatorio({ permiso, onCerrar, onActualizado }) {
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [alerta, setAlerta] = useState({ open: false, mensaje: "", tipo: "success" });

  if (!permiso) return null;

  console.log(permiso)
  const manejarAccion = async (estatus) => {
    try {
      setLoading(true);
      const res = await RHService.actualizarPermiso(
        permiso.id_permiso,
        estatus,
        comentario
      );

      setAlerta({
        open: true,
        mensaje: `Permiso ${estatus} correctamente.`,
        tipo: "success",
      });

      if (onActualizado) onActualizado(res.data);
      onCerrar();
    } catch (error) {
      console.error(error);
      setAlerta({
        open: true,
        mensaje: error.response?.data?.message || "Error al actualizar permiso.",
        tipo: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (estatus) => {
    switch (estatus) {
      case "aprobado": return "success";
      case "rechazado": return "error";
      case "pendiente": return "warning";
      default: return "default";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <>
      <Dialog
        open={!!permiso}
        onClose={onCerrar}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          component: motion.div,
          initial: { scale: 0.9, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { duration: 0.3 },
        }}
      >
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
          }}
        >
          <DialogTitle sx={{ p: 0, mb: 3 }}>
            <Typography
              variant="h5"
              fontWeight="600"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Revisar Permiso
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ p: 0, mb: 3 }}>
            {/* Información del permiso */}
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" fontWeight="500">
                  Empleado:
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {permiso.Empleado?.nombre || "Desconocido"}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" fontWeight="500">
                  Tipo:
                </Typography>
                <Chip
                  label={permiso.tipo?.charAt(0).toUpperCase() + permiso.tipo?.slice(1)}
                  size="small"
                  variant="outlined"
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" fontWeight="500">
                  Estado:
                </Typography>
                <Chip
                  label={permiso.estatus_rh?.charAt(0).toUpperCase() + permiso.estatus_rh?.slice(1)}
                  color={getStatusColor(permiso.estatus_rh)}
                  size="small"
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" fontWeight="500">
                  Fecha:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(permiso.fecha_inicio)}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="body1" fontWeight="500" gutterBottom>
                  Motivo:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  {permiso.motivo}
                </Typography>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Comentario adicional"
                variant="outlined"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "#667eea",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#667eea",
                    },
                  },
                }}
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 0 }}>
            <Stack direction="row" spacing={2} width="100%">
              <Button
                onClick={onCerrar}
                variant="outlined"
                disabled={loading}
                fullWidth
                sx={{
                  borderRadius: 2,
                  py: 1,
                  textTransform: "none",
                  fontWeight: "500",
                  borderColor: "#667eea",
                  color: "#667eea",
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => manejarAccion("rechazado")}
                variant="contained"
                disabled={loading}
                fullWidth
                sx={{
                  borderRadius: 2,
                  py: 1,
                  textTransform: "none",
                  fontWeight: "500",
                  background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                  boxShadow: "0 4px 15px rgba(255, 107, 107, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(255, 107, 107, 0.4)",
                  },
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Rechazar"}
              </Button>
              <Button
                onClick={() => manejarAccion("aprobado")}
                variant="contained"
                disabled={loading}
                fullWidth
                sx={{
                  borderRadius: 2,
                  py: 1,
                  textTransform: "none",
                  fontWeight: "500",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                  },
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Aprobar"}
              </Button>
            </Stack>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar
        open={alerta.open}
        autoHideDuration={3000}
        onClose={() => setAlerta({ ...alerta, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={alerta.tipo}
          onClose={() => setAlerta({ ...alerta, open: false })}
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          {alerta.mensaje}
        </Alert>
      </Snackbar>
    </>
  );
}