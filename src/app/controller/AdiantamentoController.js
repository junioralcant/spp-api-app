const moment = require('moment');
const Adiantamento = require('../models/Adiantamento');
const Image = require('../models/Image');
const User = require('../models/User');

class AdiantamentoController {
  async index(req, res) {
    const userLogged = await User.findById(req.userId);

    const {
      nomeLinha,
      dataIncio,
      dataFim,
      colaborador,
      tipoPagamento,
    } = req.query;

    const filters = {};

    let adiantamento = await Adiantamento.find()
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

      if (colaborador) {
        filters.nomeColaborador = new RegExp(colaborador, 'i');
      }

      if (tipoPagamento) {
        filters.tipoPagamento = new RegExp(tipoPagamento, 'i');
      }

      let adiantamentoFilter = await Adiantamento.paginate(filters, {
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

      adiantamento = adiantamentoFilter.docs;
    } else if (nomeLinha) {
      adiantamento = await Adiantamento.find({
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
    } else if (colaborador) {
      adiantamento = await Adiantamento.find({
        nomeColaborador: new RegExp(colaborador, 'i'),
      })
        .populate({
          path: 'imagem',
          select: ['_id', 'url'],
        })
        .populate({
          path: 'userCreate',
          select: ['_id', 'name', 'email'],
        });
    } else if (tipoPagamento) {
      adiantamento = await Adiantamento.find({
        tipoPagamento: new RegExp(tipoPagamento, 'i'),
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
    //   adiantamento = adiantamento.filter(
    //     (aliment) =>
    //       moment(aliment.createdAt).month() ===
    //         moment(Date.now()).month() &&
    //       moment(aliment.createdAt).year() ===
    //         moment(Date.now()).year()
    //   );
    // }

    if (userLogged.role !== 'ROLE_ADMIN') {
      adiantamento = adiantamento.filter((item) => {
        if (item.userCreate) {
          return (
            String(item.userCreate._id) === String(userLogged._id)
          );
        }
      });
    }

    return res.json(adiantamento);
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
      nomeColaborador,
      descricao,
      total,
      dataNota,
      tipoPagamento,
    } = req.body;

    const data = !dataNota
      ? new Date()
      : moment(dataNota).format('YYYY-MM-DDT00:1m:ss.SSSZ');

    const adiantamento = await Adiantamento.create({
      nomeLinha,
      nomeColaborador,
      descricao,
      imagem: image._id,
      tipoPagamento,
      total,
      userCreate: userLogged._id,
      createdAt: data,
    });

    return res.json(adiantamento);
  }

  async show(req, res) {
    const {id} = req.params;

    const alimentacoes = await Adiantamento.findById(id).populate({
      path: 'imagem',
      select: ['_id', 'url'],
    });

    return res.json(alimentacoes);
  }

  async update(req, res) {
    const {id} = req.params;

    if (req.file) {
      const adiantamento = await Adiantamento.findById(id);

      const {imagem: imageId} = adiantamento;

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
        nomeColaborador,
        descricao,
        total,
        dataNota,
        tipoPagamento,
      } = req.body;

      const data = !dataNota
        ? new Date()
        : moment(dataNota).format('YYYY-MM-DDT00:1m:ss.SSSZ');

      const adiantamentoUpdate = await Adiantamento.findByIdAndUpdate(
        id,
        {
          nomeLinha,
          nomeColaborador,
          descricao,
          total,
          tipoPagamento,
          imagem: imageCreate._id,
          createdAt: data,
        },
        {
          new: true,
        }
      );

      return res.json(adiantamentoUpdate);
    } else {
      const {
        nomeLinha,
        nomeColaborador,
        descricao,
        total,
        dataNota,
        tipoPagamento,
      } = req.body;

      const data = !dataNota
        ? new Date()
        : moment(dataNota).format('YYYY-MM-DDT00:1m:ss.SSSZ');

      const adiantamento = await Adiantamento.findByIdAndUpdate(
        id,
        {
          nomeLinha,
          nomeColaborador,
          descricao,
          total,
          tipoPagamento,
          createdAt: data,
        },
        {
          new: true,
        }
      );

      res.json(adiantamento);
    }
  }

  async delete(req, res) {
    const adiantamento = await Adiantamento.findById(req.params.id);

    const {imagem: imageId} = adiantamento;

    const image = await Image.findById(imageId);

    if (image._id) {
      await image.remove();
    }

    await adiantamento.remove();

    return res.send();
  }
}

module.exports = new AdiantamentoController();
