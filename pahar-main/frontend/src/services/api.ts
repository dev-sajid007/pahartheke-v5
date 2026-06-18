import axios from 'axios'
import { store } from '@/store'
import { logout } from '@/store/slices/userSlice'
import { config } from '@/config'

const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (reqConfig) => {
    const token = store.getState().user.token
    if (token) {
      reqConfig.headers.Authorization = `Bearer ${token}`
    }
    return reqConfig
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout())
      // Redirect to login page or handle unauthorized access
    }
    return Promise.reject(error)
  }
)

export default api