import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { getHerramientas } from '../services/herramientaService'
import { getPrestamosActivos, registrarPrestamo, registrarDevolucion } from '../services/prestamoService'
import api from '../services/api'

function PrestamosPage() {
  const [prestamos, setPrestamos] = useState([])
  const [herramientas, setHerramientas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ idUsuario: '', idHerramienta: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const cargar = async () => {
    try {
      const [p, h, u] = await Promise.all([
        getPrestamosActivos(),
        getHerramientas(),
        api.get('/usuarios').then(r => r.data)
      ])
      setPrestamos(p)
      setHerramientas(h.filter(h => h.cantidadDisponible > 0))
      setUsuarios(u)
    } catch { } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const handleRegistrar = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await registrarPrestamo({
        idUsuario: parseInt(form.idUsuario),
        idHerramienta: parseInt(form.idHerramienta)
      })
      setShowModal(false)
      setForm({ idUsuario: '', idHerramienta: '' })
      cargar()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar préstamo')
    }
  }

  const handleDevolucion = async (id) => {
    if (!window.confirm('¿Confirmas la devolución?')) return
    try {
      await registrarDevolucion(id)
      cargar()
    } catch {
      alert('Error al registrar devolución')
    }
  }

  return (
    <>
      <Navbar />
      <div style={styles.page}>

        <div style={styles.pageHeader}>
          <div>
            <h2 style={styles.pageTitle}>Gestión de préstamos</h2>
            <p style={styles.pageSubtitle}>{prestamos.length} préstamos activos</p>
          </div>
          <button onClick={() => setShowModal(true)} style={styles.btnPrimary}>
            + Nuevo préstamo
          </button>
        </div>

        <div style={styles.tableCard}>
          {loading ? (
            <div style={styles.empty}>Cargando...</div>
          ) : prestamos.length === 0 ? (
            <div style={styles.empty}>No hay préstamos activos</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>#</th>
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
                      <span style={styles.badgeActivo}>Activo</span>
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleDevolucion(p.id)}
                        style={styles.btnDevolver}
                      >
                        Registrar devolución
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal nuevo préstamo */}
        {showModal && (
          <div style={styles.overlay}>
            <div style={styles.modal}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Registrar préstamo</h3>
                <button onClick={() => { setShowModal(false); setError('') }} style={styles.btnCerrar}>✕</button>
              </div>

              <form onSubmit={handleRegistrar} style={styles.modalForm}>
                <div style={styles.field}>
                  <label style={styles.label}>Empleado</label>
                  <select
                    value={form.idUsuario}
                    onChange={e => setForm({...form, idUsuario: e.target.value})}
                    style={styles.input}
                    required
                  >
                    <option value="">Selecciona un empleado...</option>
                    {usuarios.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.nombre} — {u.rol}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Herramienta disponible</label>
                  <select
                    value={form.idHerramienta}
                    onChange={e => setForm({...form, idHerramienta: e.target.value})}
                    style={styles.input}
                    required
                  >
                    <option value="">Selecciona una herramienta...</option>
                    {herramientas.map(h => (
                      <option key={h.id} value={h.id}>
                        {h.nombre} — {h.cantidadDisponible} disponibles
                      </option>
                    ))}
                  </select>
                </div>

                {error && <p style={styles.errorMsg}>{error}</p>}

                <div style={styles.modalFooter}>
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setError('') }}
                    style={styles.btnSecondary}
                  >
                    Cancelar
                  </button>
                  <button type="submit" style={styles.btnPrimary}>
                    Confirmar préstamo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  )
}

const styles = {
  page: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  pageTitle: { fontSize: '20px', fontWeight: '700', margin: '0', color: '#1a1a18' },
  pageSubtitle: { fontSize: '13px', color: '#888', margin: '4px 0 0' },
  tableCard: { background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  thead: { background: '#f8f9fa' },
  th: { textAlign: 'left', padding: '10px 16px', fontSize: '11px', fontWeight: '600', color: '#666' },
  tr: { borderTop: '1px solid #f5f5f5' },
  td: { padding: '12px 16px', color: '#444' },
  toolName: { fontWeight: '600', margin: '0', color: '#1a1a18' },
  badgeActivo: { background: '#FFF8E1', color: '#BA7517', fontSize: '10px', padding: '3px 8px', borderRadius: '20px', fontWeight: '600' },
  btnDevolver: { background: 'transparent', border: '1px solid #1D9E75', color: '#1D9E75', borderRadius: '6px', padding: '5px 12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' },
  empty: { padding: '40px', textAlign: 'center', color: '#aaa', fontSize: '13px' },
  btnPrimary: { background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  btnSecondary: { background: '#fff', color: '#666', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 },
  modal: { background: '#fff', borderRadius: '14px', width: '100%', maxWidth: '440px', padding: '24px', boxShadow: '0 8px 40px rgba(0,0,0,0.15)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  modalTitle: { fontSize: '16px', fontWeight: '700', margin: '0', color: '#1a1a18' },
  btnCerrar: { background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#888' },
  modalForm: { display: 'flex', flexDirection: 'column', gap: '14px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '11px', fontWeight: '600', color: '#555', textTransform: 'uppercase', letterSpacing: '0.04em' },
  input: { background: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '10px 13px', fontSize: '13px', outline: 'none' },
  errorMsg: { background: '#FFEBEE', color: '#C62828', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', margin: '0' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }
}

export default PrestamosPage