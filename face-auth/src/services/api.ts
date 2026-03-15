import axios from 'axios'

const api = axios.create({
  baseURL: 'http://192.168.3.73:3333',
})

export async function registerUser(payload: {name: string, email: string, password: string, descriptor: number[]}){
  const res = await api.post('/auth/register', payload)
  return res.data
}

export async function loginWithDescriptor(descriptor: number[]){
  const res = await api.post('/auth/login', { descriptor })
  return res.data
}

export async function loginWithCredentials(email: string, password: string){
  const res = await api.post('/auth/login-credentials', { email, password })
  return res.data
}

export default api
