"use client"

import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import authService from "../services/auth.js"
import LoadingSpinner from "./LoadingSpinner.jsx"

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        setLoading(false)
        return
      }

      const isValid = await authService.validateToken()
      setIsAuthenticated(isValid)
      setLoading(false)
    }

    checkAuth()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    // Si viene de una ruta protegida, redirigir al home en lugar del login
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
