import { motion } from "framer-motion";
import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
  Stack,
} from "@mui/material";

export default function GeneradorReportesPDFUI() {
  const [tipo, setTipo] = useState("");
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tipo || !inicio || !fin) return alert("Completa todos los campos");

    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/director/reporte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo,
          periodo_inicio: inicio,
          periodo_fin: fin,
          generado_por: "director",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error generando el reporte");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte_${tipo}_${inicio}_a_${fin}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Error al generar el reporte PDF: " + error.message);
    } finally {
      setLoading(false);
    }
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
            mb: 3,
          }}
        >
          Generar Reportes
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <FormControl fullWidth>
            <InputLabel sx={{ color: "#667eea", fontWeight: "500" }}>
              Tipo de Reporte
            </InputLabel>
            <Select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              label="Tipo de Reporte"
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
              <MenuItem value="asistencia">Reporte de Asistencia</MenuItem>
              <MenuItem value="permisos">Reporte de Permisos</MenuItem>
              <MenuItem value="retardos">Reporte de Retardos</MenuItem>
            </Select>
          </FormControl>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Fecha Inicio"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={inicio}
                onChange={(e) => setInicio(e.target.value)}
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
                label="Fecha Fin"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={fin}
                onChange={(e) => setFin(e.target.value)}
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

          <Stack direction="row" alignItems="center" justifyContent="center" gap={2}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
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
              {loading ? "Generando..." : "Generar Reporte PDF"}
            </Button>

            {loading && <CircularProgress size={28} sx={{ color: "#667eea" }} />}
          </Stack>
        </Box>
      </Box>
    </motion.div>
  );
}
