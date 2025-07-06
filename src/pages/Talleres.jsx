"use client"
import { useState, useEffect } from "react"
import apiService from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import { Calendar, Clock, Users, GraduationCap, ArrowRight, MapPin, Award } from 'lucide-react'
import "../styles/talleres.css"

const Talleres = () => {
  const [talleres, setTalleres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargarTalleres = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getTalleres()
      if (response.tipo === "SUCCESS") {
        // Filtrar solo talleres activos
        const talleresActivos = (response.datos || []).filter(taller => taller.status === true)
        setTalleres(talleresActivos)
      } else {
        setTalleres([])
      }
    } catch (err) {
      setError("Error al cargar los talleres. Por favor, intenta de nuevo.")
      console.error("Error cargando talleres:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarTalleres()
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
    
    if (hoy < inicio) {
      return "upcoming"
    } else if (hoy >= inicio && hoy <= fin) {
      return "active"
    } else {
      return "finished"
    }
  }

  const getStatusText = (fechaInicio, fechaFin) => {
    const hoy = new Date()
    const inicio = new Date(fechaInicio)
    const fin = new Date(fechaFin)
    
    if (hoy < inicio) {
      return "Próximamente"
    } else if (hoy >= inicio && hoy <= fin) {
      return "En curso"
    } else {
      return "Finalizado"
    }
  }

  if (loading) {
    return <LoadingSpinner message="Cargando talleres..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={cargarTalleres} />
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
            Nuestros talleres de capacitación y formación están diseñados para empoderar a las comunidades y crear
            oportunidades de crecimiento personal y profesional.
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
              <article key={taller.id} className="taller-card" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Imagen */}
                {taller.imagen && (
                  <div className="taller-image">
                    <img
                      src={taller.imagen || "/placeholder.svg"}
                      alt={taller.nombre}
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
                )}

                {/* Contenido */}
                <div className="taller-content">
                  {/* Meta información */}
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

                  {/* Título */}
                  <h2 className="taller-title">{taller.nombre}</h2>

                  {/* Descripción */}
                  <p className="taller-description">{taller.descripcion}</p>

                  {/* Información adicional */}
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

                  {/* Acciones */}
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
