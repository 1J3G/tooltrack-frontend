import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { getHistorial } from '../services/prestamoService'

function HistorialPage() {
  const [historial, setHistorial] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('TODOS')

  useEffect(() => {
    getHistorial()
      .then(data => setHistorial(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtrado = historial.filter(p => {
    const matchBusqueda =
      p.nombreUsuario.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.nombreHerramienta.toLowerCase().includes(busqueda.toLowerCase())
    const matchEstado = filtroEstado === 'TODOS' || p.estado === filtroEstado
    return matchBusqueda && matchEstado
  })

  return (
    <>
      <Navbar />
      <div style={styles.page}>

        <div style={styles.pageHeader}>
          <div>
            <h2 style={styles.pageTitle}>Historial de préstamos</h2>
            <p style={styles.pageSubtitle}>{historial.length} registros en total</p>
          </div>
        </div>

        <div style={styles.filtros}>
          <input
            placeholder="Buscar por empleado o herramienta..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
            style={styles.select}
          >
            <option value="TODOS">Todos</option>
            <option value="ACTIVO">Activos</option>
            <option value="DEVUELTO">Devueltos</option>
          </select>
        </div>

        <div style={styles.tableCard}>
          {loading ? (
            <div style={styles.empty}>Cargando historial...</div>
          ) : filtrado.length === 0 ? (
            <div style={styles.empty}>No se encontraron registros</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Herramienta</th>
                  <th style={styles.th}>Empleado</th>
                  <th style={styles.th}>Fecha préstamo</th>
                  <th style={styles.th}>Fecha devolución</th>
                  <th style={styles.th}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtrado.map(p => (
                  <tr key={p.id} style={styles.tr}>
                    <td style={{...styles.td, color: '#aaa', fontSize: '12px'}}>#{p.id}</td>
                    <td style={styles.td}>
                      <p style={styles.toolName}>{p.nombreHerramienta}</p>
                    </td>
                    <td style={styles.td}>{p.nombreUsuario}</td>
                    <td style={styles.td}>
                      {new Date(p.fechaPrestamo).toLocaleDateString('es-CO', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td style={styles.td}>
                      {p.fechaDevolucion
                        ? new Date(p.fechaDevolucion).toLocaleDateString('es-CO', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })
                        : <span style={styles.pendiente}>Pendiente</span>
                      }
                    </td>
                    <td style={styles.td}>
                      <span style={p.estado === 'ACTIVO' ? styles.badgeActivo : styles.badgeDevuelto}>
                        {p.estado === 'ACTIVO' ? 'Activo' : 'Devuelto'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </>
  )
}

const styles = {
  page: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  pageTitle: { fontSize: '20px', fontWeight: '700', margin: '0', color: '#1a1a18' },
  pageSubtitle: { fontSize: '13px', color: '#888', margin: '4px 0 0' },
  filtros: { display: 'flex', gap: '10px', marginBottom: '14px' },
  searchInput: { flex: 1, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '9px 13px', fontSize: '13px', outline: 'none' },
  select: { background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '9px 13px', fontSize: '13px', outline: 'none', minWidth: '150px' },
  tableCard: { background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  thead: { background: '#f8f9fa' },
  th: { textAlign: 'left', padding: '10px 16px', fontSize: '11px', fontWeight: '600', color: '#666' },
  tr: { borderTop: '1px solid #f5f5f5' },
  td: { padding: '12px 16px', color: '#444' },
  toolName: { fontWeight: '600', margin: '0', color: '#1a1a18' },
  pendiente: { color: '#aaa', fontSize: '12px', fontStyle: 'italic' },
  badgeActivo: { background: '#FFF8E1', color: '#BA7517', fontSize: '10px', padding: '3px 8px', borderRadius: '20px', fontWeight: '600' },
  badgeDevuelto: { background: '#E8F5E9', color: '#2E7D32', fontSize: '10px', padding: '3px 8px', borderRadius: '20px', fontWeight: '600' },
  empty: { padding: '40px', textAlign: 'center', color: '#aaa', fontSize: '13px' }
}

export default HistorialPage