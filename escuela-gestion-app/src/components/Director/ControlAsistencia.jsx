import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Divider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Chip,
} from "@mui/material";
import EmpleadoService from "../../services/EmpleadoService";

export default function ControlAsistencia({ onRegistrar, onRetardo }) {
  const [empleadoId, setEmpleadoId] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaEntrada, setHoraEntrada] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [minutosRetardo, setMinutosRetardo] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [activeTab, setActiveTab] = useState("asistencia");

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await EmpleadoService.listarEmpleados();
        setEmpleados(response);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmpleados();
  }, []);

  const handleRegistrar = (e) => {
    e.preventDefault();
    onRegistrar({
      empleado_id: empleadoId,
      fecha,
      hora_entrada: horaEntrada,
      hora_salida: horaSalida,
    });
  };

  const handleRetardo = (e) => {
    e.preventDefault();
    onRetardo({
      empleado_id: empleadoId,
      fecha,
      minutos_retraso: minutosRetardo,
    });
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
          Control de Asistencia
        </Typography>

        {/* Tabs */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={1}>
            <Grid item>
              <Chip
                label="Registrar Asistencia"
                variant={activeTab === "asistencia" ? "filled" : "outlined"}
                onClick={() => setActiveTab("asistencia")}
                sx={{
                  background: activeTab === "asistencia" ? 
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent",
                  color: activeTab === "asistencia" ? "white" : "#667eea",
                  borderColor: "#667eea",
                  fontWeight: "500",
                  "&:hover": {
                    backgroundColor: activeTab === "asistencia" ? 
                      "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)" : "rgba(102, 126, 234, 0.1)",
                  }
                }}
              />
            </Grid>
            <Grid item>
              <Chip
                label="Registrar Retardo"
                variant={activeTab === "retardo" ? "filled" : "outlined"}
                onClick={() => setActiveTab("retardo")}
                sx={{
                  background: activeTab === "retardo" ? 
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent",
                  color: activeTab === "retardo" ? "white" : "#667eea",
                  borderColor: "#667eea",
                  fontWeight: "500",
                  "&:hover": {
                    backgroundColor: activeTab === "retardo" ? 
                      "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)" : "rgba(102, 126, 234, 0.1)",
                  }
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Employee Selector */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel sx={{ color: "#667eea", fontWeight: "500" }}>
            Seleccionar Empleado
          </InputLabel>
          <Select
            value={empleadoId}
            onChange={(e) => setEmpleadoId(e.target.value)}
            label="Seleccionar Empleado"
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
            {empleados.map((emp) => (
              <MenuItem key={emp.id_empleado} value={emp.id_empleado}>
                {emp.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Attendance Form */}
        {activeTab === "asistencia" && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              component="form"
              onSubmit={handleRegistrar}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <TextField
                label="Fecha"
                type="date"
                variant="outlined"
                size="medium"
                InputLabelProps={{ shrink: true }}
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
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
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Hora Entrada"
                    type="time"
                    variant="outlined"
                    size="medium"
                    InputLabelProps={{ shrink: true }}
                    value={horaEntrada}
                    onChange={(e) => setHoraEntrada(e.target.value)}
                    required
                    fullWidth
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
                <Grid item xs={6}>
                  <TextField
                    label="Hora Salida"
                    type="time"
                    variant="outlined"
                    size="medium"
                    InputLabelProps={{ shrink: true }}
                    value={horaSalida}
                    onChange={(e) => setHoraSalida(e.target.value)}
                    required
                    fullWidth
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
              </Grid>

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
                Registrar Asistencia
              </Button>
            </Box>
          </motion.div>
        )}

        {/* Delay Form */}
        {activeTab === "retardo" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              component="form"
              onSubmit={handleRetardo}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <TextField
                label="Fecha"
                type="date"
                variant="outlined"
                size="medium"
                InputLabelProps={{ shrink: true }}
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
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
              
              <TextField
                label="Minutos de Retardo"
                type="number"
                variant="outlined"
                size="medium"
                value={minutosRetardo}
                onChange={(e) => setMinutosRetardo(e.target.value)}
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
                color="error"
                sx={{
                  background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                  borderRadius: 2,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: "600",
                  textTransform: "none",
                  boxShadow: "0 4px 15px rgba(255, 107, 107, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(255, 107, 107, 0.4)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Registrar Retardo
              </Button>
            </Box>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
}