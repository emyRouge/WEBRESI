"use client"
import { useState, useEffect, useRef } from "react"
import apiService from "../services/api.js"
import LoadingSpinner from "./LoadingSpinner.jsx"
import Modal from "./Modal.jsx"
import ConfirmDialog from "./ConfirmDialog.jsx"
import "../styles/AdminPanel.css"

const SenasPage = () => {
  const [senas, setSenas] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingSena, setEditingSena] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [senaToDelete, setSenaToDelete] = useState(null)
  const [formData, setFormData] = useState({
    nombre: "",
    video: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // ✅ NUEVOS ESTADOS para manejo de archivos
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [inputMethod, setInputMethod] = useState("url") // "url" o "file"
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadSenas()
  }, [])

  const filteredSenas = senas.filter((sena) => sena.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

  const loadSenas = async () => {
    try {
      setLoading(true)
      const response = await apiService.getSenas()
      if (response && response.datos) {
        setSenas(response.datos)
      }
    } catch (error) {
      console.error("Error cargando señas:", error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio"
    }

    // Validar según el método de entrada
    if (inputMethod === "url") {
      if (!formData.video.trim()) {
        errors.video = "La URL del video es obligatoria"
      } else {
        // Validar formato de URL
        try {
          new URL(formData.video)
        } catch {
          errors.video = "Debe ser una URL válida"
        }
      }
    } else if (inputMethod === "file") {
      if (!selectedFile && !formData.video) {
        errors.video = "Debe seleccionar un archivo o proporcionar una URL"
      }
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

  // ✅ NUEVO: Manejar selección de archivo
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = [
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/avi",
        "video/mov",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ]

      if (!allowedTypes.includes(file.type)) {
        alert("Tipo de archivo no permitido. Use videos (MP4, WebM, OGG, AVI, MOV) o imágenes (JPG, PNG, GIF, WebP)")
        return
      }

      // Validar tamaño (máximo 50MB)
      const maxSize = 50 * 1024 * 1024 // 50MB
      if (file.size > maxSize) {
        alert("El archivo es demasiado grande. Máximo 50MB permitido.")
        return
      }

      setSelectedFile(file)
      // Limpiar URL si hay archivo seleccionado
      setFormData((prev) => ({ ...prev, video: "" }))
      // Limpiar errores
      if (formErrors.video) {
        setFormErrors((prev) => ({ ...prev, video: "" }))
      }
    }
  }

  // ✅ NUEVO: Subir archivo
  const uploadFile = async () => {
    if (!selectedFile) return null

    try {
      setUploadingFile(true)
      setUploadProgress(0)

      // Simular progreso (ya que fetch no tiene progreso nativo)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await apiService.uploadFile(selectedFile, "senas")

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.success && response.fileUrl) {
        return response.fileUrl
      } else {
        throw new Error(response.error || "Error al subir archivo")
      }
    } catch (error) {
      console.error("Error subiendo archivo:", error)
      throw error
    } finally {
      setUploadingFile(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const openCreateModal = () => {
    setEditingSena(null)
    setFormData({
      nombre: "",
      video: "",
    })
    setFormErrors({})
    setSelectedFile(null)
    setInputMethod("url")
    setShowModal(true)
  }

  const openEditModal = (sena) => {
    setEditingSena(sena)
    setFormData({
      nombre: sena.nombre || "",
      video: sena.video || "",
    })
    setFormErrors({})
    setSelectedFile(null)
    setInputMethod("url")
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    try {
      let videoUrl = formData.video

      // Si hay archivo seleccionado, subirlo primero
      if (selectedFile) {
        videoUrl = await uploadFile()
      }

      const senaData = {
        ...formData,
        video: videoUrl,
      }

      if (editingSena) {
        await apiService.updateSena(editingSena.id, senaData)
      } else {
        await apiService.createSena(senaData)
      }

      setShowModal(false)
      loadSenas()
    } catch (error) {
      console.error("Error guardando seña:", error)
      alert("Error al guardar la seña: " + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = (sena) => {
    setSenaToDelete(sena)
    setShowConfirmDialog(true)
  }

  const confirmDelete = async () => {
    if (!senaToDelete) return
    try {
      await apiService.deleteSena(senaToDelete.id)
      setShowConfirmDialog(false)
      setSenaToDelete(null)
      loadSenas()
    } catch (error) {
      console.error("Error eliminando seña:", error)
    }
  }

  const toggleStatus = async (sena) => {
    try {
      await apiService.toggleSenaStatus(sena.id, !sena.status)
      loadSenas()
    } catch (error) {
      console.error("Error cambiando estado:", error)
    }
  }

  const getVideoPreview = (videoUrl) => {
    if (!videoUrl) return null
    // Detectar tipo de video
    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      return "📺 YouTube"
    } else if (videoUrl.includes("vimeo.com")) {
      return "🎬 Vimeo"
    } else if (videoUrl.includes(".mp4") || videoUrl.includes(".webm") || videoUrl.includes(".ogg")) {
      return "🎥 Video"
    } else if (
      videoUrl.includes(".jpg") ||
      videoUrl.includes(".jpeg") ||
      videoUrl.includes(".png") ||
      videoUrl.includes(".gif") ||
      videoUrl.includes(".webp")
    ) {
      return "🖼️ Imagen"
    } else {
      return "🔗 Enlace"
    }
  }

  // ✅ NUEVO: Obtener preview del archivo seleccionado
  const getFilePreview = () => {
    if (!selectedFile) return null

    if (selectedFile.type.startsWith("video/")) {
      return "🎥 " + selectedFile.name
    } else if (selectedFile.type.startsWith("image/")) {
      return "🖼️ " + selectedFile.name
    }
    return "📁 " + selectedFile.name
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Gestión de Señas</h1>
          <p>Administra las señas y videos educativos</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <span className="btn-icon">🤟</span>
          Nueva Seña
        </button>
      </div>

      <div className="admin-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar señas por nombre..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="results-info">
          <span className="results-count">
            {filteredSenas.length} seña{filteredSenas.length !== 1 ? "s" : ""} encontrada
            {filteredSenas.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="admin-content">
        {filteredSenas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🤟</div>
            <h3>No se encontraron señas</h3>
            <p>{searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primera seña"}</p>
            {!searchTerm && (
              <button className="btn-primary" onClick={openCreateModal}>
                <span className="btn-icon">🤟</span>
                Crear Primera Seña
              </button>
            )}
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Video</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredSenas.map((sena) => (
                  <tr key={sena.id}>
                    <td>
                      <div className="product-info">
                        <strong className="product-name">{sena.nombre}</strong>
                      </div>
                    </td>
                    <td>
                      {sena.video ? (
                        <div className="video-info">
                          <span className="video-type">{getVideoPreview(sena.video)}</span>
                          <a
                            href={sena.video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="video-link"
                            title="Ver video"
                          >
                            Ver video
                          </a>
                        </div>
                      ) : (
                        <span className="no-video">Sin video</span>
                      )}
                    </td>
                    <td>
                      <label className="status-switch">
                        <input type="checkbox" checked={sena.status || false} onChange={() => toggleStatus(sena)} />
                        <span className="switch-slider"></span>
                      </label>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-action btn-edit" onClick={() => openEditModal(sena)} title="Editar seña">
                          ✏️
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(sena)}
                          title="Eliminar seña"
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
        title={editingSena ? "Editar Seña" : "Nueva Seña"}
        size="medium"
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre de la Seña *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className={formErrors.nombre ? "error" : ""}
              placeholder="Ej: Hola, Gracias, Por favor"
            />
            {formErrors.nombre && <span className="error-text">{formErrors.nombre}</span>}
          </div>

          {/* ✅ NUEVO: Selector de método de entrada */}
          <div className="form-group">
            <label>Método de entrada del video *</label>
            <div className="input-method-selector">
              <label className="radio-option">
                <input
                  type="radio"
                  name="inputMethod"
                  value="url"
                  checked={inputMethod === "url"}
                  onChange={(e) => {
                    setInputMethod(e.target.value)
                    setSelectedFile(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ""
                    }
                  }}
                />
                <span>URL del video</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="inputMethod"
                  value="file"
                  checked={inputMethod === "file"}
                  onChange={(e) => {
                    setInputMethod(e.target.value)
                    setFormData((prev) => ({ ...prev, video: "" }))
                  }}
                />
                <span>Subir archivo</span>
              </label>
            </div>
          </div>

          {/* Campo URL (solo si método es URL) */}
          {inputMethod === "url" && (
            <div className="form-group">
              <label htmlFor="video">URL del Video *</label>
              <input
                type="url"
                id="video"
                name="video"
                value={formData.video}
                onChange={handleInputChange}
                className={formErrors.video ? "error" : ""}
                placeholder="https://youtube.com/watch?v=... o https://ejemplo.com/video.mp4"
              />
              {formErrors.video && <span className="error-text">{formErrors.video}</span>}
              <small className="form-hint">
                Puedes usar enlaces de YouTube, Vimeo o videos directos (.mp4, .webm, .ogg)
              </small>
            </div>
          )}

          {/* Campo archivo (solo si método es archivo) */}
          {inputMethod === "file" && (
            <div className="form-group">
              <label htmlFor="videoFile">Seleccionar Archivo *</label>
              <div className="file-input-container">
                <input
                  type="file"
                  id="videoFile"
                  ref={fileInputRef}
                  accept="video/*,image/*,.gif"
                  onChange={handleFileSelect}
                  className="file-input"
                />
                <div className="file-input-display">
                  {selectedFile ? (
                    <div className="selected-file">
                      <span className="file-info">{getFilePreview()}</span>
                      <span className="file-size">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                      <button
                        type="button"
                        className="remove-file"
                        onClick={() => {
                          setSelectedFile(null)
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ""
                          }
                        }}
                      >
                        ❌
                      </button>
                    </div>
                  ) : (
                    <div className="file-placeholder">
                      <span>📁 Seleccionar video, imagen o GIF</span>
                    </div>
                  )}
                </div>
              </div>
              {formErrors.video && <span className="error-text">{formErrors.video}</span>}
              <small className="form-hint">
                Formatos soportados: MP4, WebM, OGG, AVI, MOV, JPG, PNG, GIF, WebP (máximo 50MB)
              </small>
            </div>
          )}

          {/* ✅ NUEVO: Barra de progreso de subida */}
          {uploadingFile && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
              </div>
              <span className="progress-text">Subiendo archivo... {uploadProgress}%</span>
            </div>
          )}

          {/* Vista previa del video/URL */}
          {((inputMethod === "url" && formData.video && !formErrors.video) ||
            (inputMethod === "file" && selectedFile)) && (
            <div className="video-preview">
              <label>Vista previa:</label>
              <div className="video-preview-info">
                <span className="video-type-preview">
                  {inputMethod === "url" ? getVideoPreview(formData.video) : getFilePreview()}
                </span>
                {inputMethod === "url" && (
                  <a href={formData.video} target="_blank" rel="noopener noreferrer" className="video-test-link">
                    Probar enlace
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowModal(false)}
              disabled={submitting || uploadingFile}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={submitting || uploadingFile}>
              {submitting || uploadingFile ? (
                <>
                  <span className="btn-spinner"></span>
                  {uploadingFile ? "Subiendo archivo..." : editingSena ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                <>
                  <span className="btn-icon">{editingSena ? "💾" : "🤟"}</span>
                  {editingSena ? "Actualizar Seña" : "Crear Seña"}
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
        title="Eliminar Seña"
        message={`¿Estás seguro de que deseas eliminar "${senaToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}

export default SenasPage
