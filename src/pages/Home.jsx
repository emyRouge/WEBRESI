import { Link } from "react-router-dom"
import { Coffee, GraduationCap, HandHeart, BookOpen, ShoppingBag, Heart, ArrowRight } from "lucide-react"
import "../styles/home.css"

const Home = () => {
  const menuItems = [
    {
      name: "Conócenos",
      href: "/conocenos",
      description: "Nuestra historia y misión",
      icon: Coffee,
      color: "amber-orange",
    },
    {
      name: "Talleres",
      href: "/talleres",
      description: "Capacitación y formación",
      icon: GraduationCap,
      color: "blue-indigo",
    },
    {
      name: "Proyectos de Inclusión",
      href: "/proyectos",
      description: "Iniciativas que transforman vidas",
      icon: HandHeart,
      color: "green-emerald",
    },
    {
      name: "Blog",
      href: "/blog",
      description: "Historias y noticias",
      icon: BookOpen,
      color: "purple-violet",
    },
    {
      name: "Tienda",
      href: "/tienda",
      description: "Productos con propósito",
      icon: ShoppingBag,
      color: "pink-rose",
    },
    {
      name: "¿Cómo Apoyar el Proyecto?",
      href: "/apoyo",
      description: "Únete a nuestra causa",
      icon: Heart,
      color: "red-pink",
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
                <Coffee size={60} />
                <span>R</span>
              </div>
            </div>
          </div>
          <h1 className="main-title">Resiliente</h1>
          <p className="main-subtitle">Cambia tu café, cambia el mundo</p>
        </header>

        {/* Menu Grid */}
        <main className="menu-main">
          <div className="cards-grid">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="elegant-menu-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-content">
                    <div className={`card-icon-wrapper ${item.color}`}>
                      <IconComponent size={24} className="card-icon-svg" />
                    </div>
                    <div className="card-text">
                      <h3 className="card-title-elegant">{item.name}</h3>
                      <p className="card-description-elegant">{item.description}</p>
                    </div>
                    <div className="card-arrow">
                      <ArrowRight size={20} className="arrow-icon" />
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
            <a href="#" className="social-link">
              <span className="social-icon">📘</span>
              <span>@resilientecafe</span>
            </a>
            <a href="#" className="social-link">
              <span className="social-icon">📷</span>
              <span>@resilientecafe</span>
            </a>
            <a href="#" className="social-link">
              <span className="social-icon">📺</span>
              <span>Resiliente Café</span>
            </a>
          </div>
          <p className="copyright-text">© {new Date().getFullYear()} - Última actualización</p>
        </footer>
      </div>
    </div>
  )
}

export default Home
