const moment = require('moment');
const Image = require('../models/Image');
const Roco = require('../models/Roco');

class RocoController {
  async index(req, res) {
    const { nomeLinha, dataIncio, dataFim, nomeHotel } = req.query;

    const filters = {};

    let roco = await Roco.find()
      .sort('-createdAt')
      .populate({
        path: 'fotoAntes',
        select: ['_id', 'url'],
      })
      .populate({
        path: 'fotoDepois',
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

      let rocoFilter = await Roco.paginate(filters, {
        page: req.query.page || 1,
        limit: parseInt(req.query.limit_page) || 1000000,
        populate: [
          {
            path: 'fotoAntes',
            select: ['_id', 'url'],
          },
          {
            path: 'fotoDepois',
            select: ['_id', 'url'],
          },
        ],
        sort: '-createdAt',
      });

      roco = rocoFilter.docs;
    } else if (nomeLinha) {
      roco = await Roco.find({
        nomeLinha: new RegExp(nomeLinha, 'i'),
      })
        .populate({
          path: 'fotoAntes',
          select: ['_id', 'url'],
        })
        .populate({
          path: 'fotoDepois',
          select: ['_id', 'url'],
        });
    }

    // Filtra por dados do mes e ano atual
    if (!dataIncio || !dataFim) {
      roco = roco.filter(
        (aliment) =>
          moment(aliment.createdAt).month() ===
            moment(Date.now()).month() &&
          moment(aliment.createdAt).year() ===
            moment(Date.now()).year()
      );
    }

    return res.json(roco);
  }

  async store(req, res) {
    const { fotoAntes, fotoDepois } = req.files;
    let imgAntes = '';
    let imgDepois = '';

    if (fotoAntes) {
      const {
        originalname: name,
        size,
        key,
        location: url = '',
      } = fotoAntes[0];

      imgAntes = await Image.create({
        name,
        size,
        key,
        url,
      });
    }

    if (fotoDepois) {
      const {
        originalname: name,
        size,
        key,
        location: url = '',
      } = fotoDepois[0];

      imgDepois = await Image.create({
        name,
        size,
        key,
        url,
      });
    }

    const { nomeLinha } = req.body;

    const roco = await Roco.create({
      nomeLinha,
      fotoAntes: imgAntes._id,
      fotoDepois: imgDepois._id,
    });

    return res.json(roco);
  }

  async show(req, res) {
    const { id } = req.params;

    const roco = await Roco.findById(id)
      .populate({
        path: 'fotoAntes',
        select: ['_id', 'url'],
      })
      .populate({
        path: 'fotoDepois',
        select: ['_id', 'url'],
      });

    return res.json(roco);
  }

  async update(req, res) {
    const { id } = req.params;

    if (req.files) {
      const roco = await Roco.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      const { fotoAntes: fotoAntesId, fotoDepois: fotoDepoisId } =
        roco;

      const { fotoAntes, fotoDepois } = req.files;

      if (fotoAntes) {
        const {
          originalname: name,
          size,
          key,
          location: url = '',
        } = fotoAntes[0];

        const imageCreate = await Image.create({
          name,
          size,
          key,
          url,
        });

        roco.fotoAntes = imageCreate._id;

        const deleteImgAntes = await Image.findById(fotoAntesId);

        if (deleteImgAntes) {
          await deleteImgAntes.remove();
        }
      }

      if (fotoDepois) {
        const {
          originalname: name,
          size,
          key,
          location: url = '',
        } = fotoDepois[0];

        const imageCreate = await Image.create({
          name,
          size,
          key,
          url,
        });

        roco.fotoDepois = imageCreate._id;

        const deleteImgDepois = await Image.findById(fotoDepoisId);

        if (deleteImgDepois) {
          await deleteImgDepois.remove();
        }
      }

      roco.save();

      return res.json(roco);
    } else {
      const roco = await Roco.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      res.json(roco);
    }
  }

  async delete(req, res) {
    const roco = await Roco.findById(req.params.id);

    const { fotoAntes: fotoAntesId, fotoDepois: fotoDepoisId } = roco;

    const deleteImgAntes = await Image.findById(fotoAntesId);

    if (deleteImgAntes) {
      await deleteImgAntes.remove();
    }

    const deleteImgDepois = await Image.findById(fotoDepoisId);

    if (deleteImgDepois) {
      await deleteImgDepois.remove();
    }

    await roco.remove();

    return res.send();
  }
}

module.exports = new RocoController();
