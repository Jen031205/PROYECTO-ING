import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, TextField, Button, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmpleadoService from "../services/EmpleadoService";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await EmpleadoService.resetPassword(token, newPassword);
      toast.success("Contraseña restablecida correctamente");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      toast.error(err.message);
    }
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
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Paper
            sx={{
              p: 5,
              borderRadius: 4,
              background: "rgba(255,255,255,0.95)",
              width: 400,
              maxWidth: "90vw",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="700"
              textAlign="center"
              mb={3}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Restablecer Contraseña
            </Typography>

            <Stack spacing={3} component="form" onSubmit={handleReset}>
              <TextField
                label="Nueva contraseña"
                type="password"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Button type="submit" variant="contained" fullWidth>
                Guardar Contraseña
              </Button>
            </Stack>
          </Paper>
        </motion.div>
      </Box>
    </>
  );
}
