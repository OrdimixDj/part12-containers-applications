import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { changeUser } from '../reducers/userReducer'
import { Form, Button } from 'react-bootstrap'
import loginService from '../services/login'
import PropTypes from 'prop-types'

const LoginForm = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      dispatch(changeUser(user))

      setUsername('')
      setPassword('')
    } catch (exception) {
      const statusCode = exception.response.status

      if (statusCode === 401) {
        dispatch(setNotification(`wrong username or password`, 'error', 5))
      } else {
        dispatch(
          setNotification(
            `Error: ${exception.response.data.error}`,
            'error',
            5,
          ),
        )
      }
    }
  }

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Log in to application</h2>
      <Form onSubmit={handleLogin} className="w-50 mx-auto">
        <Form.Group>
          <Form.Label>username:</Form.Label>
          <Form.Control
            id="username-input"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>password:</Form.Label>
          <Form.Control
            id="password-input"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </Form.Group>
        <Button id="login-button" type="submit">
          login
        </Button>
      </Form>
    </div>
  )
}

LoginForm.propTypes = {
  handleCreateBlog: PropTypes.func.isRequired,
}

export default LoginForm
