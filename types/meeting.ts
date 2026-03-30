export interface AttendeeResponse {
  odId: string
  name: string
  respondedAt: Date
}

export interface Meeting {
  id: string
  title: string
  organizer: string
  company: string
  startTime: Date
  endTime: Date
  description: string
  attendees: string[]
  files: FileAttachment[]
  comments: Comment[]
  status: MeetingStatus
  recurrence?: RecurrenceInfo
  acceptedBy?: AttendeeResponse[]
  rejectedBy?: AttendeeResponse[]
  provisionalBy?: AttendeeResponse[]
}

export interface RecurrenceInfo {
  isRecurring: boolean
  pattern: "weekly"
  daysOfWeek: number[] // 0 = domingo, 1 = lunes, etc.
  endDate?: Date
  parentId?: string // ID de la reunión original para agrupar las recurrentes
}

export interface FileAttachment {
  id: string
  name: string
  size: string
  uploadedBy: string
  uploadedAt: Date
  url?: string
  type: string
}

export interface Comment {
  id: string
  author: string
  content: string
  createdAt: Date
}

export type MeetingStatus = "Abierta" | "Cerrada" | "Cancelada" | "Opcional"

export const MEETING_STATUS_CONFIG = {
  Abierta: {
    color: "bg-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-500",
    textColor: "text-green-700",
    label: "Abierta",
  },
  Cerrada: {
    color: "bg-gray-500",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-500",
    textColor: "text-gray-700",
    label: "Cerrada",
  },
  Cancelada: {
    color: "bg-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-500",
    textColor: "text-red-700",
    label: "Cancelada",
  },
  Opcional: {
    color: "bg-yellow-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-500",
    textColor: "text-yellow-700",
    label: "Opcional",
  },
}
