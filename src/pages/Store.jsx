"use client"

import { useState, useEffect } from "react"
import apiService from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import { Tag, Star, Search, Filter, ShoppingBag, Eye, X } from "lucide-react"
import "../styles/store.css"
const Store = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtroCategoria, setFiltroCategoria] = useState("todos")
  const [busqueda, setBusqueda] = useState("")
  const [modalAbierto, setModalAbierto] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)

  const cargarProductos = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getProductosTienda()
      if (response.tipo === "SUCCESS") {
        const productosActivos = response.datos?.filter((producto) => producto.status === true) || []
        setProductos(productosActivos)
      } else {
        setProductos([])
      }
    } catch (err) {
      setError("Error al cargar los productos. Por favor, intenta de nuevo.")
      console.error("Error cargando productos:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  const categorias = ["todos", ...new Set(productos.map((p) => p.categoria).filter(Boolean))]

  const productosFiltrados = productos.filter((producto) => {
    const cumpleFiltroCategoria = filtroCategoria === "todos" || producto.categoria === filtroCategoria
    const cumpleBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return cumpleFiltroCategoria && cumpleBusqueda
  })

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const calcularPrecioConDescuento = (precio, descuento) => {
    if (!descuento) return precio
    return precio - (precio * descuento) / 100
  }

  const abrirModal = (producto) => {
    setProductoSeleccionado(producto)
    setModalAbierto(true)
    document.body.style.overflow = "hidden" // Prevenir scroll del body
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setProductoSeleccionado(null)
    document.body.style.overflow = "unset" // Restaurar scroll del body
  }

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && modalAbierto) {
        cerrarModal()
      }
    }
    if (modalAbierto) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [modalAbierto])

  if (loading) {
    return <LoadingSpinner message="Cargando productos..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={cargarProductos} />
  }

  return (
    <div className="store-container">
      {/* Hero Section */}
      <section className="store-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <ShoppingBag size={20} />
            <span>Productos con Propósito</span>
          </div>
          <h1 className="hero-title">
            Tienda
            <span className="hero-highlight"> Resiliente</span>
          </h1>
          <p className="hero-description">
            Descubre nuestros productos con propósito. Cada compra contribuye a nuestros proyectos de inclusión social y
            transforma vidas en nuestra comunidad.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="store-content">
        {/* Filtros */}
        <div className="filters-section">
          {/* Buscador */}
          <div className="search-container">
            <div className="search-box">
              <div className="search-icon">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="¿Qué estás buscando?"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input"
              />
              {busqueda && (
                <button onClick={() => setBusqueda("")} className="clear-btn">
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Filtros de categoría */}
          <div className="filters-card">
            <div className="filters-header">
              <Filter size={16} />
              <span>Filtrar por categoría</span>
            </div>
            <div className="filter-buttons">
              {categorias.map((categoria, index) => (
                <button
                  key={categoria}
                  onClick={() => setFiltroCategoria(categoria)}
                  className={`filter-btn ${filtroCategoria === categoria ? "active" : ""}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {categoria === "todos" ? "Todos" : categoria}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Productos */}
        {productosFiltrados.length === 0 ? (
          <div className="store-empty">
            <div className="empty-icon">
              <ShoppingBag size={48} />
            </div>
            <h3>No se encontraron productos</h3>
            <p>Intenta ajustar los filtros o la búsqueda para encontrar lo que buscas.</p>
          </div>
        ) : (
          <div className="products-grid">
            {productosFiltrados.map((producto, index) => (
              <article key={producto.id} className="product-card" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Imagen */}
                <div className="product-image">
                  <img
                    src={producto.imagen || "/placeholder.svg?height=300&width=400"}
                    alt={producto.nombre}
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=300&width=400"
                    }}
                  />
                  {producto.descuento && <div className="discount-badge">-{producto.descuento}%</div>}
                  <div className="product-overlay">
                    <button className="view-btn" onClick={() => abrirModal(producto)}>
                      <Eye size={20} />
                      <span>Ver detalles</span>
                    </button>
                  </div>
                </div>

                {/* Contenido */}
                <div className="product-content">
                  <div className="product-meta">
                    <div className="meta-item">
                      <Tag size={14} />
                      <span>{producto.categoria}</span>
                    </div>
                    <div className="meta-item">
                      <Star size={14} />
                      <span>Destacado</span>
                    </div>
                  </div>
                  <h2 className="product-title">{producto.nombre}</h2>
                  <p className="product-description">{producto.descripcion}</p>
                  <div className="price-container">
                    {producto.descuento ? (
                      <>
                        <span className="price-original">{formatearPrecio(producto.precio)}</span>
                        <span className="price-discount">
                          {formatearPrecio(calcularPrecioConDescuento(producto.precio, producto.descuento))}
                        </span>
                      </>
                    ) : (
                      <span className="price-current">{formatearPrecio(producto.precio)}</span>
                    )}
                  </div>
                  <div className="product-actions">
                    <button className="view-details-btn" onClick={() => abrirModal(producto)}>
                      <Eye size={16} />
                      <span>Ver detalles</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalle de producto */}
      {modalAbierto && productoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={cerrarModal}>
              <X size={24} />
            </button>
            <div className="modal-body">
              <div className="modal-image">
                <img
                  src={productoSeleccionado.imagen || "/placeholder.svg?height=400&width=400"}
                  alt={productoSeleccionado.nombre}
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=400&width=400"
                  }}
                />
                {productoSeleccionado.descuento && (
                  <div className="modal-discount-badge">-{productoSeleccionado.descuento}%</div>
                )}
              </div>
              <div className="modal-info">
                <div className="modal-meta">
                  <div className="meta-item">
                    <Tag size={16} />
                    <span>{productoSeleccionado.categoria}</span>
                  </div>
                  <div className="meta-item">
                    <Star size={16} />
                    <span>Producto destacado</span>
                  </div>
                </div>
                <h2 className="modal-title">{productoSeleccionado.nombre}</h2>
                <div className="modal-price">
                  {productoSeleccionado.descuento ? (
                    <>
                      <span className="price-original">{formatearPrecio(productoSeleccionado.precio)}</span>
                      <span className="price-discount">
                        {formatearPrecio(
                          calcularPrecioConDescuento(productoSeleccionado.precio, productoSeleccionado.descuento),
                        )}
                      </span>
                    </>
                  ) : (
                    <span className="price-current">{formatearPrecio(productoSeleccionado.precio)}</span>
                  )}
                </div>
                <div className="modal-description">
                  <h3>Descripción</h3>
                  <p>{productoSeleccionado.descripcion}</p>
                </div>
                <div className="modal-features">
                  <h3>Características</h3>
                  <ul>
                    <li>Producto con propósito social</li>
                    <li>Contribuye a proyectos de inclusión</li>
                    <li>Calidad garantizada</li>
                    <li>Impacto positivo en la comunidad</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Store
