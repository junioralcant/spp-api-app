const express = require('express');
const multer = require('multer');
const HospedagemController = require('../app/controller/HospedagemController');
const multerConfig = require('../config/multer');

const hospedagem = express.Router();

hospedagem.get('/hospedagem', HospedagemController.index);
hospedagem.get('/hospedagem/:id', HospedagemController.show);

hospedagem.post(
  '/hospedagem',
  multer(multerConfig).single('file'),
  HospedagemController.store
);
hospedagem.put(
  '/hospedagem/:id',
  multer(multerConfig).single('file'),
  HospedagemController.update
);
hospedagem.delete('/hospedagem/:id', HospedagemController.delete);

module.exports = hospedagem;
