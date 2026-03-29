import api from './api'

export const getHerramientas = async () => {
  const response = await api.get('/herramientas')
  return response.data
}

export const getDisponibles = async () => {
  const response = await api.get('/herramientas/disponibles')
  return response.data
}

export const createHerramienta = async (datos) => {
  const response = await api.post('/herramientas', datos)
  return response.data
}

export const updateHerramienta = async (id, datos) => {
  const response = await api.put(`/herramientas/${id}`, datos)
  return response.data
}

export const deleteHerramienta = async (id) => {
  const response = await api.delete(`/herramientas/${id}`)
  return response.data
}

export const getResumen = async () => {
  const response = await api.get('/herramientas/resumen')
  return response.data
}