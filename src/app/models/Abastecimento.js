const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const AbastecimetoSchema = new mongoose.Schema({
  userCreate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    default: 'Abastecimento',
  },
  nomeLinha: {
    type: String,
  },
  veiculo: {
    type: String,
  },
  litros: {
    type: String,
  },
  descricao: {
    type: String,
  },
  imagem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
  },
  valorUnitario: {
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

AbastecimetoSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Abastecimeto', AbastecimetoSchema);
