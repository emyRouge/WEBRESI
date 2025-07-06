"use client"

import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <>
      <footer className="modern-footer">
        <div className="footer-container">
          {/* Main Content */}
          <div className="footer-content">
            {/* Brand Section */}
            <div className="footer-brand">
              <div className="brand-logo">
                <div className="logo-circle">
                  <span>R</span>
                </div>
                <div className="brand-text">
                  <h3>Resiliente</h3>
                  <p>Emprendimiento Social</p>
                </div>
              </div>
              <p className="brand-description">
                Somos una organización social que a través de cafeterías apoyamos la creación y fortalecimiento de
                proyectos comunitarios, promoviendo la inclusión laboral.
              </p>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h4 className="section-title">Contacto</h4>
              <div className="contact-items">
                <a href="mailto:direccion@proyectoresiliente.org" className="contact-item">
                  <Mail size={18} />
                  <span>direccion@proyectoresiliente.org</span>
                </a>
                <div className="contact-item">
                  <MapPin size={18} />
                  <span>
                    Av. José María Morelos y Pavón 190
                    <br />
                    Cuernavaca, Morelos 62000
                  </span>
                </div>
                <div className="contact-item">
                  <Phone size={18} />
                  <span>+52 777 123 4567</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="footer-section">
              <h4 className="section-title">Síguenos</h4>
              <div className="social-grid">
                <a
                  href="https://www.facebook.com/profile.php?id=100063500079360"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-card facebook"
                >
                  <Facebook size={24} />
                  <div className="social-info">
                    <span className="social-name">Facebook</span>
                    <span className="social-handle">@Resiliemtemx</span>
                    <span className="social-stats">18K seguidores</span>
                  </div>
                </a>

                <a
                  href="https://www.instagram.com/resilienmx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-card instagram"
                >
                  <Instagram size={24} />
                  <div className="social-info">
                    <span className="social-name">Instagram</span>
                    <span className="social-handle">@resilienmx</span>
                    <span className="social-stats">8.9K seguidores</span>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/company/proyecto-resiliente/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-card linkedin"
                >
                  <Linkedin size={24} />
                  <div className="social-info">
                    <span className="social-name">LinkedIn</span>
                    <span className="social-handle">Proyecto Resiliente</span>
                    <span className="social-stats">27 seguidores</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <div className="bottom-content">
              <p className="copyright">© {currentYear} Proyecto Resiliente - Todos los derechos reservados</p>
              <div className="footer-links">
                <a href="/privacidad">Política de Privacidad</a>
                <a href="/terminos">Términos de Uso</a>
                <a href="/cookies">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .modern-footer {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          color: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .modern-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 2fr 1fr 1.5fr;
          gap: 60px;
          padding: 60px 0 40px;
        }

        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 40px 0 30px;
          }
        }

        /* Brand Section */
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 10px;
        }

        .logo-circle {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 24px;
          color: white;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .brand-text h3 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-text p {
          margin: 2px 0 0;
          font-size: 14px;
          color: rgba(255,255,255,0.7);
          font-weight: 500;
        }

        .brand-description {
          color: rgba(255,255,255,0.8);
          line-height: 1.6;
          font-size: 15px;
          margin: 0;
        }

        /* Section Titles */
        .section-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 25px;
          color: #ffffff;
          position: relative;
          padding-bottom: 10px;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30px;
          height: 2px;
          background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
          border-radius: 1px;
        }

        /* Contact Items */
        .contact-items {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          transition: all 0.3s ease;
          padding: 8px 0;
        }

        .contact-item:hover {
          color: #4ecdc4;
          transform: translateX(5px);
        }

        .contact-item svg {
          margin-top: 2px;
          flex-shrink: 0;
        }

        /* Social Grid */
        .social-grid {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .social-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          text-decoration: none;
          color: white;
          transition: all 0.3s ease;
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
        }

        .social-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
          border-color: rgba(255,255,255,0.2);
        }

        .social-card.facebook:hover {
          background: rgba(24, 119, 242, 0.1);
          border-color: #1877f2;
        }

        .social-card.instagram:hover {
          background: rgba(225, 48, 108, 0.1);
          border-color: #e1306c;
        }

        .social-card.linkedin:hover {
          background: rgba(10, 102, 194, 0.1);
          border-color: #0a66c2;
        }

        .social-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .social-name {
          font-weight: 600;
          font-size: 14px;
        }

        .social-handle {
          font-size: 13px;
          color: rgba(255,255,255,0.7);
        }

        .social-stats {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
        }

        /* Footer Bottom */
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding: 25px 0;
        }

        .bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        @media (max-width: 768px) {
          .bottom-content {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }
        }

        .copyright {
          margin: 0;
          color: rgba(255,255,255,0.6);
          font-size: 14px;
        }

        .footer-links {
          display: flex;
          gap: 25px;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .footer-links {
            justify-content: center;
          }
        }

        .footer-links a {
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: #4ecdc4;
        }
      `}</style>
    </>
  )
}

export default Footer
