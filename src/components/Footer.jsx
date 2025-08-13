"use client"

import { useState, useEffect } from "react"
import { Facebook, Instagram, Linkedin, Mail, MapPin } from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [socialStats, setSocialStats] = useState({
    facebook: { followers: 18000 },
    instagram: { followers: 8900 },
    linkedin: { followers: 27 },
  })

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  useEffect(() => {
    const updateStats = () => {
      setSocialStats((prev) => ({
        facebook: {
          ...prev.facebook,
          followers: prev.facebook.followers + Math.floor(Math.random() * 3),
        },
        instagram: {
          ...prev.instagram,
          followers: prev.instagram.followers + Math.floor(Math.random() * 2),
        },
        linkedin: {
          ...prev.linkedin,
          followers: prev.linkedin.followers + (Math.random() > 0.8 ? 1 : 0),
        },
      }))
    }

    const interval = setInterval(updateStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const styles = {
    footer: {
      backgroundColor: "#1a1a1a",
      color: "#ffffff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "60px 0 30px",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 24px",
    },
    content: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "48px",
      marginBottom: "48px",
    },
    brandSection: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    brandHeader: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      marginBottom: "8px",
    },
    logo: {
      width: "48px",
      height: "48px",
      backgroundColor: "#3b82f6",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      fontWeight: "bold",
      color: "white",
    },
    brandText: {
      display: "flex",
      flexDirection: "column",
    },
    brandTitle: {
      fontSize: "24px",
      fontWeight: "700",
      margin: "0",
      color: "#ffffff",
    },
    brandSubtitle: {
      fontSize: "14px",
      color: "#9ca3af",
      margin: "2px 0 0",
    },
    description: {
      color: "#d1d5db",
      lineHeight: "1.6",
      fontSize: "15px",
      margin: "0",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "600",
      margin: "0 0 24px",
      color: "#ffffff",
    },
    contactList: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    contactItem: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      color: "#d1d5db",
      textDecoration: "none",
      transition: "color 0.2s ease",
      padding: "8px 0",
    },
    contactItemHover: {
      color: "#3b82f6",
    },
    socialList: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    socialItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 16px",
      backgroundColor: "#262626",
      borderRadius: "8px",
      textDecoration: "none",
      color: "#ffffff",
      transition: "all 0.2s ease",
      border: "1px solid transparent",
    },
    socialItemHover: {
      backgroundColor: "#333333",
      transform: "translateY(-1px)",
    },
    socialInfo: {
      display: "flex",
      flexDirection: "column",
      gap: "2px",
    },
    socialName: {
      fontSize: "14px",
      fontWeight: "500",
    },
    socialStats: {
      fontSize: "12px",
      color: "#9ca3af",
    },
    bottom: {
      borderTop: "1px solid #374151",
      paddingTop: "24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "16px",
    },
    copyright: {
      color: "#9ca3af",
      fontSize: "14px",
      margin: "0",
    },
    links: {
      display: "flex",
      gap: "24px",
      flexWrap: "wrap",
    },
    link: {
      color: "#9ca3af",
      textDecoration: "none",
      fontSize: "14px",
      transition: "color 0.2s ease",
    },
    linkHover: {
      color: "#ffffff",
    },
  }

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.content}>
          {/* Brand Section */}
          <div style={styles.brandSection}>
            <div style={styles.brandHeader}>
           
              <div style={styles.brandText}>
                <h3 style={styles.brandTitle}>Proyecto Resiliente</h3>
                <p style={styles.brandSubtitle}>Emprendimiento Social</p>
              </div>
            </div>
            <p style={styles.description}>
              Somos una organización social que a través de cafeterías apoyamos la creación y fortalecimiento de
              proyectos comunitarios, promoviendo la inclusión laboral.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h4 style={styles.sectionTitle}>Contacto</h4>
            <div style={styles.contactList}>
              <a
                href="mailto:direccion@proyectoresiliente.org"
                style={styles.contactItem}
                onMouseEnter={(e) => (e.target.style.color = styles.contactItemHover.color)}
                onMouseLeave={(e) => (e.target.style.color = styles.contactItem.color)}
              >
                <Mail size={18} style={{ color: "#3b82f6", marginTop: "2px" }} />
                <span>direccion@proyectoresiliente.org</span>
              </a>
              <div style={styles.contactItem}>
                <MapPin size={18} style={{ color: "#3b82f6", marginTop: "2px" }} />
                <span>
                  Av. José María Morelos y Pavón 190
                  <br />
                  Cuernavaca, Morelos 62000
                </span>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div>
            <h4 style={styles.sectionTitle}>Síguenos</h4>
            <div style={styles.socialList}>
              <a
                href="https://www.facebook.com/profile.php?id=100063500079360"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.socialItem}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = styles.socialItemHover.backgroundColor
                  e.currentTarget.style.transform = styles.socialItemHover.transform
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = styles.socialItem.backgroundColor
                  e.currentTarget.style.transform = "none"
                }}
              >
                <Facebook size={20} style={{ color: "#1877f2" }} />
                <div style={styles.socialInfo}>
                  <div style={styles.socialName}>Facebook</div>
                  <div style={styles.socialStats}>{formatNumber(socialStats.facebook.followers)} seguidores</div>
                </div>
              </a>

              <a
                href="https://www.instagram.com/resilienmx/"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.socialItem}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = styles.socialItemHover.backgroundColor
                  e.currentTarget.style.transform = styles.socialItemHover.transform
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = styles.socialItem.backgroundColor
                  e.currentTarget.style.transform = "none"
                }}
              >
                <Instagram size={20} style={{ color: "#e4405f" }} />
                <div style={styles.socialInfo}>
                  <div style={styles.socialName}>Instagram</div>
                  <div style={styles.socialStats}>{formatNumber(socialStats.instagram.followers)} seguidores</div>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/company/proyecto-resiliente/"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.socialItem}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = styles.socialItemHover.backgroundColor
                  e.currentTarget.style.transform = styles.socialItemHover.transform
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = styles.socialItem.backgroundColor
                  e.currentTarget.style.transform = "none"
                }}
              >
                <Linkedin size={20} style={{ color: "#0077b5" }} />
                <div style={styles.socialInfo}>
                  <div style={styles.socialName}>LinkedIn</div>
                  <div style={styles.socialStats}>{socialStats.linkedin.followers} seguidores</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={styles.bottom}>
          <p style={styles.copyright}>© {currentYear} Proyecto Resiliente - Todos los derechos reservados</p>
          <div style={styles.links}>
          
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
