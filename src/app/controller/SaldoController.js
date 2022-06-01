const moment = require('moment');
const Saldo = require('../models/Saldo');

class SaldoController {
  async index(req, res) {
    const { dataIncio, dataFim, allDatas } = req.query;

    console.log(allDatas);

    const filters = {};

    let saldo = await Saldo.find().sort('-createdAt');

    //Filtro de data e nome linha
    if (dataIncio && dataFim) {
      filters.createdAt = {};

      const inicio = moment(dataIncio).format(
        'YYYY-MM-DDT00:mm:ss.SSSZ'
      );

      const fim = moment(dataFim).format('YYYY-MM-DDT23:59:ss.SSSZ');

      filters.createdAt.$gte = inicio;
      filters.createdAt.$lte = fim;

      let saldoFilter = await Saldo.paginate(filters, {
        page: req.query.page || 1,
        limit: parseInt(req.query.limit_page) || 1000000,
        sort: '-createdAt',
      });

      saldo = saldoFilter.docs;
    }

    // Filtra por dados do mes e ano atual
    if ((!dataIncio || !dataFim) && !allDatas) {
      saldo = saldo.filter(
        (aliment) =>
          moment(aliment.createdAt).month() ===
            moment(Date.now()).month() &&
          moment(aliment.createdAt).year() ===
            moment(Date.now()).year()
      );
    }

    return res.json(saldo);
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

  async delete(req, res) {
    const saldo = await Saldo.findById(req.params.id);

    await saldo.remove();

    return res.send();
  }
}

module.exports = new SaldoController();
