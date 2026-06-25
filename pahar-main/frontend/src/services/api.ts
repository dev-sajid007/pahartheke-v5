import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (reqConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('auth_token')
      if (token) {
        reqConfig.headers.Authorization = `Bearer ${token}`
      }
    }
    return reqConfig
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      }
    }
    return Promise.reject(error)
  }
)

export default api
