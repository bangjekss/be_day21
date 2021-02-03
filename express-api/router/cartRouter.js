const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/:id', (req, res) => {
  const sql = `
        SELECT 
            c.id,
            p.nama,
            c.qty,
            (c.qty * p.harga) as total
        FROM cartdb c 
        JOIN productdb p ON c.productID = p.id
        WHERE c.userID = ${parseInt(req.params.id)}`;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(data);
  });
});

router.post('/', (req, res) => {
  const sql = `INSERT INTO cartdb SET ?`;
  db.query(sql, req.body, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(201).send({
      message: sql,
      status: 'SUCCESS',
      value: req.body,
      data,
    });
  });
});

router.patch('/:id', (req, res) => {
  const sql = `UPDATE cartdb SET qty = ${req.body.qty} WHERE id = ${req.params.id}`;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(201).send({
      message: sql,
      status: 'SUCCESS',
      value: req.body,
      data,
    });
  });
});

router.delete('/:id', (req, res) => {
  const sql = `DELETE FROM cartdb WHERE id = ${req.params.id}`;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send({
      message: sql,
      status: 'SUCCESS',
      data,
    });
  });
});

module.exports = router;
