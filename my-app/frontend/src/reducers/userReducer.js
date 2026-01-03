import { createSlice } from '@reduxjs/toolkit'
import { setNotification } from '../reducers/notificationReducer'

const initialState = {
  token: '',
  username: '',
  name: '',
}

const userReducer = createSlice({
  name: 'User',
  initialState,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser(state, action) {
      return initialState
    },
  },
})

export const { setUser, clearUser } = userReducer.actions

export const initializeUser = () => {
  return async (dispatch) => {
    try {
      const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        dispatch(setUser(user))
      }
    } catch (exception) {
      dispatch(
        setNotification(
          `Unable to get user data. Exact error: ${exception.response.data.error}`,
          'error',
          5,
        ),
      )
    }
  }
}

export const changeUser = (user) => {
  return async (dispatch) => {
    try {
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      dispatch(setUser(user))
    } catch (exception) {
      dispatch(
        setNotification(
          `Unable to set user data in browser. Exact error: ${exception.response.data.error}`,
          'error',
          5,
        ),
      )
    }
  }
}

export const disconnectUser = () => {
  return async (dispatch) => {
    try {
      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(initialState),
      )
      dispatch(clearUser())
      dispatch(setNotification(`User successfully logged out.`, 'success', 5))
    } catch (exception) {
      dispatch(
        setNotification(
          `Unable to disconnect user. Exact error: ${exception.response.data.error}`,
          'error',
          5,
        ),
      )
    }
  }
}

export default userReducer.reducer
