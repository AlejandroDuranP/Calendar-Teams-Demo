import type { Meeting } from "@/types/meeting"
import { generateSampleMeetings } from "./mock-data"

// Almacen local de reuniones (simula base de datos)
let localMeetings: Meeting[] = generateSampleMeetings()

// Variable para indicar que siempre estamos en modo demo
const developmentMode = true

// Obtener todas las reuniones
export const getMeetings = async (): Promise<Meeting[]> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300))
  console.log("Cargando reuniones desde datos de ejemplo...")
  return Promise.resolve([...localMeetings])
}

// Crear una reunion
export const createMeeting = async (meeting: Omit<Meeting, "id">): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  const id = `meeting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const newMeeting: Meeting = { ...meeting, id }
  localMeetings.push(newMeeting)
  console.log("Reunion creada:", newMeeting.title)
  return Promise.resolve(id)
}

// Crear multiples reuniones (para recurrentes)
export const createMeetings = async (meetings: Omit<Meeting, "id">[]): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const ids: string[] = []
  for (const meeting of meetings) {
    const id = `meeting-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newMeeting: Meeting = { ...meeting, id }
    localMeetings.push(newMeeting)
    ids.push(id)
  }
  console.log(`${meetings.length} reuniones creadas`)
  return Promise.resolve(ids)
}

// Actualizar una reunion
export const updateMeeting = async (id: string, meeting: Partial<Meeting>): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  const index = localMeetings.findIndex((m) => m.id === id)
  if (index !== -1) {
    localMeetings[index] = { ...localMeetings[index], ...meeting }
    console.log("Reunion actualizada:", meeting.title || localMeetings[index].title)
  }
  return Promise.resolve()
}

// Eliminar una reunion
export const deleteMeeting = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  const index = localMeetings.findIndex((m) => m.id === id)
  if (index !== -1) {
    const deletedMeeting = localMeetings.splice(index, 1)[0]
    console.log("Reunion eliminada:", deletedMeeting.title)
  }
  return Promise.resolve()
}

// Obtener reuniones por rango de fechas
export const getMeetingsByDateRange = async (startDate: Date, endDate: Date): Promise<Meeting[]> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return localMeetings.filter((meeting) => {
    const meetingDate = new Date(meeting.startTime)
    return meetingDate >= startDate && meetingDate <= endDate
  })
}

// Obtener reuniones recurrentes por parentId
export const getRecurringMeetings = async (parentId: string): Promise<Meeting[]> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return localMeetings.filter((meeting) => meeting.recurrence?.parentId === parentId)
}

// Funcion para verificar el estado (siempre en modo demo)
export const getFirebaseStatus = () => {
  return {
    configured: false,
    developmentMode: true,
    localMeetingsCount: localMeetings.length,
  }
}

// Funcion para resetear datos locales
export const resetLocalData = () => {
  localMeetings = generateSampleMeetings()
  console.log("Datos de reuniones reseteados")
}

// Funcion para forzar el modo desarrollo (no hace nada en modo demo)
export const forceDevelopmentMode = (_force = true) => {
  console.log("Modo demo siempre activo")
}
