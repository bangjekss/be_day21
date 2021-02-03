const express = require('express');
const router = express.Router();
const {
  createToken,
  checkToken,
  hashPassword,
  transporter,
  transporterPromisify,
} = require('../favordb');
const { db, query } = require('../db');

router.get('/', async (req, res) => {
  try {
    const getData = await query(`SELECT * FROM userdb`);
    return res.status(200).send(getData);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.post('/login', (req, res) => {
  const { username_email, password } = req.body;
  let sql;
  const regex_email = /[\w-\.]+(@[\w-\.]+\.)+[\w\.]{2,4}$/;
  if (username_email.match(regex_email)) {
    sql = `
      SELECT 
        id, username, email, password, alamat, roleID, verified
      FROM userdb WHERE email='${username_email}' AND password = '${hashPassword(password)}'
    `;
  } else {
    sql = `
      SELECT 
        id, username, email, password, alamat, roleID, verified
      FROM userdb WHERE username='${username_email}' AND password = '${hashPassword(password)}'
    `;
  }
  // console.log(req.body);
  // console.log(username_email.match(regex_email));
  // console.log(sql);
  db.query(sql, (err, data) => {
    if (err) return res.status(500).send(err);
    if (data.length === 0) {
      return res.status(404).send({ status: '404 Not Found', message: 'user not found' });
    }
    const responseData = { ...data[0] };
    const token = createToken(responseData);
    responseData.token = token;
    return res.status(200).send(responseData);
  });
});

router.post('/keep-login', checkToken, (req, res) => {
  console.log(req.user);
  let sql = `
    SELECT 
      id, username, email, password, alamat, roleID, verified 
    FROM userdb WHERE id=${req.user.id}
  `;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(data[0]);
  });
});

router.post('/register', (req, res) => {
  let { username, password, email, validation } = req.body;
  if (validation) {
    // console.log('eaea');
    let sqlValidation_username = `SELECT username FROM userdb WHERE username='${username}'`;
    db.query(sqlValidation_username, (err, data) => {
      if (err) return res.status(500).send(err);
      console.log(data);
      if (data.length === 0) {
        let sqlValidation_email = `SELECT email FROM userdb WHERE email='${email}'`;
        db.query(sqlValidation_email, (err, data) => {
          if (err) return res.status(500).send(err);
          console.log(data);
          return res.status(200).send(data);
        });
      } else {
        return res.status(200).send(data);
      }
    });
  } else {
    // console.log('no');
    password = hashPassword(password);
    let sql_addUser = `INSERT INTO userdb (username, email, password, roleID, verified) VALUES ('${username}', '${email}', '${password}', 2, 0)`;
    db.query(sql_addUser, (err, data_newUser) => {
      if (err) return res.status(500).send(err);
      console.log(data_newUser);
      const sql_getUser = `SELECT * FROM userdb WHERE id = ${data_newUser.insertId}`;
      db.query(sql_getUser, (err, data_user) => {
        if (err) return res.status(500).send(err);
        const responseData = { ...data_user[0] };
        const token = createToken(responseData);
        responseData.token = token;
        console.log(responseData);
        return res.status(200).send({
          status: 'success',
          value: responseData,
          flow: [sql_addUser, data_newUser, sql_addUser, data_user],
        });
      });
    });
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

router.post('/email-verification', (req, res) => {
  const { username } = req.body;
  console.log(req.body);
  const sql_updateUser = `UPDATE userdb SET verified = 1 WHERE username='${username}'`;
  db.query(sql_updateUser, (err, data_updateUser) => {
    if (err) return res.status(500).send(err);
    console.log(data_updateUser);
    const sql_login = `SELECT id, username, email, roleID, alamat, verified FROM userdb WHERE username = '${username}'`;
    db.query(sql_login, (err, data_login) => {
      if (err) return res.status(500).send(err);
      console.log(data_login);
      const responseData = { ...data_login[0] };
      const token = createToken(responseData);
      responseData.token = token;
      return res.status(200).send(responseData);
    });
  });
});

router.post('/send-change-password', (req, res) => {
  const { email_username } = req.body;
  const regex_email = /[\w-\.]+(@[\w-\.]+\.)+[\w\.]{2,4}$/;
  let sql_getUser;
  console.log(email_username);
  if (email_username.match(regex_email)) {
    sql_getUser = `SELECT * FROM userdb WHERE email = '${email_username}'`;
  } else {
    sql_getUser = `SELECT * FROM userdb WHERE username = '${email_username}'`;
  }
  console.log(sql_getUser);
  db.query(sql_getUser, (err, data_getUser) => {
    if (err) return res.status(500).send(err);
    const { id, username, email, password } = data_getUser[0];
    // create token hanya bisa digunakan untuk string | objek | buffer
    const token = createToken({ id });
    console.log(data_getUser, 'data_getUser');
    const mailOption = {
      from: `Admin <unyu@official.com>`,
      to: email,
      subject: 'Forget Password',
      html: `<div><a href='http://localhost:3000/change-password?token=${token}'>Klik di sini untuk mengganti password</a></div>`,
    };
    transporter.sendMail(mailOption, (err, data_nodeMailer) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send({
        status: 'success',
        message: 'email sent',
        flow: [sql_getUser, data_getUser[0], mailOption, data_nodeMailer],
      });
    });
  });
});

router.post('/change-password', checkToken, (req, res) => {
  console.log(req.user);
  const { password } = req.body;
  const userID = req.user.id;
  const sql_password = `UPDATE userdb SET password = '${hashPassword(
    password
  )}' WHERE id = ${userID}`;
  console.log(req.body);
  console.log(req.user);
  db.query(sql_password, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send({ status: 'success', flow: [sql_password, data] });
  });
});

module.exports = router;
