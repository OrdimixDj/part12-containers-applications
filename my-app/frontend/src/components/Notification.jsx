import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  let variant = 'success'

  if (!notification.content) {
    return null
  }

  if (notification.type == 'error') {
    variant = 'danger'
  }

  return <Alert variant={variant}>{notification.content}</Alert>
}

export default Notification
