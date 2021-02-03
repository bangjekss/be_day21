const mysql = require('mysql');
const util = require('util');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'bangjekss',
  password: 'lolipop9098',
  database: 'jcwm15',
  port: 3306,
});

const query = util.promisify(db.query).bind(db);

const { MongoClient, ObjectID } = require('mongodb');
const url =
  'mongodb+srv://bangjekss:lolipop9098@learn.hibgl.mongodb.net/test?retryWrites=true&w=majority';
// const _client = MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = {
  db,
  query,
  mongo: { MongoClient, ObjectID, url },
};
