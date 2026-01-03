const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
  } catch (exception) {
    next(exception)
  }
})

blogRouter.post(
  '/',
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response, next) => {
    const body = request.body
    const user = request.user

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      comments: body.comments || [],
      user: user.id,
    })

    try {
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
      response.status(201).json(savedBlog)
    } catch (exception) {
      next(exception)
    }
  },
)

blogRouter.post('/:id/comments', async (request, response, next) => {
  const commentContent = request.body.content

  const blog = await Blog.findById(request.params.id)

  try {
    blog.comments = blog.comments.concat(commentContent)

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (exception) {
    next(exception)
  }
})

blogRouter.delete(
  '/:id',
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      const user = request.user

      const blog = await Blog.findById(request.params.id)
      if (!blog) {
        return response.status(204).end()
      }

      if (blog.user.toString() === user._id.toString()) {
        await blog.deleteOne()

        user.blogs = user.blogs.filter(
          (b) => b.toString() !== blog._id.toString(),
        )
        await user.save()

        return response.status(204).end()
      } else {
        return response
          .status(401)
          .json({ error: 'this user is not the blog creator' })
      }
    } catch (exception) {
      next(exception)
    }
  },
)

blogRouter.put(
  '/:id',
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response, next) => {
    const { title, author, url, likes, comments } = request.body
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).end()
    }

    try {
      blog.title = title
      blog.author = author
      blog.url = url
      blog.likes = likes
      blog.comments = comments

      const updatedBlog = await blog.save()
      response.json(updatedBlog)
    } catch (exception) {
      next(exception)
    }
  },
)

module.exports = blogRouter
