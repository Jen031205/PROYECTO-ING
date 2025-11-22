const nodemailer = require("nodemailer");
require("dotenv").config(); 

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  }
});


transporter.verify((error) => {
  if (error) {
    console.error("Error al conectar con el servicio de correo:", error);
  } else {
    console.log("Conexión SMTP establecida correctamente");
  }
});

module.exports = transporter;
