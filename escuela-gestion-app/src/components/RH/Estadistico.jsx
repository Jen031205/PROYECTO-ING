import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Paper,
  Typography,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  ExpandMore,
  TrendingUp,
  People,
  Schedule,
  CheckCircle,
  Cancel,
  Pending,
} from "@mui/icons-material";
import RHService from "../../services/RHService";
import BotonDescargarReporte from "./BotonDescargarReporte";

export default function EstadisticasPermisos() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({
    resumen: true,
    empleados: false,
    recientes: false,
  });

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded({ ...expanded, [panel]: isExpanded });
  };

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const response = await RHService.obtenerEstadisticasPermisos();
        console.log(response);
        setEstadisticas(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEstadisticas();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={40} sx={{ color: '#667eea' }} />
      </Box>
    );
  }

  if (!estadisticas) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 3,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No se pudieron cargar las estadísticas
        </Typography>
      </Paper>
    );
  }

  const { resumen, porEmpleado, recientes } = estadisticas;

  const getStatusColor = (estatus) => {
    switch (estatus?.toLowerCase()) {
      case "aprobado": return "success";
      case "rechazado": return "error";
      case "pendiente": return "warning";
      default: return "default";
    }
  };

  const getStatusIcon = (estatus) => {
    switch (estatus?.toLowerCase()) {
      case "aprobado": return <CheckCircle />;
      case "rechazado": return <Cancel />;
      case "pendiente": return <Pending />;
      default: return <Schedule />;
    }
  };

  const getCardIcon = (tipo) => {
    switch (tipo) {
      case "total": return <TrendingUp />;
      case "temporal": return <Schedule />;
      case "economico": return <People />;
      case "cumpleaños": return <People />;
      default: return <TrendingUp />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box>


        {/* Resumen Global - Accordion */}
        <Accordion
          expanded={expanded.resumen}
          onChange={handleAccordionChange("resumen")}
          sx={{
            mb: 3,
            borderRadius: '16px !important',
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            '&:before': { display: 'none' },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore sx={{ color: '#667eea' }} />}
            sx={{
              borderRadius: '16px',
              '& .MuiAccordionSummary-content': {
                alignItems: 'center',
                gap: 2,
              },
            }}
          >
            <TrendingUp sx={{ color: '#667eea' }} />
            <Typography variant="h6" fontWeight="600" color="#667eea">
              Resumen Global
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {/* Total de Permisos */}
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 40px rgba(102, 126, 234, 0.3)",
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <TrendingUp sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
                    <Typography variant="h3" fontWeight="700" sx={{ mb: 1 }}>
                      {resumen.total}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Total de Permisos
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Por Tipo */}
              {Object.entries(resumen.porTipo).map(([tipo, valor]) => (
                <Grid item xs={12} sm={6} md={3} key={tipo}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", p: 3 }}>
                      {getCardIcon(tipo)}
                      <Typography
                        variant="h4"
                        fontWeight="700"
                        sx={{
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          color: "transparent",
                          mb: 1,
                        }}
                      >
                        {valor}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight="500">
                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}

              {/* Por Estatus RH */}
              {Object.entries(resumen.porEstatusRH).map(([estatus, valor]) => (
                <Grid item xs={12} sm={6} md={3} key={estatus}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", p: 3 }}>
                      {getStatusIcon(estatus)}
                      <Typography
                        variant="h4"
                        fontWeight="700"
                        sx={{
                          background: `linear-gradient(135deg, ${estatus === 'aprobado' ? '#66bb6a' :
                            estatus === 'rechazado' ? '#ef5350' : '#ffa726'
                            } 0%, ${estatus === 'aprobado' ? '#388e3c' :
                              estatus === 'rechazado' ? '#d32f2f' : '#f57c00'
                            } 100%)`,
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          color: "transparent",
                          mb: 1,
                        }}
                      >
                        {valor}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight="500">
                        {estatus.charAt(0).toUpperCase() + estatus.slice(1)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}

              {/* Promedio días temporal */}
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    borderRadius: 3,
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Schedule />
                    <Typography
                      variant="h4"
                      fontWeight="700"
                      sx={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                        mb: 1,
                      }}
                    >
                      {resumen.promedioDiasTemporal}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight="500">
                      Promedio días
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Box sx={{ display: "flex", justifyContent: "end", mb: 2 }}>
                <BotonDescargarReporte />
              </Box>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Por Empleado - Accordion */}
        <Accordion
          expanded={expanded.empleados}
          onChange={handleAccordionChange("empleados")}
          sx={{
            mb: 3,
            borderRadius: '16px !important',
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            '&:before': { display: 'none' },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore sx={{ color: '#667eea' }} />}
            sx={{
              borderRadius: '16px',
              '& .MuiAccordionSummary-content': {
                alignItems: 'center',
                gap: 2,
              },
            }}
          >
            <People sx={{ color: '#667eea' }} />
            <Typography variant="h6" fontWeight="600" color="#667eea">
              Permisos por Empleado
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Paper
              sx={{
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "600", color: "#667eea" }}>Empleado</TableCell>
                    <TableCell sx={{ fontWeight: "600", color: "#667eea" }}>Total</TableCell>
                    <TableCell sx={{ fontWeight: "600", color: "#667eea" }}>Aprobados</TableCell>
                    <TableCell sx={{ fontWeight: "600", color: "#667eea" }}>Rechazados</TableCell>
                    <TableCell sx={{ fontWeight: "600", color: "#667eea" }}>Pendientes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {porEmpleado.map((emp) => (
                    <TableRow
                      key={emp.nombre}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(102, 126, 234, 0.04)",
                        },
                      }}
                    >
                      <TableCell sx={{ fontWeight: "500" }}>{emp.nombre}</TableCell>
                      <TableCell>
                        <Chip label={emp.total} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={emp.aprobados}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={emp.rechazados}
                          size="small"
                          color="error"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={emp.pendientes}
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </AccordionDetails>
        </Accordion>

        {/* Últimos Permisos - Accordion */}
        <Accordion
          expanded={expanded.recientes}
          onChange={handleAccordionChange("recientes")}
          sx={{
            borderRadius: '16px !important',
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            '&:before': { display: 'none' },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore sx={{ color: '#667eea' }} />}
            sx={{
              borderRadius: '16px',
              '& .MuiAccordionSummary-content': {
                alignItems: 'center',
                gap: 2,
              },
            }}
          >
            <Schedule sx={{ color: '#667eea' }} />
            <Typography variant="h6" fontWeight="600" color="#667eea">
              Últimos Permisos
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <AnimatePresence>
                {recientes.map((perm, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                        },
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Empleado
                          </Typography>
                          <Typography variant="body1" fontWeight="500">
                            {perm.nombre}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Tipo
                          </Typography>
                          <Chip
                            label={perm.tipo}
                            size="small"
                            variant="outlined"
                            sx={{ borderColor: "#667eea", color: "#667eea" }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Estatus
                          </Typography>
                          <Chip
                            icon={getStatusIcon(perm.estatus)}
                            label={perm.estatus}
                            color={getStatusColor(perm.estatus)}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Inicio
                          </Typography>
                          <Typography variant="body2">
                            {new Date(perm.fechaInicio).toLocaleDateString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Motivo
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {perm.motivo}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>
    </motion.div>
  );
}