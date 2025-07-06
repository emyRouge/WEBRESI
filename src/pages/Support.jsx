"use client"
import { useState } from "react"
import {
  Heart,
  Users,
  DollarSign,
  Coffee,
  HandHeart,
  Gift,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Check,
  Star,
  Target,
  Award,
  Lightbulb,
} from "lucide-react"
import "../styles/support.css"

const Support = () => {
  const [selectedAmount, setSelectedAmount] = useState(50000)
  const [customAmount, setCustomAmount] = useState("")

  const supportOptions = [
    {
      id: 1,
      title: "Voluntariado",
      description:
        "Únete como voluntario en nuestros talleres y actividades comunitarias. Tu tiempo y habilidades pueden transformar vidas.",
      icon: Users,
      color: "blue",
      benefits: [
        "Capacitación gratuita en LSM",
        "Certificado de voluntariado",
        "Experiencia en proyectos sociales",
        "Red de contactos profesionales",
      ],
      cta: "Ser Voluntario",
    },
    {
      id: 2,
      title: "Donaciones Económicas",
      description:
        "Apoya económicamente nuestros programas de inclusión social. Cada peso cuenta para crear oportunidades.",
      icon: DollarSign,
      color: "green",
      benefits: [
        "Deducible de impuestos",
        "Reporte de impacto trimestral",
        "Reconocimiento público",
        "Visitas a proyectos financiados",
      ],
      cta: "Donar Ahora",
    },
    {
      id: 3,
      title: "Compra con Propósito",
      description: "Cada taza de café que compras financia directamente nuestros proyectos de transformación social.",
      icon: Coffee,
      color: "amber",
      benefits: [
        "Café de alta calidad",
        "Impacto social directo",
        "Apoyo a productores locales",
        "Experiencia gastronómica única",
      ],
      cta: "Visitar Tienda",
    },
    {
      id: 4,
      title: "Patrocinio Empresarial",
      description:
        "Alianzas estratégicas para empresas comprometidas con la responsabilidad social y la inclusión laboral.",
      icon: HandHeart,
      color: "purple",
      benefits: [
        "Branding en eventos",
        "Certificación RSE",
        "Networking especializado",
        "Impacto medible y reportable",
      ],
      cta: "Ser Patrocinador",
    },
    {
      id: 5,
      title: "Donación de Productos",
      description: "Dona productos, equipos o servicios que necesitamos para nuestros talleres y programas formativos.",
      icon: Gift,
      color: "pink",
      benefits: ["Deducción fiscal", "Reconocimiento público", "Impacto directo visible", "Certificado de donación"],
      cta: "Donar Productos",
    },
    {
      id: 6,
      title: "Eventos y Actividades",
      description: "Organiza o participa en eventos de recaudación de fondos y sensibilización sobre inclusión social.",
      icon: Calendar,
      color: "indigo",
      benefits: ["Eventos personalizados", "Apoyo logístico completo", "Material promocional", "Cobertura mediática"],
      cta: "Organizar Evento",
    },
  ]

  const donationAmounts = [25000, 50000, 100000, 250000, 500000]

  const impactStats = [
    { number: "1 Taller", description: "Con $50,000 financias un taller completo", icon: Lightbulb },
    { number: "5 Becas", description: "Con $100,000 otorgas 5 becas de capacitación", icon: Award },
    { number: "1 Proyecto", description: "Con $250,000 apoyas un proyecto comunitario", icon: Target },
    { number: "10 Empleos", description: "Con $500,000 generas 10 oportunidades laborales", icon: Users },
  ]

  const testimonials = [
    {
      name: "Empresa TechSol",
      type: "Patrocinador Corporativo",
      content:
        "Ser patrocinador de Resiliente ha fortalecido nuestro compromiso con la RSE y nos ha conectado con talento increíble.",
      impact: "Financió 3 talleres de tecnología",
    },
    {
      name: "María Fernández",
      type: "Voluntaria",
      content:
        "Ser voluntaria en Resiliente cambió mi perspectiva. Ahora soy instructora certificada en LSM y ayudo a transformar vidas.",
      impact: "120 horas de voluntariado",
    },
    {
      name: "Fundación Esperanza",
      type: "Donante Regular",
      content:
        "Nuestras donaciones mensuales han permitido que Resiliente expanda su impacto a más comunidades vulnerables.",
      impact: "Donante desde hace 2 años",
    },
  ]

  return (
    <div className="support-container">
      {/* Hero Section */}
      <section className="support-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Heart size={20} />
            <span>Únete al Cambio</span>
          </div>
          <h1 className="hero-title">
            ¿Cómo Apoyar
            <span className="hero-highlight"> el Proyecto?</span>
          </h1>
          <p className="hero-description">
            Existen muchas formas de ser parte de la transformación social. Desde voluntariado hasta donaciones, cada
            contribución cuenta para crear un mundo más inclusivo y justo.
          </p>
        </div>
      </section>

      {/* Support Options */}
      <section className="support-options">
        <div className="options-container">
          <div className="section-header">
            <div className="section-badge">
              <HandHeart size={16} />
              <span>Formas de Apoyar</span>
            </div>
            <h2 className="section-title">Elige tu Forma de Contribuir</h2>
            <p className="section-description">
              Cada forma de apoyo es valiosa y contribuye directamente a nuestros proyectos de inclusión social
            </p>
          </div>
          <div className="options-grid">
            {supportOptions.map((option, index) => {
              const IconComponent = option.icon
              return (
                <div
                  key={option.id}
                  className={`option-card ${option.color}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="option-header">
                    <div className="option-icon">
                      <IconComponent size={28} />
                    </div>
                    <h3 className="option-title">{option.title}</h3>
                  </div>
                  <p className="option-description">{option.description}</p>
                  <div className="option-benefits">
                    <h4>Beneficios:</h4>
                    <ul>
                      {option.benefits.map((benefit, idx) => (
                        <li key={idx}>
                          <Check size={14} />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="option-actions">
                    <button className="option-btn">
                      <span>{option.cta}</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="donation-section">
        <div className="donation-container">
          <div className="donation-content">
            <div className="donation-info">
              <h2 className="donation-title">Haz una Donación</h2>
              <p className="donation-description">
                Tu donación tiene un impacto directo y medible en nuestra comunidad. Elige el monto que deseas aportar y
                ve cómo tu contribución transforma vidas.
              </p>
              <div className="amount-selector">
                <h3>Selecciona un monto:</h3>
                <div className="amount-buttons">
                  {donationAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setSelectedAmount(amount)}
                      className={`amount-btn ${selectedAmount === amount ? "active" : ""}`}
                    >
                      ${amount.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="custom-amount">
                  <label>O ingresa un monto personalizado:</label>
                  <div className="custom-input">
                    <span>$</span>
                    <input
                      type="number"
                      placeholder="Monto personalizado"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                    />
                  </div>
                </div>
                <button className="donate-btn">
                  <Heart size={18} />
                  <span>Donar ${(customAmount || selectedAmount).toLocaleString()}</span>
                </button>
              </div>
            </div>
            <div className="impact-preview">
              <h3>Tu Impacto</h3>
              <div className="impact-grid">
                {impactStats.map((stat, index) => {
                  const IconComponent = stat.icon
                  return (
                    <div key={index} className="impact-item">
                      <div className="impact-icon">
                        <IconComponent size={24} />
                      </div>
                      <div className="impact-text">
                        <strong>{stat.number}</strong>
                        <p>{stat.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="section-header">
            <div className="section-badge">
              <Star size={16} />
              <span>Testimonios</span>
            </div>
            <h2 className="section-title">Voces de Nuestra Comunidad</h2>
            <p className="section-description">Conoce las experiencias de quienes ya son parte del cambio</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="testimonial-content">
                  <p className="testimonial-text">"{testimonial.content}"</p>
                  <div className="testimonial-impact">
                    <Award size={16} />
                    <span>{testimonial.impact}</span>
                  </div>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.name.charAt(0)}</div>
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-type">{testimonial.type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-info">
            <h2 className="contact-title">¿Tienes Preguntas?</h2>
            <p className="contact-description">
              Estamos aquí para ayudarte a encontrar la mejor forma de apoyar nuestro proyecto
            </p>
            <div className="contact-methods">
              <div className="contact-method">
                <div className="method-icon">
                  <Mail size={24} />
                </div>
                <div className="method-info">
                  <h4>Email</h4>
                  <p>apoyo@proyectoresiliente.org</p>
                </div>
              </div>
              <div className="contact-method">
                <div className="method-icon">
                  <Phone size={24} />
                </div>
                <div className="method-info">
                  <h4>Teléfono</h4>
                  <p>+52 777 123 4567</p>
                </div>
              </div>
              <div className="contact-method">
                <div className="method-icon">
                  <MapPin size={24} />
                </div>
                <div className="method-info">
                  <h4>Ubicación</h4>
                  <p>Av. Morelos 215, Cuernavaca, México</p>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-cta">
            <div className="cta-card">
              <h3>¿Listo para Hacer la Diferencia?</h3>
              <p>Únete a nuestra comunidad de personas comprometidas con el cambio social</p>
              <button className="cta-button">
                <Heart size={18} />
                Comenzar Ahora
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Support
