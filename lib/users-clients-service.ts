import type { User, Client } from "@/types/user"
import { sampleUsers, sampleClients, demoUser } from "./mock-data"

// Almacen local de usuarios y clientes
const localUsers: User[] = [...sampleUsers, demoUser]
const localClients: Client[] = [...sampleClients]

// Obtener todos los usuarios
export const getUsers = async (): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  console.log("Cargando usuarios de ejemplo...")
  return Promise.resolve([...localUsers])
}

// Obtener todos los clientes
export const getClients = async (): Promise<Client[]> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  console.log("Cargando clientes de ejemplo...")
  return Promise.resolve([...localClients])
}

// Buscar usuario por correo o nombre
export const findUserByEmailOrName = async (searchTerm: string): Promise<User | null> => {
  const searchLower = searchTerm.toLowerCase().trim()
  const user = localUsers.find(
    (u) => u.correo.toLowerCase() === searchLower || u.nombre.toLowerCase() === searchLower
  )
  return user || null
}

// Buscar multiples usuarios por correos o nombres
export const findUsersByEmailsOrNames = async (searchTerms: string[]): Promise<User[]> => {
  const foundUsers: User[] = []
  for (const term of searchTerms) {
    const searchLower = term.toLowerCase().trim()
    const user = localUsers.find(
      (u) => u.correo.toLowerCase() === searchLower || u.nombre.toLowerCase() === searchLower
    )
    if (user && !foundUsers.find((fu) => fu.id === user.id)) {
      foundUsers.push(user)
    }
  }
  return foundUsers
}

// Buscar cliente por nombre
export const findClientByName = async (name: string): Promise<Client | null> => {
  const searchLower = name.toLowerCase().trim()
  const client = localClients.find((c) => c.nombre.toLowerCase() === searchLower)
  return client || null
}

// Obtener usuarios activos (puedes filtrar por tipo si necesitas)
export const getActiveUsers = async (tipo?: string): Promise<User[]> => {
  const users = await getUsers()
  if (tipo) {
    return users.filter((user) => user.tipo.toLowerCase() === tipo.toLowerCase())
  }
  return users
}

// Obtener clientes activos
export const getActiveClients = async (): Promise<Client[]> => {
  const clients = await getClients()
  return clients.filter((client) => client.activo !== false)
}

// Funcion para verificar el estado (siempre en modo demo)
export const getUsersClientsStatus = () => {
  return {
    configured: false,
    developmentModeUsers: true,
    developmentModeClients: true,
    localUsersCount: localUsers.length,
    localClientsCount: localClients.length,
  }
}

// Funcion para forzar el modo desarrollo (no hace nada en modo demo)
export const forceDevelopmentMode = (_force = true) => {
  console.log("Modo demo siempre activo")
}

// Funcion para resetear datos locales
export const resetLocalData = () => {
  console.log("Datos de usuarios y clientes reseteados")
}
