const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const RocoSchema = new mongoose.Schema({
  nomeLinha: {
    type: String,
  },
  fotoAntes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
  },
  fotoDepois: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
  },
  descricao: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

RocoSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Roco', RocoSchema);
