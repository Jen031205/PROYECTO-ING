import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import EmpleadoPage from "./pages/EmpleadoPage";
import DirectorPage from "./pages/DirectorPage";
import RHDashboard from "./components/RH/RHDashboard";
import RHPage from "./pages/RHPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
  const [rol, setRol] = useState(localStorage.getItem("rol") || null);

  // * Escucha cambios en localStorage (ej. login/registro en otra pestaña)
  useEffect(() => {
    const handleStorage = () => setRol(localStorage.getItem("rol"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const PrivateRoute = ({ children, role }) => {
    const currentRol = localStorage.getItem("rol");
    if (!currentRol) return <Navigate to="/" replace />;
    if (role && currentRol !== role) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/" element={<LoginPage />} />

        {/* Empleado / Profesor */}
        <Route
          path="/permisos"
          element={
            <PrivateRoute role="empleado">
              <EmpleadoPage />
            </PrivateRoute>
          }
        />

        {/* Director */}
        <Route
          path="/director"
          element={
            <PrivateRoute role="director">
              <DirectorPage />
            </PrivateRoute>
          }
        />

        {/* Recursos Humanos */}
        <Route
          path="/rh"
          element={
            <PrivateRoute role="rh">
              <RHPage />
            </PrivateRoute>
          }
        />

        { /* Reset password*/}
        <Route
          path="/recuperar/:token"
          element={<ResetPasswordPage />}
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
