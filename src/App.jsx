import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import HerramientasPage from './pages/HerramientasPage'
import PrestamosPage from './pages/PrestamosPage'
import HistorialPage from './pages/HistorialPage'
import UsuariosPage from './pages/UsuariosPage'
import MisPrestamosPage from './pages/MisPrestamosPage'
import NotFoundPage from './pages/NotFoundPage'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas compartidas */}
          <Route path="/" element={
            <PrivateRoute><DashboardPage /></PrivateRoute>
          }/>
          <Route path="/herramientas" element={
            <PrivateRoute><HerramientasPage /></PrivateRoute>
          }/>

          {/* Rutas solo Admin */}
          <Route path="/prestamos" element={
            <PrivateRoute soloAdmin><PrestamosPage /></PrivateRoute>
          }/>
          <Route path="/historial" element={
            <PrivateRoute soloAdmin><HistorialPage /></PrivateRoute>
          }/>
          <Route path="/usuarios" element={
            <PrivateRoute soloAdmin><UsuariosPage /></PrivateRoute>
          }/>

          {/* Rutas solo Empleado */}
          <Route path="/mis-prestamos" element={
            <PrivateRoute><MisPrestamosPage /></PrivateRoute>
          }/>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App