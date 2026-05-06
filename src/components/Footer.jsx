import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import "../styles/footer.css"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-accent-bar" />
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo-wrap">
              <img
                src="/logo.png"
                alt="Proyecto Resiliente"
                className="footer-logo-img"
                onError={(e) => {
                  e.target.style.display = "none"
                }}
              />
            </div>
            <h3 className="footer-brand-name">Proyecto Resiliente</h3>
            <p className="footer-brand-tag">Emprendimiento Social</p>
            <p className="footer-brand-desc">
              Somos una organización social que a través de cafeterías apoyamos la creación y
              fortalecimiento de proyectos comunitarios, promoviendo la inclusión laboral.
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="footer-col-title">Contacto</h4>
            <div className="footer-contact-list">
              <a href="mailto:direccion@proyectoresiliente.org" className="footer-contact-link">
                <Mail size={16} />
                <span>direccion@proyectoresiliente.org</span>
              </a>
              <a href="tel:+527771234567" className="footer-contact-link">
                <Phone size={16} />
                <span>+52 777 123 4567</span>
              </a>
              <div className="footer-contact-link no-hover">
                <MapPin size={16} />
                <span>Av. José María Morelos y Pavón 190, Cuernavaca, Morelos</span>
              </div>
            </div>
          </div>

          {/* Redes */}
          <div>
            <h4 className="footer-col-title">Síguenos</h4>
            <div className="footer-social-list">
              <a
                href="https://www.facebook.com/profile.php?id=100063500079360"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-item"
              >
                <Facebook size={20} className="icon-facebook" />
                <div>
                  <p className="social-platform">Facebook</p>
                  <p className="social-count">18.3K seguidores</p>
                </div>
              </a>
              <a
                href="https://www.instagram.com/resilienmx/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-item"
              >
                <Instagram size={20} className="icon-instagram" />
                <div>
                  <p className="social-platform">Instagram</p>
                  <p className="social-count">9.1K seguidores</p>
                </div>
              </a>
              <a
                href="https://www.linkedin.com/company/proyecto-resiliente/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-item"
              >
                <Linkedin size={20} className="icon-linkedin" />
                <div>
                  <p className="social-platform">LinkedIn</p>
                  <p className="social-count">27 seguidores</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© {currentYear} Proyecto Resiliente · Todos los derechos reservados</p>
          <p className="footer-slogan">Cambia tu café, cambia el mundo</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
