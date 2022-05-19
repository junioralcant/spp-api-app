const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const AdiantamentoSchema = new mongoose.Schema({
  nomeLinha: {
    type: String,
  },
  nomeColaborador: {
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

AdiantamentoSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Adiantamento', AdiantamentoSchema);
