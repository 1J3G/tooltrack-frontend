import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { getHerramientas, getResumen } from '../services/herramientaService'
import { getPrestamosActivos, registrarDevolucion } from '../services/prestamoService'

function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.rol === 'ADMIN'

  const [herramientas, setHerramientas] = useState([])
  const [prestamos, setPrestamos] = useState([])
  const [loading, setLoading] = useState(true)

  const cargar = async () => {
    try {
      if (isAdmin) {
        const [h, p] = await Promise.all([
          getHerramientas(),
          getPrestamosActivos()
        ])
        setHerramientas(h)
        setPrestamos(p)
      } else {
        const h = await getResumen()
        setHerramientas(h)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const handleDevolucion = async (id) => {
    if (!window.confirm('¿Confirmas la devolución de esta herramienta?')) return
    try {
      await registrarDevolucion(id)
      cargar()
    } catch {
      alert('Error al registrar devolución')
    }
  }

  const totalUnidades = herramientas.reduce((a, h) => a + h.cantidadTotal, 0)
  const totalDisponibles = herramientas.reduce((a, h) => a + h.cantidadDisponible, 0)
  const totalPrestadas = herramientas.reduce((a, h) => a + h.cantidadPrestada, 0)

  if (loading) return (
    <>
      <Navbar />
      <div style={styles.loading}>Cargando...</div>
    </>
  )

  return (
    <>
      <Navbar />
      <div style={styles.page}>

        <div style={styles.pageHeader}>
          <h2 style={styles.pageTitle}>
            {isAdmin ? 'Dashboard' : `Bienvenido, ${user?.nombre}`}
          </h2>
          <p style={styles.pageSubtitle}>
            {isAdmin
              ? 'Resumen general del sistema'
              : 'Consulta el estado del inventario'}
          </p>
        </div>

        {/* Métricas */}
        <div style={styles.metricsGrid}>
          <div style={{...styles.metricCard, borderLeft: '3px solid #1D9E75'}}>
            <p style={styles.metricLabel}>Total herramientas</p>
            <p style={{...styles.metricValue, color: '#1D9E75'}}>{herramientas.length}</p>
            <p style={styles.metricSub}>{totalUnidades} unidades en total</p>
          </div>
          <div style={{...styles.metricCard, borderLeft: '3px solid #185FA5'}}>
            <p style={styles.metricLabel}>Unidades disponibles</p>
            <p style={{...styles.metricValue, color: '#185FA5'}}>{totalDisponibles}</p>
            <p style={styles.metricSub}>listas para prestar</p>
          </div>
          <div style={{...styles.metricCard, borderLeft: '3px solid #BA7517'}}>
            <p style={styles.metricLabel}>Unidades prestadas</p>
            <p style={{...styles.metricValue, color: '#BA7517'}}>{totalPrestadas}</p>
            <p style={styles.metricSub}>{prestamos.length} préstamos activos</p>
          </div>
          {isAdmin && (
            <div style={{...styles.metricCard, borderLeft: '3px solid #534AB7'}}>
              <p style={styles.metricLabel}>Herramientas agotadas</p>
              <p style={{...styles.metricValue, color: '#534AB7'}}>
                {herramientas.filter(h => h.estado === 'AGOTADA').length}
              </p>
              <p style={styles.metricSub}>sin unidades disponibles</p>
            </div>
          )}
        </div>

        {/* Tabla préstamos activos — solo admin */}
        {isAdmin && (
          <div style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <span style={styles.tableTitle}>Préstamos activos</span>
              <span
                onClick={() => navigate('/historial')}
                style={styles.tableLink}
              >
                Ver historial completo →
              </span>
            </div>
            {prestamos.length === 0 ? (
              <div style={styles.empty}>No hay préstamos activos</div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>Herramienta</th>
                    <th style={styles.th}>Empleado</th>
                    <th style={styles.th}>Fecha préstamo</th>
                    <th style={styles.th}>Estado</th>
                    <th style={styles.th}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {prestamos.map(p => (
                    <tr key={p.id} style={styles.tr}>
                      <td style={styles.td}>{p.nombreHerramienta}</td>
                      <td style={styles.td}>{p.nombreUsuario}</td>
                      <td style={styles.td}>
                        {new Date(p.fechaPrestamo).toLocaleDateString('es-CO')}
                      </td>
                      <td style={styles.td}>
                        <span style={styles.badgeActivo}>Activo</span>
                      </td>
                      <td style={styles.td}>
                        <button
                          onClick={() => handleDevolucion(p.id)}
                          style={styles.btnDevolver}
                        >
                          Devolver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Vista empleado — herramientas disponibles */}
        {!isAdmin && (
          <div style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <span style={styles.tableTitle}>Herramientas disponibles</span>
              <span
                onClick={() => navigate('/mis-prestamos')}
                style={styles.tableLink}
              >
                Ver mis préstamos →
              </span>
            </div>
            <div style={styles.cardsGrid}>
              {herramientas.filter(h => h.cantidadDisponible > 0).map(h => (
                <div key={h.id} style={styles.toolCard}>
                  <div style={styles.toolCardTop}>
                    <span style={styles.toolIcon}>🔧</span>
                    <span style={{
                      ...styles.stockBadge,
                      background: '#E8F5E9',
                      color: '#2E7D32'
                    }}>
                      {h.cantidadDisponible} disponibles
                    </span>
                  </div>
                  <p style={styles.toolName}>{h.nombre}</p>
                  <p style={styles.toolType}>{h.tipo}</p>
                  <div style={styles.progressBar}>
                    <div style={{
                      ...styles.progressFill,
                      width: `${(h.cantidadDisponible / h.cantidadTotal) * 100}%`
                    }} />
                  </div>
                  <p style={styles.toolStock}>
                    {h.cantidadDisponible} de {h.cantidadTotal} unidades libres
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  )
}

const styles = {
  page: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
  loading: { padding: '40px', textAlign: 'center', color: '#888' },
  pageHeader: { marginBottom: '20px' },
  pageTitle: { fontSize: '20px', fontWeight: '700', margin: '0', color: '#1a1a18' },
  pageSubtitle: { fontSize: '13px', color: '#888', margin: '4px 0 0' },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '20px'
  },
  metricCard: {
    background: '#fff', borderRadius: '10px',
    padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  metricLabel: { fontSize: '12px', color: '#888', margin: '0 0 6px' },
  metricValue: { fontSize: '28px', fontWeight: '700', margin: '0' },
  metricSub: { fontSize: '11px', color: '#aaa', margin: '4px 0 0' },
  tableCard: {
    background: '#fff', borderRadius: '10px',
    overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    marginBottom: '20px'
  },
  tableHeader: {
    padding: '14px 18px', borderBottom: '1px solid #f0f0f0',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  tableTitle: { fontSize: '14px', fontWeight: '600', color: '#1a1a18' },
  tableLink: { fontSize: '12px', color: '#1D9E75', cursor: 'pointer', fontWeight: '500' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  thead: { background: '#f8f9fa' },
  th: { textAlign: 'left', padding: '10px 16px', fontSize: '11px', fontWeight: '600', color: '#666' },
  tr: { borderTop: '1px solid #f5f5f5' },
  td: { padding: '12px 16px', color: '#444' },
  badgeActivo: {
    background: '#FFF8E1', color: '#BA7517',
    fontSize: '10px', padding: '3px 8px', borderRadius: '20px', fontWeight: '600'
  },
  btnDevolver: {
    background: 'transparent', border: '1px solid #1D9E75',
    color: '#1D9E75', borderRadius: '6px', padding: '4px 10px',
    fontSize: '11px', fontWeight: '600', cursor: 'pointer'
  },
  empty: { padding: '32px', textAlign: 'center', color: '#aaa', fontSize: '13px' },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px', padding: '14px'
  },
  toolCard: { border: '1px solid #e8f5e9', borderRadius: '10px', padding: '14px' },
  toolCardTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  toolIcon: { fontSize: '20px' },
  stockBadge: { fontSize: '10px', padding: '2px 8px', borderRadius: '20px', fontWeight: '600' },
  toolName: { fontSize: '13px', fontWeight: '600', margin: '0 0 2px', color: '#1a1a18' },
  toolType: { fontSize: '11px', color: '#888', margin: '0 0 8px' },
  progressBar: { background: '#f0f0f0', borderRadius: '4px', height: '4px', marginBottom: '6px' },
  progressFill: { background: '#1D9E75', borderRadius: '4px', height: '4px' },
  toolStock: { fontSize: '10px', color: '#aaa', margin: '0' }
}

export default DashboardPage