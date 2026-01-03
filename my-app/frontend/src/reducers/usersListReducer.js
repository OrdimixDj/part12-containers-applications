import { createSlice } from '@reduxjs/toolkit'
import { setNotification } from '../reducers/notificationReducer'
import usersService from '../services/users'

const usersListSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsersList(state, action) {
      return action.payload
    },
    updateUser(state, action) {
      const userToUpdate = action.payload

      return state.map((user) =>
        user.id !== userToUpdate.id ? user : userToUpdate,
      )
    },
  },
})

export const { setUsersList, updateUser } = usersListSlice.actions

export const initializeUsersList = () => {
  return async (dispatch) => {
    try {
      const blogs = await usersService.getAll()
      dispatch(setUsersList(blogs))
    } catch (exception) {
      dispatch(
        setNotification(
          `Unable to initialize users list. Exact error: ${exception.response.data.error}`,
          'error',
          5,
        ),
      )
    }
  }
}

export const addBlogInUsersList = (blog) => {
  return async (dispatch, getState) => {
    try {
      const state = getState()
      const user = state.user
      const users = state.users

      const userToUpdate = users.find((u) => u.username === user.username)

      const updatedUser = {
        ...userToUpdate,
        blogs: userToUpdate.blogs.concat(blog),
      }

      dispatch(updateUser(updatedUser))
    } catch (exception) {
      dispatch(
        setNotification(
          `Unable to initialize users list. Exact error: ${exception.message}`,
          'error',
          5,
        ),
      )
    }
  }
}

export default usersListSlice.reducer
