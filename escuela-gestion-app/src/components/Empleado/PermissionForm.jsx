import { useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfesorService from "../../services/ProfesorService";

export default function PermissionForm({ onActualizacion }) {
  const [tipo, setTipo] = useState("");
  const [motivo, setMotivo] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const empleado_id = parseInt(localStorage.getItem("id_empleado"));
      if (!empleado_id) throw new Error("No se encontró el ID del empleado");

      const respuesta = await ProfesorService.solicitarPermiso({
        empleado_id,
        tipo,
        motivo,
        fecha_inicio: new Date(fechaInicio).toISOString(),
      });

      const { data } = respuesta;
      if (data.valiadtion_error) {
        toast.warning(data.mensaje);
        setTipo("");
        setMotivo("");
        setFechaInicio("");
        onActualizacion();
        return;
      }

      toast.success("Permiso solicitado correctamente");

      setTipo("");
      setMotivo("");
      setFechaInicio("");
      onActualizacion();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar 
        theme="colored"
      />
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
            Solicitar Nuevo Permiso
          </Typography>
          
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: 3 
            }}
          >
            <FormControl fullWidth>
              <InputLabel sx={{ color: "#667eea", fontWeight: "500" }}>
                Tipo de permiso
              </InputLabel>
              <Select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                label="Tipo de permiso"
                required
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e0e0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#667eea",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#667eea",
                  },
                }}
              >
                <MenuItem value="temporal">Temporal (horas)</MenuItem>
                <MenuItem value="economico">Económico (día completo)</MenuItem>
                <MenuItem value="cumpleaños">Cumpleaños</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Motivo"
              variant="outlined"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              required
              multiline
              rows={3}
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

            <TextField
              label="Fecha de inicio"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
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

            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: 2,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: "600",
                textTransform: "none",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Enviar Solicitud
            </Button>
          </Box>
        </Box>
      </motion.div>
    </>
  );
}