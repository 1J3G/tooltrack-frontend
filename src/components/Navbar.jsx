import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isAdmin = user?.rol === 'ADMIN'
  const isActive = (path) => location.pathname === path

  const navLink = (path, label) => (
    <span
      onClick={() => navigate(path)}
      style={{
        fontSize: '13px',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: isActive(path) ? '600' : '400',
        color: isActive(path)
          ? (isAdmin ? '#1D9E75' : '#8B7FF0')
          : '#aaa',
        background: isActive(path)
          ? (isAdmin ? 'rgba(29,158,117,0.15)' : 'rgba(83,74,183,0.15)')
          : 'transparent',
        transition: 'all 0.2s'
      }}
    >
      {label}
    </span>
  )

  return (
    <nav style={styles.navbar}>
      <div style={styles.left}>
        <span style={styles.logo}>🔧</span>
        <span style={styles.brand}>ToolTrack</span>
        <div style={styles.links}>
          {isAdmin ? (
            <>
              {navLink('/', 'Dashboard')}
              {navLink('/herramientas', 'Herramientas')}
              {navLink('/prestamos', 'Préstamos')}
              {navLink('/historial', 'Historial')}
              {navLink('/usuarios', 'Usuarios')}
            </>
          ) : (
            <>
              {navLink('/', 'Inicio')}
              {navLink('/herramientas', 'Herramientas')}
              {navLink('/mis-prestamos', 'Mis préstamos')}
            </>
          )}
        </div>
      </div>

      <div style={styles.right}>
        <div style={{
          ...styles.avatar,
          background: isAdmin ? '#1D9E75' : '#534AB7'
        }}>
          {user?.nombre?.charAt(0).toUpperCase()}
        </div>
        <span style={styles.userName}>{user?.nombre}</span>
        <span style={{
          ...styles.rolBadge,
          background: isAdmin ? '#E1F5EE' : '#EEEDFE',
          color: isAdmin ? '#0F6E56' : '#534AB7'
        }}>
          {isAdmin ? 'Admin' : 'Empleado'}
        </span>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Salir
        </button>
      </div>
    </nav>
  )
}

const styles = {
  navbar: {
    background: '#1a1a18',
    padding: '10px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  logo: { fontSize: '18px' },
  brand: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#fff',
    marginRight: '8px'
  },
  links: {
    display: 'flex',
    gap: '2px'
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  avatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    color: '#fff'
  },
  userName: {
    fontSize: '13px',
    color: '#ccc'
  },
  rolBadge: {
    fontSize: '10px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '10px'
  },
  logoutBtn: {
    background: '#2a2a28',
    border: 'none',
    color: '#888',
    fontSize: '12px',
    padding: '5px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginLeft: '4px'
  }
}

export default Navbar