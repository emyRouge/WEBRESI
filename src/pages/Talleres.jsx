import { useState, useEffect } from "react"
import { Calendar, Clock, Users, GraduationCap, ArrowRight, MapPin, Award } from "lucide-react"
import "../styles/talleres.css"

const TALLERES_PRUEBA = [
  {
    id: 1,
    nombre: "Barismo Profesional — Nivel I",
    descripcion:
      "Aprende las bases del café de especialidad: molienda, extracción, perfiles de tostado y técnicas de espresso. Ideal para quienes inician su carrera en el mundo del café.",
    fechaInicio: "2026-06-08",
    fechaFin: "2026-06-26",
    imagen:
      "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&h=360&fit=crop&auto=format&q=80",
    status: true,
  },
  {
    id: 2,
    nombre: "Lengua de Señas Mexicana — Básico",
    descripcion:
      "Introducción a la LSM para comunicarte en tu entorno laboral y social. Aprende el alfabeto, vocabulario esencial y frases del día a día con instructores certificados.",
    fechaInicio: "2026-07-06",
    fechaFin: "2026-08-01",
    imagen:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=360&fit=crop&auto=format&q=80",
    status: true,
  },
  {
    id: 3,
    nombre: "Emprendimiento Social con Propósito",
    descripcion:
      "Diseña y lanza proyectos con impacto social sostenible. Veremos modelos de negocio social, finanzas para emprendedores y estrategias de comunicación comunitaria.",
    fechaInicio: "2026-08-10",
    fechaFin: "2026-09-11",
    imagen:
      "https://images.unsplash.com/photo-1553484771-371a605b060b?w=600&h=360&fit=crop&auto=format&q=80",
    status: true,
  },
  {
    id: 4,
    nombre: "Arte Latte y Creatividad en el Café",
    descripcion:
      "Domina el milk steaming y el latte art: corazones, rosetones, tulipanes y diseños libres. Un taller práctico y creativo para baristas en formación que buscan destacar.",
    fechaInicio: "2026-09-14",
    fechaFin: "2026-09-30",
    imagen:
      "https://images.unsplash.com/photo-1511920183353-8cd77ccbf8e3?w=600&h=360&fit=crop&auto=format&q=80",
    status: true,
  },
]

const Talleres = () => {
  const [talleres, setTalleres] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTalleres(TALLERES_PRUEBA)
    setLoading(false)
  }, [])

  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString)
    return fecha.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calcularDuracion = (fechaInicio, fechaFin) => {
    const inicio = new Date(fechaInicio)
    const fin = new Date(fechaFin)
    const diferencia = fin - inicio
    const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24))
    return dias
  }

  const getStatusColor = (fechaInicio, fechaFin) => {
    const hoy = new Date()
    const inicio = new Date(fechaInicio)
    const fin = new Date(fechaFin)
    if (hoy < inicio) return "upcoming"
    if (hoy >= inicio && hoy <= fin) return "active"
    return "finished"
  }

  const getStatusText = (fechaInicio, fechaFin) => {
    const hoy = new Date()
    const inicio = new Date(fechaInicio)
    const fin = new Date(fechaFin)
    if (hoy < inicio) return "Próximamente"
    if (hoy >= inicio && hoy <= fin) return "En curso"
    return "Finalizado"
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <GraduationCap size={40} style={{ color: "#f59e0b", opacity: 0.5 }} />
      </div>
    )
  }

  return (
    <div className="talleres-container">
      {/* Hero Section */}
      <section className="talleres-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <GraduationCap size={20} />
            <span>Formación y Capacitación</span>
          </div>
          <h1 className="hero-title">
            Talleres
            <span className="hero-highlight"> Resiliente</span>
          </h1>
          <p className="hero-description">
            Nuestros talleres de capacitación y formación están diseñados para empoderar a las comunidades
            y crear oportunidades de crecimiento personal y profesional.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="talleres-content">
        {talleres.length === 0 ? (
          <div className="talleres-empty">
            <div className="empty-icon">
              <GraduationCap size={48} />
            </div>
            <h3>Próximamente nuevos talleres</h3>
            <p>Estamos preparando talleres increíbles para compartir contigo. ¡Mantente atento!</p>
          </div>
        ) : (
          <div className="talleres-grid">
            {talleres.map((taller, index) => (
              <article
                key={taller.id}
                className="taller-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Imagen */}
                <div className="taller-image">
                  <img
                    src={taller.imagen}
                    alt={taller.nombre}
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = "none"
                    }}
                  />
                  <div className="taller-status">
                    <span className={`status-badge ${getStatusColor(taller.fechaInicio, taller.fechaFin)}`}>
                      {getStatusText(taller.fechaInicio, taller.fechaFin)}
                    </span>
                  </div>
                  <div className="taller-overlay">
                    <button className="view-btn">
                      <Users size={20} />
                      <span>Ver detalles</span>
                    </button>
                  </div>
                </div>

                {/* Contenido */}
                <div className="taller-content">
                  <div className="taller-meta">
                    <div className="meta-item">
                      <Calendar size={14} />
                      <span>{formatearFecha(taller.fechaInicio)}</span>
                    </div>
                    <div className="meta-item">
                      <Clock size={14} />
                      <span>{calcularDuracion(taller.fechaInicio, taller.fechaFin)} días</span>
                    </div>
                  </div>

                  <h2 className="taller-title">{taller.nombre}</h2>
                  <p className="taller-description">{taller.descripcion}</p>

                  <div className="taller-info">
                    <div className="info-item">
                      <MapPin size={16} />
                      <span>Av. Morelos 215, Cuernavaca</span>
                    </div>
                    <div className="info-item">
                      <Award size={16} />
                      <span>Certificado incluido</span>
                    </div>
                  </div>

                  <div className="taller-actions">
                    <button className="register-btn">
                      <span>Más información</span>
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

export default Talleres
