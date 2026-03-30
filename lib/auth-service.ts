import type { User } from "@/types/user"
import { demoUser } from "./mock-data"

export interface AuthUser {
  firebaseUser: {
    email: string
    displayName: string
    photoURL: string | null
    uid: string
  }
  appUser: User
}

// Usuario de demo siempre autenticado
const demoAuthUser: AuthUser = {
  firebaseUser: {
    email: demoUser.correo,
    displayName: demoUser.nombre,
    photoURL: null,
    uid: demoUser.id,
  },
  appUser: demoUser,
}

// Estado de autenticacion (siempre autenticado en modo demo)
let currentAuthUser: AuthUser | null = demoAuthUser
let authStateListeners: ((user: AuthUser | null) => void)[] = []

// Funcion para notificar cambios de estado
const notifyAuthStateChange = (user: AuthUser | null) => {
  currentAuthUser = user
  authStateListeners.forEach((listener) => listener(user))
}

// Suscribirse a cambios de estado de autenticacion
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  authStateListeners.push(callback)
  // Llamar inmediatamente con el usuario demo
  callback(currentAuthUser)
  // Retornar funcion para desuscribirse
  return () => {
    authStateListeners = authStateListeners.filter((listener) => listener !== callback)
  }
}

// Iniciar sesion (en modo demo, siempre exitoso)
export const signInWithGoogle = async (): Promise<{ success: boolean; error?: string; errorCode?: string }> => {
  console.log("Iniciando sesion en modo demo...")
  notifyAuthStateChange(demoAuthUser)
  return { success: true }
}

// Cerrar sesion
export const signOut = async (): Promise<void> => {
  console.log("Sesion cerrada (modo demo)")
  notifyAuthStateChange(null)
}

// Obtener usuario actual
export const getCurrentUser = (): AuthUser | null => {
  return currentAuthUser
}

// Verificar si el usuario esta autenticado
export const isAuthenticated = (): boolean => {
  return currentAuthUser !== null
}

// Obtener informacion del usuario actual
export const getCurrentUserInfo = () => {
  if (!currentAuthUser) return null

  return {
    email: currentAuthUser.firebaseUser.email,
    name: currentAuthUser.appUser.nombre,
    type: currentAuthUser.appUser.tipo,
    photoURL: currentAuthUser.firebaseUser.photoURL,
    uid: currentAuthUser.firebaseUser.uid,
  }
}

// Funcion para verificar la configuracion (modo demo)
export const checkFirebaseConfig = () => {
  return {
    isConfigured: false,
    config: {
      apiKey: false,
      authDomain: false,
      projectId: false,
      storageBucket: false,
      messagingSenderId: false,
      appId: false,
    },
    currentDomain: typeof window !== "undefined" ? window.location.origin : "localhost",
    authDomain: null,
  }
}
