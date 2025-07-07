const API_BASE_URL = "https://backresiliente-production.up.railway.app"

class AuthService {
  constructor() {
    this.token = localStorage.getItem("token")
    this.user = JSON.parse(localStorage.getItem("user") || "null")
  }

  async login(email, password) {
    try {
      console.log("Enviando petición de login a:", `${API_BASE_URL}/auth/login`)

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log("Respuesta del servidor:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Datos recibidos:", data)

      if (data.tipo === "SUCCESS" && data.datos) {
        this.token = data.datos.token
        this.user = {
          userId: data.datos.userId,
          email: data.datos.email,
          nombre: data.datos.nombre,
          apellido: data.datos.apellido,
          rol: data.datos.rol,
        }

        localStorage.setItem("token", this.token)
        localStorage.setItem("user", JSON.stringify(this.user))

        console.log("Usuario guardado:", this.user)
        return { success: true, user: this.user }
      } else {
        return { success: false, message: data.mensaje || "Error desconocido" }
      }
    } catch (error) {
      console.error("Error en login:", error)
      return { success: false, message: "Error de conexión con el servidor" }
    }
  }

  async validateToken() {
    if (!this.token) {
      return false
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        this.logout()
        return false
      }

      const data = await response.json()

      if (data.valido && data.datos) {
        this.user = {
          userId: data.datos.userId,
          email: data.datos.email,
          nombre: data.datos.nombre,
          apellido: data.datos.apellido,
          rol: data.datos.rol,
        }
        localStorage.setItem("user", JSON.stringify(this.user))
        return true
      } else {
        this.logout()
        return false
      }
    } catch (error) {
      console.error("Error validando token:", error)
      this.logout()
      return false
    }
  }

  logout() {
    this.token = null
    this.user = null
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    // Limpiar cualquier otro dato de sesión si existe
    localStorage.removeItem("lastActivity")

    console.log("Sesión cerrada completamente")
  }

  isAuthenticated() {
    return !!this.token && !!this.user
  }

  getUser() {
    return this.user
  }

  getToken() {
    return this.token
  }

  isAdmin() {
    return this.user?.rol === "ADMIN"
  }

  isEmployee() {
    return this.user?.rol === "EMPLEADO"
  }

  // Método para refrescar los datos del usuario desde localStorage
  refreshUserData() {
    this.token = localStorage.getItem("token")
    this.user = JSON.parse(localStorage.getItem("user") || "null")
  }
}

export default new AuthService()
