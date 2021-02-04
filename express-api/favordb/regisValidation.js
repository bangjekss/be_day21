const { query } = require('../db');

const regisValidation = async (req, res, next) => {
  const { username, email } = req.body;
  const getData_username = await query(`SELECT * FROM userdb WHERE username = '${username}'`);
  if (getData_username.length !== 0)
    return res.status(401).send({ status: 'failed', message: 'Username already exists' });
  const getData_email = await query(`SELECT * FROM userdb WHERE email = '${email}'`);
  if (getData_email.length !== 0)
    return res.status(401).send({ status: 'failed', message: 'Email already exists' });
  next();
};

module.exports = regisValidation;
