const Saldo = require('../models/Saldo');
const Transferencia = require('../models/Transferencia');
const User = require('../models/User');

class TransferenciaController {
  async index(req, res) {
    const userLogged = await User.findById(req.userId);

    const {nomeLinha, dataIncio, dataFim} = req.query;

    const filters = {};

    let transferencia = await Transferencia.find()
      .sort('-createdAt')
      .populate({
        path: 'to',
        select: ['_id', 'name', 'email'],
      })
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

      if (nomeLinha) {
        filters.nomeLinha = new RegExp(nomeLinha, 'i');
      }

      let transferenciaFilter = await Transferencia.paginate(
        filters,
        {
          page: req.query.page || 1,
          limit: parseInt(req.query.limit_page) || 1000000,
          populate: [
            {
              path: 'to',
              select: ['_id', 'name', 'email'],
            },
            {
              path: 'userCreate',
              select: ['_id', 'name', 'email'],
            },
          ],
          sort: '-createdAt',
        }
      );

      transferencia = transferenciaFilter.docs;
    } else if (nomeLinha) {
      transferencia = await Transferencia.find({
        nomeLinha: new RegExp(nomeLinha, 'i'),
      })
        .populate({
          path: 'to',
          select: ['_id', 'name', 'email'],
        })
        .populate({
          path: 'userCreate',
          select: ['_id', 'name', 'email'],
        });
    }

    // Filtra por dados do mes e ano atual
    // if (!dataIncio || !dataFim) {
    //   transferencia = Transferencia.filter(
    //     (aliment) =>
    //       moment(aliment.createdAt).month() ===
    //         moment(Date.now()).month() &&
    //       moment(aliment.createdAt).year() ===
    //         moment(Date.now()).year()
    //   );
    // }

    if (userLogged.role !== 'ROLE_ADMIN') {
      transferencia = transferencia.filter((item) => {
        if (item.userCreate) {
          return (
            String(item.userCreate._id) === String(userLogged._id)
          );
        }
      });
    }

    return res.json(transferencia);
  }

  async store(req, res) {
    const userLogged = await User.findById(req.userId);

    const {to, total, nomeLinha} = req.body;

    const userFrom = await User.findById(userLogged);
    const userTo = await User.findById(to);

    const transferencia = await Transferencia.create({
      userCreate: userFrom._id,
      to: userTo._id,
      total,
      nomeLinha,
    });

    await Saldo.create({
      total,
      descricao: `TRANFERÊNCIA DE ${userFrom.name}`,
      userCreate: userTo._id,
      transfer: transferencia._id,
    });

    return res.json(transferencia);
  }

  async delete(req, res) {
    const transferencia = await Transferencia.findById(req.params.id);

    const saldo = await Saldo.find({transfer: transferencia._id});
    await Saldo.findByIdAndDelete(saldo[0]._id);
    await transferencia.remove();

    return res.json();
  }
}

module.exports = new TransferenciaController();
