import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1/',
})

// Interceptor për me shtu token automatikisht në çdo request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

export default api
