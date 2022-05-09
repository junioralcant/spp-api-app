const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const DespesaExtraSchema = new mongoose.Schema({
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

DespesaExtraSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('DespesaExtra', DespesaExtraSchema);
