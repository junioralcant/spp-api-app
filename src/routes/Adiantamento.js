const express = require('express');
const multer = require('multer');
const AdiantamentoController = require('../app/controller/AdiantamentoController');
const multerConfig = require('../config/multer');

const adiantamento = express.Router();

adiantamento.get('/adiantamento', AdiantamentoController.index);
adiantamento.get('/adiantamento/:id', AdiantamentoController.show);

adiantamento.post(
  '/adiantamento',
  multer(multerConfig).single('file'),
  AdiantamentoController.store
);
adiantamento.put(
  '/adiantamento/:id',
  multer(multerConfig).single('file'),
  AdiantamentoController.update
);
adiantamento.delete(
  '/adiantamento/:id',
  AdiantamentoController.delete
);

module.exports = adiantamento;
