import { useSelector } from 'react-redux'
import { Table } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

const User = () => {
  const userId = useParams().id

  const users = useSelector((state) => state.users)

  const user = users.find((user) => user.id === userId)

  if (!user) return null

  return (
    <>
      <h1>{user.name}</h1>
      <h2>added blogs</h2>

      {user.blogs && user.blogs.length > 0 ? (
        <Table striped>
          <tbody>
            {user.blogs.map((blog) => (
              <tr key={blog.id}>
                <td>{blog.title}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>This user has not added any blogs yet.</p>
      )}
    </>
  )
}

export default User
