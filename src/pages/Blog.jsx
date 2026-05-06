import { useState, useEffect } from "react"
import { Share2, Clock, Calendar, X, Check, Eye, BookOpen, Quote, ArrowRight } from "lucide-react"
import "../styles/blog.css"

const PUBLICACIONES_PRUEBA = [
  {
    id: 1,
    titulo: "Cómo una taza de café puede transformar una comunidad",
    contenido:
      "Cada vez que visitas nuestra cafetería y pides un espresso o un latte, contribuyes directamente al financiamiento de talleres, becas y proyectos sociales que cambian vidas en Cuernavaca.\n\nEn Proyecto Resiliente creemos que el comercio puede ser una herramienta de transformación social. No solo vendemos café: generamos empleos para personas en situación de vulnerabilidad, capacitamos a jóvenes en barismo y promovemos la inclusión laboral en nuestra comunidad.\n\nCada peso que inviertes en tu bebida favorita regresa a la sociedad en forma de oportunidades reales. Eso es lo que llamamos economía solidaria.",
    fechaPublicacion: "2026-04-20T10:00:00",
    imagen:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&h=450&fit=crop&auto=format&q=80",
    status: true,
  },
  {
    id: 2,
    titulo: "Nuestra primera generación de baristas certificados",
    contenido:
      "Con gran orgullo presentamos a los 18 jóvenes que completaron nuestro taller de Barismo Profesional — Nivel I. Durante seis semanas aprendieron desde la selección del grano hasta la elaboración de bebidas de especialidad.\n\nHoy cuentan con un certificado reconocido y varios de ellos ya trabajan en cafeterías de la ciudad. Este logro no es solo de ellos: es de toda la comunidad que apostó por el proyecto.\n\nLa siguiente generación abre inscripciones en junio. ¡No te quedes fuera!",
    fechaPublicacion: "2026-03-15T09:30:00",
    imagen:
      "https://images.unsplash.com/photo-1511920183353-8cd77ccbf8e3?w=700&h=450&fit=crop&auto=format&q=80",
    status: true,
  },
  {
    id: 3,
    titulo: "Lengua de Señas Mexicana: rompiendo barreras en el trabajo",
    contenido:
      "La comunicación inclusiva es un derecho. Por eso lanzamos nuestro programa de LSM abierto a toda la comunidad de Cuernavaca, sin costo para participantes de bajos recursos.\n\nGracias a este esfuerzo, hoy contamos con 12 colaboradores que se comunican en LSM y brindan una atención más cálida y accesible a nuestros clientes sordos. La respuesta de la comunidad fue increíble: la primera edición se llenó en menos de 48 horas.\n\nLa inclusión empieza con escuchar — aunque sea en silencio.",
    fechaPublicacion: "2026-02-28T11:00:00",
    imagen:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&h=450&fit=crop&auto=format&q=80",
    status: true,
  },
  {
    id: 4,
    titulo: "Café de origen: apoyando a productores locales de Morelos",
    contenido:
      "Este mes presentamos nuestro blend de temporada, elaborado con granos cultivados en las faldas del Tepoztlán a más de 1,400 msnm. Son granos de proceso natural con notas de maracuyá, panela y almendra.\n\nTrabajamos directamente con tres familias productoras a las que pagamos un 30% por encima del precio de mercado. Sin intermediarios, sin engaños. Transparencia y comercio justo, siempre.\n\nPídelo en nuestra cafetería o encuéntralo en la tienda en línea. Cada bolsa tiene la historia de quién lo cultivó.",
    fechaPublicacion: "2026-01-10T08:00:00",
    imagen:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=700&h=450&fit=crop&auto=format&q=80",
    status: true,
  },
]

const Blog = () => {
  const [publicaciones, setPublicaciones] = useState([])
  const [copiedId, setCopiedId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  useEffect(() => {
    setPublicaciones(PUBLICACIONES_PRUEBA)
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
    } catch {
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
    return Math.ceil(palabras / 200)
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
              Historias que inspiran, experiencias que transforman y reflexiones que conectan corazones.
              Descubre las voces de nuestra comunidad.
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
                <article
                  key={publicacion.id}
                  className="blog-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Imagen */}
                  {publicacion.imagen && (
                    <div className="blog-image">
                      <img
                        src={publicacion.imagen}
                        alt={publicacion.titulo}
                        loading="lazy"
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

                    <h2 className="blog-title">{publicacion.titulo}</h2>
                    <p className="blog-excerpt">{truncarTexto(publicacion.contenido)}</p>

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

            <div className="modal-body">
              <h1 className="modal-title">{selectedPost.titulo}</h1>
              {selectedPost.imagen && (
                <div className="modal-image">
                  <img
                    src={selectedPost.imagen}
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
