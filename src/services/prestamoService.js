import api from './api'

export const getPrestamosActivos = async () => {
  const response = await api.get('/prestamos/activos')
  return response.data
}

export const getHistorial = async () => {
  const response = await api.get('/prestamos/historial')
  return response.data
}

export const getHistorialPorUsuario = async (idUsuario) => {
  const response = await api.get(`/prestamos/historial/usuario/${idUsuario}`)
  return response.data
}

export const registrarPrestamo = async (datos) => {
  const response = await api.post('/prestamos', datos)
  return response.data
}

export const registrarDevolucion = async (id) => {
  const response = await api.put(`/prestamos/${id}/devolver`)
  return response.data
}

export const getMisPrestamos = async (idUsuario) => {
  const response = await api.get(`/prestamos/mis-prestamos?idUsuario=${idUsuario}`)
  return response.data
}