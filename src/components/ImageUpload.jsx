"use client"

import { useState } from "react"

const ImageUpload = ({ currentImage, onImageUpload, folder = "productos" }) => {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const getAuthToken = () => {
    // Obtener el token JWT de donde lo tengas almacenado
    // Puede ser localStorage, cookies, o un contexto de autenticación
    return localStorage.getItem('token') || sessionStorage.getItem('token')
  }

  const handleFileUpload = async (file) => {
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona solo archivos de imagen")
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("El archivo es demasiado grande. Máximo 5MB.")
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)

      const token = getAuthToken()
      if (!token) {
        throw new Error("No se encontró token de autenticación. Por favor inicia sesión.")
      }

      const response = await fetch("https://backresiliente-production.up.railway.app/api/upload", {
        method: "POST",
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // Verificar si la respuesta no es OK
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.message || 
          errorData.error || 
          `Error ${response.status}: ${response.statusText}`
        )
      }

      const data = await response.json()

      if (data.success) {
        onImageUpload(data.cdnUrl)
      } else {
        throw new Error(data.error || "Error al subir la imagen")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      
      // Mensajes más específicos según el tipo de error
      let errorMessage = error.message
      if (error.message.includes("401")) {
        errorMessage = "Sesión expirada. Por favor vuelve a iniciar sesión."
      } else if (error.message.includes("network")) {
        errorMessage = "Error de conexión. Verifica tu internet e intenta nuevamente."
      }
      
      alert(`Error al subir la imagen: ${errorMessage}`)
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  return (
    <div className="image-upload-container">
      {currentImage ? (
        <div className="current-image">
          <img 
            src={currentImage || "/placeholder.svg"} 
            alt="Imagen actual" 
            className="preview-image" 
          />
          <div className="image-overlay">
            <button
              type="button"
              className="btn-change-image"
              onClick={() => document.getElementById("file-input").click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <span className="upload-spinner"></span>
                  Subiendo...
                </>
              ) : "Cambiar imagen"}
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`upload-zone ${dragOver ? "drag-over" : ""} ${uploading ? "uploading" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !uploading && document.getElementById("file-input").click()}
        >
          {uploading ? (
            <div className="upload-loading">
              <div className="upload-spinner"></div>
              <p>Subiendo imagen...</p>
            </div>
          ) : (
            <div className="upload-content">
              <div className="upload-icon">📷</div>
              <p className="upload-text">
                <strong>Haz clic para subir</strong> o arrastra una imagen aquí
              </p>
              <p className="upload-hint">PNG, JPG, JPEG hasta 5MB</p>
            </div>
          )}
        </div>
      )}

      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        disabled={uploading}
      />
    </div>
  )
}

export default ImageUpload