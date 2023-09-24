const express = require('express');
const router = express.Router();
const {body, validationResult } = require ('express-validator');
const connection = require('../config/db');

router.get('/', function (req, res) {
  connection.query(
    "select * from mahasiswa order by id_m desc",
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: 'Server Failed',
        });
      } else {
        return res.status(200).json({
          status: true,
          message: 'Data Mahasiswa',
          data: rows,
        });
      }
    }
  );
});

router.post('/store',[
    body('nama').notEmpty(),
    body('nrp').notEmpty()
  ],(req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        error: error.array()
      });
    }
let data = {
  nama : req.body.nama,
  nrp : req.body.nrp
}

    connection.query('INSERT INTO mahasiswa SET ?', data, function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: 'Server error',
        })
      } else {
        return res.status(201).json({
          status: true,
          message: 'Success',
          data: rows[0]
        })
      }
    })
  })


  router.get ('/(:id)', function (req, res){
    let id = req.params.id;
    connection.query(`select * from mahasiswa where id_m = ${id}`, function (err,rows){
      if (err){
        return res.status(500).json({
          status: false,
          message: 'server error',
        })
      }
      if (rows.length <=0 ){
        return res.status(400).json({
          status: false,
          message: 'not found',
        })
      }
      else{
        return res.status(200).json({
          status: true,
          message: 'data mahasiswa',
          data : rows[0]
        })
      }
    })
  })


module.exports = router;
