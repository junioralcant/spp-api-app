const express = require('express');
const multer = require('multer');
const AlimentacaoController = require('../app/controller/AlimentacaoController');
const multerConfig = require('../config/multer');

const alimentacao = express.Router();

alimentacao.get('/alimentacoes', AlimentacaoController.index);
alimentacao.get('/alimentacao/:id', AlimentacaoController.show);
alimentacao.post(
  '/alimentacao',
  multer(multerConfig).single('file'),
  AlimentacaoController.store
);
alimentacao.put(
  '/alimentacao/:id',
  multer(multerConfig).single('file'),
  AlimentacaoController.update
);
alimentacao.delete('/alimentacao/:id', AlimentacaoController.delete);

module.exports = alimentacao;
