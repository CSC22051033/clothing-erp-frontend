import axios from 'axios'

const apiClient = axios.create({
    baseURL: '/api',
    timeout: 10000
})

export const fetchUsers = () => apiClient.get('/users').then(res => res.data)