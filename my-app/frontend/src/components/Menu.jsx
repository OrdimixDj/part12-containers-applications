import { Link } from 'react-router-dom'
import { Navbar, Nav, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { disconnectUser } from '../reducers/userReducer'

const Menu = () => {
  const dispatch = useDispatch()

  const user = useSelector((state) => state.user)

  const handleDisconnectUser = async (event) => {
    event.preventDefault()

    dispatch(disconnectUser())
  }

  const menuStyle = {
    backgroundColor: '#d3d3d3',
    display: 'flex',
  }

  const padding = {
    padding: 5,
  }

  return (
    <Navbar
      style={menuStyle}
      collapseOnSelect
      expand="lg"
      bg="#d3d3d3"
      variant="dark"
    >
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#" as="span">
            <Link to="/">blogs</Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <Link to="/users">users</Link>
          </Nav.Link>
          <Nav style={{ marginLeft: 5 }}>
            <Navbar.Text className="me-2 mb-0 text-primary">
              {user.name} logged in
            </Navbar.Text>
            <Button
              style={{ marginLeft: 5 }}
              id="logout-button"
              onClick={handleDisconnectUser}
              variant="outline-secondary"
              size="sm"
            >
              logout
            </Button>
          </Nav>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Menu
