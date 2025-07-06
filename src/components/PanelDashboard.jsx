"use client"

import authService from "../services/auth.js"

const PanelDashboard = () => {
  const user = authService.getUser()

  const statCards = [
    {
      title: "Ventas Totales",
      value: "$21,456",
      icon: "💰",
      color: "#4CAF50",
    },
    {
      title: "Nuevos Usuarios",
      value: "2,345",
      icon: "👥",
      color: "#2196F3",
    },
    {
      title: "Productos Vendidos",
      value: "8,234",
      icon: "🛒",
      color: "#FF9800",
    },
    {
      title: "Visitas al Sitio",
      value: "12,567",
      icon: "📊",
      color: "#9C27B0",
    },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>
          Bienvenido, {user?.nombre} {user?.apellido}
        </p>
      </div>
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Accesos Rápidos</h2>
          <div className="quick-actions">
            <button className="quick-action-btn">
              <span>➕</span>
              Nuevo Producto
            </button>
            <button className="quick-action-btn">
              <span>📝</span>
              Nueva Publicación
            </button>
            <button className="quick-action-btn">
              <span>🎨</span>
              Nuevo Taller
            </button>
            {authService.isAdmin() && (
              <button className="quick-action-btn">
                <span>👤</span>
                Nuevo Usuario
              </button>
            )}
          </div>
        </div>
        <div className="dashboard-section">
          <h2>Actividad Reciente</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">✅</span>
              <div className="activity-content">
                <p>Sistema iniciado correctamente</p>
                <small>Hace unos momentos</small>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">👤</span>
              <div className="activity-content">
                <p>Usuario {user?.nombre} ha iniciado sesión</p>
                <small>Ahora</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PanelDashboard
