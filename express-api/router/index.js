const productRouter = require('./productRouter');
const cartRouter = require('./cartRouter');
const imageRouter = require('./imageRouter');
const userRouter = require('./userRouter');
const mongoRouter = require('./mongoRouter');
const socketRouter = require('./socketRouter');

module.exports = {
  productRouter,
  cartRouter,
  imageRouter,
  userRouter,
  mongoRouter,
  socketRouter,
};
