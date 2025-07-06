"use client"

import { useState, useEffect } from "react"
import apiService from "../services/api.js"
import authService from "../services/auth.js"
import LoadingSpinner from "./LoadingSpinner.jsx"
import Modal from "./Modal.jsx"
import ConfirmDialog from "./ConfirmDialog.jsx"
import ImageUpload from "./ImageUpload.jsx"
import "../styles/AdminPanel.css"

const TalleresPage = () => {
  const [talleres, setTalleres] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingTaller, setEditingTaller] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [tallerToDelete, setTallerToDelete] = useState(null)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    imagen: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadTalleres()
  }, [])

  const filteredTalleres = talleres.filter(
    (taller) =>
      taller.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      taller.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const loadTalleres = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await apiService.getTalleres()
      if (response && response.datos) {
        setTalleres(response.datos)
      }
    } catch (error) {
      console.error("Error cargando talleres:", error)
      setError("Error al cargar los talleres")

      // Si es error de autenticación, no hacer nada aquí
      // El apiService ya maneja la redirección
      if (error.message?.includes("401") || error.message?.includes("token")) {
        return
      }
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio"
    }

    if (!formData.descripcion.trim()) {
      errors.descripcion = "La descripción es obligatoria"
    }

    if (!formData.fechaInicio) {
      errors.fechaInicio = "La fecha de inicio es obligatoria"
    }

    if (!formData.fechaFin) {
      errors.fechaFin = "La fecha de fin es obligatoria"
    }

    if (formData.fechaInicio && formData.fechaFin && new Date(formData.fechaInicio) >= new Date(formData.fechaFin)) {
      errors.fechaFin = "La fecha de fin debe ser posterior a la fecha de inicio"
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

    // Limpiar error general
    if (error) {
      setError("")
    }
  }

  const handleImageUpload = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      imagen: imageUrl,
    }))
  }

  const openCreateModal = () => {
    setEditingTaller(null)
    setFormData({
      nombre: "",
      descripcion: "",
      fechaInicio: "",
      fechaFin: "",
      imagen: "",
    })
    setFormErrors({})
    setError("")
    setShowModal(true)
  }

  const openEditModal = (taller) => {
    setEditingTaller(taller)

    // Formatear fechas correctamente para el input date
    const formatDateForInput = (dateString) => {
      if (!dateString) return ""
      try {
        const date = new Date(dateString)
        return date.toISOString().split("T")[0]
      } catch (error) {
        console.error("Error formateando fecha:", error)
        return ""
      }
    }

    setFormData({
      nombre: taller.nombre || "",
      descripcion: taller.descripcion || "",
      fechaInicio: formatDateForInput(taller.fechaInicio),
      fechaFin: formatDateForInput(taller.fechaFin),
      imagen: taller.imagen || "",
    })
    setFormErrors({})
    setError("")
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    setError("")

    try {
      // Verificar que el usuario sigue autenticado
      if (!authService.isAuthenticated()) {
        setError("Sesión expirada. Por favor, inicia sesión nuevamente.")
        setSubmitting(false)
        return
      }

      // Formatear las fechas para el backend (ISO string con hora)
      const formatDateForBackend = (dateString) => {
        if (!dateString) return null
        try {
          // Crear fecha con hora 00:00:00 en zona local
          const date = new Date(dateString + "T00:00:00")
          return date.toISOString()
        } catch (error) {
          console.error("Error formateando fecha para backend:", error)
          return null
        }
      }

      const tallerData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        fechaInicio: formatDateForBackend(formData.fechaInicio),
        fechaFin: formatDateForBackend(formData.fechaFin),
        imagen: formData.imagen || null,
      }

      console.log("Enviando datos del taller:", tallerData)

      let response
      if (editingTaller) {
        response = await apiService.updateTaller(editingTaller.id, tallerData)
      } else {
        response = await apiService.createTaller(tallerData)
      }

      console.log("Respuesta del servidor:", response)

      if (response && (response.tipo === "SUCCESS" || response.datos)) {
        setShowModal(false)
        await loadTalleres()
        setError("")
      } else {
        setError(response?.mensaje || "Error al guardar el taller")
      }
    } catch (error) {
      console.error("Error guardando taller:", error)

      // Manejar diferentes tipos de errores
      if (error.message?.includes("401") || error.message?.includes("token")) {
        setError("Sesión expirada. Serás redirigido al login.")
        // El apiService ya maneja la redirección
      } else if (error.message?.includes("400")) {
        setError("Datos inválidos. Verifica la información ingresada.")
      } else if (error.message?.includes("409")) {
        setError("Ya existe un taller con ese nombre.")
      } else {
        setError("Error al guardar el taller. Intenta nuevamente.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = (taller) => {
    setTallerToDelete(taller)
    setShowConfirmDialog(true)
  }

  const confirmDelete = async () => {
    if (!tallerToDelete) return

    try {
      setError("")

      if (!authService.isAuthenticated()) {
        setError("Sesión expirada. Por favor, inicia sesión nuevamente.")
        return
      }

      await apiService.deleteTaller(tallerToDelete.id)
      setShowConfirmDialog(false)
      setTallerToDelete(null)
      await loadTalleres()
    } catch (error) {
      console.error("Error eliminando taller:", error)
      setError("Error al eliminar el taller")
    }
  }

  const toggleStatus = async (taller) => {
    try {
      setError("")

      if (!authService.isAuthenticated()) {
        setError("Sesión expirada. Por favor, inicia sesión nuevamente.")
        return
      }

      await apiService.toggleTallerStatus(taller.id, !taller.status)
      await loadTalleres()
    } catch (error) {
      console.error("Error cambiando estado:", error)
      setError("Error al cambiar el estado del taller")
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "No definida"
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      console.error("Error formateando fecha:", error)
      return "Fecha inválida"
    }
  }

  const getDateStatus = (fechaInicio, fechaFin) => {
    try {
      const now = new Date()
      const inicio = new Date(fechaInicio)
      const fin = new Date(fechaFin)

      if (now < inicio) {
        return { status: "upcoming", text: "Próximo", class: "status-upcoming" }
      } else if (now >= inicio && now <= fin) {
        return { status: "active", text: "En curso", class: "status-active" }
      } else {
        return { status: "finished", text: "Finalizado", class: "status-finished" }
      }
    } catch (error) {
      console.error("Error calculando estado de fecha:", error)
      return { status: "unknown", text: "Desconocido", class: "status-finished" }
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Gestión de Talleres</h1>
          <p>Administra los talleres y eventos del café</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <span className="btn-icon">🎓</span>
          Nuevo Taller
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError("")} className="error-close">
            ✕
          </button>
        </div>
      )}

      <div className="admin-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar talleres por nombre o descripción..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="results-info">
          <span className="results-count">
            {filteredTalleres.length} taller{filteredTalleres.length !== 1 ? "es" : ""} encontrado
            {filteredTalleres.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="admin-content">
        {filteredTalleres.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎓</div>
            <h3>No se encontraron talleres</h3>
            <p>{searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer taller"}</p>
            {!searchTerm && (
              <button className="btn-primary" onClick={openCreateModal}>
                <span className="btn-icon">🎓</span>
                Crear Primer Taller
              </button>
            )}
          </div>
        ) : (
          <div className="admin-table-container">
            <div className="hidden-columns-indicator">📱 Algunas columnas están ocultas en pantallas pequeñas</div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Taller</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Estado del Taller</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTalleres.map((taller) => {
                  const dateStatus = getDateStatus(taller.fechaInicio, taller.fechaFin)
                  return (
                    <tr key={taller.id}>
                      <td>
                        <div className="product-image-container">
                          <img
                            src={taller.imagen || "/placeholder.svg?height=50&width=50"}
                            alt={taller.nombre}
                            className="product-image"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg?height=50&width=50"
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="product-info">
                          <strong className="product-name">{taller.nombre}</strong>
                          <p className="product-description">{taller.descripcion}</p>
                        </div>
                      </td>
                      <td>
                        <span className="date-text">{formatDate(taller.fechaInicio)}</span>
                      </td>
                      <td>
                        <span className="date-text">{formatDate(taller.fechaFin)}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${dateStatus.class}`}>{dateStatus.text}</span>
                      </td>
                      <td>
                        <label className="status-switch">
                          <input
                            type="checkbox"
                            checked={taller.status || false}
                            onChange={() => toggleStatus(taller)}
                          />
                          <span className="switch-slider"></span>
                        </label>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-action btn-edit"
                            onClick={() => openEditModal(taller)}
                            title="Editar taller"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-action btn-delete"
                            onClick={() => handleDelete(taller)}
                            title="Eliminar taller"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para crear/editar */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setError("")
        }}
        title={editingTaller ? "Editar Taller" : "Nuevo Taller"}
        size="large"
      >
        <form onSubmit={handleSubmit} className="admin-form">
          {error && (
            <div className="form-error">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="nombre">Nombre del Taller *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className={formErrors.nombre ? "error" : ""}
              placeholder="Ej: Taller de Barismo Avanzado"
              disabled={submitting}
            />
            {formErrors.nombre && <span className="error-text">{formErrors.nombre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción del Taller *</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className={formErrors.descripcion ? "error" : ""}
              placeholder="Describe el contenido, objetivos y beneficios del taller..."
              rows="4"
              disabled={submitting}
            />
            {formErrors.descripcion && <span className="error-text">{formErrors.descripcion}</span>}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="fechaInicio">Fecha de Inicio *</label>
              <input
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleInputChange}
                className={formErrors.fechaInicio ? "error" : ""}
                disabled={submitting}
              />
              {formErrors.fechaInicio && <span className="error-text">{formErrors.fechaInicio}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="fechaFin">Fecha de Fin *</label>
              <input
                type="date"
                id="fechaFin"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleInputChange}
                className={formErrors.fechaFin ? "error" : ""}
                disabled={submitting}
              />
              {formErrors.fechaFin && <span className="error-text">{formErrors.fechaFin}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Imagen del Taller</label>
            <ImageUpload
              currentImage={formData.imagen}
              onImageUpload={handleImageUpload}
              folder="talleres"
              disabled={submitting}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setShowModal(false)
                setError("")
              }}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="btn-spinner"></span>
                  {editingTaller ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                <>
                  <span className="btn-icon">{editingTaller ? "💾" : "🎓"}</span>
                  {editingTaller ? "Actualizar Taller" : "Crear Taller"}
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
        title="Eliminar Taller"
        message={`¿Estás seguro de que deseas eliminar "${tallerToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}

export default TalleresPage
