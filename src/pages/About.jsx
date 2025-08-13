import { MapPin, Mail, Users, Heart, Coffee, Award, Clock, Star, Calendar, Target, Lightbulb } from "lucide-react"
import "../styles/about.css"

const About = () => {
  const stats = [
    { number: "94%", label: "Recomendación", icon: Star },
    { number: "27+", label: "Seguidores", icon: Users },
    { number: "50+", label: "Empleados", icon: Heart },
    { number: "5+", label: "Años", icon: Calendar },
  ]

  const services = [
    {
      title: "Cafetería Inclusiva",
      description: "Espacio acogedor donde cada taza de café contribuye a proyectos sociales",
      icon: Coffee,
      color: "amber",
    },
    {
      title: "Capacitaciones",
      description: "Cursos de inclusión laboral y Lengua de Señas Mexicana (LSM)",
      icon: Lightbulb,
      color: "blue",
    },
    {
      title: "Proyectos Comunitarios",
      description: "Financiamiento y apoyo a iniciativas de transformación social",
      icon: Users,
      color: "green",
    },
    {
      title: "Inclusión Laboral",
      description: "Oportunidades de empleo para personas con discapacidad",
      icon: Heart,
      color: "purple",
    },
  ]

  const values = [
    {
      title: "Inclusión",
      description: "Creamos espacios donde todos tienen cabida y oportunidades",
      emoji: "🤝",
    },
    {
      title: "Solidaridad",
      description: "Cada compra apoya proyectos que transforman comunidades",
      emoji: "💝",
    },
    {
      title: "Calidad",
      description: "El mejor café y atención, servido con amor y dedicación",
      emoji: "☕",
    },
    {
      title: "Transformación",
      description: "Creemos en el poder del café para cambiar vidas",
      emoji: "🌟",
    },
  ]

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Coffee size={20} />
            <span>Proyecto Resiliente</span>
          </div>
          <h1 className="hero-title">
            Más que una cafetería,
            <span className="hero-highlight"> somos transformación social</span>
          </h1>
          <p className="hero-description">
            Somos un proyecto de economía solidaria que a través de cafeterías apoyamos la creación y fortalecimiento de
            proyectos comunitarios, promoviendo la inclusión laboral y los derechos humanos.
          </p>
          <div className="hero-location">
            <MapPin size={18} />
            <span>Av. Morelos 215, Cuernavaca, México</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="stat-icon">
                  <IconComponent size={24} />
                </div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="story-container">
          <div className="story-content">
            <div className="section-badge">
              <Target size={16} />
              <span>Nuestra Historia</span>
            </div>
            <h2 className="section-title">Un punto y aparte en tu día</h2>
            <div className="story-text">
              <p>
                Te diriges al trabajo y necesitas algo que te dé el empujón para empezar tu mañana. Llega el mediodía y
                necesitas un respiro. Acabas tu jornada y buscas un momento de relax antes de irte a casa. En todos esos
                momentos, te encontrarás viniendo a Resiliente.
              </p>
              <p>
                Entrar a una cafetería debería suponer una pausa, un momento para ti, un momento para disfrutar.
                Contratamos solo a los mejores, que te atenderán con el mayor de los cuidados y siempre tendrán para ti
                una sonrisa.
              </p>
              <p>
                Después de probar nuestro excelente café acompañado de alguno de nuestros deliciosos postres, te
                sentirás a gusto y pleno, pues también estarás ayudando al financiamiento de proyectos sociales de la
                zona.
              </p>
            </div>
          </div>
          <div className="story-image">
            <div className="image-placeholder">
              <Coffee size={48} />
              <span>Espacio acogedor</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="services-container">
          <div className="section-header">
            <div className="section-badge">
              <Heart size={16} />
              <span>Lo que hacemos</span>
            </div>
            <h2 className="section-title">Nuestros Servicios</h2>
            <p className="section-description">
              Cada servicio que ofrecemos está diseñado para crear impacto social positivo
            </p>
          </div>
          <div className="services-grid">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <div
                  key={index}
                  className={`service-card ${service.color}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="service-icon">
                    <IconComponent size={28} />
                  </div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="values-container">
          <div className="section-header">
            <div className="section-badge">
              <Award size={16} />
              <span>Nuestros Valores</span>
            </div>
            <h2 className="section-title">Lo que nos mueve</h2>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="value-emoji">{value.emoji}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weather Section */}
      <section className="weather-section">
        <div className="weather-container">
          <h2 className="weather-title">¿Cómo anda el tiempo?</h2>
          <div className="weather-grid">
            <div className="weather-card">
              <div className="weather-icon">❄️</div>
              <h3>¿Hace frío?</h3>
              <p>Nada como sujetar la taza de un chocolate caliente</p>
            </div>
            <div className="weather-card">
              <div className="weather-icon">☀️</div>
              <h3>¿Hace calor?</h3>
              <p>Atrévete con una de nuestras deliciosas bebidas heladas</p>
            </div>
            <div className="weather-card">
              <div className="weather-icon">🎉</div>
              <h3>¿Buen día?</h3>
              <p>¡Celébralo con unos ricos chilaquiles verdes especiales!</p>
            </div>
            <div className="weather-card">
              <div className="weather-icon">☕</div>
              <h3>Siempre</h3>
              <p>Disfruta del mejor espresso con pan dulce, hecho con amor</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
     
    </div>
  )
}

export default About
