const { query } = require('../db');

const regisValidation = async (req, res, next) => {
  const { username, email } = req.body;
  try {
    const getData_username = await query(
      `SELECT username FROM userdb WHERE username = '${username}'`
    );
    // console.log(getData_username);
    if (getData_username.length === 0) {
      const getData_email = await query(`SELECT email FROM userdb WHERE email = '${email}'`);
      res.status(200).send(getData_email);
      // next();
      return res.status(200).send(getData_email);
    } else {
      res.status(200).send(getData_username);
      // next();
      // next();
      return res.status(200).send(getData_username);
    }
  } catch (err) {
    return res.status(500).send(err);
  }
  // next();
};

module.exports = regisValidation;
