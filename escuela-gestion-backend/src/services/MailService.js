const fs = require("fs");
const path = require("path");
const transporter = require("../config/mailer");

class MailService {
  /**
   * Envía un correo con plantilla HTML y variables dinámicas.
   */
  static async sendEmail({ to, subject, template, variables = {} }) {
    try {
      // * Validar campos obligatorios
      if (!to || !subject || !template)
        throw new Error("Parámetros incompletos para el envío de correo");

      const templatePath = path.join(__dirname, "../templates", `${template}.html`);

      if (!fs.existsSync(templatePath)) {
        throw new Error(`Plantilla '${template}.html' no encontrada`);
      }

      let html = fs.readFileSync(templatePath, "utf-8");

      // * Reemplazo de variables tipo {{variable}}
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, "g");
        html = html.replace(regex, value);
      });

      const mailOptions = {
        from: `"Sistema Escolar" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Correo enviado correctamente a ${to}: ${info.messageId}`);
      return { status: true, message: "Correo enviado correctamente" };
    } catch (error) {
      console.error("Error al enviar correo:", error);
      throw new Error("No se pudo enviar el correo");
    }
  }
}

module.exports = MailService;
