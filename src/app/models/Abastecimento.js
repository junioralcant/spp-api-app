const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const AbastecimetoSchema = new mongoose.Schema({
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
