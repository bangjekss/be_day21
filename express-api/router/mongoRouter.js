const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const {
  mongo: { MongoClient, ObjectID, url },
} = require('../db');

router.get('/', (req, res) => {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) return res.status(500).send(err);
    const movieCol = client.db('sample_mflix').collection('movies');
    // console.log(movieCol);
    movieCol
      .find({
        title: {
          $regex: req.query.title,
          $options: 'i',
        },
      })
      .limit(10)
      .toArray((err, data) => {
        client.close();
        // console.log(data);
        if (err) return res.status(500).send(err);
        res.status(200).send(data);
      });
  });
});

// callback async await try catch
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const movieCol = client.db('sample_mflix').collection('movies');
    const data = await movieCol.findOne({ _id: ObjectID(id) });
    client.close();
    return res.status(200).send(data);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const movieCol = client.db('sample_mflix').collection('movies');
    const data = await movieCol.insertOne(req.body);
    console.log(req.body);
    client.close();
    return res.status(200).send(data);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const movieCol = client.db('sample_mflix').collection('movies');
    const { set, unset } = req.body;
    let clause = {};
    if (set) clause.$set = set;
    if (unset) clause.$unset = unset;
    console.log(clause);
    const data = await movieCol.updateOne({ _id: ObjectId(id) }, clause);
    client.close();
    return res.status(200).send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const movieCol = client.db('sample_mflix').collection('movies');
    const data = await movieCol.deleteOne({ _id: ObjectId(id) });
    client.close();
    return res.status(200).send(data);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

module.exports = router;

// callback hell
// router.get('/:id', (req, res) => {
//   const { id } = req.params;
//   MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
//     if (err) return res.status(500).send(err);
//     const movieCol = client.db('sample_mflix').collection('movies');
//     // console.log(movieCol);
//     movieCol.findOne({ _id: ObjectID(id) }, (err, data) => {
//       if (err) return res.status(500).send(err);
//       console.log(true);
//       return res.status(200).send(data);
//     });
//   });
// });

// callback then catch
// router.get('/:id', (req, res) => {
//   const { id } = req.params;
//   MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then((client) => {
//       const movieCol = client.db('sample_mflix').collection('movies');
//       movieCol.findOne({ _id: ObjectID(id) }).then((data) => {
//         client.close();
//         return res.status(200).send(data);
//       });
//     })
//     .catch((err) => res.status(500).send(err));
// });
