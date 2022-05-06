const Image = require('../models/Image');

class ImageController {
  async index(req, res) {
    const image = await Image.find();

    return res.json(image);
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
    return res.json(image);
  }

  async destroy(req, res) {
    const image = await Image.findById(req.params.id);

    await image.remove();

    return res.send();
  }
}

module.exports = new ImageController();
