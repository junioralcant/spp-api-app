const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const HospedagemSchema = new mongoose.Schema({
  nomeLinha: {
    type: String,
  },
  nomeHotel: {
    type: String,
  },
  diarias: {
    type: Number,
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

HospedagemSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Hospedagem', HospedagemSchema);
