"use client"

import { useState, useEffect } from "react"
import type { Meeting } from "@/types/meeting"
import {
  getMeetings,
  createMeeting,
  createMeetings,
  updateMeeting,
  deleteMeeting,
  getFirebaseStatus,
} from "@/lib/meetings-service"

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [firebaseStatus, setFirebaseStatus] = useState({
    configured: false,
    developmentMode: false,
    localMeetingsCount: 0,
  })

  useEffect(() => {
    loadMeetings()
  }, [])

  const loadMeetings = async () => {
    try {
      setLoading(true)
      setError(null)
      // It will NOT throw errors - it handles permission errors gracefully
      const fetchedMeetings = await getMeetings()
      setMeetings(fetchedMeetings)
      setFirebaseStatus(getFirebaseStatus())
    } catch (err) {
      // This catch block should rarely trigger now since getMeetings handles its own errors
      console.error("❌ Unexpected error loading meetings:", err)
      setError("Error inesperado al cargar reuniones")
      setMeetings([])
    } finally {
      setLoading(false)
    }
  }

  const addMeeting = async (meeting: Omit<Meeting, "id">): Promise<void> => {
    try {
      setError(null)
      const id = await createMeeting(meeting)
      const newMeeting: Meeting = { ...meeting, id }
      setMeetings((prev) => [...prev, newMeeting])
      setFirebaseStatus(getFirebaseStatus())
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear reunión"
      console.error("❌ Error en addMeeting:", err)
      setError(errorMessage)
      throw err
    }
  }

  const addMeetings = async (meetingsData: Omit<Meeting, "id">[]): Promise<Meeting[]> => {
    try {
      setError(null)
      const ids = await createMeetings(meetingsData)
      const newMeetings = meetingsData.map((meeting, index) => ({
        ...meeting,
        id: ids[index],
      }))
      setMeetings((prev) => [...prev, ...newMeetings])
      setFirebaseStatus(getFirebaseStatus())
      return newMeetings
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear reuniones"
      console.error("❌ Error en addMeetings:", err)
      setError(errorMessage)
      throw err
    }
  }

  const editMeeting = async (id: string, updates: Partial<Meeting>): Promise<void> => {
    try {
      setError(null)
      await updateMeeting(id, updates)
      setMeetings((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)))
      setFirebaseStatus(getFirebaseStatus())
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar reunión"
      console.error("❌ Error en editMeeting:", err)
      setError(errorMessage)
      throw err
    }
  }

  const removeMeeting = async (id: string): Promise<void> => {
    try {
      setError(null)
      await deleteMeeting(id)
      setMeetings((prev) => prev.filter((m) => m.id !== id))
      setFirebaseStatus(getFirebaseStatus())
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar reunión"
      console.error("❌ Error en removeMeeting:", err)
      setError(errorMessage)
      throw err
    }
  }

  const refreshMeetings = () => {
    console.log("🔄 Refrescando reuniones...")
    loadMeetings()
  }

  return {
    meetings,
    loading,
    error,
    firebaseStatus,
    addMeeting,
    addMeetings,
    editMeeting,
    removeMeeting,
    refreshMeetings,
  }
}
