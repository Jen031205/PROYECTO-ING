import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Paper,
  TextField,
  MenuItem,
  Button,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Box,
} from "@mui/material";
import EmpleadoService from "../../services/EmpleadoService"; 

export default function Filtros({ onFiltrar }) {
  const [empleadoId, setEmpleadoId] = useState("");
  const [tipo, setTipo] = useState("");
  const [mes, setMes] = useState("");
  const [estatus, setEstatus] = useState("");
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await EmpleadoService.listarEmpleados(); 
        setEmpleados(response);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchEmpleados();
  }, []);

  const handleFiltrar = (e) => {
    e.preventDefault();
    onFiltrar({ empleado_id: empleadoId, tipo, mes, estatus_rh: estatus });
  };

  const handleLimpiar = () => {
    setEmpleadoId("");
    setTipo("");
    setMes("");
    setEstatus("");
    onFiltrar({});
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
          Filtros de Búsqueda
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
          <Grid container spacing={2} alignItems="end">
            {/* Empleado */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Empleado</InputLabel>
                <Select
                  value={empleadoId}
                  onChange={(e) => setEmpleadoId(e.target.value)}
                  label="Empleado"
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
                  <MenuItem value="">Todos los empleados</MenuItem>
                  {empleados.map((emp) => (
                    <MenuItem key={emp.id_empleado} value={emp.id_empleado}>
                      {emp.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Tipo de permiso */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  label="Tipo"
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
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="temporal">Temporal</MenuItem>
                  <MenuItem value="economico">Económico</MenuItem>
                  <MenuItem value="cumpleaños">Cumpleaños</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Estatus */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Estatus</InputLabel>
                <Select
                  value={estatus}
                  onChange={(e) => setEstatus(e.target.value)}
                  label="Estatus"
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
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="aprobado">Aprobado</MenuItem>
                  <MenuItem value="rechazado">Rechazado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Mes */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Mes"
                type="month"
                size="small"
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
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
            </Grid>

            {/* Botones */}
            <Grid item xs={12} sm={6} md={2}>
              <Stack direction="row" spacing={1}>
                <Button 
                  variant="outlined" 
                  onClick={handleLimpiar}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "500",
                    borderColor: "#667eea",
                    color: "#667eea",
                  }}
                >
                  Limpiar
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleFiltrar}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "500",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                    "&:hover": {
                      boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                    },
                  }}
                >
                  Filtrar
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </motion.div>
  );
}