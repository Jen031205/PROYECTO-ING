import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  FormControlLabel,
  Switch,
  Link,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmpleadoService from "../services/EmpleadoService";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isRecover, setIsRecover] = useState(false);

  // * Login
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  // * Registro
  const [nombre, setNombre] = useState("");
  const [regCorreo, setRegCorreo] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // * Recuperar
  const [recCorreo, setRecCorreo] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { empleado, token } = await EmpleadoService.loginEmpleado(correo, password);
      localStorage.setItem("token", token);
      localStorage.setItem("rol", empleado.rol);
      localStorage.setItem("id_empleado", empleado.id_empleado);

      toast.success("Inicio de sesión exitoso");
      if (empleado.rol === "empleado") navigate("/permisos");
      else if (empleado.rol === "director") navigate("/director");
      else navigate("/rh");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    try {
      const nuevoEmpleado = { nombre, correo: regCorreo, password: regPassword, rol: "empleado" };
      await EmpleadoService.registrarEmpleado(nuevoEmpleado);
      toast.success("Empleado registrado correctamente. Revisa tu correo para activar la cuenta.");
      setNombre(""); setRegCorreo(""); setRegPassword("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRecuperar = async (e) => {
    e.preventDefault();
    try {
      const response = await EmpleadoService.solicitarReset(recCorreo);
      toast.success("Correo de recuperación enviado correctamente.");
      setRecCorreo("");
      console.log(response)
      setIsRecover(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const animation = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.3 } },
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="colored" />

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Paper
          sx={{
            p: 5,
            borderRadius: 4,
            background: "rgba(255,255,255,0.95)",
            width: 400,
            maxWidth: "90vw",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              fontWeight="700"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Sistema de Gestión
            </Typography>

            {!isRecover && (
              <FormControlLabel
                control={
                  <Switch checked={!isLogin} onChange={() => setIsLogin(!isLogin)} color="primary" />
                }
                label={
                  <Typography variant="body1">
                    {isLogin ? "Iniciar Sesión" : "Registrar Empleado"}
                  </Typography>
                }
              />
            )}
          </Box>

          <AnimatePresence mode="wait">
            {isRecover ? (
              <motion.div key="recover" variants={animation} initial="hidden" animate="visible" exit="exit">
                <Typography variant="h6" align="center" mb={2}>Recuperar Contraseña</Typography>
                <Stack spacing={3} component="form" onSubmit={handleRecuperar}>
                  <TextField
                    label="Correo electrónico"
                    type="email"
                    fullWidth
                    value={recCorreo}
                    onChange={(e) => setRecCorreo(e.target.value)}
                    required
                  />
                  <Button type="submit" variant="contained" fullWidth>
                    Enviar Enlace
                  </Button>
                  <Button onClick={() => setIsRecover(false)}>Volver al inicio</Button>
                </Stack>
              </motion.div>
            ) : isLogin ? (
              <motion.div key="login" variants={animation} initial="hidden" animate="visible" exit="exit">
                <Stack spacing={3} component="form" onSubmit={handleLogin}>
                  <TextField
                    label="Correo electrónico"
                    type="email"
                    fullWidth
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                  />
                  <TextField
                    label="Contraseña"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button type="submit" variant="contained" fullWidth>
                    Iniciar Sesión
                  </Button>
                  <Link
                    component="button"
                    onClick={() => setIsRecover(true)}
                    sx={{ textAlign: "center", mt: 1 }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Stack>
              </motion.div>
            ) : (
              <motion.div key="register" variants={animation} initial="hidden" animate="visible" exit="exit">
                <Stack spacing={3} component="form" onSubmit={handleRegistro}>
                  <TextField
                    label="Nombre completo"
                    fullWidth
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                  <TextField
                    label="Correo electrónico"
                    type="email"
                    fullWidth
                    value={regCorreo}
                    onChange={(e) => setRegCorreo(e.target.value)}
                    required
                  />
                  <TextField
                    label="Contraseña"
                    type="password"
                    fullWidth
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                  <Button type="submit" variant="contained" fullWidth>
                    Registrar Empleado
                  </Button>
                </Stack>
              </motion.div>
            )}
          </AnimatePresence>
        </Paper>
      </Box>
    </>
  );
}
