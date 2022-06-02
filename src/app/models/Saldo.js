const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const SaldoSchema = new mongoose.Schema({
  userCreate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  total: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

SaldoSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Saldo', SaldoSchema);
