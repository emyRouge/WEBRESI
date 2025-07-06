"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import authService from "../services/auth.js"
import "../styles/login.css"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    // Si ya está autenticado, redirigir al panel
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        const isValid = await authService.validateToken()
        if (isValid) {
          navigate("/panel", { replace: true })
        }
      }
    }
    checkAuth()
  }, [navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("") // Limpiar error al escribir
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("Intentando login con:", formData.email)
      const result = await authService.login(formData.email, formData.password)

      console.log("Resultado del login:", result)

      if (result.success) {
        console.log("Login exitoso, redirigiendo a panel...")
        // Usar replace para evitar que el usuario pueda volver al login con el botón atrás
        navigate("/panel", { replace: true })
      } else {
        setError(result.message || "Error en el login")
      }
    } catch (error) {
      console.error("Error en login:", error)
      setError("Error de conexión con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src="/logo.png" alt="Logo" className="login-logo" />
          <h1>Panel de Administración</h1>
          <p>Ingresa tus credenciales para acceder</p>
          <button type="button" className="back-to-home-btn" onClick={() => navigate("/")}>
            ← Volver al inicio
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="login-footer">
          <div className="test-credentials">
            <h4>Credenciales de prueba:</h4>
            <p>
              <strong>Admin:</strong> direccion@proyectoresiliente.org / admin123
            </p>
            <p>
              <strong>Empleado:</strong> empleado@resiliente.com / empleado123
            </p>
          </div>

          <div className="login-navigation">
            <button type="button" className="home-link-btn" onClick={() => navigate("/")}>
              🏠 Ir al sitio web
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
