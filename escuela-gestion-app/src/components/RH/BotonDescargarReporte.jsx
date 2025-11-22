import { Button } from "@mui/material";
import { FileText } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const API_URL = "http://localhost:4000/api";

export default function BotonDescargarReporte() {
  const descargarPDF = async () => {
    try {
      const response = await axios.get(`${API_URL}/rh/reporte-estadisticas`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Reporte_Estadisticas_Permisos.pdf";
      a.click();
      toast.success("Reporte descargado correctamente");
    } catch (error) {
      toast.error("Error al descargar el reporte");
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={<FileText size={18} />}
      onClick={descargarPDF}
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        textTransform: "none",
        fontWeight: "600",
        borderRadius: 2,
        boxShadow: "0 4px 15px rgba(118,75,162,0.3)",
        "&:hover": { boxShadow: "0 6px 20px rgba(118,75,162,0.4)" },
      }}
    >
      Descargar Reporte PDF
    </Button>
  );
}
