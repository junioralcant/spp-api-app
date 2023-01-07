const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const TransferenciaSchema = new mongoose.Schema({
  userCreate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  nomeLinha: {
    type: String,
  },
  title: {
    type: String,
    default: 'Transferência',
  },
  total: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

TransferenciaSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Transferencia', TransferenciaSchema);
