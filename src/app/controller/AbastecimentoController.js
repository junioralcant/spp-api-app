const moment = require('moment');
const Abastecimento = require('../models/Abastecimento');
const Image = require('../models/Image');

class AbastecimentoController {
  async index(req, res) {
    const { nomeLinha, dataIncio, dataFim, veiculo } = req.query;

    const filters = {};

    let abastecimento = await Abastecimento.find()
      .sort('-createdAt')
      .populate({
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

      filters.createdAt.$gte = inicio;
      filters.createdAt.$lte = fim;

      if (nomeLinha) {
        filters.nomeLinha = new RegExp(nomeLinha, 'i');
      }

      if (veiculo) {
        filters.veiculo = new RegExp(veiculo, 'i');
      }

      let abastecimentoFilter = await Abastecimento.paginate(
        filters,
        {
          page: req.query.page || 1,
          limit: parseInt(req.query.limit_page) || 1000000,
          populate: [
            {
              path: 'imagem',
              select: ['_id', 'url'],
            },
          ],
          sort: '-createdAt',
        }
      );

      abastecimento = abastecimentoFilter.docs;
    } else if (nomeLinha) {
      abastecimento = await Abastecimento.find({
        nomeLinha: new RegExp(nomeLinha, 'i'),
      }).populate({
        path: 'imagem',
        select: ['_id', 'url'],
      });
    } else if (veiculo) {
      abastecimento = await Abastecimento.find({
        veiculo: new RegExp(veiculo, 'i'),
      }).populate({
        path: 'imagem',
        select: ['_id', 'url'],
      });
    }

    // Filtra por dados do mes e ano atual
    if (!dataIncio || !dataFim) {
      abastecimento = abastecimento.filter(
        (aliment) =>
          moment(aliment.createdAt).month() ===
            moment(Date.now()).month() &&
          moment(aliment.createdAt).year() ===
            moment(Date.now()).year()
      );
    }

    return res.json(abastecimento);
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

    const {
      nomeLinha,
      litros,
      descricao,
      total,
      veiculo,
      valorUnitario,
    } = req.body;

    const abastecimento = await Abastecimento.create({
      nomeLinha,
      litros,
      descricao,
      imagem: image._id,
      total,
      veiculo,
      valorUnitario,
    });

    return res.json(abastecimento);
  }

  async show(req, res) {
    const { id } = req.params;

    const alimentacoes = await Abastecimento.findById(id).populate({
      path: 'imagem',
      select: ['_id', 'url'],
    });

    return res.json(alimentacoes);
  }

  async update(req, res) {
    const { id } = req.params;

    if (req.file) {
      const abastecimento = await Abastecimento.findById(id);

      const { imagem: imageId } = abastecimento;

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

      const abastecimentoUpdate =
        await Abastecimento.findByIdAndUpdate(id, req.body, {
          new: true,
        });

      abastecimentoUpdate.imagem = imageCreate._id;

      abastecimentoUpdate.save();

      return res.json(abastecimentoUpdate);
    } else {
      const abastecimento = await Abastecimento.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
        }
      );

      res.json(abastecimento);
    }
  }

  async delete(req, res) {
    const abastecimento = await Abastecimento.findById(req.params.id);

    const { imagem: imageId } = abastecimento;

    const image = await Image.findById(imageId);

    if (image) {
      await image.remove();
    }

    await abastecimento.remove();

    return res.send();
  }
}

module.exports = new AbastecimentoController();
