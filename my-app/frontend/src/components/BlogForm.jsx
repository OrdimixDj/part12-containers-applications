import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { addBlogInUsersList } from '../reducers/usersListReducer'
import { Form, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

const BlogForm = ({ blogFormRef }) => {
  const dispatch = useDispatch()

  const user = useSelector((state) => state.user)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      title: title,
      author: author,
      url: url,
    }

    const blogCreated = await dispatch(createBlog(newBlog, user))
    dispatch(addBlogInUsersList(blogCreated))

    blogFormRef.current.toggleVisibility()

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const formStyle = { margin: 5 }

  return (
    <div>
      <h2>create new</h2>

      <Form onSubmit={addBlog}>
        <Form.Group>
          <Form.Label>title:</Form.Label>
          <Form.Control
            id="title-input"
            type="text"
            value={title}
            name="Title"
            placeholder="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>author:</Form.Label>
          <Form.Control
            id="author-input"
            type="text"
            value={author}
            name="Author"
            placeholder="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>url:</Form.Label>
          <Form.Control
            id="url-input"
            type="text"
            value={url}
            name="Url"
            placeholder="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </Form.Group>
        <br />
        <Button
          style={{ marginBottom: 10 }}
          id="create-blog-button"
          type="submit"
        >
          create
        </Button>
        <br />
      </Form>
    </div>
  )
}

export default BlogForm
