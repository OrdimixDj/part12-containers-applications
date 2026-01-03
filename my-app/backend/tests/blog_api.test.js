const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root1', passwordHash })
  await user.save()

  const userBlogs = []

  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  blogObject.user = user._id
  userBlogs.push(blogObject._id)
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  blogObject.user = user._id
  userBlogs.push(blogObject._id)
  await blogObject.save()

  user.blogs = userBlogs
  await user.save()
})

describe('when there is initially some blogs saved', () => {
  test('blogs are correctly returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs has an id an not an _id', async () => {
    const response = await api.get('/api/blogs')
    const firstBlog = response.body[0]
    expect(firstBlog.id).toBeDefined()
  })
})

describe('addition of a new blog', () => {
  test('a valid blog can be added with valid token', async () => {
    const user = {
      username: 'root1',
      password: 'sekret',
    }

    const loginResponse = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = loginResponse.body.token

    const newBlog = {
      title: 'Title test',
      author: 'Author test',
      url: 'Url test',
      likes: 0,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((b) => b.title)
    expect(titles).toContain('Title test')

    const authors = blogsAtEnd.map((b) => b.author)
    expect(authors).toContain('Author test')

    const urls = blogsAtEnd.map((b) => b.url)
    expect(urls).toContain('Url test')

    const totLikes = blogsAtEnd.map((b) => b.likes)
    expect(totLikes).toContain(0)
  })

  test('works if likes is missing, with default value 0', async () => {
    const user = {
      username: 'root1',
      password: 'sekret',
    }

    const loginResponse = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = loginResponse.body.token

    const newBlog = {
      title: 'Title test',
      author: 'Author test',
      url: 'Url test',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    const likes = blogsAtEnd.map((b) => b.likes)
    expect(likes).toContain(0) // 0 is supposed to be associated to that blog because the other blogs have 7 & 5 likes
  })

  test('fails with status code 400 if title or url missing', async () => {
    const user = {
      username: 'root1',
      password: 'sekret',
    }

    const loginResponse = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = loginResponse.body.token

    const blogWithoutTitle = {
      author: 'Author test',
      url: 'Url test',
      likes: 0,
    }

    const blogWithoutUrl = {
      title: 'Title test',
      author: 'Author test',
      likes: 0,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithoutTitle)
      .expect(400)

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithoutUrl)
      .expect(400)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if it is valid', async () => {
    const user = {
      username: 'root1',
      password: 'sekret',
    }

    const loginResponse = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = loginResponse.body.token

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map((b) => b.title)
    expect(titles).not.toContain(blogToDelete.title)

    const authors = blogsAtEnd.map((b) => b.author)
    expect(authors).not.toContain(blogToDelete.author)

    const urls = blogsAtEnd.map((b) => b.url)
    expect(urls).not.toContain(blogToDelete.url)

    const likes = blogsAtEnd.map((b) => b.likes)
    expect(likes).not.toContain(blogToDelete.likes)
  })
})

describe('update a blog', () => {
  test('updated likes of a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const user = {
      username: 'root1',
      password: 'sekret',
    }

    const loginResponse = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = loginResponse.body.token

    blogToUpdate.likes = 29

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(blogToUpdate)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const blogUpdated = blogsAtEnd[0]

    expect(blogUpdated.likes).toBe(blogToUpdate.likes)
  })

  test('completely update a blog', async () => {
    const user = {
      username: 'root1',
      password: 'sekret',
    }

    const loginResponse = await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = loginResponse.body.token

    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    blogToUpdate.title = 'updated title'
    blogToUpdate.author = 'updated author'
    blogToUpdate.url = 'updated url'
    blogToUpdate.likes = 33

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(blogToUpdate)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const blogUpdated = blogsAtEnd[0]

    expect(blogUpdated.title).toBe(blogToUpdate.title)
    expect(blogUpdated.author).toBe(blogToUpdate.author)
    expect(blogUpdated.url).toBe(blogToUpdate.url)
    expect(blogUpdated.likes).toBe(blogToUpdate.likes)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
