const express = require('express');
const multer = require('multer');
const AbastecimentoController = require('../app/controller/AbastecimentoController');
const multerConfig = require('../config/multer');

const abastecimento = express.Router();

abastecimento.get('/abastecimento', AbastecimentoController.index);
abastecimento.get('/abastecimento/:id', AbastecimentoController.show);

abastecimento.post(
  '/abastecimento',
  multer(multerConfig).single('file'),
  AbastecimentoController.store
);
abastecimento.put(
  '/abastecimento/:id',
  multer(multerConfig).single('file'),
  AbastecimentoController.update
);
abastecimento.delete(
  '/abastecimento/:id',
  AbastecimentoController.delete
);

module.exports = abastecimento;
