const moment = require('moment');
const Image = require('../models/Image');
const Peca = require('../models/Peca');
const User = require('../models/User');

class PecaController {
  async index(req, res) {
    const userLogged = await User.findById(req.userId);

    const {nomeLinha, dataIncio, dataFim, veiculo} = req.query;

    const filters = {};

    let peca = await Peca.find()
      .sort('-createdAt')
      .populate({
        path: 'imagem',
        select: ['_id', 'url'],
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

      if (veiculo) {
        filters.veiculo = new RegExp(veiculo, 'i');
      }

      let pecaFilter = await Peca.paginate(filters, {
        page: req.query.page || 1,
        limit: parseInt(req.query.limit_page) || 1000000,
        populate: [
          {
            path: 'imagem',
            select: ['_id', 'url'],
          },
          {
            path: 'userCreate',
            select: ['_id', 'name', 'email'],
          },
        ],
        sort: '-createdAt',
      });

      peca = pecaFilter.docs;
    } else if (nomeLinha) {
      peca = await Peca.find({
        nomeLinha: new RegExp(nomeLinha, 'i'),
      })
        .populate({
          path: 'imagem',
          select: ['_id', 'url'],
        })
        .populate({
          path: 'userCreate',
          select: ['_id', 'name', 'email'],
        });
    } else if (veiculo) {
      peca = await Peca.find({
        veiculo: new RegExp(veiculo, 'i'),
      })
        .populate({
          path: 'imagem',
          select: ['_id', 'url'],
        })
        .populate({
          path: 'userCreate',
          select: ['_id', 'name', 'email'],
        });
    }

    // Filtra por dados do mes e ano atual
    // if (!dataIncio || !dataFim) {
    //   peca = peca.filter(
    //     (aliment) =>
    //       moment(aliment.createdAt).month() ===
    //         moment(Date.now()).month() &&
    //       moment(aliment.createdAt).year() ===
    //         moment(Date.now()).year()
    //   );
    // }

    if (userLogged.role !== 'ROLE_ADMIN') {
      peca = peca.filter((item) => {
        if (item.userCreate) {
          return (
            String(item.userCreate._id) === String(userLogged._id)
          );
        }
      });
    }

    return res.json(peca);
  }

  async store(req, res) {
    const userLogged = await User.findById(req.userId);

    const {
      originalname: name,
      size,
      key,
      location: url = '',
    } = req.file;

    const image = await Image.create({
      name,
      size,
      key,
      url,
    });

    const {
      nomeLinha,
      nomePeca,
      quantidade,
      desconto,
      descricao,
      total,
      veiculo,
      valorUnitario,
      tipoPagamento,
      dataNota,
    } = req.body;

    const data = !dataNota
      ? new Date()
      : moment(dataNota).format('YYYY-MM-DDT00:1m:ss.SSSZ');

    const peca = await Peca.create({
      nomeLinha,
      nomePeca,
      quantidade,
      desconto,
      descricao,
      imagem: image._id,
      total,
      veiculo,
      valorUnitario,
      tipoPagamento,
      userCreate: userLogged._id,
      createdAt: data,
    });

    return res.json(peca);
  }

  async show(req, res) {
    const {id} = req.params;

    const alimentacoes = await Peca.findById(id).populate({
      path: 'imagem',
      select: ['_id', 'url'],
    });

    return res.json(alimentacoes);
  }

  async update(req, res) {
    const {id} = req.params;

    if (req.file) {
      const peca = await Peca.findById(id);

      const {imagem: imageId} = peca;

      const image = await Image.findById(imageId);

      if (image) {
        await image.remove();
      }

      const {
        originalname: name,
        size,
        key,
        location: url = '',
      } = req.file;

      const imageCreate = await Image.create({
        name,
        size,
        key,
        url,
      });

      const {
        nomeLinha,
        nomePeca,
        quantidade,
        desconto,
        descricao,
        total,
        veiculo,
        tipoPagamento,
        valorUnitario,
        dataNota,
      } = req.body;

      const data = !dataNota
        ? new Date()
        : moment(dataNota).format('YYYY-MM-DDT00:1m:ss.SSSZ');

      const pecaUpdate = await Peca.findByIdAndUpdate(
        id,
        {
          nomeLinha,
          nomePeca,
          quantidade,
          desconto,
          descricao,
          imagem: imageCreate._id,
          total,
          veiculo,
          valorUnitario,
          tipoPagamento,
          createdAt: data,
        },
        {
          new: true,
        }
      );

      return res.json(pecaUpdate);
    } else {
      const {
        nomeLinha,
        nomePeca,
        quantidade,
        desconto,
        descricao,
        total,
        veiculo,
        valorUnitario,
        tipoPagamento,
        dataNota,
      } = req.body;

      const data = !dataNota
        ? new Date()
        : moment(dataNota).format('YYYY-MM-DDT00:1m:ss.SSSZ');

      const peca = await Peca.findByIdAndUpdate(
        id,
        {
          nomeLinha,
          nomePeca,
          quantidade,
          desconto,
          descricao,
          total,
          veiculo,
          valorUnitario,
          tipoPagamento,
          createdAt: data,
        },
        {
          new: true,
        }
      );

      res.json(peca);
    }
  }

  async delete(req, res) {
    const peca = await Peca.findById(req.params.id);

    const {imagem: imageId} = peca;

    const image = await Image.findById(imageId);

    if (image) {
      await image.remove();
    }

    await peca.remove();

    return res.send();
  }
}

module.exports = new PecaController();
