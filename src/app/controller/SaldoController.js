const Saldo = require('../models/Saldo');

class SaldoController {
  async index(req, res) {
    const saldo = await Saldo.find();

    return res.json(saldo[0]);
  }
  async store(req, resp) {
    const saldo = await Saldo.create(req.body);

    return resp.json(saldo);
  }

  async update(req, res) {
    const { id } = req.params;
    const saldo = await Saldo.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.json(saldo);
  }
}

module.exports = new SaldoController();
