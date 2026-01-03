import { createSlice } from '@reduxjs/toolkit'
import { setNotification } from '../reducers/notificationReducer'
import blogService from '../services/blogs'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    updateBlog(state, action) {
      const blogToUpdate = action.payload

      return state.map((blog) =>
        blog.id !== blogToUpdate.id ? blog : blogToUpdate,
      )
    },
    removeBlog(state, action) {
      const blogToRemove = action.payload

      return state.filter((blog) => blog.id !== blogToRemove.id)
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
  },
})

export const { updateBlog, appendBlog, removeBlog, setBlogs } =
  blogsSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    try {
      const blogs = await blogService.getAll()
      dispatch(setBlogs(blogs))
    } catch (exception) {
      dispatch(
        setNotification(
          `Unable to initialize blogs list. Exact error: ${exception.response.data.error}`,
          'error',
          5,
        ),
      )
    }
  }
}

export const createBlog = (content) => {
  return async (dispatch, getState) => {
    try {
      const user = getState().user
      const newBlog = await blogService.create(content, user.token)
      newBlog.user = user
      dispatch(appendBlog(newBlog))
      dispatch(
        setNotification(
          `a new blog ${newBlog.title} by ${newBlog.author} added`,
          'success',
          5,
        ),
      )
      return newBlog
    } catch (exception) {
      if (exception.response.status === 400) {
        dispatch(
          setNotification(
            `Bad request: title and url are required`,
            'error',
            5,
          ),
        )
      } else {
        dispatch(
          setNotification(
            `Unable to create that blog. Exact error: ${exception.response.data.error}`,
            'error',
            5,
          ),
        )
      }
    }
  }
}

export const changeBlog = (newBlog) => {
  return async (dispatch, getState) => {
    try {
      const token = getState().user.token
      const blogUpdated = await blogService.update(newBlog, token)
      dispatch(updateBlog(blogUpdated))
      dispatch(
        setNotification(
          `blog ${blogUpdated.title} by ${blogUpdated.author} successfully modified`,
          'success',
          5,
        ),
      )
    } catch (exception) {
      dispatch(
        setNotification(
          `Unable to modify that blog. Exact error: ${exception.response.data.error}`,
          'error',
          5,
        ),
      )
    }
  }
}

export const commentBlog = (blog, commentContent) => {
  return async (dispatch) => {
    try {
      const blogUpdated = await blogService.comment(blog, commentContent)
      dispatch(updateBlog(blogUpdated))
      dispatch(
        setNotification(`a new comment ${commentContent} added`, 'success', 5),
      )
    } catch (exception) {
      dispatch(
        setNotification(
          `Unable to comment that blog. Exact error: ${exception.response.data.error}`,
          'error',
          5,
        ),
      )
    }
  }
}

export const deleteBlog = (blogToDelete) => {
  return async (dispatch, getState) => {
    try {
      const token = getState().user.token
      await blogService.remove(blogToDelete, token)
      dispatch(removeBlog(blogToDelete))
      dispatch(
        setNotification(
          `blog ${blogToDelete.title} by ${blogToDelete.author} successfully deleted`,
          'success',
          5,
        ),
      )
    } catch (exception) {
      dispatch(
        setNotification(
          `Unable to delete that blog. Exact error: ${exception.response.data.error}`,
          'error',
          5,
        ),
      )
    }
  }
}

export const likeBlog = (blog) => {
  return async (dispatch, getState) => {
    try {
      const token = getState().user.token
      const blogToUpdate = { ...blog, likes: blog.likes + 1 }
      const blogUpdated = await blogService.update(blogToUpdate, token)
      blogUpdated.user = blog.user
      dispatch(updateBlog(blogUpdated))
      dispatch(
        setNotification(
          `Blog ${blogUpdated.title} by ${blogUpdated.author} successfully liked`,
          'success',
          5,
        ),
      )
    } catch (exception) {
      dispatch(
        setNotification(
          `Unable to like that blog. Exact error: ${exception.response.data.error}`,
          'error',
          5,
        ),
      )
    }
  }
}

export default blogsSlice.reducer
