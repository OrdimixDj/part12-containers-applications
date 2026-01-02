const express = require('express');
const redis = require('../redis');
const router = express.Router();

const configs = require('../util/config')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

/* GET statistics */
router.get('/statistics', async (req, res) => {
  const counter = await redis.getAsync('added_todos');

  if (!counter) {
    res.send({ "added_todos": 0 });
  }
  else {
    res.send({ "added_todos": Number(counter) });
  }
});

module.exports = router;
