const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const AlimentacaoSchema = new mongoose.Schema({
  nomeLinha: {
    type: String,
  },
  quantidade: {
    type: String,
  },
  descricao: {
    type: String,
  },
  imagem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
  },
  total: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

AlimentacaoSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Alimentacao', AlimentacaoSchema);
