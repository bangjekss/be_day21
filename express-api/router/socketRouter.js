const express = require('express');
const { query } = require('../db');
const router = express.Router();
const moment = require('moment');
const { getTime } = require('../favordb');

router.get('/', async (req, res) => {
  try {
    const response = await query(
      `SELECT c.id, u.username, c.message, c.time FROM chat c JOIN userdb u ON u.id = c.userID`
    );
    return res.status(200).send(response);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.post('/:id', getTime, async (req, res) => {
  // console.log(req.body);
  const { message } = req.body;
  const { userNamespace } = req.app;
  const id = parseInt(req.params.id);
  const { time } = req;
  console.log(req.time);
  try {
    const { insertId } = await query(
      `INSERT INTO chat (message, time, userID) VALUES ('${message}', '${time}', ${id})`
    );
    const response = await query(
      `SELECT c.id, u.username, c.message, c.time FROM chat c JOIN userdb u ON u.id = c.userID WHERE c.id = ${insertId}`
    );
    userNamespace.emit('chat', response[0]);
    console.log(response);
    return res.status(200).send({ message, status: 'success' });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

module.exports = router;
