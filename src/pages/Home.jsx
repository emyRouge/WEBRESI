import { Link } from "react-router-dom"
import { ArrowRight, Coffee } from "lucide-react"
import Footer from "../components/Footer"
import "../styles/home.css"

const Home = () => {
  const menuItems = [
    {
      name: "Conócenos",
      href: "/conocenos",
      description: "Nuestra historia y misión transformadora",
      iconSrc: "/conocenos.png",
      color: "warm-amber",
    },
    {
      name: "Talleres",
      href: "/talleres",
      description: "Capacitación y formación especializada",
      iconSrc: "/talleres.png",
      color: "rich-emerald",
    },
    {
      name: "Proyectos de Inclusión",
      href: "/proyectos",
      description: "Iniciativas que transforman comunidades",
      iconSrc: "/proyectos.png",
      color: "deep-sapphire",
    },
    {
      name: "Blog",
      href: "/blog",
      description: "Historias inspiradoras y noticias",
      iconSrc: "/blog.png",
      color: "royal-purple",
    },
    {
      name: "Tienda",
      href: "/tienda",
      description: "Productos artesanales con propósito",
      iconSrc: "/tienda.png",
      color: "sunset-coral",
    },
    {
      name: "¿Cómo Apoyar el Proyecto?",
      href: "/apoyo",
      description: "Únete a nuestra causa social",
      iconSrc: "/apoyo.png",
      color: "ocean-teal",
    },
  ]

  const handleImageError = (e) => {
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
  }

  const handleImageLoad = () => {
    console.log("Logo cargado exitosamente")
  }

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
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
              <div className="logo-fallback-content">
                <Coffee size={60} />
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
            {menuItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                className="elegant-menu-card"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="card-content">
                  <div className={`card-icon-wrapper ${item.color}`}>
                    <img
                      src={item.iconSrc || "/placeholder.svg"}
                      alt={`Icono ${item.name}`}
                      className="card-icon-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="card-text">
                    <h3 className="card-title-elegant">{item.name}</h3>
                    <p className="card-description-elegant">{item.description}</p>
                  </div>
                  <div className="card-arrow">
                    <ArrowRight size={18} className="arrow-icon" />
                  </div>
                </div>
                <div className="card-shine"></div>
              </Link>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default Home
