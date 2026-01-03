import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { likeBlog, commentBlog, deleteBlog } from '../reducers/blogReducer'
import { Table, Button, Form } from 'react-bootstrap'

import { useNavigate } from 'react-router-dom'

const Blog = () => {
  const navigate = useNavigate()
  const [commentContent, setCommentContent] = useState('')

  const user = useSelector((state) => state.user)

  const blogId = useParams().id
  const blogs = useSelector((state) => state.blogs)

  const blog = blogs.find((blog) => blog.id === blogId)

  if (!blog) {
    return null
  }

  const showWhenSameUser = {
    display: user.username === blog.user.username ? '' : 'none',
  }

  const dispatch = useDispatch()

  const increaseLike = (event) => {
    event.preventDefault()
    dispatch(likeBlog(blog))
  }

  const addBlogComment = (event) => {
    event.preventDefault()
    dispatch(commentBlog(blog, commentContent))
    setCommentContent('')
  }

  const removeBlog = async (event) => {
    event.preventDefault()

    if (window.confirm('Remove blog ' + blog.title + ' by ' + blog.author)) {
      await dispatch(deleteBlog(blog))
      navigate('/')
    }
  }

  return (
    <div>
      <h1>
        {blog.title} <em>written by {blog.author}</em>
      </h1>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <br />
      <div className="d-flex align-items-center">
        {blog.likes} likes
        <Button style={{ marginLeft: 5 }} onClick={increaseLike}>
          like
        </Button>
      </div>
      <br />
      <div>added by {blog.user.name}</div>
      <br />
      <div id="remove-blog-button" style={showWhenSameUser}>
        <Button onClick={removeBlog}>remove</Button>
      </div>
      <br />
      <h2>comments</h2>
      <Form style={{ display: 'flex' }} onSubmit={addBlogComment}>
        <Form.Group className="d-flex gap-2">
          <Form.Control
            type="text"
            value={commentContent}
            placeholder="type your comment"
            onChange={({ target }) => setCommentContent(target.value)}
          />
          <Button className="text-nowrap" id="create-blog-button" type="submit">
            add comment
          </Button>
        </Form.Group>
      </Form>
      <br />
      <Table striped>
        <tbody>
          {blog.comments.map(
            (
              comment,
              i, // Because a comment doesn't have an id, I looked on internet and saw we can use the i variable
            ) => (
              <tr key={i}>
                <td key={i}>{comment}</td>
              </tr>
            ),
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default Blog
