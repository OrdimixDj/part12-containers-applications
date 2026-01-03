import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUsersList } from './reducers/usersListReducer'
import { initializeUser } from './reducers/userReducer'
import { Routes, Route } from 'react-router-dom'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Login from './components/Login'
import Notification from './components/Notification'
import BlogList from './components/BlogList'
import UsersList from './components/UsersList'
import User from './components/User'
import Blog from './components/Blog'
import Menu from './components/Menu'
import { Container } from 'react-bootstrap'

const App = () => {
  const dispatch = useDispatch()

  const user = useSelector((state) => state.user)

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
    dispatch(initializeUsersList())
  }, [])

  if (!user.token) {
    return (
      <div>
        <Notification />
        <Login />
      </div>
    )
  }

  return (
    <Container>
      <Menu />
      <Notification />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <h2>blog app</h2>
              <Togglable
                buttonId="show-create-blog-div-button"
                buttonLabel="create new blog"
                ref={blogFormRef}
              >
                <BlogForm blogFormRef={blogFormRef} />
              </Togglable>
              <br />
              <BlogList />
            </>
          }
        />

        <Route path="/users" element={<UsersList />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<Blog />} />
      </Routes>
    </Container>
  )
}

export default App
