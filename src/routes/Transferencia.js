const express = require('express');
const TransferenciaController = require('../app/controller/TransferenciaController');

const transferencia = express.Router();

transferencia.post('/transferencia', TransferenciaController.store);
transferencia.get('/transferencia', TransferenciaController.index);

module.exports = transferencia;
