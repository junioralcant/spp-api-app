const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const DespesaExtraSchema = new mongoose.Schema({
  userCreate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    default: 'Despesa Extra',
  },
  nomeLinha: {
    type: String,
  },
  item: {
    type: String,
  },
  descricao: {
    type: String,
  },
  imagem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
  },
  quantidade: {
    type: String,
  },
  tipoPagamento: {
    type: String,
    default: '',
  },
  total: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

DespesaExtraSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('DespesaExtra', DespesaExtraSchema);
