const moment = require('moment');
const Saldo = require('../models/Saldo');
const User = require('../models/User');

class SaldoController {
  async index(req, res) {
    const userLogged = await User.findById(req.userId);

    const { dataIncio, dataFim, allDatas, descricao } = req.query;

    const filters = {};

    let saldo = await Saldo.find()
      .sort('-createdAt')
      .populate({
        path: 'userCreate',
        select: ['_id', 'name', 'email'],
      });

    //Filtro de data e nome linha
    if (dataIncio && dataFim) {
      filters.createdAt = {};

      const inicio = moment(dataIncio).format(
        'YYYY-MM-DDT00:mm:ss.SSSZ'
      );

      const fim = moment(dataFim).format('YYYY-MM-DDT23:59:ss.SSSZ');

      filters.createdAt.$gte = inicio;
      filters.createdAt.$lte = fim;

      if (descricao) {
        filters.descricao = new RegExp(descricao, 'i');
      }

      let saldoFilter = await Saldo.paginate(filters, {
        page: req.query.page || 1,
        limit: parseInt(req.query.limit_page) || 1000000,
        populate: [
          {
            path: 'userCreate',
            select: ['_id', 'name', 'email'],
          },
        ],
        sort: '-createdAt',
      });

      saldo = saldoFilter.docs;
    } else if (descricao) {
      saldo = await Saldo.find({
        descricao: new RegExp(descricao, 'i'),
      }).populate({
        path: 'userCreate',
        select: ['_id', 'name', 'email'],
      });
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

    if (userLogged.role !== 'ROLE_ADMIN') {
      saldo = saldo.filter((item) => {
        if (item.userCreate) {
          return (
            String(item.userCreate._id) === String(userLogged._id)
          );
        }
      });
    }

    return res.json(saldo);
  }
  async store(req, resp) {
    const userLogged = await User.findById(req.userId);

    const { total, descricao } = req.body;

    const saldo = await Saldo.create({
      total,
      descricao,
      userCreate: userLogged._id,
    });

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
