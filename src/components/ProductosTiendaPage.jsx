"use client"

import { useState, useEffect } from "react"
import apiService from "../services/api.js"
import LoadingSpinner from "./LoadingSpinner.jsx"
import Modal from "./Modal.jsx"
import ConfirmDialog from "./ConfirmDialog.jsx"
import ImageUpload from "./ImageUpload.jsx"
import "../styles/AdminPanel.css"

const ProductosTiendaPage = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    imagen: "",
    descuento: "",
    caracteristicas: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const categorias = [
    "Accesorios",
    "Ropa",
    "Hogar",
    "Tecnología",
    "Libros",
    "Arte",
    "Artesanías",
    "Souvenirs",
    "Café para llevar",
    "Merchandising",
  ]

  useEffect(() => {
    loadProductos()
  }, [])

  const filteredProductos = productos.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const loadProductos = async () => {
    try {
      setLoading(true)
      const response = await apiService.getProductosTienda()
      if (response && response.datos) {
        setProductos(response.datos)
      }
    } catch (error) {
      console.error("Error cargando productos tienda:", error)
    } finally {
      setLoading(false)
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

    if (formData.descuento && (Number.parseFloat(formData.descuento) < 0 || Number.parseFloat(formData.descuento) > 100)) {
      errors.descuento = "El descuento debe estar entre 0 y 100"
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
    setEditingProduct(null)
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      categoria: "",
      imagen: "",
      descuento: "",
      caracteristicas: "",
    })
    setFormErrors({})
    setShowModal(true)
  }

  const openEditModal = (producto) => {
    setEditingProduct(producto)
    setFormData({
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      precio: producto.precio?.toString() || "",
      categoria: producto.categoria || "",
      imagen: producto.imagen || "",
      descuento: producto.descuento?.toString() || "",
      caracteristicas: producto.caracteristicas || "",
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
        descuento: formData.descuento ? Number.parseFloat(formData.descuento) : 0,
      }

      if (editingProduct) {
        await apiService.updateProductoTienda(editingProduct.id, productData)
      } else {
        await apiService.createProductoTienda(productData)
      }

      setShowModal(false)
      loadProductos()
    } catch (error) {
      console.error("Error guardando producto tienda:", error)
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
      await apiService.deleteProductoTienda(productToDelete.id)
      setShowConfirmDialog(false)
      setProductToDelete(null)
      loadProductos()
    } catch (error) {
      console.error("Error eliminando producto:", error)
    }
  }

  const toggleStatus = async (producto) => {
    try {
      await apiService.toggleProductoTiendaStatus(producto.id, !producto.status)
      loadProductos()
    } catch (error) {
      console.error("Error cambiando estado:", error)
    }
  }

  const calculateDiscountedPrice = (precio, descuento) => {
    if (!descuento || descuento === 0) return precio
    return precio - (precio * descuento) / 100
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Gestión de Productos Tienda</h1>
          <p>Administra el catálogo de productos para la tienda online</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <span className="btn-icon">🛍️</span>
          Nuevo Producto
        </button>
      </div>

      <div className="admin-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar productos por nombre, categoría o descripción..."
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
            <div className="empty-icon">🛍️</div>
            <h3>No se encontraron productos</h3>
            <p>{searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer producto de tienda"}</p>
            {!searchTerm && (
              <button className="btn-primary" onClick={openCreateModal}>
                <span className="btn-icon">🛍️</span>
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
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Descuento</th>
                  <th>Precio Final</th>
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
                          src={producto.imagen || "/placeholder.svg?height=50&width=50"}
                          alt={producto.nombre}
                          className="product-image"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=50&width=50"
                          }}
                        />
                      </div>
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
                      {producto.descuento && producto.descuento > 0 ? (
                        <span className="discount-badge">{producto.descuento}%</span>
                      ) : (
                        <span className="no-discount">Sin descuento</span>
                      )}
                    </td>
                    <td>
                      <div className="final-price">
                        <span className="price">
                          ${calculateDiscountedPrice(producto.precio, producto.descuento).toFixed(2)}
                        </span>
                        {producto.descuento && producto.descuento > 0 && (
                          <span className="savings">
                            Ahorro: ${(producto.precio - calculateDiscountedPrice(producto.precio, producto.descuento)).toFixed(2)}
                          </span>
                        )}
                      </div>
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
        title={editingProduct ? "Editar Producto Tienda" : "Nuevo Producto Tienda"}
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
                placeholder="Ej: Taza de Café Artesanal"
              />
              {formErrors.nombre && <span className="error-text">{formErrors.nombre}</span>}
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
              <label htmlFor="descuento">Descuento (%)</label>
              <input
                type="number"
                id="descuento"
                name="descuento"
                value={formData.descuento}
                onChange={handleInputChange}
                className={formErrors.descuento ? "error" : ""}
                placeholder="0"
                step="0.01"
                min="0"
                max="100"
              />
              {formErrors.descuento && <span className="error-text">{formErrors.descuento}</span>}
              {formData.precio && formData.descuento && (
                <div className="price-preview">
                  <small>
                    Precio final: $
                    {calculateDiscountedPrice(
                      Number.parseFloat(formData.precio) || 0,
                      Number.parseFloat(formData.descuento) || 0,
                    ).toFixed(2)}
                  </small>
                </div>
              )}
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
              placeholder="Describe el producto, sus características, materiales, etc..."
              rows="4"
            />
            {formErrors.descripcion && <span className="error-text">{formErrors.descripcion}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="caracteristicas">Características Adicionales</label>
            <textarea
              id="caracteristicas"
              name="caracteristicas"
              value={formData.caracteristicas}
              onChange={handleInputChange}
              placeholder="Dimensiones, materiales, cuidados especiales, etc..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Imagen del Producto</label>
            <ImageUpload currentImage={formData.imagen} onImageUpload={handleImageUpload} folder="tienda" />
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
                  <span className="btn-icon">{editingProduct ? "💾" : "🛍️"}</span>
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

export default ProductosTiendaPage
