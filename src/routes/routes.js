const express = require('express');
const multer = require('multer');

const ImageController = require('../app/controller/ImageController');
const SessionContrller = require('../app/controller/SessionContrller');
const UserController = require('../app/controller/UserController');

const abastecimento = require('./Abastecimento');
const adiantamento = require('./Adiantamento');
const alimentacao = require('./Alimentacao');

const multerConfig = require('../config/multer');

const routes = express.Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionContrller.store);

routes.post(
  '/imagens',
  multer(multerConfig).single('file'),
  ImageController.store
);

routes.use(abastecimento, alimentacao, adiantamento);

routes.get('/', (req, res) => {
  return res.json({ message: 'ok' });
});

module.exports = routes;
