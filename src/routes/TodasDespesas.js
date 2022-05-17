const express = require('express');
const multer = require('multer');
const TodasDespesasController = require('../app/controller/TodasDespesasController');

const todasdespesas = express.Router();

todasdespesas.get('/todasdespesas', TodasDespesasController.index);

module.exports = todasdespesas;
