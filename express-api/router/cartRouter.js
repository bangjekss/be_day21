const express = require('express');
const router = express.Router();
const { db, query } = require('../db');

router.get('/', async (req, res) => {
  const data = await query('SELECT * FROM cartdb');
  return res.status(200).send(data);
});

router.get('/:id', async (req, res) => {
  const userID = parseInt(req.params.id);
  try {
    const data = await query(
      `SELECT c.id, c.userID, u.username, p.nama, c.qty, p.harga FROM cartdb c JOIN productdb p ON p.id = c.productID JOIN userdb u ON u.id = c.userID WHERE c.userID = ${userID}`
    );
    return res.status(200).send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.post('/', async (req, res) => {
  const { userID, productID, qty } = req.body;
  try {
    await query(
      `INSERT INTO cartdb (userID, productID, qty) VALUES (${userID}, ${productID}, ${qty})`
    );
    return res.status(200).send({ status: 'success', message: 'ADD TO CART' });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

router.patch('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { qty } = req.body;
  try {
    await query(`UPDATE CARTDB SET qty = ${qty} WHERE id = ${id}`);
    return res.status(200).send({ status: 'success', message: 'UPDATE CART' });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await query(`DELETE FROM cartdb WHERE id = ${id}`);
    return res.status(200).send({ status: 'success', message: 'DELETE FROM CART' });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
