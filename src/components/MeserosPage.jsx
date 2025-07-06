"use client"

import { useState, useEffect } from "react"
import apiService from "../services/api.js"
import LoadingSpinner from "./LoadingSpinner.jsx"
import Modal from "./Modal.jsx"
import ConfirmDialog from "./ConfirmDialog.jsx"
import ImageUpload from "./ImageUpload.jsx"
import "../styles/AdminPanel.css"

const MeserosPage = () => {
  const [meseros, setMeseros] = useState([])
  const [condiciones, setCondiciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingMesero, setEditingMesero] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [meseroToDelete, setMeseroToDelete] = useState(null)
  const [formData, setFormData] = useState({
    nombre: "",
    presentacion: "",
    condicionId: "",
    edad: "",
    foto: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadMeseros()
    loadCondiciones()
  }, [])

  const filteredMeseros = meseros.filter(
    (mesero) =>
      mesero.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mesero.condicion?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mesero.presentacion?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const loadMeseros = async () => {
    try {
      setLoading(true)
      const response = await apiService.getMeseros()
      if (response && response.datos) {
        setMeseros(response.datos)
      }
    } catch (error) {
      console.error("Error cargando meseros:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadCondiciones = async () => {
    try {
      const response = await apiService.getCondiciones()
      if (response && response.datos) {
        setCondiciones(response.datos)
      }
    } catch (error) {
      console.error("Error cargando condiciones:", error)
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio"
    }

    if (!formData.edad || Number.parseInt(formData.edad) < 18 || Number.parseInt(formData.edad) > 100) {
      errors.edad = "La edad debe estar entre 18 y 100 años"
    }

    if (!formData.condicionId) {
      errors.condicionId = "La condición es obligatoria"
    }

    if (!formData.presentacion.trim()) {
      errors.presentacion = "La presentación es obligatoria"
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

  const handleImageUpload = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      foto: imageUrl,
    }))
  }

  const openCreateModal = () => {
    setEditingMesero(null)
    setFormData({
      nombre: "",
      presentacion: "",
      condicionId: "",
      edad: "",
      foto: "",
    })
    setFormErrors({})
    setShowModal(true)
  }

  const openEditModal = (mesero) => {
    setEditingMesero(mesero)
    setFormData({
      nombre: mesero.nombre || "",
      presentacion: mesero.presentacion || "",
      condicionId: mesero.condicion?.id?.toString() || "",
      edad: mesero.edad?.toString() || "",
      foto: mesero.foto || "",
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
      const meseroData = {
        ...formData,
        condicionId: Number.parseInt(formData.condicionId),
        edad: Number.parseInt(formData.edad),
      }

      if (editingMesero) {
        await apiService.updateMesero(editingMesero.id, meseroData)
      } else {
        await apiService.createMesero(meseroData)
      }

      setShowModal(false)
      loadMeseros()
    } catch (error) {
      console.error("Error guardando mesero:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = (mesero) => {
    setMeseroToDelete(mesero)
    setShowConfirmDialog(true)
  }

  const confirmDelete = async () => {
    if (!meseroToDelete) return

    try {
      await apiService.deleteMesero(meseroToDelete.id)
      setShowConfirmDialog(false)
      setMeseroToDelete(null)
      loadMeseros()
    } catch (error) {
      console.error("Error eliminando mesero:", error)
    }
  }

  const toggleStatus = async (mesero) => {
    try {
      await apiService.toggleMeseroStatus(mesero.id, !mesero.status)
      loadMeseros()
    } catch (error) {
      console.error("Error cambiando estado:", error)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Gestión de Meseros</h1>
          <p>Administra el equipo de meseros del café</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <span className="btn-icon">👨‍💼</span>
          Nuevo Mesero
        </button>
      </div>

      <div className="admin-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar meseros por nombre, condición o presentación..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="results-info">
          <span className="results-count">
            {filteredMeseros.length} mesero{filteredMeseros.length !== 1 ? "s" : ""} encontrado
            {filteredMeseros.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="admin-content">
        {filteredMeseros.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👨‍💼</div>
            <h3>No se encontraron meseros</h3>
            <p>{searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer mesero"}</p>
            {!searchTerm && (
              <button className="btn-primary" onClick={openCreateModal}>
                <span className="btn-icon">👨‍💼</span>
                Crear Primer Mesero
              </button>
            )}
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Mesero</th>
                  <th>Edad</th>
                  <th>Condición</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredMeseros.map((mesero) => (
                  <tr key={mesero.id}>
                    <td>
                      <div className="product-image-container">
                        <img
                          src={mesero.foto || "/placeholder.svg?height=50&width=50"}
                          alt={mesero.nombre}
                          className="product-image"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=50&width=50"
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="product-info">
                        <strong className="product-name">{mesero.nombre}</strong>
                        <p className="product-description">{mesero.presentacion}</p>
                      </div>
                    </td>
                    <td>
                      <span className="age-badge">{mesero.edad} años</span>
                    </td>
                    <td>
                      <span className="category-badge">{mesero.condicion?.nombre || "Sin condición"}</span>
                    </td>
                    <td>
                      <label className="status-switch">
                        <input type="checkbox" checked={mesero.status || false} onChange={() => toggleStatus(mesero)} />
                        <span className="switch-slider"></span>
                      </label>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-edit"
                          onClick={() => openEditModal(mesero)}
                          title="Editar mesero"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(mesero)}
                          title="Eliminar mesero"
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
        title={editingMesero ? "Editar Mesero" : "Nuevo Mesero"}
        size="large"
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nombre">Nombre del Mesero *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={formErrors.nombre ? "error" : ""}
                placeholder="Ej: Juan Pérez"
              />
              {formErrors.nombre && <span className="error-text">{formErrors.nombre}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="edad">Edad *</label>
              <input
                type="number"
                id="edad"
                name="edad"
                value={formData.edad}
                onChange={handleInputChange}
                className={formErrors.edad ? "error" : ""}
                placeholder="25"
                min="18"
                max="100"
              />
              {formErrors.edad && <span className="error-text">{formErrors.edad}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="condicionId">Condición *</label>
              <select
                id="condicionId"
                name="condicionId"
                value={formData.condicionId}
                onChange={handleInputChange}
                className={formErrors.condicionId ? "error" : ""}
              >
                <option value="">Seleccionar condición</option>
                {condiciones.map((condicion) => (
                  <option key={condicion.id} value={condicion.id}>
                    {condicion.nombre}
                  </option>
                ))}
              </select>
              {formErrors.condicionId && <span className="error-text">{formErrors.condicionId}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="presentacion">Presentación del Mesero *</label>
            <textarea
              id="presentacion"
              name="presentacion"
              value={formData.presentacion}
              onChange={handleInputChange}
              className={formErrors.presentacion ? "error" : ""}
              placeholder="Describe la experiencia, habilidades y personalidad del mesero..."
              rows="4"
            />
            {formErrors.presentacion && <span className="error-text">{formErrors.presentacion}</span>}
          </div>

          <div className="form-group">
            <label>Foto del Mesero</label>
            <ImageUpload currentImage={formData.foto} onImageUpload={handleImageUpload} folder="meseros" />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} disabled={submitting}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="btn-spinner"></span>
                  {editingMesero ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                <>
                  <span className="btn-icon">{editingMesero ? "💾" : "👨‍💼"}</span>
                  {editingMesero ? "Actualizar Mesero" : "Crear Mesero"}
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
        title="Eliminar Mesero"
        message={`¿Estás seguro de que deseas eliminar a "${meseroToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}

export default MeserosPage
