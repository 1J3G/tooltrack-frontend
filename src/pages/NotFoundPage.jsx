import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function NotFoundPage() {
  const navigate = useNavigate()
  const { token } = useAuth()

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconBox}>🔧</div>
        <h1 style={styles.code}>404</h1>
        <h2 style={styles.title}>Página no encontrada</h2>
        <p style={styles.subtitle}>
          La ruta que buscas no existe o no tienes permisos para acceder.
        </p>
        <button
          onClick={() => navigate(token ? '/' : '/login')}
          style={styles.button}
        >
          {token ? 'Volver al inicio' : 'Ir al login'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh', background: '#f0f2f5',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  card: {
    background: '#fff', borderRadius: '16px', padding: '48px 40px',
    textAlign: 'center', maxWidth: '400px', width: '100%',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
  },
  iconBox: {
    fontSize: '40px', marginBottom: '16px'
  },
  code: {
    fontSize: '72px', fontWeight: '800',
    margin: '0', color: '#1a1a18', lineHeight: '1'
  },
  title: {
    fontSize: '20px', fontWeight: '600',
    margin: '12px 0 8px', color: '#333'
  },
  subtitle: {
    fontSize: '13px', color: '#888',
    margin: '0 0 28px', lineHeight: '1.6'
  },
  button: {
    background: '#1D9E75', color: '#fff', border: 'none',
    borderRadius: '8px', padding: '11px 24px',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer'
  }
}

export default NotFoundPage