const express = require('express');
const multer = require('multer');
const TransferenciaController = require('../app/controller/TransferenciaController');
const multerConfig = require('../config/multer');

const transferencia = express.Router();

transferencia.post('/transferencia', TransferenciaController.store);

module.exports = transferencia;
