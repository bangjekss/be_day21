const express = require('express');
const router = express.Router();
const {
  createToken,
  checkToken,
  hashPassword,
  transporter,
  transporterPromisify,
  regisValidation,
} = require('../favordb');
const { db, query } = require('../db');

const handleToken = (data) => {
  const newData = { ...data };
  const token = createToken(newData);
  newData.token = token;
  return newData;
};

router.get('/', async (req, res) => {
  try {
    const getData = await query(`SELECT * FROM userdb`);
    return res.status(200).send(getData);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.post('/login', async (req, res) => {
  const { username_email, password } = req.body;
  console.log(req.body);
  const regexEmail = /[\w\-\.]+(@[\w\-]+\.)+[\w\-\.]{2,4}$/;
  let sql_query;
  if (username_email.match(regexEmail)) {
    sql_query = `SELECT * FROM userdb WHERE email = '${username_email}' AND password = '${hashPassword(
      password
    )}'`;
  } else {
    sql_query = `SELECT * FROM userdb WHERE username = '${username_email}' AND password = '${hashPassword(
      password
    )}'`;
  }
  try {
    const data = await query(sql_query);
    const newData = await handleToken(data[0]);
    console.log(newData);
    return res.status(200).send(newData);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.post('/keep-login', checkToken, async (req, res) => {
  // tambahan req.user berasal dari middleware checkToken
  try {
    const data = await query(`SELECT * FROM userdb WHERE id = ${req.user.id}`);
    return res.status(200).send(data[0]);
  } catch (err) {
    console.log(err);
    if (err) return res.status(500).send(err);
  }
});

router.post('/register-live-validation', async (req, res) => {
  console.log(req.body);
  const { username, email } = req.body;
  const usernameExist = await query(`SELECT username FROM userdb WHERE username = '${username}'`);
  const emailExist = await query(`SELECT email FROM userdb WHERE email = '${email}'`);
  return res.status(200).send({ username: usernameExist[0], email: emailExist[0] });
});

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    await query(
      `INSERT INTO userdb (username, email, password, roleID, verified) VALUES ('${username}', '${email}', '${hashPassword(
        password
      )}', 2, 0)`
    );
    const data = await query(`SELECT * FROM userdb WHERE email = '${email}'`);
    const newData = await handleToken(data[0]);
    return res.status(200).send(newData);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await query(`DELETE FROM userdb WHERE id = ${id}`);
    return res.status(200).send({ status: 'success', message: 'delete from userdb' });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

// send mail
// router.post('/send-email-verification', (req, res) => {
//   const { userID } = req.body;
//   console.log(req.body);
//   console.log(userID);
//   const sql_getUser = `SELECT * FROM userdb WHERE id = ${userID}`;
//   db.query(sql_getUser, (err, data_user) => {
//     if (err) return res.status(500).send(err);
//     const { username, email, password } = data_user[0];
//     const mailOption = {
//       from: 'Admin <razak9098@gmail.com>',
//       to: email,
//       subject: 'Email Verification',
//       html: `<h1>Welcome ${username} to Yuchase</h1><br><a href='http://localhost:3000/verify?username=${username}&password=${password}</a>`,
//     };
//     transporter.sendMail(mailOption, (err, data_nodeMailer) => {
//       if (err) return res.status(500).send(err);
//       // console.log(data_user[0]);
//       console.log(data_nodeMailer);
//       return res.status(200).send({
//         status: 'success',
//         message: 'sent mail',
//         flow: [sql_getUser, data_user, data_nodeMailer],
//       });
//     });
//   });
// });

// send mail promisify
router.post('/send-email-verification', async (req, res) => {
  const userID = parseInt(req.body.userID);
  try {
    const getUser = await query(`SELECT * FROM userdb WHERE id = ${userID}`);
    const { username, email, password } = getUser[0];
    const mailOption = {
      from: 'Admin <razak9098@gmail.com>',
      to: email,
      subject: 'Email Verification',
      html: `<h1>Welcome ${username} to Yuchase</h1><br><a href='http://localhost:3000/verify?username=${username}&password=${password}'>klik disini</a>`,
    };
    await transporterPromisify(mailOption);
    return res.status(200).send({ message: 'email sent', status: 'success' });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.post('/email-verification', async (req, res) => {
  const { username } = req.body;
  try {
    await query(`UPDATE userbd SET verified = 1 WHERE username = '${username}'`);
    const getUser = await query(`SELECT * FROM userdb WHERE username = '${username}'`);
    const newData = await handleToken(getUser[0]);
    return res.status(200).send(newData);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.post('/send-change-password', async (req, res) => {
  const { username_email } = req.body;
  let sql_getUser;
  try {
    const regexEmail = /[\w\-\.]+(@[\w\-]+\.)+[\w\-\.]{2,4}$/;
    if (username_email.match(regexEmail)) {
      sql_getUser = `SELECT * FROM userdb WHERE email = '${username_email}'`;
    } else {
      sql_getUser = `SELECT * FROM userdb WHERE username = '${username_email}'`;
    }
    const getUser = await query(sql_getUser);
    const new_getUser = handleToken(getUser[0]);
    const { id, email, username, token } = new_getUser;
    console.log(new_getUser);
    const mailOptions = {
      from: `<admin> jek@oficial.jek`,
      to: email,
      subject: `FORGOT PASSWORD`,
      html: `<a href='http://localhost:3000/change-password?token=${token}'>klik di sini</a>`,
    };
    await transporterPromisify(mailOptions);
    return res.status(200).send({ status: 'ok', message: `sent` });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.post('/change-password', checkToken, async (req, res) => {
  const id = parseInt(req.user.id);
  const { password } = req.body;
  try {
    await query(`UPDATE userdb SET password = '${hashPassword(password)}' WHERE id = '${id}'`);
    return res.status(200).send({ status: 'success', message: `change password` });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

module.exports = router;
