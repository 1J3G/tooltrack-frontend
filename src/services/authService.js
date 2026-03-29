import api from './api'

export const login = async (correo, contrasena) => {
  const response = await api.post('/auth/login', { correo, contrasena })
  return response.data
}

export const registerEmpleado = async (datos) => {
  const response = await api.post('/auth/register', datos)
  return response.data
}