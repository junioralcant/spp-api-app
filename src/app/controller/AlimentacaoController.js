const moment = require('moment');
const Alimentacao = require('../models/Alimentacao');
const Image = require('../models/Image');
const User = require('../models/User');

class AlimentacaoController {
  async index(req, res) {
    const userLogged = await User.findById(req.userId);

    const {nomeLinha, dataIncio, dataFim, tipoPagamento} = req.query;

    const filters = {};

    let alimentacao = await Alimentacao.find()
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

      if (tipoPagamento) {
        filters.tipoPagamento = new RegExp(tipoPagamento, 'i');
      }

      let alimentacaoFilter = await Alimentacao.paginate(filters, {
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

      alimentacao = alimentacaoFilter.docs;
    } else if (nomeLinha) {
      alimentacao = await Alimentacao.find({
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
    } else if (tipoPagamento) {
      alimentacao = await Alimentacao.find({
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
    if (!dataIncio || !dataFim) {
      alimentacao = alimentacao.filter(
        (aliment) =>
          moment(aliment.createdAt).year() ===
          moment(Date.now()).year()
      );
    }

    if (userLogged.role !== 'ROLE_ADMIN') {
      alimentacao = alimentacao.filter((item) => {
        if (item.userCreate) {
          return (
            String(item.userCreate._id) === String(userLogged._id)
          );
        }
      });
    }

    return res.json(alimentacao);
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
      quantidade,
      descricao,
      total,
      dataNota,
      tipoPagamento,
    } = req.body;

    const data = !dataNota
      ? new Date()
      : moment(dataNota).format('YYYY-MM-DDT00:1m:ss.SSSZ');

    const alimentacao = await Alimentacao.create({
      nomeLinha,
      quantidade,
      descricao,
      imagem: image._id,
      total,
      tipoPagamento,
      userCreate: userLogged._id,
      createdAt: data,
    });

    return res.json(alimentacao);
  }

  async show(req, res) {
    const {id} = req.params;

    const alimentacoes = await Alimentacao.findById(id).populate({
      path: 'imagem',
      select: ['_id', 'url'],
    });

    return res.json(alimentacoes);
  }

  async update(req, res) {
    const {id} = req.params;

    if (req.file) {
      const alimentacao = await Alimentacao.findById(id);

      const {imagem: imageId} = alimentacao;

      const image = await Image.findById(imageId);

      if (image._id) {
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
        quantidade,
        descricao,
        total,
        dataNota,
        tipoPagamento,
      } = req.body;

      const data = !dataNota
        ? new Date()
        : moment(dataNota).format('YYYY-MM-DDT00:1m:ss.SSSZ');

      const alimentacaoUpdate = await Alimentacao.findByIdAndUpdate(
        id,
        {
          nomeLinha,
          quantidade,
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

      return res.json(alimentacaoUpdate);
    } else {
      const {
        nomeLinha,
        quantidade,
        descricao,
        total,
        dataNota,
        tipoPagamento,
      } = req.body;

      const data = !dataNota
        ? new Date()
        : moment(dataNota).format('YYYY-MM-DDT00:1m:ss.SSSZ');

      const alimentacao = await Alimentacao.findByIdAndUpdate(
        id,
        {
          nomeLinha,
          quantidade,
          descricao,
          total,
          tipoPagamento,
          createdAt: data,
        },
        {
          new: true,
        }
      );

      res.json(alimentacao);
    }
  }

  async delete(req, res) {
    const alimentacao = await Alimentacao.findById(req.params.id);

    const {imagem: imageId} = alimentacao;

    const image = await Image.findById(imageId);

    if (image._id) {
      await image.remove();
    }

    await alimentacao.remove();

    return res.send();
  }
}

module.exports = new AlimentacaoController();
