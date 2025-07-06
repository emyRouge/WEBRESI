"use client"

import { useState, useEffect } from "react"
import apiService from "../services/api.js"
import authService from "../services/auth.js"
import LoadingSpinner from "./LoadingSpinner.jsx"
import Modal from "./Modal.jsx"
import ConfirmDialog from "./ConfirmDialog.jsx"
import "../styles/AdminPanel.css"

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [usuarioToDelete, setUsuarioToDelete] = useState(null)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    numeroEmpleado: "",
    area: "",
    rolId: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const areas = [
    "Administración",
    "Cocina",
    "Servicio al cliente",
    "Barismo",
    "Limpieza",
    "Seguridad",
    "Recursos Humanos",
    "Contabilidad",
    "Marketing",
    "Mantenimiento",
  ]

  useEffect(() => {
    if (authService.isAdmin()) {
      loadUsuarios()
      loadRoles()
    }
  }, [])

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.numeroEmpleado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.area?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const loadUsuarios = async () => {
    try {
      setLoading(true)
      const response = await apiService.getUsuarios()
      if (response && response.datos) {
        setUsuarios(response.datos)
      }
    } catch (error) {
      console.error("Error cargando usuarios:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadRoles = async () => {
    try {
      const response = await apiService.getRoles()
      if (response && response.datos) {
        setRoles(response.datos)
      } else {
        // Si no hay endpoint de roles, usar valores por defecto
        setRoles([
          { id: 1, nombre: "ADMIN" },
          { id: 2, nombre: "EMPLEADO" },
        ])
      }
    } catch (error) {
      console.error("Error cargando roles:", error)
      // Usar valores por defecto si falla
      setRoles([
        { id: 1, nombre: "ADMIN" },
        { id: 2, nombre: "EMPLEADO" },
      ])
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio"
    }

    if (!formData.apellido.trim()) {
      errors.apellido = "El apellido es obligatorio"
    }

    if (!formData.email.trim()) {
      errors.email = "El email es obligatorio"
    } else {
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        errors.email = "Debe ser un email válido"
      }
    }

    if (!editingUsuario && !formData.password.trim()) {
      errors.password = "La contraseña es obligatoria"
    } else if (formData.password && formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    if (!formData.numeroEmpleado.trim()) {
      errors.numeroEmpleado = "El número de empleado es obligatorio"
    }

    if (!formData.rolId) {
      errors.rolId = "El rol es obligatorio"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const openCreateModal = () => {
    setEditingUsuario(null)
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      numeroEmpleado: "",
      area: "",
      rolId: "",
    })
    setFormErrors({})
    setShowModal(true)
  }

  const openEditModal = (usuario) => {
    setEditingUsuario(usuario)
    setFormData({
      nombre: usuario.nombre || "",
      apellido: usuario.apellido || "",
      email: usuario.email || "",
      password: "", // No mostrar contraseña actual
      numeroEmpleado: usuario.numeroEmpleado || "",
      area: usuario.area || "",
      rolId: usuario.rol?.id?.toString() || "",
    })
    setFormErrors({})
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      const usuarioData = {
        ...formData,
        rolId: Number.parseInt(formData.rolId),
      }

      if (editingUsuario) {
        // Si no se cambió la contraseña, no enviarla
        if (!formData.password) {
          delete usuarioData.password
        }
        await apiService.updateUsuario(editingUsuario.id, usuarioData)
      } else {
        await apiService.createUsuario(usuarioData)
      }

      setShowModal(false)
      loadUsuarios()
    } catch (error) {
      console.error("Error guardando usuario:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = (usuario) => {
    setUsuarioToDelete(usuario)
    setShowConfirmDialog(true)
  }

  const confirmDelete = async () => {
    if (!usuarioToDelete) return

    try {
      await apiService.deleteUsuario(usuarioToDelete.id)
      setShowConfirmDialog(false)
      setUsuarioToDelete(null)
      loadUsuarios()
    } catch (error) {
      console.error("Error eliminando usuario:", error)
    }
  }

  const toggleStatus = async (usuario) => {
    try {
      await apiService.toggleUsuarioStatus(usuario.id, !usuario.status)
      loadUsuarios()
    } catch (error) {
      console.error("Error cambiando estado:", error)
    }
  }

  const getRoleBadgeClass = (roleName) => {
    switch (roleName?.toUpperCase()) {
      case "ADMIN":
        return "role-admin"
      case "EMPLEADO":
        return "role-employee"
      default:
        return "role-default"
    }
  }

  if (!authService.isAdmin()) {
    return (
      <div className="admin-page">
        <div className="empty-state">
          <div className="empty-icon">🔒</div>
          <h3>Acceso Denegado</h3>
          <p>Solo los administradores pueden acceder a esta sección.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Gestión de Usuarios</h1>
          <p>Administra los usuarios y empleados del sistema</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <span className="btn-icon">👤</span>
          Nuevo Usuario
        </button>
      </div>

      <div className="admin-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar usuarios por nombre, email, número de empleado o área..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="results-info">
          <span className="results-count">
            {filteredUsuarios.length} usuario{filteredUsuarios.length !== 1 ? "s" : ""} encontrado
            {filteredUsuarios.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="admin-content">
        {filteredUsuarios.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <h3>No se encontraron usuarios</h3>
            <p>{searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer usuario"}</p>
            {!searchTerm && (
              <button className="btn-primary" onClick={openCreateModal}>
                <span className="btn-icon">👤</span>
                Crear Primer Usuario
              </button>
            )}
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>No. Empleado</th>
                  <th>Área</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>
                      <div className="product-info">
                        <strong className="product-name">
                          {usuario.nombre} {usuario.apellido}
                        </strong>
                        <p className="user-employee-number">#{usuario.numeroEmpleado}</p>
                      </div>
                    </td>
                    <td>
                      <span className="user-email">{usuario.email}</span>
                    </td>
                    <td>
                      <span className="employee-number">{usuario.numeroEmpleado}</span>
                    </td>
                    <td>
                      <span className="user-area">{usuario.area || "Sin área"}</span>
                    </td>
                    <td>
                      <span className={`role-badge ${getRoleBadgeClass(usuario.rol?.nombre)}`}>
                        {usuario.rol?.nombre || "Sin rol"}
                      </span>
                    </td>
                    <td>
                      <label className="status-switch">
                        <input
                          type="checkbox"
                          checked={usuario.status || false}
                          onChange={() => toggleStatus(usuario)}
                        />
                        <span className="switch-slider"></span>
                      </label>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-edit"
                          onClick={() => openEditModal(usuario)}
                          title="Editar usuario"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(usuario)}
                          title="Eliminar usuario"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para crear/editar */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingUsuario ? "Editar Usuario" : "Nuevo Usuario"}
        size="large"
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={formErrors.nombre ? "error" : ""}
                placeholder="Juan"
              />
              {formErrors.nombre && <span className="error-text">{formErrors.nombre}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="apellido">Apellido *</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                className={formErrors.apellido ? "error" : ""}
                placeholder="Pérez"
              />
              {formErrors.apellido && <span className="error-text">{formErrors.apellido}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={formErrors.email ? "error" : ""}
                placeholder="juan.perez@ejemplo.com"
              />
              {formErrors.email && <span className="error-text">{formErrors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="numeroEmpleado">Número de Empleado *</label>
              <input
                type="text"
                id="numeroEmpleado"
                name="numeroEmpleado"
                value={formData.numeroEmpleado}
                onChange={handleInputChange}
                className={formErrors.numeroEmpleado ? "error" : ""}
                placeholder="EMP001"
              />
              {formErrors.numeroEmpleado && <span className="error-text">{formErrors.numeroEmpleado}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="area">Área de Trabajo</label>
              <select id="area" name="area" value={formData.area} onChange={handleInputChange}>
                <option value="">Seleccionar área</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="rolId">Rol *</label>
              <select
                id="rolId"
                name="rolId"
                value={formData.rolId}
                onChange={handleInputChange}
                className={formErrors.rolId ? "error" : ""}
              >
                <option value="">Seleccionar rol</option>
                {roles.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
              {formErrors.rolId && <span className="error-text">{formErrors.rolId}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña {editingUsuario ? "(dejar vacío para no cambiar)" : "*"}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={formErrors.password ? "error" : ""}
              placeholder={editingUsuario ? "Nueva contraseña (opcional)" : "Contraseña"}
            />
            {formErrors.password && <span className="error-text">{formErrors.password}</span>}
            <small className="form-hint">La contraseña debe tener al menos 6 caracteres</small>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} disabled={submitting}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="btn-spinner"></span>
                  {editingUsuario ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                <>
                  <span className="btn-icon">{editingUsuario ? "💾" : "👤"}</span>
                  {editingUsuario ? "Actualizar Usuario" : "Crear Usuario"}
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Dialog de confirmación */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmDelete}
        title="Eliminar Usuario"
        message={`¿Estás seguro de que deseas eliminar a "${usuarioToDelete?.nombre} ${usuarioToDelete?.apellido}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}

export default UsuariosPage
