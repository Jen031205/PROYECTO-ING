import { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
import PermissionForm from "../components/Empleado/PermissionForm";
import PermissionHistory from "../components/Empleado/PermissionHistory";
import CalendarComponent from "../components/Empleado/CalendarComponent";
import ProfesorService from "../services/ProfesorService";

export default function PermisosPage() {
  const [permisos, setPermisos] = useState([]);
  const empleado_id = localStorage.getItem("id_empleado");

  const fetchPermisos = async () => {
    try {
      const response = await ProfesorService.obtenerHistorial(empleado_id);
      setPermisos(response.data)
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchPermisos();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 80% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
        }
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Typography 
            variant="h3" 
            fontWeight="700" 
            sx={{ 
              background: "linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              mb: 1,
              textAlign: "center"
            }}
          >
            Gestión de Permisos
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: "rgba(255, 255, 255, 0.8)",
              textAlign: "center",
              mb: 4
            }}
          >
            Solicita y gestiona tus permisos de manera eficiente
          </Typography>
        </motion.div>

        {/* Form Section */}
        <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
          <Paper 
            sx={{ 
              p: 4,
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)",
              overflow: "hidden"
            }}
          >
            <PermissionForm onActualizacion={fetchPermisos} />
          </Paper>
        </motion.div>

        {/* History and Calendar Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 3,
            alignItems: "start"
          }}
        >
          {/* History Section */}
          <motion.div variants={itemVariants}>
            <Paper 
              sx={{ 
                p: 4,
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                height: "fit-content",
                minHeight: 400
              }}
            >
              <PermissionHistory 
                permisos={permisos} 
                onSeleccionar={() => {}} 
                onActualizar={fetchPermisos} 
              />
            </Paper>
          </motion.div>

          {/* Calendar Section */}
          <motion.div variants={itemVariants}>
            <Paper 
              sx={{ 
                p: 4,
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                height: "fit-content",
                minHeight: 400
              }}
            >
              <CalendarComponent permisos={permisos} />
            </Paper>
          </motion.div>
        </Box>
      </motion.div>
    </Box>
  );
}