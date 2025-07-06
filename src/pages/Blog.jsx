"use client"
import { useState, useEffect } from "react"
import apiService from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import { Share2, Clock, Calendar, X, Check, Eye, BookOpen, Quote, ArrowRight } from "lucide-react"
import "../styles/blog.css"

const Blog = () => {
  const [publicaciones, setPublicaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  const cargarPublicaciones = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getPublicaciones()
      if (response.tipo === "SUCCESS") {
        // Filtrar solo publicaciones activas
        const publicacionesActivas = response.datos?.filter((pub) => pub.status === true) || []
        setPublicaciones(publicacionesActivas)
      } else {
        setPublicaciones([])
      }
    } catch (err) {
      setError("Error al cargar las publicaciones. Por favor, intenta de nuevo.")
      console.error("Error cargando publicaciones:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarPublicaciones()
  }, [])

  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString)
    return fecha.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const compartirPublicacion = async (publicacion) => {
    const url = `${window.location.origin}/blog/${publicacion.id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(publicacion.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      const textArea = document.createElement("textarea")
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopiedId(publicacion.id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  const truncarTexto = (texto, limite = 150) => {
    if (texto.length <= limite) return texto
    return texto.substring(0, limite) + "..."
  }

  const abrirModal = (publicacion) => {
    setSelectedPost(publicacion)
    setModalOpen(true)
    document.body.style.overflow = "hidden"
  }

  const cerrarModal = () => {
    setModalOpen(false)
    setSelectedPost(null)
    document.body.style.overflow = "unset"
  }

  const calcularTiempoLectura = (contenido) => {
    const palabras = contenido.split(" ").length
    const tiempoMinutos = Math.ceil(palabras / 200)
    return tiempoMinutos
  }

  if (loading) {
    return <LoadingSpinner message="Cargando publicaciones..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={cargarPublicaciones} />
  }

  return (
    <>
      <div className="blog-container">
        {/* Hero Section */}
        <section className="blog-hero">
          <div className="hero-content">
            <div className="hero-badge">
              <BookOpen size={20} />
              <span>Historias que Inspiran</span>
            </div>
            <h1 className="hero-title">
              Blog
              <span className="hero-highlight"> Resiliente</span>
            </h1>
            <p className="hero-description">
              Historias que inspiran, experiencias que transforman y reflexiones que conectan corazones. Descubre las
              voces de nuestra comunidad.
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="blog-content">
          {publicaciones.length === 0 ? (
            <div className="blog-empty">
              <div className="empty-icon">
                <Quote size={48} />
              </div>
              <h3>Próximamente nuevas historias</h3>
              <p>Estamos preparando contenido inspirador para compartir contigo.</p>
            </div>
          ) : (
            <div className="blog-grid">
              {publicaciones.map((publicacion, index) => (
                <article key={publicacion.id} className="blog-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Imagen */}
                  {publicacion.imagen && (
                    <div className="blog-image">
                      <img
                        src={publicacion.imagen || "/placeholder.svg"}
                        alt={publicacion.titulo}
                        onError={(e) => {
                          e.target.style.display = "none"
                        }}
                      />
                      <div className="blog-overlay">
                        <button className="view-btn" onClick={() => abrirModal(publicacion)}>
                          <Eye size={20} />
                          <span>Leer completo</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Contenido */}
                  <div className="blog-card-content">
                    {/* Meta información */}
                    <div className="blog-meta">
                      <div className="meta-item">
                        <Calendar size={14} />
                        <span>{formatearFecha(publicacion.fechaPublicacion)}</span>
                      </div>
                      <div className="meta-item">
                        <Clock size={14} />
                        <span>{calcularTiempoLectura(publicacion.contenido)} min</span>
                      </div>
                    </div>

                    {/* Título */}
                    <h2 className="blog-title">{publicacion.titulo}</h2>

                    {/* Extracto */}
                    <p className="blog-excerpt">{truncarTexto(publicacion.contenido)}</p>

                    {/* Acciones */}
                    <div className="blog-actions">
                      <button className="read-btn" onClick={() => abrirModal(publicacion)}>
                        <span>Leer completo</span>
                        <ArrowRight size={16} />
                      </button>
                      <button
                        className={`share-btn ${copiedId === publicacion.id ? "copied" : ""}`}
                        onClick={() => compartirPublicacion(publicacion)}
                        title="Compartir"
                      >
                        {copiedId === publicacion.id ? <Check size={18} /> : <Share2 size={18} />}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedPost && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Header del modal */}
            <div className="modal-header">
              <div className="modal-meta">
                <div className="modal-meta-item">
                  <Calendar size={16} />
                  <span>{formatearFecha(selectedPost.fechaPublicacion)}</span>
                </div>
                <div className="modal-meta-item">
                  <Clock size={16} />
                  <span>{calcularTiempoLectura(selectedPost.contenido)} min de lectura</span>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  className={`modal-share-btn ${copiedId === selectedPost.id ? "copied" : ""}`}
                  onClick={() => compartirPublicacion(selectedPost)}
                >
                  {copiedId === selectedPost.id ? <Check size={18} /> : <Share2 size={18} />}
                </button>
                <button className="modal-close-btn" onClick={cerrarModal}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="modal-body">
              <h1 className="modal-title">{selectedPost.titulo}</h1>
              {selectedPost.imagen && (
                <div className="modal-image">
                  <img
                    src={selectedPost.imagen || "/placeholder.svg"}
                    alt={selectedPost.titulo}
                    onError={(e) => {
                      e.target.style.display = "none"
                    }}
                  />
                </div>
              )}
              <div className="modal-text">
                {selectedPost.contenido.split("\n").map((parrafo, index) => (
                  <p key={index} className="modal-paragraph">
                    {parrafo.trim()}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Blog
