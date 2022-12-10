const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const PecaSchema = new mongoose.Schema({
  userCreate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    default: 'Peças',
  },
  nomeLinha: {
    type: String,
  },
  veiculo: {
    type: String,
  },
  nomePeca: {
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
  valorUnitario: {
    type: Number,
  },
  desconto: {
    type: Number,
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

PecaSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Peca', PecaSchema);
