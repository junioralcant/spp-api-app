const express = require('express');
const multer = require('multer');
const DespesaExtraController = require('../app/controller/DespesaExtraController');
const multerConfig = require('../config/multer');

const despesaExtra = express.Router();

despesaExtra.get('/despesa-extra', DespesaExtraController.index);
despesaExtra.get('/despesa-extra/:id', DespesaExtraController.show);

despesaExtra.post(
  '/despesa-extra',
  multer(multerConfig).single('file'),
  DespesaExtraController.store
);
despesaExtra.put(
  '/despesa-extra/:id',
  multer(multerConfig).single('file'),
  DespesaExtraController.update
);
despesaExtra.delete(
  '/despesa-extra/:id',
  DespesaExtraController.delete
);

module.exports = despesaExtra;
