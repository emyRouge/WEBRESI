"use client"

import { useState, useEffect } from "react"
import apiService from "../services/api.js"
import LoadingSpinner from "./LoadingSpinner.jsx"
import Modal from "./Modal.jsx"
import ConfirmDialog from "./ConfirmDialog.jsx"
import ImageUpload from "./ImageUpload.jsx"
import "../styles/AdminPanel.css"

const ProductosPage = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [senas, setSenas] = useState([])
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    categoria: "",
    codigo: "",
    foto: "",
    idSena: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const categorias = [
    "Bebidas calientes",
    "Bebidas frías",
    "Postres",
    "Alimentos",
    "Snacks",
    "Especiales",
    "Desayunos",
    "Comidas",
    "Cenas",
  ]

  useEffect(() => {
    loadProductos()
    loadSenas()
  }, [])

  const filteredProductos = productos.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.codigo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const loadProductos = async () => {
    try {
      setLoading(true)
      const response = await apiService.getProductos()
      if (response && response.datos) {
        setProductos(response.datos)
      }
    } catch (error) {
      console.error("Error cargando productos:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadSenas = async () => {
    try {
      const response = await apiService.getSenas()
      if (response && response.datos) {
        setSenas(response.datos)
      }
    } catch (error) {
      console.error("Error cargando señas:", error)
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio"
    }

    if (!formData.precio || Number.parseFloat(formData.precio) <= 0) {
      errors.precio = "El precio debe ser mayor a 0"
    }

    if (!formData.descripcion.trim()) {
      errors.descripcion = "La descripción es obligatoria"
    }

    if (!formData.categoria) {
      errors.categoria = "La categoría es obligatoria"
    }

    if (!formData.codigo.trim()) {
      errors.codigo = "El código es obligatorio"
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
    setEditingProduct(null)
    setFormData({
      nombre: "",
      precio: "",
      descripcion: "",
      categoria: "",
      codigo: "",
      foto: "",
      idSena: "",
    })
    setFormErrors({})
    setShowModal(true)
  }

  const openEditModal = (producto) => {
    setEditingProduct(producto)
    setFormData({
      nombre: producto.nombre || "",
      precio: producto.precio?.toString() || "",
      descripcion: producto.descripcion || "",
      categoria: producto.categoria || "",
      codigo: producto.codigo || "",
      foto: producto.foto || "",
      idSena: producto.sena?.id?.toString() || "",
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
      const productData = {
        ...formData,
        precio: Number.parseFloat(formData.precio),
        idSena: formData.idSena ? Number.parseInt(formData.idSena) : null,
      }

      if (editingProduct) {
        await apiService.updateProducto(editingProduct.id, productData)
      } else {
        await apiService.createProducto(productData)
      }

      setShowModal(false)
      loadProductos()
    } catch (error) {
      console.error("Error guardando producto:", error)
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = (producto) => {
    setProductToDelete(producto)
    setShowConfirmDialog(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return

    try {
      await apiService.deleteProducto(productToDelete.id)
      setShowConfirmDialog(false)
      setProductToDelete(null)
      loadProductos()
    } catch (error) {
      console.error("Error eliminando producto:", error)
    }
  }

  const toggleStatus = async (producto) => {
    try {
      await apiService.toggleProductoStatus(producto.id, !producto.status)
      loadProductos()
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
          <h1>Gestión de Productos</h1>
          <p>Administra el catálogo de productos del café</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <span className="btn-icon">➕</span>
          Nuevo Producto
        </button>
      </div>

      <div className="admin-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar productos por nombre, código o categoría..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="results-info">
          <span className="results-count">
            {filteredProductos.length} producto{filteredProductos.length !== 1 ? "s" : ""} encontrado
            {filteredProductos.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="admin-content">
        {filteredProductos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No se encontraron productos</h3>
            <p>{searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer producto"}</p>
            {!searchTerm && (
              <button className="btn-primary" onClick={openCreateModal}>
                <span className="btn-icon">➕</span>
                Crear Primer Producto
              </button>
            )}
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Seña</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProductos.map((producto) => (
                  <tr key={producto.id}>
                    <td>
                      <div className="product-image-container">
                        <img
                          src={producto.foto || "/placeholder.svg?height=50&width=50"}
                          alt={producto.nombre}
                          className="product-image"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=50&width=50"
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <span className="product-code">{producto.codigo}</span>
                    </td>
                    <td>
                      <div className="product-info">
                        <strong className="product-name">{producto.nombre}</strong>
                        <p className="product-description">{producto.descripcion}</p>
                      </div>
                    </td>
                    <td>
                      <span className="category-badge">{producto.categoria || "Sin categoría"}</span>
                    </td>
                    <td>
                      <span className="price">${producto.precio}</span>
                    </td>
                    <td>
                      <span className="sena-info">{producto.sena?.nombre || "Sin seña"}</span>
                    </td>
                    <td>
                      <label className="status-switch">
                        <input
                          type="checkbox"
                          checked={producto.status || false}
                          onChange={() => toggleStatus(producto)}
                        />
                        <span className="switch-slider"></span>
                      </label>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-edit"
                          onClick={() => openEditModal(producto)}
                          title="Editar producto"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(producto)}
                          title="Eliminar producto"
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
        title={editingProduct ? "Editar Producto" : "Nuevo Producto"}
        size="large"
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nombre">Nombre del Producto *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={formErrors.nombre ? "error" : ""}
                placeholder="Ej: Café Americano"
              />
              {formErrors.nombre && <span className="error-text">{formErrors.nombre}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="codigo">Código del Producto *</label>
              <input
                type="text"
                id="codigo"
                name="codigo"
                value={formData.codigo}
                onChange={handleInputChange}
                className={formErrors.codigo ? "error" : ""}
                placeholder="Ej: CAF-001"
              />
              {formErrors.codigo && <span className="error-text">{formErrors.codigo}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="categoria">Categoría *</label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className={formErrors.categoria ? "error" : ""}
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {formErrors.categoria && <span className="error-text">{formErrors.categoria}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="precio">Precio *</label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                className={formErrors.precio ? "error" : ""}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {formErrors.precio && <span className="error-text">{formErrors.precio}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="idSena">Seña Asociada</label>
              <select id="idSena" name="idSena" value={formData.idSena} onChange={handleInputChange}>
                <option value="">Sin seña asociada</option>
                {senas.map((sena) => (
                  <option key={sena.id} value={sena.id}>
                    {sena.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción del Producto *</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className={formErrors.descripcion ? "error" : ""}
              placeholder="Describe el producto, sus ingredientes, características especiales..."
              rows="4"
            />
            {formErrors.descripcion && <span className="error-text">{formErrors.descripcion}</span>}
          </div>

          <div className="form-group">
            <label>Imagen del Producto</label>
            <ImageUpload currentImage={formData.foto} onImageUpload={handleImageUpload} folder="productos" />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} disabled={submitting}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="btn-spinner"></span>
                  {editingProduct ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                <>
                  <span className="btn-icon">{editingProduct ? "💾" : "➕"}</span>
                  {editingProduct ? "Actualizar Producto" : "Crear Producto"}
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
        title="Eliminar Producto"
        message={`¿Estás seguro de que deseas eliminar "${productToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}

export default ProductosPage
