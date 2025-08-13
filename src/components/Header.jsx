"use client"

import { Link, useLocation } from "react-router-dom"
import { User, Menu, X, Coffee, Heart } from "lucide-react"
import { useState } from "react"
import "../styles/header.css"
import logo from "./logo.png"

const Header = () => {
  const location = useLocation()
  const isHome = location.pathname === "/"
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Conócenos", href: "/conocenos", icon: Heart },
    { name: "Talleres", href: "/talleres", icon: Coffee },
    { name: "Proyectos", href: "/proyectos", icon: Coffee },
    { name: "Blog", href: "/blog", icon: Coffee },
    { name: "Tienda", href: "/tienda", icon: Coffee },
    { name: "Apoyo", href: "/apoyo", icon: Heart },
  ]

  // No mostrar header en la página de inicio
  if (isHome) {
    return null
  }

  return (
    <header className="page-header">
      {/* Decorative top bar */}
    
      <div className="header-container">
        <div className="header-content">
          {/* Logo expandido y más elegante */}
          <Link to="/" className="header-brand">
            <div className="logo-container">
              <img src={logo || "/placeholder.svg"} alt="Resiliente Logo" className="header-logo-large" />
              <div className="logo-glow-large"></div>
            </div>
            <div className="header-text">
              <span className="header-title">Proyecto Resiliente</span>
              <span className="header-subtitle">Café con propósito social</span>
              <div className="brand-underline"></div>
            </div>
          </Link>

          {/* Navegación desktop mejorada */}
          <nav className="header-nav">
            {navigation.map((item, index) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-link ${location.pathname === item.href ? "nav-active" : ""}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <IconComponent size={16} className="nav-icon" />
                  <span>{item.name}</span>
                  <div className="nav-hover-effect"></div>
                </Link>
              )
            })}
          </nav>

          {/* Acciones mejoradas */}
          <div className="header-actions">
          
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              <div className="menu-btn-bg"></div>
            </button>
          </div>
        </div>

        {/* Menú móvil mejorado */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              {navigation.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`mobile-link ${location.pathname === item.href ? "mobile-active" : ""}`}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <IconComponent size={18} className="mobile-icon" />
                    <span>{item.name}</span>
                    <div className="mobile-link-arrow">→</div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
