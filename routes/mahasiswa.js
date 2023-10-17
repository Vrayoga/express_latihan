const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, File, cb) => {
    cb(null, "public/image");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("jenis file tidak diizinkan"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.get("/", function (req, res) {
  connection.query(
    "SELECT a.nama, b.nama_jurusan AS jurusan FROM mahasiswa a JOIN jurusan b ON b.id_j = a.id_jurusan ORDER BY a.id_m DESC",
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Failed",
          error: err,
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data Mahasiswa",
          data: rows,
        });
      }
    }
  );
});

router.post(
  "/store",
  upload.fields([
    { name: "gambar", maxCount: 1 },
    { name: "swa_foto", maxCount: 1 },
  ]),
  [
    //validation
    body("nama").notEmpty(),
    body("nrp").notEmpty(),
    body("id_jurusan").notEmpty(),
  ],
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        error: error.array(),
      });
    }
    let Data = {
      nama: req.body.nama,
      nrp: req.body.nrp,
      id_jurusan: req.body.id_jurusan,
      gambar: req.files.gambar[0].filename,
      swa_foto: req.files.swa_foto[0].filename,
    };
    connection.query("insert into mahasiswa set ?", Data, function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
          error: err,
        });
      } else {
        return res.status(201).json({
          status: true,
          message: "Success..!",
          data: rows[0],
        });
      }
    });
  }
);

router.get("/(:id)", function (req, res) {
  let id = req.params.id;
  connection.query(
    `select * from mahasiswa where id_m = ${id}`,
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "server error",
        });
      }
      if (rows.length <= 0) {
        return res.status(400).json({
          status: false,
          message: "not found",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "data mahasiswa",
          data: rows[0],
        });
      }
    }
  );
});

router.patch(
  "/update/:id",
  upload.single("gambar"),
  [
    body("nama").notEmpty(),
    body("nrp").notEmpty(),
    body("id_jurusan").notEmpty(),
  ],
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        error: error.array(),
      });
    }
    let id = req.params.id;
    let gambar = req.file ? req.file.filename : null;

    connection.query(
      `select * from mahasiswa where id_m = ${id}`,
      function (err, rows) {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "server error",
          });
        }
        if (rows.length === 0) {
          return res.status(404).json({
            status: false,
            message: "not found",
          });
        }
        const namaFileLama = rows[0].gambar;
        if (namaFileLama && gambar) {
          const patchFileLama = path.join(
            __dirname,
            "../public/image",
            namaFileLama
          );
          fs.unlinkSync(patchFileLama);
        }
        let data = {
          nama: req.body.nama,
          nrp: req.body.nrp,
          id_jurusan: req.body.id_jurusan,
          gambar: gambar,
        };
        connection.query(
          `update mahasiswa set ? where id_m =${id}`,
          data,
          function (err, rows) {
            if (err) {
              return res.status(500).json({
                status: false,
                message: "server error",
              });
            } else {
              return res.status(200).json({
                status: true,
                message: "update mahasiswa berhasil",
              });
            }
          }
        );
      }
    );
  }
);
router.delete("/delete/(:id)", function (req, res) {
  let id = req.params.id;

  connection.query(
    `select * from mahasiswa where id_m = ${id}`,
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "server error",
        });
      }
      if (rows.length === 0) {
        return res.status(404).json({
          status: false,
          message: "not found",
        });
      }
      const namaFileLama = rows[0].gambar;
      if (namaFileLama) {
        const patchFileLama = path.join(
          __dirname,
          "../public/image",
          namaFileLama
        );
        fs.unlinkSync(patchFileLama);
      }
      connection.query(
        `delete from mahasiswa where id_m = ${id}`,
        function (err, rows) {
          if (err) {
            return res.status(500).json({
              status: false,
              message: "server error",
            });
          } else {
            return res.status(200).json({
              status: true,
              message: "data berhasil dihapus",
            });
          }
        }
      );
    }
  );
});

module.exports = router;
