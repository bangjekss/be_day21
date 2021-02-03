const moment = require('moment');

const getTime = (req, res, next) => {
  req.time = moment().format('LT');
  next();
};

module.exports = getTime;
