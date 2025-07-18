"use client"

import { Link, useLocation } from "react-router-dom"
import { User, Menu, X } from "lucide-react"
import { useState } from "react"
import "../styles/header.css" // Usar el nuevo archivo CSS
import logo from "./logo.png" // Asegúrate de que esta ruta sea correcta en tu proyecto

const Header = () => {
  const location = useLocation()
  const isHome = location.pathname === "/"
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Conócenos", href: "/conocenos" },
    { name: "Talleres", href: "/talleres" },
    { name: "Proyectos", href: "/proyectos" },
    { name: "Blog", href: "/blog" },
    { name: "Tienda", href: "/tienda" },
    { name: "Apoyo", href: "/apoyo" },
  ]

  // No mostrar header en la página de inicio
  if (isHome) {
    return null
  }

  return (
    <header className="page-header">
      <div className="header-container">
        <div className="header-content">
          {/* Logo compacto */}
          <Link to="/" className="header-brand">
            <img src={logo || "/placeholder.svg"} alt="Resiliente Logo" className="header-logo" />
            <div className="header-text">
              <span className="header-title">Resiliente</span>
              <span className="header-subtitle">Café con propósito</span>
            </div>
          </Link>

          {/* Navegación desktop */}
          <nav className="header-nav">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${location.pathname === item.href ? "nav-active" : ""}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Acciones */}
          <div className="header-actions">
            {/* Enlace de login ahora solo con icono */}
            <Link to="/login" className="login-icon-btn" aria-label="Acceso para empleados">
              <User size={18} />
            </Link>
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`mobile-link ${location.pathname === item.href ? "mobile-active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
