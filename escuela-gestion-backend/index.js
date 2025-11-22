require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const router = require("./src/router/router.js");
const sequelize = require("./src/config/db.js");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api", router);

const PORT = process.env.PORT || 4000;

// ? Sincroniza con la base de datos
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Base de datos sincronizada correctamente");
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  })
  .catch((err) => console.error("Error al sincronizar BD:", err));
