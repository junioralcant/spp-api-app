const Saldo = require('../models/Saldo');
const Transferencia = require('../models/Transferencia');
const User = require('../models/User');

class TransferenciaController {
  async store(req, res) {
    const userLogged = await User.findById(req.userId);

    const {to, total} = req.body;

    const userFrom = await User.findById(userLogged);
    const userTo = await User.findById(to);

    await Saldo.create({
      total,
      descricao: `TRANFERÊNCIA DE ${userFrom.name}`,
      userCreate: userTo._id,
    });

    const transferencia = await Transferencia.create({
      userCreate: userFrom._id,
      to: userTo._id,
      total,
    });

    return res.json(transferencia);
  }
}

module.exports = new TransferenciaController();
