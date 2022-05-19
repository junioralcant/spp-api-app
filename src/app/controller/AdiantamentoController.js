const moment = require('moment');
const Adiantamento = require('../models/Adiantamento');
const Image = require('../models/Image');

class AdiantamentoController {
  async index(req, res) {
    const { nomeLinha, dataIncio, dataFim, colaborador } = req.query;

    console.log(dataFim, dataIncio);

    const filters = {};

    let adiantamento = await Adiantamento.find().populate({
      path: 'imagem',
      select: ['_id', 'url'],
    });

    //Filtro de data e nome linha
    if (dataIncio && dataFim) {
      filters.createdAt = {};

      const inicio = moment(dataIncio).format(
        'YYYY-MM-DDT00:mm:ss.SSSZ'
      );

      const fim = moment(dataFim).format('YYYY-MM-DDT23:59:ss.SSSZ');

      console.log(inicio, fim);

      filters.createdAt.$gte = inicio;
      filters.createdAt.$lte = fim;

      if (nomeLinha) {
        filters.nomeLinha = new RegExp(nomeLinha, 'i');
      }

      if (colaborador) {
        filters.nomeColaborador = new RegExp(colaborador, 'i');
      }

      let adiantamentoFilter = await Adiantamento.paginate(filters, {
        page: req.query.page || 1,
        limit: parseInt(req.query.limit_page) || 1000000,
        populate: [
          {
            path: 'imagem',
            select: ['_id', 'url'],
          },
        ],
        sort: '-createdAt',
      });

      adiantamento = adiantamentoFilter.docs;
    } else if (nomeLinha) {
      adiantamento = await Adiantamento.find({
        nomeLinha: new RegExp(nomeLinha, 'i'),
      }).populate({
        path: 'imagem',
        select: ['_id', 'url'],
      });
    } else if (colaborador) {
      adiantamento = await Adiantamento.find({
        nomeColaborador: new RegExp(colaborador, 'i'),
      }).populate({
        path: 'imagem',
        select: ['_id', 'url'],
      });
    }

    // Filtra por dados do mes e ano atual
    if (!dataIncio || !dataFim) {
      adiantamento = adiantamento.filter(
        (aliment) =>
          moment(aliment.createdAt).month() ===
            moment(Date.now()).month() &&
          moment(aliment.createdAt).year() ===
            moment(Date.now()).year()
      );
    }

    return res.json(adiantamento);
  }

  async store(req, res) {
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

    const { nomeLinha, nomeColaborador, descricao, total } = req.body;

    const adiantamento = await Adiantamento.create({
      nomeLinha,
      nomeColaborador,
      descricao,
      imagem: image._id,
      total,
    });

    return res.json(adiantamento);
  }

  async show(req, res) {
    const { id } = req.params;

    const alimentacoes = await Adiantamento.findById(id).populate({
      path: 'imagem',
      select: ['_id', 'url'],
    });

    return res.json(alimentacoes);
  }

  async update(req, res) {
    const { id } = req.params;

    if (req.file) {
      const adiantamento = await Adiantamento.findById(id);

      const { imagem: imageId } = adiantamento;

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

      const adiantamentoUpdate = await Adiantamento.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
        }
      );

      adiantamentoUpdate.imagem = imageCreate._id;

      adiantamentoUpdate.save();

      return res.json(adiantamentoUpdate);
    } else {
      const adiantamento = await Adiantamento.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
        }
      );

      res.json(adiantamento);
    }
  }

  async delete(req, res) {
    const adiantamento = await Adiantamento.findById(req.params.id);

    const { imagem: imageId } = adiantamento;

    const image = await Image.findById(imageId);

    if (image._id) {
      await image.remove();
    }

    await adiantamento.remove();

    return res.send();
  }
}

module.exports = new AdiantamentoController();
