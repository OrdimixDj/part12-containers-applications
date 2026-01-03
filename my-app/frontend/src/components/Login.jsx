import { useSelector } from 'react-redux'
import LoginForm from './LoginForm'
import { disconnectUser } from '../reducers/userReducer'

const Login = () => {
  const user = useSelector((state) => state.user)

  return (
    <>
      <LoginForm />
    </>
  )
}

export default Login
