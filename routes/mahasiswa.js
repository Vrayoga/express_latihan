const express = require('express');
const router = express.Router();
const {body, validationResult} = require ('express-validator');
const connection = require('../config/db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
destination: (req,File,cb) =>{
  cb(null,'public/image')
},
filename: (req, file, cb) =>{
  console.log(file)
  cb(null, Date.now() + path.extname(file.originalname))
}
})
const upload = multer({storage:storage})

router.get('/', function (req, res) {
  connection.query(
    'SELECT a.nama, b.nama_jurusan AS jurusan FROM mahasiswa a JOIN jurusan b ON b.id_j = a.id_jurusan ORDER BY a.id_m DESC',
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
          message: 'Data Mahasiswa',
          data: rows,
        });
      }
    }
  );
});


router.post('/store',upload.single("gambar"), [
    body('nama').notEmpty(),
    body('nrp').notEmpty(),
    body('id_jurusan').notEmpty()
  ],(req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        error: error.array()
      });   
    }
let data = {
  nama : req.body.nama,
  nrp : req.body.nrp,
  id_jurusan :req.body.id_jurusan,
  gambar : req.file.filename
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

  router.patch('/update/:id',[
    body('nama').notEmpty(),
    body('nrp').notEmpty(),
    body('id_jurusan').notEmpty()
  ], (req,res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
      return res.status(422).json({
        error: error.array()
      });
    }
    let id = req.params.id;
    let data = {
      nama : req.body.nama,
      nrp : req.body.nrp,
      id_jurusan : req.body.id_jurusan
    }
    connection.query(`update mahasiswa set ? where id_m = ${id}`,data,function(err,rows){
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
    connection.query(`delete from mahasiswa where id_m = ${id}`,function (err,rows){
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
