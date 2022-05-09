const moment = require('moment');
const Hospedagem = require('../models/Hospedagem');
const Image = require('../models/Image');

class HospedagemController {
  async index(req, res) {
    const { nomeLinha, dataIncio, dataFim, nomeHotel } = req.query;

    const filters = {};

    let hospedagem = await Hospedagem.find().populate({
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
      filters.nomeLinha = new RegExp(nomeLinha, 'i');
      filters.nomeHotel = new RegExp(nomeHotel, 'i');

      let hospedagemFilter = await Hospedagem.paginate(filters, {
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

      hospedagem = hospedagemFilter.docs;
    } else if (nomeLinha) {
      hospedagem = await Hospedagem.find({
        nomeLinha: new RegExp(nomeLinha, 'i'),
      }).populate({
        path: 'imagem',
        select: ['_id', 'url'],
      });
    } else if (nomeHotel) {
      hospedagem = await Hospedagem.find({
        nomeHotel: new RegExp(nomeHotel, 'i'),
      }).populate({
        path: 'imagem',
        select: ['_id', 'url'],
      });
    }

    // Filtra por dados do mes e ano atual
    if (!dataIncio || !dataFim) {
      hospedagem = hospedagem.filter(
        (aliment) =>
          moment(aliment.createdAt).month() ===
            moment(Date.now()).month() &&
          moment(aliment.createdAt).year() ===
            moment(Date.now()).year()
      );
    }

    return res.json(hospedagem);
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
      nomeHotel,
      descricao,
      total,
      diarias,
      valorUnitario,
    } = req.body;

    const hospedagem = await Hospedagem.create({
      nomeLinha,
      nomeHotel,
      descricao,
      imagem: image._id,
      total,
      diarias,
      valorUnitario,
    });

    return res.json(hospedagem);
  }

  async show(req, res) {
    const { id } = req.params;

    const alimentacoes = await Hospedagem.findById(id).populate({
      path: 'imagem',
      select: ['_id', 'url'],
    });

    return res.json(alimentacoes);
  }

  async update(req, res) {
    const { id } = req.params;

    if (req.file) {
      const hospedagem = await Hospedagem.findById(id);

      const { imagem: imageId } = hospedagem;

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

      const hospedagemUpdate = await Hospedagem.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
        }
      );

      hospedagemUpdate.imagem = imageCreate._id;

      hospedagemUpdate.save();

      return res.json(hospedagemUpdate);
    } else {
      const hospedagem = await Hospedagem.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
        }
      );

      res.json(hospedagem);
    }
  }

  async delete(req, res) {
    const hospedagem = await Hospedagem.findById(req.params.id);

    const { imagem: imageId } = hospedagem;

    const image = await Image.findById(imageId);

    if (image) {
      await image.remove();
    }

    await hospedagem.remove();

    return res.send();
  }
}

module.exports = new HospedagemController();
