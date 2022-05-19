const moment = require('moment');
const Image = require('../models/Image');
const Peca = require('../models/Peca');

class PecaController {
  async index(req, res) {
    const { nomeLinha, dataIncio, dataFim, veiculo } = req.query;

    const filters = {};

    let peca = await Peca.find().populate({
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

      let pecaFilter = await Peca.paginate(filters, {
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

      peca = pecaFilter.docs;
    } else if (nomeLinha) {
      peca = await Peca.find({
        nomeLinha: new RegExp(nomeLinha, 'i'),
      }).populate({
        path: 'imagem',
        select: ['_id', 'url'],
      });
    } else if (veiculo) {
      peca = await Peca.find({
        veiculo: new RegExp(veiculo, 'i'),
      }).populate({
        path: 'imagem',
        select: ['_id', 'url'],
      });
    }

    // Filtra por dados do mes e ano atual
    if (!dataIncio || !dataFim) {
      peca = peca.filter(
        (aliment) =>
          moment(aliment.createdAt).month() ===
            moment(Date.now()).month() &&
          moment(aliment.createdAt).year() ===
            moment(Date.now()).year()
      );
    }

    return res.json(peca);
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
      nomePeca,
      quantidade,
      desconto,
      descricao,
      total,
      veiculo,
      valorUnitario,
    } = req.body;

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
    });

    return res.json(peca);
  }

  async show(req, res) {
    const { id } = req.params;

    const alimentacoes = await Peca.findById(id).populate({
      path: 'imagem',
      select: ['_id', 'url'],
    });

    return res.json(alimentacoes);
  }

  async update(req, res) {
    const { id } = req.params;

    if (req.file) {
      const peca = await Peca.findById(id);

      const { imagem: imageId } = peca;

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

      const pecaUpdate = await Peca.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      pecaUpdate.imagem = imageCreate._id;

      pecaUpdate.save();

      return res.json(pecaUpdate);
    } else {
      const peca = await Peca.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      res.json(peca);
    }
  }

  async delete(req, res) {
    const peca = await Peca.findById(req.params.id);

    const { imagem: imageId } = peca;

    const image = await Image.findById(imageId);

    if (image) {
      await image.remove();
    }

    await peca.remove();

    return res.send();
  }
}

module.exports = new PecaController();
