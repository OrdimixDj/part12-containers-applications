const express = require('express');
const { Todo } = require('../mongo')
const redis = require('../redis');
const { $where } = require('../mongo/models/Todo');
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  const counter = await redis.getAsync('added_todos');

  let newCount = 1;

  if (counter !== null) {
    newCount = Number(counter) + 1;
  }

  await redis.setAsync('added_todos', newCount);

  res.send(todo);
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

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { text, done } = req.body;

  if (text !== undefined) {
    req.todo.text = text;
  }

  if (done !== undefined) {
    req.todo.done = done;
  }

  await req.todo.save();
  res.send(req.todo);
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
