const express = require('express');
const router = express.Router();
const { db, query } = require('../db');
// const _ = require('lodash');
const { uploader } = require('../favordb');
const fs = require('fs');

router.get('/', async (req, res) => {
  try {
    let sql = 'SELECT * FROM productdb';
    if (req.query.isAvailable)
      sql += ` WHERE isAvailable = 1 ${Object.keys(req.query).length >= 2 ? 'AND' : ''}`;
    if (req.query.hargaMin)
      sql += ` harga >= ${req.query.hargaMin} ${Object.keys(req.query).length >= 2 ? 'AND' : ''}`;
    if (req.query.hargaMax)
      sql += ` harga <= ${req.query.hargaMax} ${Object.keys(req.query).length >= 2 ? 'AND' : ''}`;
    if (Object.keys(req.query).length >= 2) {
      const index = sql.lastIndexOf('AND');
      const x = sql.slice(0, index - 1);
      const y = sql.slice(index + 3);
      sql = x + y;
      console.log(sql);
    }
    const getProduct = await query(sql);
    return res.status(200).send(getProduct);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

// Promise get by id
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const getProduct = await query(`SELECT * FROM productdb WHERE id = ${id}`);
    // console.log(getProduct);
    return res.status(200).send(getProduct[0]);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

router.post('/', (req, res) => {
  const path = '/productdb';
  const upload = uploader(path, 'PRD').fields([{ name: 'image' }]);
  upload(req, res, async (err) => {
    const { image } = req.files;
    const { nama, harga, stock, caption } = JSON.parse(req.body.data);
    const imagePath = image ? `${path}/${image[0].filename}` : null;
    try {
      await query(
        `INSERT INTO productdb (nama, harga, stock, caption, isAvailable, imagePath) VALUES ('${nama}', ${harga}, ${stock}, '${caption}', 1, '${imagePath}')`
      );
      return res.status(200).send({ status: 'success', message: 'ADD PRODUCT' });
    } catch (err) {
      console.log(err);
      fs.unlinkSync(`public${imagePath}`);
      return res.status(500).send(err);
    }
  });
});

router.patch('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const getData = await query(`SELECT * FROM productdb WHERE id = ${id}`);
  console.log(getData, id);
  const oldImagePath = getData[0].imagePath;
  const path = '/productdb';
  const upload = uploader(path, 'PRD').fields([{ name: 'image' }]);
  upload(req, res, async (err) => {
    const { image } = req.files;
    const { nama, harga, stock, caption } = JSON.parse(req.body.data);
    const imagePath = image ? `${path}/${image[0].filename}` : oldImagePath;
    try {
      await query(
        `UPDATE productdb SET nama = '${nama}', harga = ${harga}, caption = '${caption}', stock = '${stock}', imagePath = '${imagePath}' WHERE id = ${id}`
      );
      if (image && oldImagePath) fs.unlinkSync(`public${oldImagePath}`);
      return res.status(200).send({ status: 'success', message: 'edit data' });
    } catch (err) {
      fs.unlinkSync(`public${imagePath}`);
      console.log(err);
      return res.status(500).send(err);
    }
  });
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const product = await query(`SELECT * FROM productdb WHERE id = ${id}`);
    const { imagePath } = product[0];
    await query(`DELETE FROM productdb WHERE id = ${id}`);
    fs.unlinkSync(`public${imagePath}`);
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

module.exports = router;
