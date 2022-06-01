const express = require('express');
const SaldoController = require('../app/controller/SaldoController');

const saldo = express.Router();

saldo.get('/saldo', SaldoController.index);
saldo.post('/saldo', SaldoController.store);
saldo.put('/saldo/:id', SaldoController.update);
saldo.delete('/saldo/:id', SaldoController.delete);

module.exports = saldo;
