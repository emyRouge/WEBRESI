"use client"

import { useState } from "react"

const ImageUpload = ({ currentImage, onImageUpload, folder = "productos" }) => {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

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

      const response = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        onImageUpload(data.cdnUrl)
      } else {
        throw new Error(data.error || "Error al subir la imagen")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Error al subir la imagen: " + error.message)
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
          <img src={currentImage || "/placeholder.svg"} alt="Imagen actual" className="preview-image" />
          <div className="image-overlay">
            <button
              type="button"
              className="btn-change-image"
              onClick={() => document.getElementById("file-input").click()}
              disabled={uploading}
            >
              {uploading ? "Subiendo..." : "Cambiar imagen"}
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`upload-zone ${dragOver ? "drag-over" : ""} ${uploading ? "uploading" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById("file-input").click()}
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
