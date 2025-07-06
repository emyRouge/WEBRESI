"use client"

import { useState, useEffect } from "react"
import apiService from "../services/api.js"
import LoadingSpinner from "./LoadingSpinner.jsx"
import Modal from "./Modal.jsx"
import ConfirmDialog from "./ConfirmDialog.jsx"
import "../styles/AdminPanel.css"

const CondicionesPage = () => {
  const [condiciones, setCondiciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingCondicion, setEditingCondicion] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [condicionToDelete, setCondicionToDelete] = useState(null)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadCondiciones()
  }, [])

  const filteredCondiciones = condiciones.filter(
    (condicion) =>
      condicion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      condicion.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const loadCondiciones = async () => {
    try {
      setLoading(true)
      const response = await apiService.getCondiciones()
      if (response && response.datos) {
        setCondiciones(response.datos)
      }
    } catch (error) {
      console.error("Error cargando condiciones:", error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio"
    }

    if (formData.nombre.trim().length < 3) {
      errors.nombre = "El nombre debe tener al menos 3 caracteres"
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
    setEditingCondicion(null)
    setFormData({
      nombre: "",
      descripcion: "",
    })
    setFormErrors({})
    setShowModal(true)
  }

  const openEditModal = (condicion) => {
    setEditingCondicion(condicion)
    setFormData({
      nombre: condicion.nombre || "",
      descripcion: condicion.descripcion || "",
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
      if (editingCondicion) {
        await apiService.updateCondicion(editingCondicion.id, formData)
      } else {
        await apiService.createCondicion(formData)
      }

      setShowModal(false)
      loadCondiciones()
    } catch (error) {
      console.error("Error guardando condición:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = (condicion) => {
    setCondicionToDelete(condicion)
    setShowConfirmDialog(true)
  }

  const confirmDelete = async () => {
    if (!condicionToDelete) return

    try {
      await apiService.deleteCondicion(condicionToDelete.id)
      setShowConfirmDialog(false)
      setCondicionToDelete(null)
      loadCondiciones()
    } catch (error) {
      console.error("Error eliminando condición:", error)
    }
  }

  const toggleStatus = async (condicion) => {
    try {
      await apiService.toggleCondicionStatus(condicion.id, !condicion.status)
      loadCondiciones()
    } catch (error) {
      console.error("Error cambiando estado:", error)
    }
  }

  const truncateText = (text, maxLength = 80) => {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Gestión de Condiciones</h1>
          <p>Administra las condiciones médicas y de accesibilidad</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <span className="btn-icon">🏥</span>
          Nueva Condición
        </button>
      </div>

      <div className="admin-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar condiciones por nombre o descripción..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="results-info">
          <span className="results-count">
            {filteredCondiciones.length} condición{filteredCondiciones.length !== 1 ? "es" : ""} encontrada
            {filteredCondiciones.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="admin-content">
        {filteredCondiciones.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏥</div>
            <h3>No se encontraron condiciones</h3>
            <p>{searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primera condición"}</p>
            {!searchTerm && (
              <button className="btn-primary" onClick={openCreateModal}>
                <span className="btn-icon">🏥</span>
                Crear Primera Condición
              </button>
            )}
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Condición</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCondiciones.map((condicion) => (
                  <tr key={condicion.id}>
                    <td>
                      <div className="product-info">
                        <strong className="product-name">{condicion.nombre}</strong>
                      </div>
                    </td>
                    <td>
                      <div className="condition-description">
                        {condicion.descripcion ? (
                          <span className="description-text" title={condicion.descripcion}>
                            {truncateText(condicion.descripcion)}
                          </span>
                        ) : (
                          <span className="no-description">Sin descripción</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <label className="status-switch">
                        <input
                          type="checkbox"
                          checked={condicion.status || false}
                          onChange={() => toggleStatus(condicion)}
                        />
                        <span className="switch-slider"></span>
                      </label>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-edit"
                          onClick={() => openEditModal(condicion)}
                          title="Editar condición"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(condicion)}
                          title="Eliminar condición"
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
        title={editingCondicion ? "Editar Condición" : "Nueva Condición"}
        size="medium"
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre de la Condición *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className={formErrors.nombre ? "error" : ""}
              placeholder="Ej: Sordera, Discapacidad visual, Autismo"
            />
            {formErrors.nombre && <span className="error-text">{formErrors.nombre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción de la Condición</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Describe las características, necesidades especiales o consideraciones importantes..."
              rows="4"
            />
            <small className="form-hint">
              Caracteres: {formData.descripcion.length} | Palabras: {formData.descripcion.split(" ").length}
            </small>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} disabled={submitting}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="btn-spinner"></span>
                  {editingCondicion ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                <>
                  <span className="btn-icon">{editingCondicion ? "💾" : "🏥"}</span>
                  {editingCondicion ? "Actualizar Condición" : "Crear Condición"}
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
        title="Eliminar Condición"
        message={`¿Estás seguro de que deseas eliminar "${condicionToDelete?.nombre}"? Esta acción no se puede deshacer y puede afectar a los meseros asociados.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}

export default CondicionesPage
