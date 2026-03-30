"use client"

import { useState, useEffect } from "react"
import type { User, Client } from "@/types/user"
import {
  getUsers,
  getClients,
  findUserByEmailOrName,
  findUsersByEmailsOrNames,
  findClientByName,
  getUsersClientsStatus,
} from "@/lib/users-clients-service"

export function useUsersClients() {
  const [users, setUsers] = useState<User[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<{
    configured: boolean
    developmentModeUsers: boolean
    developmentModeClients: boolean
    localUsersCount: number
    localClientsCount: number
  }>({
    configured: false,
    developmentModeUsers: false,
    developmentModeClients: false,
    localUsersCount: 0,
    localClientsCount: 0,
  })

  // Cargar datos al inicializar
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔄 Cargando usuarios y clientes...")

      // Cargar usuarios y clientes en paralelo, pero manejar errores independientemente
      const [fetchedUsers, fetchedClients] = await Promise.allSettled([getUsers(), getClients()])

      // Procesar usuarios
      if (fetchedUsers.status === "fulfilled") {
        setUsers(fetchedUsers.value)
        console.log("✅ Usuarios cargados:", fetchedUsers.value.length)
      } else {
        console.error("❌ Error cargando usuarios:", fetchedUsers.reason)
        setUsers([]) // Array vacío como fallback
      }

      // Procesar clientes
      if (fetchedClients.status === "fulfilled") {
        setClients(fetchedClients.value)
        console.log("✅ Clientes cargados:", fetchedClients.value.length)
      } else {
        console.error("❌ Error cargando clientes:", fetchedClients.reason)
        setClients([]) // Array vacío como fallback
      }

      // Actualizar estado
      const currentStatus = getUsersClientsStatus()
      setStatus(currentStatus)

      if (currentStatus.developmentModeUsers || currentStatus.developmentModeClients) {
        console.log("🔧 Ejecutándose en modo desarrollo:", {
          usuarios: currentStatus.developmentModeUsers ? "local" : "Firebase",
          clientes: currentStatus.developmentModeClients ? "local" : "Firebase",
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error cargando datos"
      console.error("❌ Error crítico cargando usuarios y clientes:", err)

      // En caso de error crítico, no mostrar error al usuario, usar fallback
      setError(null)
      setUsers([])
      setClients([])
      setStatus({
        configured: false,
        developmentModeUsers: true,
        developmentModeClients: true,
        localUsersCount: 0,
        localClientsCount: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  const searchUser = async (searchTerm: string): Promise<User | null> => {
    try {
      return await findUserByEmailOrName(searchTerm)
    } catch (err) {
      console.error("❌ Error buscando usuario:", err)
      return null
    }
  }

  const searchUsers = async (searchTerms: string[]): Promise<User[]> => {
    try {
      return await findUsersByEmailsOrNames(searchTerms)
    } catch (err) {
      console.error("❌ Error buscando usuarios:", err)
      return []
    }
  }

  const searchClient = async (name: string): Promise<Client | null> => {
    try {
      return await findClientByName(name)
    } catch (err) {
      console.error("❌ Error buscando cliente:", err)
      return null
    }
  }

  const refreshData = () => {
    console.log("🔄 Refrescando usuarios y clientes...")
    loadData()
  }

  // Funciones de utilidad
  const getUserByEmail = (email: string): User | undefined => {
    return users.find((user) => user.correo.toLowerCase() === email.toLowerCase())
  }

  const getUserByName = (name: string): User | undefined => {
    return users.find((user) => user.nombre.toLowerCase() === name.toLowerCase())
  }

  const getClientByName = (name: string): Client | undefined => {
    return clients.find((client) => client.nombre.toLowerCase() === name.toLowerCase())
  }

  const isValidUser = (emailOrName: string): boolean => {
    const searchLower = emailOrName.toLowerCase()
    return users.some((user) => user.correo.toLowerCase() === searchLower || user.nombre.toLowerCase() === searchLower)
  }

  const isValidClient = (name: string): boolean => {
    return clients.some((client) => client.nombre.toLowerCase() === name.toLowerCase())
  }

  return {
    users,
    clients,
    loading,
    error,
    status,
    searchUser,
    searchUsers,
    searchClient,
    refreshData,
    getUserByEmail,
    getUserByName,
    getClientByName,
    isValidUser,
    isValidClient,
  }
}
