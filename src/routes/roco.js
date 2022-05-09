const express = require('express');
const multer = require('multer');
const RocoController = require('../app/controller/RocoController');
const multerConfig = require('../config/multer');

const roco = express.Router();

roco.get('/roco', RocoController.index);
roco.get('/roco/:id', RocoController.show);

roco.post(
  '/roco',
  multer(multerConfig).fields([
    { name: 'fotoAntes' },
    { name: 'fotoDepois' },
  ]),
  RocoController.store
);
roco.put(
  '/roco/:id',
  multer(multerConfig).fields([
    { name: 'fotoAntes' },
    { name: 'fotoDepois' },
  ]),
  RocoController.update
);
roco.delete('/roco/:id', RocoController.delete);

module.exports = roco;
