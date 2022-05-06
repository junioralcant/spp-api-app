const Admin = require('../models/User');

class SessionController {
  async store(req, resp) {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return resp
        .status(400)
        .json({ error: 'Usuario não encontrado' });
    }

    if (!(await admin.compareHash(password))) {
      return resp.status(400).json({ error: 'Password inválida' });
    }

    return resp.json({ admin, token: Admin.generateToken(admin) });
  }
}

module.exports = new SessionController();
