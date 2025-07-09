"use client"
import { useState, useEffect } from "react"
import apiService from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import { ShoppingCart, Tag, Star, Search, Filter, ShoppingBag, ArrowRight } from "lucide-react"
import "../styles/store.css"
const Store = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtroCategoria, setFiltroCategoria] = useState("todos")
  const [busqueda, setBusqueda] = useState("")

  const cargarProductos = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getProductosTienda()
      if (response.tipo === "SUCCESS") {
        // Filtrar solo productos activos
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

  // Obtener categorías únicas
  const categorias = ["todos", ...new Set(productos.map((p) => p.categoria).filter(Boolean))]

  // Filtrar productos
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
        {/* Filtros elegantes */}
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
                {/* Imagen optimizada */}
                <div className="product-image-container">
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
                      <button className="view-btn">
                        <ShoppingCart size={20} />
                        <span>Ver producto</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contenido */}
                <div className="product-content">
                  {/* Meta información */}
                  <div className="product-meta">
                    <div className="meta-item">
                      <Tag size={14} />
                      <span>{producto.categoria}</span>
                    </div>
                    <div className="meta-item">
                      <Star size={14} />
                      <span>Producto destacado</span>
                    </div>
                  </div>

                  {/* Título */}
                  <h2 className="product-title">{producto.nombre}</h2>

                  {/* Descripción */}
                  <p className="product-description">{producto.descripcion}</p>

                  {/* Precio */}
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

                  {/* Acciones */}
                  <div className="product-actions">
                    <button className="add-cart-btn">
                      <span>Agregar al carrito</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Store
