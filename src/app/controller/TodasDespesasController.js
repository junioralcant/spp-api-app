const moment = require('moment');

const Abastecimento = require('../models/Abastecimento');
const Adiantamento = require('../models/Adiantamento');
const Alimentacao = require('../models/Alimentacao');
const DespesaExtra = require('../models/DespesaExtra');
const Hospedagem = require('../models/Hospedagem');
const Peca = require('../models/Peca');
const Roco = require('../models/Roco');

class TodasDespesasController {
  async index(req, res) {
    const { nomeLinha, dataIncio, dataFim } = req.query;

    let despesas = [];

    let abastecimento = await Abastecimento.find().populate({
      path: 'imagem',
      select: ['_id', 'url'],
    });

    let adiantamento = await Adiantamento.find().populate({
      path: 'imagem',
      select: ['_id', 'url'],
    });

    let alimentacao = await Alimentacao.find().populate({
      path: 'imagem',
      select: ['_id', 'url'],
    });

    let despesaExtra = await DespesaExtra.find().populate({
      path: 'imagem',
      select: ['_id', 'url'],
    });

    let hospedagem = await Hospedagem.find().populate({
      path: 'imagem',
      select: ['_id', 'url'],
    });

    let peca = await Peca.find().populate({
      path: 'imagem',
      select: ['_id', 'url'],
    });

    let roco = await Roco.find()
      .populate({
        path: 'fotoAntes',
        select: ['_id', 'url'],
      })
      .populate({
        path: 'fotoDepois',
        select: ['_id', 'url'],
      });

    despesas = despesas.concat(
      abastecimento,
      adiantamento,
      alimentacao,
      despesaExtra,
      hospedagem,
      peca,
      roco
    );

    console.log(despesas.length);

    // Filtra por dados do mes e ano atual
    if (!dataIncio || !dataFim) {
      despesas = despesas.filter(
        (despesa) =>
          moment(despesa.createdAt).month() ===
            moment(Date.now()).month() &&
          moment(despesa.createdAt).year() ===
            moment(Date.now()).year()
      );

      if (nomeLinha) {
        despesas = despesas.filter((despesa) => {
          if (despesa.nomeLinha) {
            return despesa.nomeLinha.match(
              new RegExp(nomeLinha, 'i')
            );
          }
        });
      }
    } else {
      const inicio = moment(dataIncio).format(
        'YYYY-MM-DDT00:mm:ss.SSSZ'
      );

      const fim = moment(dataFim).format('YYYY-MM-DDT23:59:ss.SSSZ');

      despesas = despesas.filter(
        (despesa) =>
          moment(despesa.createdAt).format(
            'YYYY-MM-DDT00:mm:ss.SSSZ'
          ) > inicio &&
          moment(despesa.createdAt).format(
            'YYYY-MM-DDT00:mm:ss.SSSZ'
          ) <= fim
      );

      if (nomeLinha) {
        despesas = despesas.filter((despesa) => {
          if (despesa.nomeLinha) {
            return despesa.nomeLinha.match(
              new RegExp(nomeLinha, 'i')
            );
          }
        });
      }
    }

    console.log('Despesa', despesas.length);

    console.log(despesas.length);

    return res.json(despesas);
  }
}
module.exports = new TodasDespesasController();
