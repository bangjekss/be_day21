const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 2000;
const bearerToken = require('express-bearer-token');
const {
  productRouter,
  cartRouter,
  imageRouter,
  userRouter,
  mongoRouter,
  socketRouter,
} = require('./router');
const { transporter } = require('./favordb');
const { query } = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser());
app.use(express.static('public'));
app.use(bearerToken());

const server = require('http').createServer(app);
const socketio = require('socket.io');
const io = socketio(server);

let userCount = 0;
app.io = io;
app.userCount = userCount;
// npm i socket.io@2.3.0
io.on('connection', (socket) => {
  userCount += 1;
  // console.log(`new ws connection, active: ${userCount}`);
  // socket.emit('message', 'welcome to chatcord');
  // socket.broadcast.emit('msg', 'a user has joined');
  // socket.on('disconnect', () => {
  //   io.emit('msg', 'a user has left');
  // });
  io.emit('jumlahUser', userCount);

  console.log('User Connected', userCount);

  socket.on('disconnect', (data) => {
    userCount--;
    console.log('User Disconnected, Remaining: ', userCount);
    io.emit('jumlahUser', userCount);
  });
});

// Namespace
const admin = io.of('/admin');
app.adminNamespace = admin;
admin.on('connection', (socket) => {});
const user = io.of('/user');
app.userNamespace = user;
user.on('connection', (socket) => {
  socket.on('notification', (data) => {
    console.log(data);
    socket.broadcast.emit('notification', `New message: ${data}`);
  });
});

app.get('/', (req, res) => {
  res.status(200).send('<h1>Express API</h1>');
});
app.use('/productdb', productRouter);
app.use('/cartdb', cartRouter);
app.use('/imagedb', imageRouter);
app.use('/userdb', userRouter);
app.use('/mongodb', mongoRouter);
app.use('/socket', socketRouter);

// app.listen(port, () => console.log(`API active at port ${port}`));
server.listen(port, () => console.log(`API active at port ${port}`));
