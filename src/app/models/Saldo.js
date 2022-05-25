const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const SaldoSchema = new mongoose.Schema({
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
