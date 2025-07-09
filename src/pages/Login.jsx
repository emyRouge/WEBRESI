"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import authService from "../services/auth.js"
import Header from "../components/Header"
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Shield } from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
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
    <>
      <Header />
      <div className="login-page">
        <div className="login-container">
          <div className="login-card">
            {/* Header del login */}
            <div className="login-header">
              <div className="login-icon">
                <Shield size={32} />
              </div>
              <h1>Panel de Administración</h1>
              <p>Acceso exclusivo para empleados autorizados</p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
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
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <Shield size={18} />
                    <span>Iniciar Sesión</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="login-footer">
              <div className="test-credentials">
               
                <p>
                 
                </p>
                <p>
               
                </p>
              </div>

              <button type="button" className="back-btn" onClick={() => navigate("/")}>
                <ArrowLeft size={16} />
                <span>Volver al sitio web</span>
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
          .login-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding-top: 80px; /* Espacio para el header */
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 80px 20px 20px;
          }

          .login-container {
            width: 100%;
            max-width: 480px;
            animation: slideUp 0.6s ease-out;
          }

          .login-card {
            background: white;
            border-radius: 24px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            padding: 3rem;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          .login-header {
            text-align: center;
            margin-bottom: 2.5rem;
          }

          .login-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 50%;
            margin-bottom: 1.5rem;
            color: white;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
          }

          .login-header h1 {
            color: #1a202c;
            margin-bottom: 0.5rem;
            font-size: 1.875rem;
            font-weight: 700;
            font-family: "Playfair Display", serif;
          }

          .login-header p {
            color: #718096;
            font-size: 1rem;
            line-height: 1.5;
          }

          .login-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .form-group label {
            color: #2d3748;
            font-weight: 600;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
          }

          .input-icon {
            position: absolute;
            left: 1rem;
            color: #a0aec0;
            z-index: 2;
            transition: color 0.3s ease;
          }

          .input-wrapper:focus-within .input-icon {
            color: #667eea;
          }

          .form-group input {
            width: 100%;
            padding: 1rem 1rem 1rem 3rem;
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: #f8fafc;
            color: #2d3748;
          }

          .form-group input:focus {
            outline: none;
            border-color: #667eea;
            background: white;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
          }

          .form-group input:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .password-toggle {
            position: absolute;
            right: 1rem;
            background: none;
            border: none;
            color: #a0aec0;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 0.25rem;
            transition: all 0.2s ease;
          }

          .password-toggle:hover {
            color: #667eea;
            background: rgba(102, 126, 234, 0.1);
          }

          .error-message {
            background: linear-gradient(135deg, #fed7d7, #feb2b2);
            color: #c53030;
            padding: 1rem 1.25rem;
            border-radius: 12px;
            font-size: 0.875rem;
            text-align: center;
            border: 1px solid #feb2b2;
            font-weight: 500;
            animation: shake 0.5s ease-in-out;
          }

          .login-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 1rem 1.5rem;
            border-radius: 16px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          }

          .login-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
          }

          .login-button:active:not(:disabled) {
            transform: translateY(0);
          }

          .login-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
          }

          .loading-spinner {
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          .login-footer {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .test-credentials {
            background: linear-gradient(135deg, #f0fff4, #c6f6d5);
            padding: 1.25rem;
            border-radius: 12px;
            border: 1px solid #9ae6b4;
          }

          .test-credentials h4 {
            color: #2f855a;
            margin-bottom: 0.75rem;
            font-size: 0.875rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .test-credentials p {
            color: #2f855a;
            font-size: 0.875rem;
            margin: 0.25rem 0;
            font-family: "Monaco", "Menlo", monospace;
          }

          .back-btn {
            background: rgba(102, 126, 234, 0.1);
            border: 1px solid rgba(102, 126, 234, 0.2);
            color: #667eea;
            padding: 0.75rem 1rem;
            border-radius: 12px;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            font-weight: 500;
          }

          .back-btn:hover {
            background: rgba(102, 126, 234, 0.15);
            border-color: rgba(102, 126, 234, 0.3);
            transform: translateY(-1px);
          }

          /* Animaciones */
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes shake {
            0%, 100% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(-5px);
            }
            75% {
              transform: translateX(5px);
            }
          }

          /* Responsive */
          @media (max-width: 640px) {
            .login-page {
              padding: 100px 1rem 1rem;
            }

            .login-card {
              padding: 2rem 1.5rem;
              border-radius: 20px;
            }

            .login-header h1 {
              font-size: 1.5rem;
            }

            .login-icon {
              width: 60px;
              height: 60px;
              margin-bottom: 1rem;
            }

            .form-group input {
              padding: 0.875rem 0.875rem 0.875rem 2.75rem;
            }

            .input-icon {
              left: 0.875rem;
            }

            .password-toggle {
              right: 0.875rem;
            }
          }

          @media (max-width: 480px) {
            .login-card {
              padding: 1.5rem 1rem;
            }

            .test-credentials {
              padding: 1rem;
            }
          }
        `}</style>
      </div>
    </>
  )
}

export default Login