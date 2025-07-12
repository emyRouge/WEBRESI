"use client"

import { useState, useEffect } from "react"
import apiService from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import { Tag, Star, Search, Filter, ShoppingBag, Eye, X, ImageOff } from "lucide-react"

const Store = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtroCategoria, setFiltroCategoria] = useState("todos")
  const [busqueda, setBusqueda] = useState("")
  const [modalAbierto, setModalAbierto] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [imageErrors, setImageErrors] = useState({})

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
    document.body.style.overflow = "hidden"
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setProductoSeleccionado(null)
    document.body.style.overflow = "unset"
  }

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

  const handleImageError = (productId) => {
    setImageErrors((prevErrors) => ({
      ...prevErrors,
      [productId]: true,
    }))
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
            {productosFiltrados.map((producto) => (
              <article key={producto.id} className="product-card">
                {/* Imagen */}
                <div className="product-image">
                  {!producto.imagen || imageErrors[producto.id] ? (
                    <div className="product-placeholder">
                      <ImageOff size={48} />
                      <span>Imagen no disponible</span>
                    </div>
                  ) : (
                    <img
                      src={producto.imagen || "/placeholder.svg"}
                      alt={producto.nombre}
                      onError={() => handleImageError(producto.id)}
                    />
                  )}
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
                {!productoSeleccionado.imagen || imageErrors[productoSeleccionado.id] ? (
                  <div className="product-placeholder">
                    <ImageOff size={48} />
                    <span>Imagen no disponible</span>
                  </div>
                ) : (
                  <img
                    src={productoSeleccionado.imagen || "/placeholder.svg"}
                    alt={productoSeleccionado.nombre}
                    onError={() => handleImageError(productoSeleccionado.id)}
                  />
                )}
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
      <style jsx>{`
        /* ESTILOS LIMPIOS Y OPTIMIZADOS PARA TIENDA - PALETA AZUL */

        .store-container {
          min-height: 100vh;
          background: #fafafa;
        }

        /* Hero Section */
        .store-hero {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%); /* Tonos de gris oscuro */
          color: white;
          padding: 6rem 2rem 4rem;
          text-align: center;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(73, 200, 245, 0.2); /* Azul con transparencia */
          border: 1px solid rgba(73, 200, 245, 0.3);
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 2rem;
          backdrop-filter: blur(10px);
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          font-family: "Playfair Display", serif;
        }

        .hero-highlight {
          background: linear-gradient(135deg, #49c8f5, #8b5cf6); /* Gradiente azul/púrpura */
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 1.25rem;
          line-height: 1.6;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Content */
        .store-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }

        /* Filtros */
        .filters-section {
          margin-bottom: 4rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .search-container {
          display: flex;
          justify-content: center;
        }

        .search-box {
          position: relative;
          width: 100%;
          max-width: 500px;
          background: white;
          border-radius: 50px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .search-box:hover {
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }

        .search-box:focus-within {
          box-shadow: 0 16px 50px rgba(73, 200, 245, 0.15); /* Sombra azul */
          transform: translateY(-3px);
          border-color: #49c8f5; /* Azul */
        }

        .search-icon {
          position: absolute;
          left: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          z-index: 2;
          transition: all 0.3s ease;
        }

        .search-box:focus-within .search-icon {
          color: #49c8f5; /* Azul */
          transform: translateY(-50%) scale(1.1);
        }

        .search-input {
          width: 100%;
          padding: 1.25rem 4rem;
          border: none;
          background: transparent;
          font-size: 1rem;
          font-weight: 500;
          color: #374151;
          outline: none;
        }

        .search-input::placeholder {
          color: #6b7280;
          font-weight: 400;
        }

        .clear-btn {
          position: absolute;
          right: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          width: 28px;
          height: 28px;
          border: none;
          background: #e5e7eb;
          color: #6b7280;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .clear-btn:hover {
          background: #49c8f5; /* Azul */
          color: white;
          transform: translateY(-50%) scale(1.1);
        }

        .filters-card {
          background: white;
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
        }

        .filters-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
          color: #374151;
          font-size: 1.25rem;
          font-weight: 600;
          font-family: "Playfair Display", serif;
        }

        .filters-header svg {
          color: #49c8f5; /* Azul */
        }

        .filter-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .filter-btn {
          padding: 1rem 2rem;
          border: 2px solid #e5e7eb;
          background: white;
          color: #6b7280;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: capitalize;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .filter-btn:hover {
          border-color: #49c8f5; /* Azul */
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #49c8f5, #8b5cf6); /* Gradiente azul/púrpura */
          color: white;
          border-color: #49c8f5; /* Azul */
          box-shadow: 0 10px 30px rgba(73, 200, 245, 0.25); /* Sombra azul */
          transform: translateY(-2px);
        }

        /* Productos */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .product-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          transition: all 0.4s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          border-color: #49c8f5; /* Azul */
        }

        .product-image {
          position: relative;
          width: 100%;
          height: 280px;
          overflow: hidden;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); /* Tonos de azul claro para fondo de imagen */
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.6s ease;
          display: block;
        }

        .product-card:hover .product-image img {
          transform: scale(1.05);
        }

        .discount-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: linear-gradient(135deg, #dc2626, #ef4444); /* Rojo para descuento */
          color: white;
          padding: 0.5rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
          z-index: 3;
          box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
        }

        .product-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 2;
          backdrop-filter: blur(2px);
        }

        .product-card:hover .product-overlay {
          opacity: 1;
        }

        .view-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          color: #1e293b; /* Gris oscuro */
          border: none;
          padding: 1rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .view-btn:hover {
          background: #49c8f5; /* Azul */
          color: white;
          transform: scale(1.05);
        }

        .product-content {
          padding: 2rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .product-meta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .meta-item svg {
          color: #49c8f5; /* Azul */
        }

        .product-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b; /* Gris oscuro */
          font-family: "Playfair Display", serif;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-clamp: 2; /* Added for compatibility */
        }

        .product-description {
          color: #525252;
          line-height: 1.6;
          font-size: 0.95rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
          line-clamp: 3; /* Added for compatibility */
        }

        .price-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0.5rem 0;
        }

        .price-original {
          color: #6b7280;
          text-decoration: line-through;
          font-size: 1rem;
          font-weight: 500;
        }

        .price-discount {
          color: #dc2626; /* Rojo para descuento */
          font-weight: 700;
          font-size: 1.25rem;
        }

        .price-current {
          color: #1e293b; /* Gris oscuro */
          font-weight: 700;
          font-size: 1.25rem;
        }

        .product-actions {
          margin-top: auto;
          padding-top: 1rem;
        }

        .view-details-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #49c8f5, #8b5cf6); /* Gradiente azul/púrpura */
          color: white;
          border: none;
          padding: 1rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
          width: 100%;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(73, 200, 245, 0.2); /* Sombra azul */
        }

        .view-details-btn:hover {
          background: linear-gradient(135deg, #2563eb, #7c3aed); /* Gradiente azul más oscuro en hover */
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(73, 200, 245, 0.3); /* Sombra azul más pronunciada */
        }

        /* Empty State */
        .store-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 24px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
        }

        .empty-icon {
          color: #49c8f5; /* Azul */
          margin-bottom: 2rem;
          opacity: 0.6;
        }

        .store-empty h3 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b; /* Gris oscuro */
          margin-bottom: 1rem;
          font-family: "Playfair Display", serif;
        }

        .store-empty p {
          color: #525252;
          max-width: 400px;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
          }

          .product-content {
            padding: 1.5rem;
          }

          .product-image {
            height: 240px;
          }

          .filters-card {
            padding: 2rem;
          }

          .filter-buttons {
            gap: 0.75rem;
          }

          .filter-btn {
            padding: 0.875rem 1.5rem;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .store-hero {
            padding: 4rem 1rem 3rem;
          }

          .store-content {
            padding: 3rem 1rem;
          }

          .products-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .product-image {
            height: 220px;
          }

          .filters-card {
            padding: 1.5rem;
          }

          .filter-buttons {
            gap: 0.5rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          }

          .filter-btn {
            padding: 0.75rem 1.25rem;
            font-size: 0.85rem;
            text-align: center;
          }

          .product-content {
            padding: 1.25rem;
          }
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.3s ease-out;
        }

        .modal-content {
          background: white;
          border-radius: 24px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          animation: slideUp 0.3s ease-out;
        }

        .modal-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(0, 0, 0, 0.1);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
          backdrop-filter: blur(10px);
        }

        .modal-close:hover {
          background: rgba(0, 0, 0, 0.2);
          transform: scale(1.1);
        }

        .modal-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          padding: 2rem;
        }

        .modal-image {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); /* Tonos de azul claro para fondo de imagen */
          aspect-ratio: 1;
        }

        .modal-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .modal-discount-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: linear-gradient(135deg, #dc2626, #ef4444);
          color: white;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 700;
          box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
        }

        .modal-info {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .modal-meta {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .modal-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          font-family: "Playfair Display", serif;
          line-height: 1.2;
          margin: 0;
        }

        .modal-price {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-price .price-original {
          font-size: 1.25rem;
        }

        .modal-price .price-discount {
          font-size: 1.75rem;
        }

        .modal-price .price-current {
          font-size: 1.75rem;
        }

        .modal-description h3,
        .modal-features h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.75rem;
          font-family: "Playfair Display", serif;
        }

        .modal-description p {
          color: #525252;
          line-height: 1.7;
          font-size: 1rem;
          margin: 0;
        }

        .modal-features ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .modal-features li {
          color: #525252;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f1f5f9;
          position: relative;
          padding-left: 1.5rem;
        }

        .modal-features li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #49c8f5; /* Azul */
          font-weight: bold;
        }

        .modal-features li:last-child {
          border-bottom: none;
        }

        /* Animaciones del modal */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Estilos para el nuevo div de placeholder */
        .product-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column; /* Para apilar el icono y el texto */
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); /* Tonos de azul claro */
          color: #6b7280; /* Color para el icono y texto */
          font-size: 1rem; /* Tamaño de fuente para el texto */
          text-align: center;
          padding: 1rem; /* Pequeño padding para que no se pegue al borde */
        }

        .product-placeholder svg {
          font-size: 3rem; /* Tamaño del icono */
          opacity: 0.5; /* Opacidad del icono */
          margin-bottom: 0.5rem; /* Espacio entre icono y texto */
        }

        /* Responsive del modal */
        @media (max-width: 768px) {
          .modal-overlay {
            padding: 1rem;
          }

          .modal-body {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 1.5rem;
          }

          .modal-title {
            font-size: 1.5rem;
          }

          .modal-close {
            top: 1rem;
            right: 1rem;
            width: 36px;
            height: 36px;
          }
        }

        @media (max-width: 480px) {
          .modal-content {
            border-radius: 16px;
            max-height: 95vh;
          }

          .modal-body {
            padding: 1rem;
            gap: 1.5rem;
          }

          .modal-price .price-discount,
          .modal-price .price-current {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}

export default Store
