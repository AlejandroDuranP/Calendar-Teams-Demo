"use client"

import { useState, useEffect } from "react"
import {
  signInWithGoogle,
  signOut,
  onAuthStateChange,
  getCurrentUser,
  isAuthenticated,
  getCurrentUserInfo,
  type AuthUser,
} from "@/lib/auth-service"

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    // Suscribirse a cambios de estado de autenticacion
    const unsubscribe = onAuthStateChange((authUser) => {
      setUser(authUser)
      setLoading(false)
    })

    // Verificar estado inicial
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
    setLoading(false)

    return unsubscribe
  }, [])

  const login = async () => {
    setSigningIn(true)
    try {
      const result = await signInWithGoogle()
      if (!result.success) {
        const error = new Error(result.error)
        ;(error as any).errorCode = result.errorCode
        throw error
      }
    } catch (error) {
      console.error("Error en login:", error)
      throw error
    } finally {
      setSigningIn(false)
    }
  }

  const logout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error en logout:", error)
      throw error
    }
  }

  return {
    user,
    loading,
    signingIn,
    isAuthenticated: isAuthenticated(),
    userInfo: getCurrentUserInfo(),
    login,
    logout,
  }
}
