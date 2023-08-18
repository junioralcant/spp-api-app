const express = require('express');
const ServicoController = require('../app/controller/ServicoController');
const multer = require('multer');
const multerConfig = require('../config/multer');

const servico = express.Router();

servico.get('/servicos', ServicoController.index);
servico.get('/servico/:id', ServicoController.show);

servico.post(
  '/servico',
  multer(multerConfig).single('file'),
  ServicoController.store
);

servico.put(
  '/servico/:id',
  multer(multerConfig).single('file'),
  ServicoController.update
);
servico.delete('/servico/:id', ServicoController.delete);

module.exports = servico;
