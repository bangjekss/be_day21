// const { response } = require('express');
const express = require('express');
const router = express.Router();
const { db, query } = require('../db');
const _ = require('lodash');
const { uploader } = require('../favordb');
const fs = require('fs');

router.get('/', (req, res) => {
  // let sql = `SELECT * FROM productdb WHERE isAvailable = 1 `; // jangan lupa tambahin spasi
  // if (req.query.hargaMin) {
  //   sql += `AND harga >= ${parseInt(req.query.hargaMin)}`;
  //   console.log(req.query);
  // } else if (req.query.hargaMax) {
  //   sql += `AND harga <= ${parseInt(req.query.hargaMax)}`;
  // } else if (req.query.hargaMin && req.query.hargaMax) {
  //   sql += `AND harga >= ${parseInt(req.query.hargaMin)} AND harga <= ${parseInt(
  //     req.query.hargaMax
  //   )}`;
  // }
  let sql = `SELECT * FROM productdb`;
  if (!_.isEmpty(req.query)) sql += ` WHERE`;
  if (req.query.isAvailable)
    sql += ` isAvailable = 1 ${Object.keys(req.query).length > 1 ? 'AND' : ''}`;
  if (req.query.hargaMin)
    sql += ` harga > ${req.query.hargaMin} ${Object.keys(req.query).length > 1 ? 'AND' : ''}`;
  if (req.query.hargaMax) sql += ` harga < ${req.query.hargaMax}`;

  db.query(sql, (err, data) => {
    if (err) return res.status(500).send(err.message);
    console.log(req.query);
    return res.status(200).send(data);
  });
});

// Get by id
// router.get('/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   let sql = `SELECT * FROM productdb WHERE id = ${id} AND isAvailable = 1 `;
//   db.query(sql, (err, data) => {
//     if (err) return res.status(500).send(err.message);
//     if (data.length === 0) return res.status(404).send('data not found');
//     return res.status(200).send(data[0]);
//   });
// });

// Promise get by id
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const getProduct = await query(`SELECT * FROM productdb WHERE id = ${id}`);
    console.log(getProduct);
    return res.status(200).send(getProduct);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

router.post('/', (req, res) => {
  // cara 1
  // const { nama, harga, caption, stock } = req.body;
  // let sql = `INSERT INTO productdb (nama, harga, caption, stock) VALUES ('${nama}', ${harga}, '${caption}', ${stock})`
  // db.query(sql, (err, data) => {
  //   if (err) return res.status(500).send(err.message);
  //   return res.status(201).send({ message: sql, status: 'success' });
  // });

  // cara 2 // untuk postman
  // let sql = `INSERT INTO productdb set ?`;
  // // parameter req.body digunakan jika menggunakan insert into (tableName) set ?
  // db.query(sql, req.body, (err, data) => {
  //   if (err) return res.status(500).send(err.message);
  //   return res.status(201).send({ message: sql, status: 'success', value: req.body, data });
  // });

  const path = '/productdb';
  const upload = uploader(path, 'PRD').fields([{ name: 'image' }]);
  upload(req, res, (err) => {
    const { image } = req.files;
    const { nama, harga, caption, stock } = JSON.parse(req.body.data);
    const imagePath = image ? `${path}/${image[0].filename}` : null;
    let sql = `INSERT INTO productdb (nama, harga, stock, caption, isAvailable, imagePath) VALUES ('${nama}', ${harga}, ${stock}, '${caption}', 1, '${imagePath}')`;
    console.log(req.body);
    console.log(nama, harga, caption, stock);
    console.log(imagePath);
    db.query(sql, (err, data) => {
      if (err) {
        // console.log(req.files);
        // console.log(req.body);
        // console.log(req.body.data);
        console.log(err.message);
        fs.unlinkSync(`public${imagePath}`);
        return res.status(500).send(err.message);
      }
      return res.status(201).send({ message: sql, status: 'success', value: req.body, data });
    });
  });
});

router.patch('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let sql = `SELECT * FROM productdb WHERE id = ${id}`;
  db.query(sql, (err, data) => {
    const oldImagePath = data[0].imagePath;
    try {
      const path = '/productdb';
      const upload = uploader(path, 'PRD').fields([{ name: 'image' }]);
      upload(req, res, (err) => {
        const { image } = req.files;
        const { nama, harga, caption, stock } = JSON.parse(req.body.data);
        const imagePath = image ? `${path}/${image[0].filename}` : oldImagePath;
        let sql_2 = `UPDATE productdb SET nama='${nama}', harga=${harga}, caption='${caption}', stock=${stock}, imagePath='${imagePath}' WHERE id = ${id}`;
        db.query(sql_2, (err, data) => {
          if (err) {
            fs.unlinkSync(`public${imagePath}`);
            console.log(data);
            console.log(err);
            console.log(req.body);
            return res.status(501).send(err);
          }
          if (image && oldImagePath) fs.unlinkSync(`public${oldImagePath}`);
          return res.status(200).send({ message: [sql, sql_2], status: 'Success', value: data });
        });
      });
    } catch (err) {
      console.log(err);
    }
  });
  // const id = parseInt(req.params.id);
  // const { nama, harga, stock, caption } = req.body;
  // let sql = `UPDATE productdb SET nama = '${nama}', harga = ${harga}, stock = ${stock}, caption = '${caption}' WHERE id = ${id}`;
  // db.query(sql, (err, data) => {
  //   if (err) return res.status(500).send({ message: err.message });
  //   return res.status(201).send({ message: sql, status: 'success', value: req.body, data });
  // });
});

//delete data by id
// router.delete('/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   let sql = `SELECT * FROM productdb WHERE id = ${id}`;
//   db.query(sql, (err, data) => {
//     if (err) return res.status(500).send(err.message);
//     const oldImagePath = data[0].imagePath;
//     // const productID = data[0].id;
//     let sql_2 = `DELETE FROM productdb WHERE id = ${id}`;
//     db.query(sql_2, (err) => {
//       if (err) {
//         return res.status(500).send(err.message);
//       } else {
//         fs.unlinkSync(`public${oldImagePath}`);
//         return res.status(200).send({ message: sql_2, status: 'success' });
//       }
//     });
//   });
// });
// promisify delete by id
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const product = await query(`SELECT * FROM productdb WHERE id = ${id}`);
    const oldImagePath = product[0].imagePath;
    await query(`DELETE FROM productdb WHERE id = ${id}`);
    fs.unlinkSync(`public${oldImagePath}`);
    return res.status(200).send({ message: 'delete data success', status: 'success' });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

//delete data isAvailable to 0
router.put('/:id', (req, res) => {
  let sql = `UPDATE productdb SET isAvailable = 0 WHERE id = ${req.params.id}`;
  db.query(sql, (err) => {
    if (err) return res.status(500).send({ message: err.message });
    return res.status(200).send({ message: sql, status: 'PUT - SUCCESS' });
  });
});

// get per ID, update, insert, delete

module.exports = router;
