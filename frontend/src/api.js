import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

export const fetchMembers = () => api.get('/members/').then((r) => r.data)
export const fetchMember = (id) => api.get(`/members/${id}`).then((r) => r.data)
export const createMember = (data) => api.post('/members/', data).then((r) => r.data)
export const updateMember = (id, data) => api.put(`/members/${id}`, data).then((r) => r.data)
export const deleteMember = (id) => api.delete(`/members/${id}`)
