import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
// Cambia el import
import {
  getHerramientas,
  getDisponibles,
  createHerramienta,
  updateHerramienta,
  deleteHerramienta
} from '../services/herramientaService'

// Agrega useAuth al import
import { useAuth } from '../context/AuthContext'

const initialForm = {
  nombre: "",
  tipo: "",
  descripcion: "",
  cantidadTotal: "",
};

function HerramientasPage() {
  const [herramientas, setHerramientas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const isAdmin = user?.rol === "ADMIN";

  const cargar = async () => {
    try {
      // Admin ve todas, empleado solo las disponibles
      const data = isAdmin
        ? await getHerramientas()
        : await getDisponibles()
      setHerramientas(data)
    } catch { } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  const abrirCrear = () => {
    setEditando(null);
    setForm(initialForm);
    setError("");
    setShowModal(true);
  };

  const abrirEditar = (h) => {
    setEditando(h);
    setForm({
      nombre: h.nombre,
      tipo: h.tipo,
      descripcion: h.descripcion || "",
      cantidadTotal: h.cantidadTotal,
    });
    setError("");
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditando(null);
    setForm(initialForm);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editando) {
        await updateHerramienta(editando.id, form);
      } else {
        await createHerramienta(form);
      }
      cerrarModal();
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || "Error al guardar herramienta");
    }
  };

  const handleEliminar = async (h) => {
    if (
      !window.confirm(
        `¿Eliminar "${h.nombre}"? Esta acción no se puede deshacer.`,
      )
    )
      return;
    try {
      await deleteHerramienta(h.id);
      cargar();
    } catch (err) {
      alert(
        err.response?.data?.error || "No se puede eliminar esta herramienta",
      );
    }
  };

  const herramientasFiltradas = herramientas.filter((h) => {
    const matchBusqueda =
      h.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      h.tipo.toLowerCase().includes(busqueda.toLowerCase());
    const matchEstado = filtroEstado === "TODOS" || h.estado === filtroEstado;
    return matchBusqueda && matchEstado;
  });

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        {/* Header */}
        <div style={styles.pageHeader}>
          <div>
            <h2 style={styles.pageTitle}>Gestión de herramientas</h2>
            <p style={styles.pageSubtitle}>
              {herramientas.length} herramientas registradas
            </p>
          </div>
          {isAdmin && (
            <button onClick={abrirCrear} style={styles.btnPrimary}>
              + Nueva herramienta
            </button>
          )}
        </div>

        {/* Filtros */}
        <div style={styles.filtros}>
          <input
            placeholder="Buscar por nombre o tipo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={styles.select}
          >
            <option value="TODOS">Todos los estados</option>
            <option value="DISPONIBLE">Disponible</option>
            <option value="AGOTADA">Agotada</option>
          </select>
        </div>

        {/* Tabla */}
        <div style={styles.tableCard}>
          {loading ? (
            <div style={styles.empty}>Cargando...</div>
          ) : herramientasFiltradas.length === 0 ? (
            <div style={styles.empty}>No se encontraron herramientas</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Herramienta</th>
                  <th style={styles.th}>Tipo</th>
                  <th style={{ ...styles.th, textAlign: "center" }}>Total</th>
                  <th
                    style={{
                      ...styles.th,
                      textAlign: "center",
                      color: "#1D9E75",
                    }}
                  >
                    Disponibles
                  </th>
                  <th
                    style={{
                      ...styles.th,
                      textAlign: "center",
                      color: "#BA7517",
                    }}
                  >
                    Prestadas
                  </th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {herramientasFiltradas.map((h) => (
                  <tr key={h.id} style={styles.tr}>
                    <td style={styles.td}>
                      <p style={styles.toolName}>{h.nombre}</p>
                      {h.descripcion && (
                        <p style={styles.toolDesc}>{h.descripcion}</p>
                      )}
                    </td>
                    <td style={styles.td}>{h.tipo}</td>
                    <td
                      style={{
                        ...styles.td,
                        textAlign: "center",
                        fontWeight: "600",
                      }}
                    >
                      {h.cantidadTotal}
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        textAlign: "center",
                        fontWeight: "700",
                        color: "#1D9E75",
                      }}
                    >
                      {h.cantidadDisponible}
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        textAlign: "center",
                        fontWeight: "700",
                        color: "#BA7517",
                      }}
                    >
                      {h.cantidadPrestada}
                    </td>
                    <td style={styles.td}>
                      <span
                        style={
                          h.estado === "DISPONIBLE"
                            ? styles.badgeDisponible
                            : styles.badgeAgotada
                        }
                      >
                        {h.estado === "DISPONIBLE" ? "Disponible" : "Agotada"}
                      </span>
                    </td>
                    {isAdmin && (
                      <td style={styles.td}>
                        <div style={styles.acciones}>
                          <button
                            onClick={() => abrirEditar(h)}
                            style={styles.btnEditar}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleEliminar(h)}
                            style={
                              h.cantidadPrestada > 0
                                ? styles.btnEliminarDisabled
                                : styles.btnEliminar
                            }
                            disabled={h.cantidadPrestada > 0}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div style={styles.overlay}>
            <div style={styles.modal}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>
                  {editando ? "Editar herramienta" : "Nueva herramienta"}
                </h3>
                <button onClick={cerrarModal} style={styles.btnCerrar}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} style={styles.modalForm}>
                <div style={styles.field}>
                  <label style={styles.label}>Nombre</label>
                  <input
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({ ...form, nombre: e.target.value })
                    }
                    style={styles.input}
                    placeholder="Ej: Taladro Bosch 800W"
                    required
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Tipo</label>
                  <input
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    style={styles.input}
                    placeholder="Ej: Eléctrica, Neumática, Medición"
                    required
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Descripción</label>
                  <textarea
                    value={form.descripcion}
                    onChange={(e) =>
                      setForm({ ...form, descripcion: e.target.value })
                    }
                    style={{
                      ...styles.input,
                      minHeight: "70px",
                      resize: "vertical",
                    }}
                    placeholder="Descripción opcional..."
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Cantidad total</label>
                  <input
                    type="number"
                    min="1"
                    value={form.cantidadTotal}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        cantidadTotal: parseInt(e.target.value),
                      })
                    }
                    style={styles.input}
                    placeholder="Ej: 5"
                    required
                  />
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
                    {editando ? "Guardar cambios" : "Crear herramienta"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  page: { padding: "24px", maxWidth: "1200px", margin: "0 auto" },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  pageTitle: {
    fontSize: "20px",
    fontWeight: "700",
    margin: "0",
    color: "#1a1a18",
  },
  pageSubtitle: { fontSize: "13px", color: "#888", margin: "4px 0 0" },
  filtros: { display: "flex", gap: "10px", marginBottom: "14px" },
  searchInput: {
    flex: 1,
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "9px 13px",
    fontSize: "13px",
    outline: "none",
  },
  select: {
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "9px 13px",
    fontSize: "13px",
    outline: "none",
    minWidth: "160px",
  },
  tableCard: {
    background: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  thead: { background: "#f8f9fa" },
  th: {
    textAlign: "left",
    padding: "10px 16px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#666",
  },
  tr: { borderTop: "1px solid #f5f5f5" },
  td: { padding: "12px 16px", color: "#444", verticalAlign: "middle" },
  toolName: { fontWeight: "600", margin: "0", color: "#1a1a18" },
  toolDesc: { fontSize: "11px", color: "#aaa", margin: "2px 0 0" },
  badgeDisponible: {
    background: "#E8F5E9",
    color: "#2E7D32",
    fontSize: "10px",
    padding: "3px 8px",
    borderRadius: "20px",
    fontWeight: "600",
  },
  badgeAgotada: {
    background: "#FFEBEE",
    color: "#C62828",
    fontSize: "10px",
    padding: "3px 8px",
    borderRadius: "20px",
    fontWeight: "600",
  },
  acciones: { display: "flex", gap: "8px" },
  btnEditar: {
    background: "transparent",
    border: "1px solid #185FA5",
    color: "#185FA5",
    borderRadius: "6px",
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
  },
  btnEliminar: {
    background: "transparent",
    border: "1px solid #C62828",
    color: "#C62828",
    borderRadius: "6px",
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
  },
  btnEliminarDisabled: {
    background: "transparent",
    border: "1px solid #ddd",
    color: "#ccc",
    borderRadius: "6px",
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "not-allowed",
  },
  empty: {
    padding: "40px",
    textAlign: "center",
    color: "#aaa",
    fontSize: "13px",
  },
  btnPrimary: {
    background: "#1D9E75",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "9px 16px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  btnSecondary: {
    background: "#fff",
    color: "#666",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "9px 16px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
  },
  modal: {
    background: "#fff",
    borderRadius: "14px",
    width: "100%",
    maxWidth: "460px",
    padding: "24px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  modalTitle: {
    fontSize: "16px",
    fontWeight: "700",
    margin: "0",
    color: "#1a1a18",
  },
  btnCerrar: {
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    color: "#888",
  },
  modalForm: { display: "flex", flexDirection: "column", gap: "14px" },
  field: { display: "flex", flexDirection: "column", gap: "5px" },
  label: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  input: {
    background: "#f8f9fa",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "10px 13px",
    fontSize: "13px",
    outline: "none",
  },
  errorMsg: {
    background: "#FFEBEE",
    color: "#C62828",
    padding: "10px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    margin: "0",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "4px",
  },
};

export default HerramientasPage;
