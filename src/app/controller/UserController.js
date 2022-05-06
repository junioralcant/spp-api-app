const User = require('../models/User');

class UserController {
  async index(req, res) {
    const users = await User.find();

    return res.json(users);
  }

  async store(req, res) {
    const UserExists = await User.findOne({ email: req.body.email });
    if (UserExists) {
      return res.status(400).json({ error: 'Email já existente.' });
    }
    const user = await User.create(req.body);

    return res.json(user);
  }
}

module.exports = new UserController();
