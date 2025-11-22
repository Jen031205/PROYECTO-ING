const AuthService = require("../services/AuthService");

class AuthController {
  static async verify(req, res) {
    try {
      const data = await AuthService.verify(req.body);
      res.json({ status: true, ...data });
    } catch (error) {
      res.status(400).json({ status: false, message: error.message });
    }
  }

  static async requestPasswordReset(req, res) {
    try {
      const { correo } = req.body;
      const data = await AuthService.requestPasswordReset(correo);
      res.json({ status: true, ...data });
    } catch (error) {
      res.status(400).json({ status: false, message: error.message });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { token, nuevaPassword } = req.body;
      const data = await AuthService.resetPassword(token, nuevaPassword);
      res.json({ status: true, ...data });
    } catch (error) {
      res.status(400).json({ status: false, message: error.message });
    }
  }
}

module.exports = AuthController;
