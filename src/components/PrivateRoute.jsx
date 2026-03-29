import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

function PrivateRoute({ children, soloAdmin = false }) {
  const { token, user } = useAuth()

  if (!token) return <Navigate to="/login" />

  if (soloAdmin && user?.rol !== 'ADMIN') {
    return <Navigate to="/" />
  }

  return children
}

export default PrivateRoute