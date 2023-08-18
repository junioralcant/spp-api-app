const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const ServicoSchema = new mongoose.Schema({
  userCreate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  imagem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
  },
  nomeLinha: {
    type: String,
  },
  cidade: {
    type: String,
  },
  loja: {
    type: String,
  },
  descricao: {
    type: String,
  },
  tipoPagamento: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'Serviço',
  },
  total: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ServicoSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Servico', ServicoSchema);
