import {
  Coffee,
  Users,
  Heart,
  GraduationCap,
  Briefcase,
  Handshake,
  Target,
  Award,
  TrendingUp,
  MapPin,
  Calendar,
  ArrowRight,
  Star,
  Quote,
} from "lucide-react"
import "../styles/projects.css"

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "Talleres de Barismo Profesional",
      description:
        "Capacitación integral en técnicas avanzadas de preparación de café, latte art y servicio al cliente para jóvenes en situación vulnerable.",
      icon: Coffee,
      color: "amber",
      impact: "150+ jóvenes capacitados",
      duration: "6 meses",
      status: "Activo",
      image: "/placeholder.svg?height=200&width=300",
      details: [
        "Certificación profesional reconocida",
        "Prácticas en cafeterías locales",
        "Seguimiento post-graduación",
        "Kit de herramientas incluido",
      ],
    },
    {
      id: 2,
      title: "Inclusión Laboral Integral",
      description:
        "Programa completo de inserción laboral para personas con discapacidad, incluyendo capacitación, adaptación del puesto y seguimiento.",
      icon: Briefcase,
      color: "blue",
      impact: "85% tasa de empleabilidad",
      duration: "Permanente",
      status: "Activo",
      image: "/placeholder.svg?height=200&width=300",
      details: [
        "Evaluación de habilidades personalizada",
        "Adaptación de puestos de trabajo",
        "Capacitación en habilidades blandas",
        "Red de empresas aliadas",
      ],
    },
    {
      id: 3,
      title: "Comercio Justo Cafetalero",
      description:
        "Apoyo directo a productores de café locales con precios justos, capacitación técnica y acceso a mercados especializados.",
      icon: Handshake,
      color: "green",
      impact: "50+ familias beneficiadas",
      duration: "Anual",
      status: "Activo",
      image: "/placeholder.svg?height=200&width=300",
      details: [
        "Precios 30% por encima del mercado",
        "Capacitación en cultivo orgánico",
        "Certificación de calidad",
        "Acceso directo a compradores",
      ],
    },
    {
      id: 4,
      title: "Lengua de Señas Mexicana",
      description:
        "Cursos de LSM para empleados y comunidad, promoviendo la comunicación inclusiva y la integración de personas sordas.",
      icon: Users,
      color: "purple",
      impact: "200+ personas formadas",
      duration: "3 meses",
      status: "Activo",
      image: "/placeholder.svg?height=200&width=300",
      details: [
        "Niveles básico, intermedio y avanzado",
        "Instructores certificados",
        "Material didáctico incluido",
        "Certificado de participación",
      ],
    },
    {
      id: 5,
      title: "Emprendimiento Social",
      description:
        "Incubadora de proyectos sociales que apoya a emprendedores con ideas de impacto comunitario mediante mentoría y financiamiento.",
      icon: Target,
      color: "pink",
      impact: "25 proyectos incubados",
      duration: "12 meses",
      status: "Activo",
      image: "/placeholder.svg?height=200&width=300",
      details: ["Mentoría especializada", "Financiamiento semilla", "Red de contactos", "Seguimiento a largo plazo"],
    },
    {
      id: 6,
      title: "Educación Comunitaria",
      description:
        "Talleres educativos gratuitos en comunidades rurales, enfocados en alfabetización digital y habilidades para la vida.",
      icon: GraduationCap,
      color: "indigo",
      impact: "300+ beneficiarios",
      duration: "Permanente",
      status: "Activo",
      image: "/placeholder.svg?height=200&width=300",
      details: [
        "Alfabetización digital básica",
        "Talleres de finanzas personales",
        "Habilidades de comunicación",
        "Certificados de participación",
      ],
    },
  ]

  const stats = [
    { number: "800+", label: "Vidas Transformadas", icon: Heart },
    { number: "15", label: "Proyectos Activos", icon: Target },
    { number: "95%", label: "Tasa de Éxito", icon: Award },
    { number: "5", label: "Años de Impacto", icon: TrendingUp },
  ]

  const testimonials = [
    {
      name: "María González",
      role: "Graduada del Taller de Barismo",
      content:
        "Gracias a Resiliente encontré no solo un trabajo, sino una pasión. Ahora soy supervisora en una cafetería y ayudo a otros jóvenes como yo.",
      rating: 5,
    },
    {
      name: "Carlos Mendoza",
      role: "Productor de Café",
      content:
        "El programa de comercio justo cambió mi vida. Ahora puedo vender mi café a precio justo y mantener a mi familia dignamente.",
      rating: 5,
    },
    {
      name: "Ana Ruiz",
      role: "Participante LSM",
      content:
        "Aprender lengua de señas me abrió un mundo nuevo. Ahora puedo comunicarme con mi hermana sorda y ayudar en mi trabajo.",
      rating: 5,
    },
  ]

  return (
    <div className="projects-container">
      {/* Hero Section */}
      <section className="projects-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Heart size={20} />
            <span>Transformando Vidas</span>
          </div>
          <h1 className="hero-title">
            Proyectos de
            <span className="hero-highlight"> Inclusión Social</span>
          </h1>
          <p className="hero-description">
            Cada taza de café que compras financia proyectos que transforman comunidades enteras. Conoce cómo tu apoyo
            genera impacto real en la vida de cientos de personas.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <h2 className="stats-title">Nuestro Impacto en Números</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="stat-icon">
                    <IconComponent size={28} />
                  </div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects-section">
        <div className="projects-content">
          <div className="section-header">
            <div className="section-badge">
              <Target size={16} />
              <span>Nuestros Proyectos</span>
            </div>
            <h2 className="section-title">Iniciativas que Transforman</h2>
            <p className="section-description">
              Cada proyecto está diseñado para generar impacto sostenible y crear oportunidades reales de crecimiento
            </p>
          </div>

          <div className="projects-grid">
            {projects.map((project, index) => {
              const IconComponent = project.icon
              return (
                <div
                  key={project.id}
                  className={`project-card ${project.color}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="project-image">
                    <img src={project.image || "/placeholder.svg"} alt={project.title} />
                    <div className="project-status">
                      <span className={`status-badge ${project.status.toLowerCase()}`}>{project.status}</span>
                    </div>
                  </div>

                  <div className="project-content">
                    <div className="project-header">
                      <div className="project-icon">
                        <IconComponent size={24} />
                      </div>
                      <div className="project-meta">
                        <div className="meta-item">
                          <Calendar size={14} />
                          <span>{project.duration}</span>
                        </div>
                        <div className="meta-item">
                          <TrendingUp size={14} />
                          <span>{project.impact}</span>
                        </div>
                      </div>
                    </div>

                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>

                    <div className="project-details">
                      <h4>Características principales:</h4>
                      <ul>
                        {project.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="project-actions">
                      <button className="learn-more-btn">
                        <span>Conocer más</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="section-header">
            <div className="section-badge">
              <Quote size={16} />
              <span>Testimonios</span>
            </div>
            <h2 className="section-title">Historias de Transformación</h2>
            <p className="section-description">
              Escucha directamente de las personas cuyas vidas han sido transformadas por nuestros proyectos
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="testimonial-content">
                  <div className="quote-icon">
                    <Quote size={24} />
                  </div>
                  <p className="testimonial-text">"{testimonial.content}"</p>
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.name.charAt(0)}</div>
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-role">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">¿Quieres ser parte del cambio?</h2>
            <p className="cta-description">
              Únete a nuestra misión de transformar vidas a través del café. Cada compra, cada visita, cada
              recomendación hace la diferencia.
            </p>
            <div className="cta-buttons">
              <button className="cta-primary">
                <Heart size={18} />
                <span>Apoyar Proyectos</span>
              </button>
              <button className="cta-secondary">
                <Users size={18} />
                <span>Ser Voluntario</span>
              </button>
            </div>
          </div>
          <div className="cta-stats">
            <div className="cta-stat">
              <MapPin size={20} />
              <div>
                <strong>Ubicación</strong>
                <p>Av. Morelos 215, Cuernavaca</p>
              </div>
            </div>
            <div className="cta-stat">
              <Award size={20} />
              <div>
                <strong>Reconocimientos</strong>
                <p>Premio Nacional de Inclusión 2023</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Projects
