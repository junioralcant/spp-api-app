const moment = require('moment');
const DespesaExtra = require('../models/DespesaExtra');
const Image = require('../models/Image');
const User = require('../models/User');

class DespesaExtraController {
  async index(req, res) {
    const userLogged = await User.findById(req.userId);

    const {nomeLinha, dataIncio, dataFim, item, tipoPagamento} =
      req.query;

    const filters = {};

    let despesaExtra = await DespesaExtra.find()
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

      if (item) {
        filters.item = new RegExp(item, 'i');
      }

      if (tipoPagamento) {
        filters.tipoPagamento = new RegExp(tipoPagamento, 'i');
      }

      let despesaExtraFilter = await DespesaExtra.paginate(filters, {
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

      despesaExtra = despesaExtraFilter.docs;
    } else if (nomeLinha) {
      despesaExtra = await DespesaExtra.find({
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
    } else if (item) {
      despesaExtra = await DespesaExtra.find({
        item: new RegExp(item, 'i'),
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
      despesaExtra = await DespesaExtra.find({
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
    //   despesaExtra = despesaExtra.filter(
    //     (aliment) =>
    //       moment(aliment.createdAt).month() ===
    //         moment(Date.now()).month() &&
    //       moment(aliment.createdAt).year() ===
    //         moment(Date.now()).year()
    //   );
    // }

    if (userLogged.role !== 'ROLE_ADMIN') {
      despesaExtra = despesaExtra.filter((item) => {
        if (item.userCreate) {
          return (
            String(item.userCreate._id) === String(userLogged._id)
          );
        }
      });
    }

    return res.json(despesaExtra);
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
      item,
      descricao,
      total,
      quantidade,
      valorUnitario,
      dataNota,
      tipoPagamento,
    } = req.body;

    const data = !dataNota
      ? new Date()
      : moment(dataNota).format('YYYY-MM-DDT00:1m:ss.SSSZ');

    const despesaExtra = await DespesaExtra.create({
      nomeLinha,
      item,
      descricao,
      imagem: image._id,
      total,
      quantidade,
      valorUnitario,
      tipoPagamento,
      userCreate: userLogged._id,
      createdAt: data,
    });

    return res.json(despesaExtra);
  }

  async show(req, res) {
    const {id} = req.params;

    const alimentacoes = await DespesaExtra.findById(id).populate({
      path: 'imagem',
      select: ['_id', 'url'],
    });

    return res.json(alimentacoes);
  }

  async update(req, res) {
    const {id} = req.params;

    if (req.file) {
      const despesaExtra = await DespesaExtra.findById(id);

      const {imagem: imageId} = despesaExtra;

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
        item,
        descricao,
        total,
        quantidade,
        valorUnitario,
        dataNota,
        tipoPagamento,
      } = req.body;

      const data = !dataNota
        ? new Date()
        : moment(dataNota).format('YYYY-MM-DDT00:1m:ss.SSSZ');

      const despesaExtraUpdate = await DespesaExtra.findByIdAndUpdate(
        id,
        {
          nomeLinha,
          item,
          descricao,
          total,
          quantidade,
          valorUnitario,
          tipoPagamento,
          imagem: imageCreate._id,
          createdAt: data,
        },
        {
          new: true,
        }
      );

      return res.json(despesaExtraUpdate);
    } else {
      const {
        nomeLinha,
        item,
        descricao,
        total,
        quantidade,
        valorUnitario,
        tipoPagamento,
        dataNota,
      } = req.body;

      const data = !dataNota
        ? new Date()
        : moment(dataNota).format('YYYY-MM-DDT00:1m:ss.SSSZ');

      const despesaExtra = await DespesaExtra.findByIdAndUpdate(
        id,
        {
          nomeLinha,
          item,
          descricao,
          total,
          quantidade,
          valorUnitario,
          tipoPagamento,
          createdAt: data,
        },
        {
          new: true,
        }
      );

      return res.json(despesaExtra);
    }
  }

  async delete(req, res) {
    const despesaExtra = await DespesaExtra.findById(req.params.id);

    const {imagem: imageId} = despesaExtra;

    const image = await Image.findById(imageId);

    if (image) {
      await image.remove();
    }

    await despesaExtra.remove();

    return res.send();
  }
}

module.exports = new DespesaExtraController();
