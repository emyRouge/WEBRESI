const API_BASE_URL = "https://backresiliente-production.up.railway.app"

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async makeRequest(endpoint, options = {}) {
    const token = localStorage.getItem("token")
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      console.log(`Making request to: ${this.baseURL}${endpoint}`)
      console.log("Request config:", config)
      const response = await fetch(`${this.baseURL}${endpoint}`, config)
      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)

      // Si es 401, el token expiró
      if (response.status === 401) {
        console.log("Token expirado, limpiando sesión...")
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/login"
        throw new Error("Sesión expirada")
      }

      // Si no es ok, lanzar error con el status
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("Response data:", data)
      return data
    } catch (error) {
      console.error("API Error:", error)
      // Si es error de red o conexión
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error("Error de conexión con el servidor")
      }
      throw error
    }
  }

  // ✅ NUEVO: Método para subir archivos
  async uploadFile(file, folder = "senas") {
    const token = localStorage.getItem("token")
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder)

    try {
      console.log(`Subiendo archivo: ${file.name}`)
      console.log(`Tamaño: ${file.size} bytes`)
      console.log(`Tipo: ${file.type}`)
      console.log(`Carpeta: ${folder}`)

      const response = await fetch(`${this.baseURL}/api/upload`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // NO incluir Content-Type para FormData, el navegador lo maneja automáticamente
        },
        body: formData,
      })

      if (response.status === 401) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/login"
        throw new Error("Sesión expirada")
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("Upload response:", data)
      return data
    } catch (error) {
      console.error("Upload Error:", error)
      throw error
    }
  }

  // Métodos para Talleres
  async getTalleres() {
    return this.makeRequest("/talleres")
  }

  async getTaller(id) {
    return this.makeRequest(`/talleres/${id}`)
  }

  async createTaller(tallerData) {
    return this.makeRequest("/talleres", {
      method: "POST",
      body: JSON.stringify(tallerData),
    })
  }

  async updateTaller(id, tallerData) {
    return this.makeRequest(`/talleres/${id}`, {
      method: "PUT",
      body: JSON.stringify(tallerData),
    })
  }

  async deleteTaller(id) {
    return this.makeRequest(`/talleres/${id}`, {
      method: "DELETE",
    })
  }

  async toggleTallerStatus(id, status) {
    return this.makeRequest(`/talleres/${id}/estado/${status}`, {
      method: "PATCH",
    })
  }

  // Métodos para Productos
  async getProductos() {
    return this.makeRequest("/productos")
  }

  async getProducto(id) {
    return this.makeRequest(`/productos/${id}`)
  }

  async createProducto(productoData) {
    return this.makeRequest("/productos", {
      method: "POST",
      body: JSON.stringify(productoData),
    })
  }

  async updateProducto(id, productoData) {
    return this.makeRequest(`/productos/${id}`, {
      method: "PUT",
      body: JSON.stringify(productoData),
    })
  }

  async deleteProducto(id) {
    return this.makeRequest(`/productos/${id}`, {
      method: "DELETE",
    })
  }

  async toggleProductoStatus(id, status) {
    return this.makeRequest(`/productos/${id}/estado/${status}`, {
      method: "PATCH",
    })
  }

  // Métodos para Productos Tienda
  async getProductosTienda() {
    return this.makeRequest("/productos-tienda")
  }

  async getProductoTienda(id) {
    return this.makeRequest(`/productos-tienda/${id}`)
  }

  async createProductoTienda(productoData) {
    return this.makeRequest("/productos-tienda", {
      method: "POST",
      body: JSON.stringify(productoData),
    })
  }

  async updateProductoTienda(id, productoData) {
    return this.makeRequest(`/productos-tienda/${id}`, {
      method: "PUT",
      body: JSON.stringify(productoData),
    })
  }

  async deleteProductoTienda(id) {
    return this.makeRequest(`/productos-tienda/${id}`, {
      method: "DELETE",
    })
  }

  async toggleProductoTiendaStatus(id, status) {
    return this.makeRequest(`/productos-tienda/${id}/estado/${status}`, {
      method: "PATCH",
    })
  }

  // Métodos para Meseros
  async getMeseros() {
    return this.makeRequest("/meseros")
  }

  async getMesero(id) {
    return this.makeRequest(`/meseros/${id}`)
  }

  async createMesero(meseroData) {
    return this.makeRequest("/meseros", {
      method: "POST",
      body: JSON.stringify(meseroData),
    })
  }

  async updateMesero(id, meseroData) {
    return this.makeRequest(`/meseros/${id}`, {
      method: "PUT",
      body: JSON.stringify(meseroData),
    })
  }

  async deleteMesero(id) {
    return this.makeRequest(`/meseros/${id}`, {
      method: "DELETE",
    })
  }

  async toggleMeseroStatus(id, status) {
    return this.makeRequest(`/meseros/${id}/estado/${status}`, {
      method: "PATCH",
    })
  }

  // Métodos para Publicaciones
  async getPublicaciones() {
    return this.makeRequest("/publicaciones")
  }

  async getPublicacion(id) {
    return this.makeRequest(`/publicaciones/${id}`)
  }

  async createPublicacion(publicacionData) {
    return this.makeRequest("/publicaciones", {
      method: "POST",
      body: JSON.stringify(publicacionData),
    })
  }

  async updatePublicacion(id, publicacionData) {
    return this.makeRequest(`/publicaciones/${id}`, {
      method: "PUT",
      body: JSON.stringify(publicacionData),
    })
  }

  async deletePublicacion(id) {
    return this.makeRequest(`/publicaciones/${id}`, {
      method: "DELETE",
    })
  }

  async togglePublicacionStatus(id, status) {
    return this.makeRequest(`/publicaciones/${id}/estado/${status}`, {
      method: "PATCH",
    })
  }

  // Métodos para Señas
  async getSenas() {
    return this.makeRequest("/senas")
  }

  async getSena(id) {
    return this.makeRequest(`/senas/${id}`)
  }

  async createSena(senaData) {
    return this.makeRequest("/senas", {
      method: "POST",
      body: JSON.stringify(senaData),
    })
  }

  async updateSena(id, senaData) {
    return this.makeRequest(`/senas/${id}`, {
      method: "PUT",
      body: JSON.stringify(senaData),
    })
  }

  async deleteSena(id) {
    return this.makeRequest(`/senas/${id}`, {
      method: "DELETE",
    })
  }

  async toggleSenaStatus(id, status) {
    return this.makeRequest(`/senas/${id}/estado/${status}`, {
      method: "PATCH",
    })
  }

  // Métodos para Condiciones
  async getCondiciones() {
    return this.makeRequest("/condiciones")
  }

  async getCondicion(id) {
    return this.makeRequest(`/condiciones/${id}`)
  }

  async createCondicion(condicionData) {
    return this.makeRequest("/condiciones", {
      method: "POST",
      body: JSON.stringify(condicionData),
    })
  }

  async updateCondicion(id, condicionData) {
    return this.makeRequest(`/condiciones/${id}`, {
      method: "PUT",
      body: JSON.stringify(condicionData),
    })
  }

  async deleteCondicion(id) {
    return this.makeRequest(`/condiciones/${id}`, {
      method: "DELETE",
    })
  }

  async toggleCondicionStatus(id, status) {
    return this.makeRequest(`/condiciones/${id}/estado/${status}`, {
      method: "PATCH",
    })
  }

  // Métodos para Usuarios
  async getUsuarios() {
    return this.makeRequest("/usuarios")
  }

  async getUsuario(id) {
    return this.makeRequest(`/usuarios/${id}`)
  }

  async createUsuario(usuarioData) {
    return this.makeRequest("/usuarios", {
      method: "POST",
      body: JSON.stringify(usuarioData),
    })
  }

  async updateUsuario(id, usuarioData) {
    return this.makeRequest(`/usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(usuarioData),
    })
  }

  async deleteUsuario(id) {
    return this.makeRequest(`/usuarios/${id}`, {
      method: "DELETE",
    })
  }

  async toggleUsuarioStatus(id, status) {
    return this.makeRequest(`/usuarios/${id}/estado/${status}`, {
      method: "PATCH",
    })
  }

  // Métodos para Roles
  async getRoles() {
    return this.makeRequest("/roles")
  }

  // Métodos para Dashboard
  async getDashboardStats() {
    return this.makeRequest("/dashboard/stats")
  }
}

export default new ApiService()
