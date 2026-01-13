import api from './api'

export const registerUser = payload => api.post('/auth/register', payload)

export const loginUser = payload => api.post('/auth/login', payload)

export const fetchProfile = () => api.get('/auth/me')

export const updateProfile = payload => api.put('/auth/profile', payload)

export const changePassword = payload => api.post('/auth/change-password', payload)
