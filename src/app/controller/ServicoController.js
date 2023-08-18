const moment = require('moment');
const Image = require('../models/Image');
const Servico = require('../models/Servico');
const User = require('../models/User');

class ServicoController {
  async index(req, res) {
    const userLogged = await User.findById(req.userId);

    const {nomeLinha, dataIncio, dataFim, tipoPagamento} = req.query;

    const filters = {};

    let servico = await Servico.find()
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

      let servicoFilter = await Servico.paginate(filters, {
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

      servico = servicoFilter.docs;
    } else if (nomeLinha) {
      servico = await Servico.find({
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
      servico = await Servico.find({
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
      servico = servico.filter(
        (aliment) =>
          moment(aliment.createdAt).year() ===
          moment(Date.now()).year()
      );
    }

    if (userLogged.role !== 'ROLE_ADMIN') {
      servico = servico.filter((item) => {
        if (item.userCreate) {
          return (
            String(item.userCreate._id) === String(userLogged._id)
          );
        }
      });
    }

    return res.json(servico);
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
      cidade,
      loja,
      descricao,
      total,
      dataNota,
      tipoPagamento,
    } = req.body;

    const data = !dataNota
      ? new Date()
      : moment(dataNota).format('YYYY-MM-DDT00:1m:ss.SSSZ');

    const servico = await Servico.create({
      nomeLinha,
      cidade,
      loja,
      descricao,
      imagem: image._id,
      total,
      tipoPagamento,
      userCreate: userLogged._id,
      createdAt: data,
    });

    return res.json(servico);
  }

  async show(req, res) {
    const {id} = req.params;

    const servico = await Servico.findById(id).populate({
      path: 'imagem',
      select: ['_id', 'url'],
    });

    return res.json(servico);
  }

  async update(req, res) {
    const {id} = req.params;

    if (req.file) {
      const servico = await Servico.findById(id);

      const {imagem: imageId} = servico;

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
        cidade,
        loja,
        descricao,
        total,
        dataNota,
        tipoPagamento,
      } = req.body;

      const data = !dataNota
        ? new Date()
        : moment(dataNota).format('YYYY-MM-DDT00:1m:ss.SSSZ');

      const servicoUpdate = await Servico.findByIdAndUpdate(
        id,
        {
          nomeLinha,
          cidade,
          loja,
          descricao,
          imagem: imageCreate._id,
          total,
          tipoPagamento,
          createdAt: data,
        },
        {
          new: true,
        }
      );

      return res.json(servicoUpdate);
    } else {
      const {
        nomeLinha,
        cidade,
        loja,
        descricao,
        total,
        dataNota,
        tipoPagamento,
      } = req.body;

      const data = !dataNota
        ? new Date()
        : moment(dataNota).format('YYYY-MM-DDT00:1m:ss.SSSZ');

      const servico = await Servico.findByIdAndUpdate(
        id,
        {
          nomeLinha,
          cidade,
          loja,
          descricao,
          total,
          tipoPagamento,
          createdAt: data,
        },
        {
          new: true,
        }
      );

      res.json(servico);
    }
  }

  async delete(req, res) {
    const servico = await Servico.findById(req.params.id);

    const {imagem: imageId} = servico;

    const image = await Image.findById(imageId);

    if (image) {
      await image.remove();
    }

    await servico.remove();

    return res.send();
  }
}

module.exports = new ServicoController();
