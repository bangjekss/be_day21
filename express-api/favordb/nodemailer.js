const nodemailer = require('nodemailer');
const util = require('util');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'razak9098@gmail.com',
    pass: 'cjyjuttenmgnwnmr',
  },
});

const transporterPromisify = util.promisify(transporter.sendMail).bind(transporter);

module.exports = {
  transporter,
  transporterPromisify,
};
