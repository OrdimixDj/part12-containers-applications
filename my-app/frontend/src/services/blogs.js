import axios from 'axios'

const baseUrl = '/api/blogs'

const create = async (newBlog, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async (blog, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }

  const url = baseUrl + '/' + blog.id
  const response = await axios.put(url, blog, config)
  return response.data
}

const comment = async (blog, commentContent) => {
  const url = baseUrl + '/' + blog.id + '/comments'
  const commentToSend = {
    content: commentContent,
  }
  const response = await axios.post(url, commentToSend)
  return response.data
}

const remove = async (blog, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }

  const url = baseUrl + '/' + blog.id
  const response = await axios.delete(url, config)
  return response.data
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

export default { create, getAll, update, remove, comment }
