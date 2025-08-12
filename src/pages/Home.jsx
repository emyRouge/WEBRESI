import { Link } from "react-router-dom"
import { ArrowRight, Coffee } from "lucide-react"
import "../styles/home.css"

const Home = () => {
  const menuItems = [
    {
      name: "Conócenos",
      href: "/conocenos",
      description: "Nuestra historia y misión",
      iconSrc: "/conocenos.png",
      color: "cyan-blue",
    },
    {
      name: "Talleres",
      href: "/talleres",
      description: "Capacitación y formación",
      iconSrc: "/talleres.png",
      color: "blue-indigo",
    },
    {
      name: "Proyectos de Inclusión",
      href: "/proyectos",
      description: "Iniciativas que transforman vidas",
      iconSrc: "/proyectos.png",
      color: "purple-violet",
    },
    {
      name: "Blog",
      href: "/blog",
      description: "Historias y noticias",
      iconSrc: "/blog.png",
      color: "cyan-purple",
    },
    {
      name: "Tienda",
      href: "/tienda",
      description: "Productos con propósito",
      iconSrc: "/tienda.png",
      color: "blue-cyan",
    },
    {
      name: "¿Cómo Apoyar el Proyecto?",
      href: "/apoyo",
      description: "Únete a nuestra causa",
      iconSrc: "/apoyo.png",
      color: "purple-blue",
    },
  ]

  return (
    <div className="home-wrapper">
      {/* Background Image */}
      <div
        className="home-background"
        style={{
          backgroundImage: 'url("/resiliente.jpg")',
        }}
      >
        <div className="home-overlay"></div>
      </div>

      {/* Content Container */}
      <div className="home-container">
        {/* Header Section */}
        <header className="home-header">
          <div className="logo-container">
            <div className="logo-wrapper">
              <img
                src="/logo.png"
                alt="Logo Resiliente"
                className="logo-img"
                onError={(e) => {
                  console.log("Error cargando logo desde /logo.png")
                  // Intentar rutas alternativas
                  if (e.target.src.includes("/logo.png")) {
                    e.target.src = "./logo.png"
                  } else if (e.target.src.includes("./logo.png")) {
                    e.target.src = "/public/logo.png"
                  } else {
                    // Si nada funciona, ocultar la imagen y mostrar texto
                    e.target.style.display = "none"
                    e.target.parentElement.classList.add("logo-fallback")
                  }
                }}
                onLoad={() => {
                  console.log("Logo cargado exitosamente")
                }}
              />
              <div className="logo-fallback-content">
                <Coffee size={50} />
                <span>R</span>
              </div>
            </div>
          </div>
          <h1 className="main-title">Proyecto Resiliente</h1>
          <p className="main-subtitle">Cambia tu café, cambia el mundo</p>
        </header>

        {/* Menu Grid */}
        <main className="menu-main">
          <div className="cards-grid">
            {menuItems.map((item, index) => {
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="elegant-menu-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-content">
                    <div className={`card-icon-wrapper ${item.color}`}>
                      <img
                        src={item.iconSrc || "/placeholder.svg"}
                        alt={`Icono ${item.name}`}
                        className="card-icon-img"
                        style={{
                          width: "32px",
                          height: "32px",
                          objectFit: "contain",
                          filter: "brightness(0) invert(1)",
                        }}
                      />
                    </div>
                    <div className="card-text">
                      <h3 className="card-title-elegant">{item.name}</h3>
                      <p className="card-description-elegant">{item.description}</p>
                    </div>
                    <div className="card-arrow">
                      <ArrowRight size={16} className="arrow-icon" />
                    </div>
                  </div>
                  <div className="card-shine"></div>
                </Link>
              )
            })}
          </div>
        </main>

        {/* Footer Section */}
        <footer className="home-footer">
          <div className="social-container">
            <a
              href="https://www.facebook.com/profile.php?id=100063500079360"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <span className="social-icon">📘</span>
              <span>@Resiliemtemx</span>
            </a>
            <a
              href="https://www.instagram.com/resilienmx/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <span className="social-icon">📷</span>
              <span>@resilienmx</span>
            </a>
            <a
              href="https://www.linkedin.com/company/proyecto-resiliente/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <span className="social-icon">💼</span>
              <span>Proyecto Resiliente</span>
            </a>
          </div>
          <p className="copyright-text">
            © {new Date().getFullYear()} Proyecto Resiliente - Todos los derechos reservados
          </p>
        </footer>
      </div>
    </div>
  )
}

export default Home
