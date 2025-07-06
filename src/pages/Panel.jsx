"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import authService from "../services/auth.js"
import PanelNavbar from "../components/PanelNavbar.jsx"
import PanelDashboard from "../components/PanelDashboard.jsx"
import ProductosPage from "../components/ProductosPage.jsx"
import ProductosTiendaPage from "../components/ProductosTiendaPage.jsx"
import MeserosPage from "../components/MeserosPage.jsx"
import TalleresPage from "../components/TalleresPage.jsx"
import PublicacionesPage from "../components/PublicacionesPage.jsx"
import SenasPage from "../components/SenasPage.jsx"
import CondicionesPage from "../components/CondicionesPage.jsx"
import UsuariosPage from "../components/UsuariosPage.jsx"
import LoadingSpinner from "../components/LoadingSpinner.jsx"
import "../styles/panel.css"
import "../styles/AdminPanel.css"

const Panel = () => {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const validateAuth = async () => {
      if (!authService.isAuthenticated()) {
        navigate("/login", { replace: true })
        return
      }

      const isValid = await authService.validateToken()
      if (!isValid) {
        navigate("/login", { replace: true })
        return
      }

      setLoading(false)
    }

    validateAuth()
  }, [navigate])

  const handleLogout = () => {
    authService.logout()
    navigate("/", { replace: true })
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <PanelDashboard />
      case "productos":
        return <ProductosPage />
      case "productos-tienda":
        return <ProductosTiendaPage />
      case "meseros":
        return <MeserosPage />
      case "talleres":
        return <TalleresPage />
      case "publicaciones":
        return <PublicacionesPage />
      case "senas":
        return <SenasPage />
      case "condiciones":
        return <CondicionesPage />
      case "usuarios":
        return authService.isAdmin() ? <UsuariosPage /> : <PanelDashboard />
      default:
        return <PanelDashboard />
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="panel-container">
      <PanelNavbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
      <div
        className={`panel-content ${sidebarOpen ? "sidebar-open" : ""} ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
      >
        {renderCurrentPage()}
      </div>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  )
}

export default Panel
