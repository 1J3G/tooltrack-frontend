import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login } from '../services/authService'

function LoginPage() {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login: authLogin } = useAuth()
  const navigate = useNavigate()

const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')
  setLoading(true)
  try {
    const data = await login(correo, contrasena)
    console.log('Datos del login:', data) // verificar que id llega
    authLogin({ id: data.id, nombre: data.nombre, rol: data.rol }, data.token)
    navigate('/')
  } catch (err) {
    setError('Correo o contraseña incorrectos')
  } finally {
    setLoading(false)
  }
}

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconBox}>🔧</div>
          <h1 style={styles.title}>ToolTrack</h1>
          <p style={styles.subtitle}>Sistema de control de herramientas</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Correo electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="usuario@tooltrack.com"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            style={loading ? {...styles.button, opacity: 0.7} : styles.button}
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <p style={styles.footer}>Solo usuarios autorizados pueden acceder</p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f0f2f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '36px 32px',
    width: '100%',
    maxWidth: '380px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px'
  },
  iconBox: {
    width: '52px',
    height: '52px',
    background: '#E1F5EE',
    borderRadius: '14px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    marginBottom: '12px'
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    margin: '0',
    color: '#1a1a18'
  },
  subtitle: {
    fontSize: '13px',
    color: '#888',
    margin: '4px 0 0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  label: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  input: {
    background: '#f8f9fa',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '10px 13px',
    fontSize: '13px',
    outline: 'none',
    transition: 'border 0.2s'
  },
  error: {
    background: '#FFEBEE',
    color: '#C62828',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    margin: '0'
  },
  button: {
    background: '#1D9E75',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '4px'
  },
  footer: {
    textAlign: 'center',
    fontSize: '11px',
    color: '#aaa',
    marginTop: '20px',
    marginBottom: '0'
  }
}

export default LoginPage