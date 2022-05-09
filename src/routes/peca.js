const express = require('express');
const multer = require('multer');
const PecaController = require('../app/controller/PecaController');
const multerConfig = require('../config/multer');

const peca = express.Router();

peca.get('/peca', PecaController.index);
peca.get('/peca/:id', PecaController.show);

peca.post(
  '/peca',
  multer(multerConfig).single('file'),
  PecaController.store
);
peca.put(
  '/peca/:id',
  multer(multerConfig).single('file'),
  PecaController.update
);
peca.delete('/peca/:id', PecaController.delete);

module.exports = peca;
