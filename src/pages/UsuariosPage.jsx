import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

const initialForm = { nombre: '', correo: '', contrasena: '', rol: 'EMPLEADO' }

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [filtroRol, setFiltroRol] = useState('TODOS')

  const cargar = async () => {
    try {
      const { data } = await api.get('/usuarios')
      setUsuarios(data)
    } catch { } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/auth/admin/register', form)
      setShowModal(false)
      setForm(initialForm)
      cargar()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear usuario')
    }
  }

  const cerrarModal = () => {
    setShowModal(false)
    setForm(initialForm)
    setError('')
  }

  const usuariosFiltrados = usuarios.filter(u => {
    const matchBusqueda =
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase())
    const matchRol = filtroRol === 'TODOS' || u.rol === filtroRol
    return matchBusqueda && matchRol
  })

  const totalAdmin = usuarios.filter(u => u.rol === 'ADMIN').length
  const totalEmpleados = usuarios.filter(u => u.rol === 'EMPLEADO').length

  return (
    <>
      <Navbar />
      <div style={styles.page}>

        {/* Header */}
        <div style={styles.pageHeader}>
          <div>
            <h2 style={styles.pageTitle}>Gestión de usuarios</h2>
            <p style={styles.pageSubtitle}>
              {usuarios.length} usuarios registrados
            </p>
          </div>
          <button onClick={() => setShowModal(true)} style={styles.btnPrimary}>
            + Nuevo usuario
          </button>
        </div>

        {/* Métricas rápidas */}
        <div style={styles.metricsRow}>
          <div style={{...styles.metricCard, borderLeft: '3px solid #1D9E75'}}>
            <p style={styles.metricLabel}>Total usuarios</p>
            <p style={{...styles.metricValue, color: '#1D9E75'}}>{usuarios.length}</p>
          </div>
          <div style={{...styles.metricCard, borderLeft: '3px solid #185FA5'}}>
            <p style={styles.metricLabel}>Administradores</p>
            <p style={{...styles.metricValue, color: '#185FA5'}}>{totalAdmin}</p>
          </div>
          <div style={{...styles.metricCard, borderLeft: '3px solid #534AB7'}}>
            <p style={styles.metricLabel}>Empleados</p>
            <p style={{...styles.metricValue, color: '#534AB7'}}>{totalEmpleados}</p>
          </div>
        </div>

        {/* Filtros */}
        <div style={styles.filtros}>
          <input
            placeholder="Buscar por nombre o correo..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={filtroRol}
            onChange={e => setFiltroRol(e.target.value)}
            style={styles.select}
          >
            <option value="TODOS">Todos los roles</option>
            <option value="ADMIN">Administrador</option>
            <option value="EMPLEADO">Empleado</option>
          </select>
        </div>

        {/* Tabla */}
        <div style={styles.tableCard}>
          {loading ? (
            <div style={styles.empty}>Cargando usuarios...</div>
          ) : usuariosFiltrados.length === 0 ? (
            <div style={styles.empty}>No se encontraron usuarios</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Usuario</th>
                  <th style={styles.th}>Correo</th>
                  <th style={styles.th}>Rol</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map(u => (
                  <tr key={u.id} style={styles.tr}>
                    <td style={{...styles.td, color: '#aaa', fontSize: '12px'}}>
                      #{u.id}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.userCell}>
                        <div style={{
                          ...styles.avatar,
                          background: u.rol === 'ADMIN' ? '#E1F5EE' : '#EEEDFE',
                          color: u.rol === 'ADMIN' ? '#0F6E56' : '#534AB7'
                        }}>
                          {u.nombre.charAt(0).toUpperCase()}
                        </div>
                        <span style={styles.userName}>{u.nombre}</span>
                      </div>
                    </td>
                    <td style={{...styles.td, color: '#666'}}>
                      {u.correo}
                    </td>
                    <td style={styles.td}>
                      <span style={u.rol === 'ADMIN'
                        ? styles.badgeAdmin
                        : styles.badgeEmpleado
                      }>
                        {u.rol === 'ADMIN' ? 'Administrador' : 'Empleado'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal nuevo usuario */}
        {showModal && (
          <div style={styles.overlay}>
            <div style={styles.modal}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Nuevo usuario</h3>
                <button onClick={cerrarModal} style={styles.btnCerrar}>✕</button>
              </div>

              <form onSubmit={handleSubmit} style={styles.modalForm}>
                <div style={styles.field}>
                  <label style={styles.label}>Nombre completo</label>
                  <input
                    value={form.nombre}
                    onChange={e => setForm({...form, nombre: e.target.value})}
                    style={styles.input}
                    placeholder="Ej: Carlos Rodríguez"
                    required
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Correo electrónico</label>
                  <input
                    type="email"
                    value={form.correo}
                    onChange={e => setForm({...form, correo: e.target.value})}
                    style={styles.input}
                    placeholder="correo@empresa.com"
                    required
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Contraseña</label>
                  <input
                    type="password"
                    value={form.contrasena}
                    onChange={e => setForm({...form, contrasena: e.target.value})}
                    style={styles.input}
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Rol</label>
                  <select
                    value={form.rol}
                    onChange={e => setForm({...form, rol: e.target.value})}
                    style={styles.input}
                  >
                    <option value="EMPLEADO">Empleado</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>

                {/* Info de permisos */}
                <div style={styles.infoBox}>
                  {form.rol === 'ADMIN' ? (
                    <p style={styles.infoText}>
                      El <strong>Administrador</strong> puede gestionar herramientas,
                      registrar préstamos y administrar usuarios.
                    </p>
                  ) : (
                    <p style={styles.infoText}>
                      El <strong>Empleado</strong> puede consultar herramientas
                      disponibles y ver sus propios préstamos.
                    </p>
                  )}
                </div>

                {error && <p style={styles.errorMsg}>{error}</p>}

                <div style={styles.modalFooter}>
                  <button
                    type="button"
                    onClick={cerrarModal}
                    style={styles.btnSecondary}
                  >
                    Cancelar
                  </button>
                  <button type="submit" style={styles.btnPrimary}>
                    Crear usuario
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
  page: { padding: '24px', maxWidth: '1100px', margin: '0 auto' },
  pageHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '16px'
  },
  pageTitle: { fontSize: '20px', fontWeight: '700', margin: '0', color: '#1a1a18' },
  pageSubtitle: { fontSize: '13px', color: '#888', margin: '4px 0 0' },
  metricsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px', marginBottom: '16px'
  },
  metricCard: {
    background: '#fff', borderRadius: '10px', padding: '14px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  metricLabel: { fontSize: '12px', color: '#888', margin: '0 0 4px' },
  metricValue: { fontSize: '26px', fontWeight: '700', margin: '0' },
  filtros: { display: 'flex', gap: '10px', marginBottom: '14px' },
  searchInput: {
    flex: 1, background: '#fff', border: '1px solid #e0e0e0',
    borderRadius: '8px', padding: '9px 13px', fontSize: '13px', outline: 'none'
  },
  select: {
    background: '#fff', border: '1px solid #e0e0e0',
    borderRadius: '8px', padding: '9px 13px', fontSize: '13px',
    outline: 'none', minWidth: '160px'
  },
  tableCard: {
    background: '#fff', borderRadius: '10px',
    overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  thead: { background: '#f8f9fa' },
  th: {
    textAlign: 'left', padding: '10px 16px',
    fontSize: '11px', fontWeight: '600', color: '#666'
  },
  tr: { borderTop: '1px solid #f5f5f5' },
  td: { padding: '12px 16px', color: '#444' },
  userCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: {
    width: '34px', height: '34px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: '700', flexShrink: 0
  },
  userName: { fontWeight: '500', color: '#1a1a18' },
  badgeAdmin: {
    background: '#E1F5EE', color: '#0F6E56',
    fontSize: '11px', padding: '4px 10px',
    borderRadius: '20px', fontWeight: '600'
  },
  badgeEmpleado: {
    background: '#EEEDFE', color: '#534AB7',
    fontSize: '11px', padding: '4px 10px',
    borderRadius: '20px', fontWeight: '600'
  },
  empty: { padding: '40px', textAlign: 'center', color: '#aaa', fontSize: '13px' },
  btnPrimary: {
    background: '#1D9E75', color: '#fff', border: 'none',
    borderRadius: '8px', padding: '9px 16px',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer'
  },
  btnSecondary: {
    background: '#fff', color: '#666', border: '1px solid #e0e0e0',
    borderRadius: '8px', padding: '9px 16px',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer'
  },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
  },
  modal: {
    background: '#fff', borderRadius: '14px',
    width: '100%', maxWidth: '440px', padding: '24px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.15)'
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '20px'
  },
  modalTitle: { fontSize: '16px', fontWeight: '700', margin: '0', color: '#1a1a18' },
  btnCerrar: {
    background: 'none', border: 'none',
    fontSize: '16px', cursor: 'pointer', color: '#888'
  },
  modalForm: { display: 'flex', flexDirection: 'column', gap: '14px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: {
    fontSize: '11px', fontWeight: '600', color: '#555',
    textTransform: 'uppercase', letterSpacing: '0.04em'
  },
  input: {
    background: '#f8f9fa', border: '1px solid #e0e0e0',
    borderRadius: '8px', padding: '10px 13px',
    fontSize: '13px', outline: 'none'
  },
  infoBox: {
    background: '#f8f9fa', borderRadius: '8px',
    padding: '10px 12px', border: '1px solid #e8e8e8'
  },
  infoText: { fontSize: '12px', color: '#666', margin: '0', lineHeight: '1.5' },
  errorMsg: {
    background: '#FFEBEE', color: '#C62828',
    padding: '10px 12px', borderRadius: '8px',
    fontSize: '12px', margin: '0'
  },
  modalFooter: {
    display: 'flex', justifyContent: 'flex-end',
    gap: '10px', marginTop: '4px'
  }
}

export default UsuariosPage