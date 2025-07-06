"use client"
import authService from "../services/auth.js"

const PanelNavbar = ({
  currentPage,
  setCurrentPage,
  onLogout,
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
}) => {
  const user = authService.getUser()
  const isAdmin = authService.isAdmin()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "productos", label: "Productos", icon: "🛍️" },
    { id: "productos-tienda", label: "Productos Tienda", icon: "🏪" },
    { id: "meseros", label: "Meseros", icon: "👨‍💼" },
    { id: "talleres", label: "Talleres", icon: "🎨" },
    { id: "publicaciones", label: "Publicaciones", icon: "📝" },
    { id: "senas", label: "Señas", icon: "👋" },
    { id: "condiciones", label: "Condiciones", icon: "⚕️" },
    ...(isAdmin ? [{ id: "usuarios", label: "Usuarios", icon: "👥" }] : []),
  ]

  return (
    <>
      {/* Header móvil */}
      <div className="panel-header-mobile">
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
        <h1>Panel Admin</h1>
        <button className="logout-btn-mobile" onClick={onLogout}>
          🚪
        </button>
      </div>

      {/* Sidebar */}
      <div className={`panel-sidebar ${sidebarOpen ? "open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}>
        {/* Botón de colapsar - solo visible en desktop */}
        <button
          className="sidebar-collapse-btn desktop-only"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {sidebarCollapsed ? "→" : "←"}
        </button>

        <div className="sidebar-header">
          <img src="/logo.png" alt="Logo" className="sidebar-logo" />
          {!sidebarCollapsed && <h2>Panel Admin</h2>}
        </div>

        {!sidebarCollapsed && (
          <div className="sidebar-user">
            <div className="user-avatar">{user?.nombre?.charAt(0)?.toUpperCase() || "U"}</div>
            <div className="user-info">
              <p className="user-name">
                {user?.nombre} {user?.apellido}
              </p>
              <p className="user-role">{user?.rol}</p>
            </div>
          </div>
        )}

        {sidebarCollapsed && (
          <div className="sidebar-user-collapsed">
            <div className="user-avatar">{user?.nombre?.charAt(0)?.toUpperCase() || "U"}</div>
          </div>
        )}

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? "active" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}
              onClick={() => {
                setCurrentPage(item.id)
                setSidebarOpen(false)
              }}
              title={sidebarCollapsed ? item.label : ""}
            >
              <span className="nav-icon">{item.icon}</span>
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className={`logout-btn ${sidebarCollapsed ? "collapsed" : ""}`}
            onClick={onLogout}
            title={sidebarCollapsed ? "Cerrar Sesión" : ""}
          >
            <span className="nav-icon">🚪</span>
            {!sidebarCollapsed && <span className="nav-label">Cerrar Sesión</span>}
          </button>
        </div>
      </div>
    </>
  )
}

export default PanelNavbar
