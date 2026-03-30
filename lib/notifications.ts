import type { Meeting } from "@/types/meeting"

/**
 * Crea notificaciones para una reunion (modo demo - no hace nada real)
 */
export const createNotificationsForMeeting = async (meeting: Meeting) => {
  console.log("Notificaciones creadas para:", meeting.title)
  // En modo demo, no creamos notificaciones reales
  return Promise.resolve()
}

/**
 * Actualiza las notificaciones de una reunion (modo demo)
 */
export const updateNotificationsForMeeting = async (meeting: Meeting) => {
  const message =
    meeting.status === "Cancelada"
      ? `La reunion "${meeting.title}" ha sido cancelada`
      : `La reunion "${meeting.title}" fue reprogramada`
  console.log("Notificacion actualizada:", message)
  return Promise.resolve()
}
