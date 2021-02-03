const { db } = require('../db');
const { uploader } = require('../favordb');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = '/imagedb';

router.get('/', (req, res) => {
  let sql = `SELECT * FROM imagedb`;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(data);
  });
});
router.get('/:id', (req, res) => {
  let sql = `SELECT * FROM imagedb WHERE id = ${req.params.id}`;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(data);
  });
});

router.post('/', (req, res) => {
  try {
    // const path = '/imagedb';
    // function upload file
    const upload = uploader(path, 'IMG').fields([{ name: 'image' }]);
    upload(req, res, (err) => {
      const { image } = req.files;
      const imagePath = image ? `${path}/${image[0].filename}` : null;
      const sql = `INSERT INTO imagedb (imagePath) VALUES ('${imagePath}')`;
      // save alamat file di dalma sql
      db.query(sql, (err, data) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send({ message: sql, status: 'SUCCESS', value: req.body, data });
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

router.delete('/:id', (req, res) => {
  // ambil alamat gambar
  let sql = `SELECT * FROM imagedb WHERE id = ${req.params.id}`;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).send(err);
    const imagePath = data[0].imagePath;
    console.log(data[0].imagePath);
    // delete row sql (database)
    let sql_2 = `DELETE FROM imagedb WHERE id = ${req.params.id}`;
    db.query(sql_2, (err, data) => {
      if (err) return res.status(500).send(err);
      // Delete file API
      fs.unlinkSync(`public${imagePath}`);
      return res.status(200).send({ message: sql_2, status: 'SUCCESS', value: req.body, data });
    });
  });
});

router.patch('/:id', (req, res) => {
  // const path = '/imagedb';
  let sql = `SELECT * FROM imagedb WHERE id = ${req.params.id}`;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).send(err);
    const oldImagePath = data[0].imagePath;
    console.log(data);
    const upload = uploader(path, 'IMG').fields([{ name: 'image' }]);
    upload(req, res, (err) => {
      const { image } = req.files;
      const imagePath = image ? `${path}/${image[0].filename}` : null;
      let sql_2 = `UPDATE imagedb SET imagePath = '${imagePath}' WHERE id = ${req.params.id}`;
      db.query(sql_2, (err, data) => {
        if (err) return res.status(500).send(err);
        fs.unlinkSync(`public${oldImagePath}`);
        return res.status(200).send({
          message: sql_2,
          status: 'success',
          value: req.body,
          data,
        });
      });
    });
  });
});
// router.patch('/:id', (req, res) => {
//   db.query(`SELECT * FROM images WHERE id = ${req.params.id}`, (err, data) => {
//     if (err) {
//       res.status(500).send(err);
//     }
//     const oldImagePath = data[0].imagepath;
//     const upload = uploader(path, 'IMG').fields([{ name: 'image' }]);
//     upload(req, res, (err) => {
//       const { image } = req.files;
//       const imagePath = image ? `${path}/${image[0].filename}` : null;

//       db.query(
//         `UPDATE images set imagepath = '${imagePath}' WHERE id = ${req.params.id}`,
//         (err) => {
//           if (err) {
//             res.status(500).send(err);
//           }
//           fs.unlinkSync(`public${oldImagePath}`);
//           return res.status(200).send({
//             message: 'Image Edited',
//             status: 'Edited',
//           });
//         }
//       );
//     });
//   });
// });

module.exports = router;
