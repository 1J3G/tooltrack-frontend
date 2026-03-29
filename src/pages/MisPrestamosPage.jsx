import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { getMisPrestamos } from '../services/prestamoService'

function MisPrestamosPage() {
  const { user } = useAuth()
  const [prestamos, setPrestamos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        console.log('Usuario actual:', user)
        console.log('ID del usuario:', user?.id)
        if (user?.id) {
          const data = await getMisPrestamos(user.id)
          console.log('Préstamos recibidos:', data)
          setPrestamos(data.filter(p => p.estado === 'ACTIVO'))
        }
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [user])

  return (
    <>
      <Navbar />
      <div style={styles.page}>

        {/* Bienvenida */}
        <div style={styles.welcomeCard}>
          <div style={styles.welcomeAvatar}>
            {user?.nombre?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={styles.welcomeTitle}>Mis préstamos activos</h2>
            <p style={styles.welcomeSub}>
              {user?.nombre} · {prestamos.length} préstamo{prestamos.length !== 1 ? 's' : ''} activo{prestamos.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Préstamos */}
        {loading ? (
          <div style={styles.empty}>Cargando...</div>
        ) : prestamos.length === 0 ? (
          <div style={styles.emptyCard}>
            <p style={styles.emptyIcon}>📦</p>
            <p style={styles.emptyText}>No tienes préstamos activos</p>
            <p style={styles.emptySub}>Cuando el administrador te asigne una herramienta aparecerá aquí</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {prestamos.map(p => (
              <div key={p.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <span style={styles.cardIcon}>🔧</span>
                  <span style={styles.badgeActivo}>Activo</span>
                </div>
                <p style={styles.cardNombre}>{p.nombreHerramienta}</p>
                <p style={styles.cardFecha}>
                  Prestado el {new Date(p.fechaPrestamo).toLocaleDateString('es-CO', {
                    day: '2-digit', month: 'long', year: 'numeric'
                  })}
                </p>
                <div style={styles.cardInfo}>
                  Para devolver esta herramienta comunícate con el administrador.
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </>
  )
}

const styles = {
  page: { padding: '24px', maxWidth: '1100px', margin: '0 auto' },
  welcomeCard: {
    background: '#1a1a18', borderRadius: '12px', padding: '20px 24px',
    display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px'
  },
  welcomeAvatar: {
    width: '48px', height: '48px', borderRadius: '50%',
    background: '#534AB7', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '18px', fontWeight: '700',
    color: '#fff', flexShrink: 0
  },
  welcomeTitle: { fontSize: '18px', fontWeight: '700', margin: '0', color: '#fff' },
  welcomeSub: { fontSize: '13px', color: '#aaa', margin: '4px 0 0' },
  empty: { padding: '40px', textAlign: 'center', color: '#aaa', fontSize: '13px' },
  emptyCard: {
    background: '#fff', borderRadius: '10px', padding: '48px 32px',
    textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  emptyIcon: { fontSize: '36px', margin: '0 0 12px' },
  emptyText: { fontSize: '15px', fontWeight: '600', margin: '0', color: '#333' },
  emptySub: { fontSize: '13px', color: '#aaa', margin: '8px 0 0', lineHeight: '1.5' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '14px'
  },
  card: {
    background: '#fff', borderRadius: '12px', padding: '18px',
    border: '1px solid #FFF8E1', boxShadow: '0 1px 6px rgba(0,0,0,0.06)'
  },
  cardTop: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '12px'
  },
  cardIcon: { fontSize: '24px' },
  badgeActivo: {
    background: '#FFF8E1', color: '#BA7517',
    fontSize: '11px', padding: '4px 10px',
    borderRadius: '20px', fontWeight: '600'
  },
  cardNombre: {
    fontSize: '15px', fontWeight: '600',
    margin: '0 0 4px', color: '#1a1a18'
  },
  cardFecha: { fontSize: '12px', color: '#888', margin: '0 0 12px' },
  cardInfo: {
    background: '#f8f9fa', borderRadius: '8px',
    padding: '10px 12px', fontSize: '12px',
    color: '#888', lineHeight: '1.5'
  }
}

export default MisPrestamosPage