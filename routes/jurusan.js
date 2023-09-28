const express = require('express');
const router = express.Router();
const {body, validationResult} = require ('express-validator');
const connection = require('../config/db');

router.get('/', function (req, res) {
  connection.query(
    'SELECT * from jurusan',
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: 'Server Failed',
          error: err,
        });
      } else {
        return res.status(200).json({
          status: true,
          message: 'Data jurusan ada',
          data: rows,
        });
      }
    }
  );
});


router.post('/store',[
    body('nama_jurusan').notEmpty()

  ],(req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        error: error.array()
      });   
    }
let data = {
  nama_jurusan : req.body.nama_jurusan
}

    connection.query('INSERT INTO jurusan SET ?', data, function (err, rows) {
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
    connection.query(`select * from jurusan where id_j = ${id}`, function (err,rows){
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
          message: 'data jurusan ada',
          data : rows[0]
        })
      }
    })
  })

  router.patch('/update/:id',[
    body('nama_jurusan').notEmpty()
  ], (req,res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
      return res.status(422).json({
        error: error.array()
      });
    }
    let id = req.params.id;
    let data = {
      nama_jurusan : req.body.nama_jurusan
    }
    connection.query(`update jurusan set ? where id_j = ${id}`,data,function(err,rows){
      if(err){
        return res.status(500).json({
          status : false,
          message : 'server error',
        })
      }else {
        return res.status(200).json({
          status : true,
          message : 'update berhasil......'
        })
      }
    })
  })

  router.delete('/delete/(:id)', function (req, res){
    let id = req.params.id;
    connection.query(`delete from jurusan where id_j = ${id}`,function (err,rows){
    if(err){
      return req.status(500).json({
        status : false,
        message : 'server error',
      })
    }else{
      return res.status(200).json({
        status : true,
        message : 'data berhasil dihapus',
      })
    }
    })
  })
  


module.exports = router;
