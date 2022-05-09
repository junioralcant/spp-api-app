const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const PecaSchema = new mongoose.Schema({
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
    type: Number,
  },
  valorUnitario: {
    type: Number,
  },
  desconto: {
    type: Number,
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
