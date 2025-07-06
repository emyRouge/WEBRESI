"use client"

import { useState, useEffect } from "react"
import apiService from "../services/api.js"
import LoadingSpinner from "./LoadingSpinner.jsx"
import Modal from "./Modal.jsx"
import ConfirmDialog from "./ConfirmDialog.jsx"
import ImageUpload from "./ImageUpload.jsx"
import "../styles/AdminPanel.css"

const PublicacionesPage = () => {
  const [publicaciones, setPublicaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingPublicacion, setEditingPublicacion] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [publicacionToDelete, setPublicacionToDelete] = useState(null)
  const [formData, setFormData] = useState({
    titulo: "",
    contenido: "",
    imagen: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadPublicaciones()
  }, [])

  const filteredPublicaciones = publicaciones.filter(
    (publicacion) =>
      publicacion.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      publicacion.contenido?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const loadPublicaciones = async () => {
    try {
      setLoading(true)
      const response = await apiService.getPublicaciones()
      if (response && response.datos) {
        setPublicaciones(response.datos)
      }
    } catch (error) {
      console.error("Error cargando publicaciones:", error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.titulo.trim()) {
      errors.titulo = "El título es obligatorio"
    }

    if (!formData.contenido.trim()) {
      errors.contenido = "El contenido es obligatorio"
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
      imagen: imageUrl,
    }))
  }

  const openCreateModal = () => {
    setEditingPublicacion(null)
    setFormData({
      titulo: "",
      contenido: "",
      imagen: "",
    })
    setFormErrors({})
    setShowModal(true)
  }

  const openEditModal = (publicacion) => {
    setEditingPublicacion(publicacion)
    setFormData({
      titulo: publicacion.titulo || "",
      contenido: publicacion.contenido || "",
      imagen: publicacion.imagen || "",
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
      if (editingPublicacion) {
        await apiService.updatePublicacion(editingPublicacion.id, formData)
      } else {
        await apiService.createPublicacion(formData)
      }

      setShowModal(false)
      loadPublicaciones()
    } catch (error) {
      console.error("Error guardando publicación:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = (publicacion) => {
    setPublicacionToDelete(publicacion)
    setShowConfirmDialog(true)
  }

  const confirmDelete = async () => {
    if (!publicacionToDelete) return

    try {
      await apiService.deletePublicacion(publicacionToDelete.id)
      setShowConfirmDialog(false)
      setPublicacionToDelete(null)
      loadPublicaciones()
    } catch (error) {
      console.error("Error eliminando publicación:", error)
    }
  }

  const toggleStatus = async (publicacion) => {
    try {
      await apiService.togglePublicacionStatus(publicacion.id, !publicacion.status)
      loadPublicaciones()
    } catch (error) {
      console.error("Error cambiando estado:", error)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "No definida"
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const truncateText = (text, maxLength = 100) => {
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
          <h1>Gestión de Publicaciones</h1>
          <p>Administra las publicaciones y noticias del blog</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <span className="btn-icon">📝</span>
          Nueva Publicación
        </button>
      </div>

      <div className="admin-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar publicaciones por título o contenido..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="results-info">
          <span className="results-count">
            {filteredPublicaciones.length} publicación{filteredPublicaciones.length !== 1 ? "es" : ""} encontrada
            {filteredPublicaciones.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="admin-content">
        {filteredPublicaciones.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No se encontraron publicaciones</h3>
            <p>{searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primera publicación"}</p>
            {!searchTerm && (
              <button className="btn-primary" onClick={openCreateModal}>
                <span className="btn-icon">📝</span>
                Crear Primera Publicación
              </button>
            )}
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Publicación</th>
                  <th>Fecha Publicación</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPublicaciones.map((publicacion) => (
                  <tr key={publicacion.id}>
                    <td>
                      <div className="product-image-container">
                        <img
                          src={publicacion.imagen || "/placeholder.svg?height=50&width=50"}
                          alt={publicacion.titulo}
                          className="product-image"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=50&width=50"
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="product-info">
                        <strong className="product-name">{publicacion.titulo}</strong>
                        <p className="product-description">{truncateText(publicacion.contenido, 120)}</p>
                      </div>
                    </td>
                    <td>
                      <span className="date-text">{formatDate(publicacion.fechaPublicacion)}</span>
                    </td>
                    <td>
                      <label className="status-switch">
                        <input
                          type="checkbox"
                          checked={publicacion.status || false}
                          onChange={() => toggleStatus(publicacion)}
                        />
                        <span className="switch-slider"></span>
                      </label>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-edit"
                          onClick={() => openEditModal(publicacion)}
                          title="Editar publicación"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(publicacion)}
                          title="Eliminar publicación"
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
        title={editingPublicacion ? "Editar Publicación" : "Nueva Publicación"}
        size="large"
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="titulo">Título de la Publicación *</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              className={formErrors.titulo ? "error" : ""}
              placeholder="Ej: Nuevas técnicas de preparación de café"
            />
            {formErrors.titulo && <span className="error-text">{formErrors.titulo}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contenido">Contenido de la Publicación *</label>
            <textarea
              id="contenido"
              name="contenido"
              value={formData.contenido}
              onChange={handleInputChange}
              className={formErrors.contenido ? "error" : ""}
              placeholder="Escribe el contenido completo de la publicación..."
              rows="8"
            />
            {formErrors.contenido && <span className="error-text">{formErrors.contenido}</span>}
            <small className="form-hint">
              Caracteres: {formData.contenido.length} | Palabras: {formData.contenido.split(" ").length}
            </small>
          </div>

          <div className="form-group">
            <label>Imagen de la Publicación</label>
            <ImageUpload currentImage={formData.imagen} onImageUpload={handleImageUpload} folder="publicaciones" />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} disabled={submitting}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="btn-spinner"></span>
                  {editingPublicacion ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                <>
                  <span className="btn-icon">{editingPublicacion ? "💾" : "📝"}</span>
                  {editingPublicacion ? "Actualizar Publicación" : "Crear Publicación"}
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
        title="Eliminar Publicación"
        message={`¿Estás seguro de que deseas eliminar "${publicacionToDelete?.titulo}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}

export default PublicacionesPage
