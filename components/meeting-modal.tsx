"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { X, Calendar, Clock, User, Building, MessageSquare, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import type { Meeting, Comment } from "@/types/meeting"
import { MEETING_STATUS_CONFIG, type MeetingStatus } from "@/types/meeting"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MeetingModalProps {
  meeting: Meeting
  onClose: () => void
  onUpdate: (meeting: Meeting) => void
  onDelete: (meetingId: string) => void
  isOpen: boolean
}

export function MeetingModal({ meeting, onClose, onUpdate, onDelete, isOpen }: MeetingModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedMeeting, setEditedMeeting] = useState(meeting)
  const [newComment, setNewComment] = useState("")
  const [newAttendee, setNewAttendee] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Una reunion se considera pasada cuando su hora de FIN ya paso
  const isPastMeeting = new Date(meeting.endTime) < new Date()
  const allowedPastStatuses: MeetingStatus[] = ["Cerrada", "Cancelada"]

  useEffect(() => {
    setEditedMeeting(meeting)
  }, [meeting])

  const handleSave = () => {
    onUpdate(editedMeeting)
    setIsEditing(false)
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: "Usuario Actual",
      content: newComment,
      createdAt: new Date(),
    }

    setEditedMeeting({
      ...editedMeeting,
      comments: [...editedMeeting.comments, comment],
    })
    setNewComment("")
  }

  const handleAddAttendee = () => {
    if (!newAttendee.trim() || editedMeeting.attendees.includes(newAttendee)) return

    setEditedMeeting({
      ...editedMeeting,
      attendees: [...editedMeeting.attendees, newAttendee],
    })
    setNewAttendee("")
  }

  const handleRemoveAttendee = (email: string) => {
    setEditedMeeting({
      ...editedMeeting,
      attendees: editedMeeting.attendees.filter((a) => a !== email),
    })
  }

  const handleQuickStatusChange = (newStatus: MeetingStatus) => {
    if (!editedMeeting?.id) {
      console.error("No se puede actualizar: la reunión no tiene ID")
      return
    }

    const updatedMeeting: Meeting = {
      ...editedMeeting,
      status: newStatus,
    }

    onUpdate(updatedMeeting)
  }

  const handleDateTimeChange = (field: "startTime" | "endTime", value: string) => {
    setEditedMeeting({
      ...editedMeeting,
      [field]: new Date(value),
    })
  }

  const availableStatuses = isPastMeeting
    ? Object.entries(MEETING_STATUS_CONFIG).filter(([status]) => allowedPastStatuses.includes(status as MeetingStatus))
    : Object.entries(MEETING_STATUS_CONFIG)

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300" onClick={onClose} />

      {/* Modal lateral */}
      <div
        className={`fixed right-0 top-0 h-full bg-background border-l shadow-2xl z-50 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-full sm:w-[600px] lg:w-[700px] xl:w-[800px]"
        }`}
      >
        {/* Header colapsable */}
        <div className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="flex-shrink-0">
              {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            {!isCollapsed && (
              <h2 className="text-lg font-semibold truncate">{isEditing ? "Editar Reunión" : meeting.title}</h2>
            )}
          </div>

          {!isCollapsed && (
            <div className="flex gap-2">
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  Editar
                </Button>
              )}
              <Button variant="destructive" size="sm" onClick={() => onDelete(meeting.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Vista colapsada */}
        {isCollapsed && (
          <div className="p-2 space-y-2">
            <div className="text-center">
              <Badge className={`${MEETING_STATUS_CONFIG[meeting.status].color} text-white text-xs`}>
                {meeting.status.charAt(0)}
              </Badge>
            </div>
            <div className="text-xs text-center text-muted-foreground">{format(meeting.startTime, "HH:mm")}</div>
            <div className="text-xs text-center font-medium truncate px-1">{meeting.title}</div>
          </div>
        )}

        {/* Contenido completo */}
        {!isCollapsed && (
          <>
            {/* Cambio rápido de estado */}
            {!isEditing && (
              <div className="px-4 py-2 border-b bg-muted/30">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">Estado:</span>
                  {isPastMeeting && (
                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                      Reunión pasada - Solo estados: Cerrada/Cancelada
                    </span>
                  )}
                  <div className="flex gap-1 flex-wrap">
                    {availableStatuses.map(([status, config]) => (
                      <Button
                        key={status}
                        variant={meeting.status === status ? "default" : "outline"}
                        size="sm"
                        className={`text-xs ${
                          meeting.status === status
                            ? `${config.color} text-white hover:opacity-80`
                            : `hover:${config.bgColor} ${config.textColor}`
                        }`}
                        onClick={() => handleQuickStatusChange(status as MeetingStatus)}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mr-1 ${meeting.status === status ? "bg-white" : config.color}`}
                        />
                        {config.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <ScrollArea className="flex-1 h-[calc(100vh-140px)]">
              <div className="p-4 space-y-6">
                {/* Información básica */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Título</Label>
                      {isEditing ? (
                        <Input
                          value={editedMeeting.title}
                          onChange={(e) => setEditedMeeting({ ...editedMeeting, title: e.target.value })}
                        />
                      ) : (
                        <p className="text-lg font-semibold">{meeting.title}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Empresa</Label>
                        {isEditing ? (
                          <Input
                            value={editedMeeting.company}
                            onChange={(e) => setEditedMeeting({ ...editedMeeting, company: e.target.value })}
                          />
                        ) : (
                          <Badge variant="secondary" className="mt-1">
                            <Building className="h-3 w-3 mr-1" />
                            {meeting.company}
                          </Badge>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Estado</Label>
                        {isEditing ? (
                          <div className="space-y-2">
                            <Select
                              value={editedMeeting.status}
                              onValueChange={(value: MeetingStatus) =>
                                setEditedMeeting({ ...editedMeeting, status: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {availableStatuses.map(([status, config]) => (
                                  <SelectItem key={status} value={status}>
                                    <div className="flex items-center gap-2">
                                      <div className={`w-3 h-3 rounded-full ${config.color}`} />
                                      {config.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {isPastMeeting && (
                              <p className="text-xs text-amber-600">
                                Para reuniones pasadas solo se permiten los estados "Cerrada" o "Cancelada"
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Badge className={`mt-1 ${MEETING_STATUS_CONFIG[meeting.status].color} text-white`}>
                              <div className="w-2 h-2 rounded-full bg-white mr-1" />
                              {meeting.status}
                            </Badge>
                            {isPastMeeting && <span className="text-xs text-gray-500">(Reunión pasada)</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Organizador */}
                    <div>
                      <Label className="text-sm font-medium">Organizador</Label>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <Input
                            value={editedMeeting.organizer}
                            onChange={(e) => setEditedMeeting({ ...editedMeeting, organizer: e.target.value })}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{meeting.organizer}</span>
                        </div>
                      )}
                    </div>

                    {/* Fecha y Hora */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Fecha y hora de inicio</Label>
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <Input
                              type="datetime-local"
                              value={format(editedMeeting.startTime, "yyyy-MM-dd'T'HH:mm")}
                              onChange={(e) => handleDateTimeChange("startTime", e.target.value)}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {format(meeting.startTime, "d/MM/yyyy HH:mm", { locale: es })}
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Fecha y hora de fin</Label>
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <Input
                              type="datetime-local"
                              value={format(editedMeeting.endTime, "yyyy-MM-dd'T'HH:mm")}
                              onChange={(e) => handleDateTimeChange("endTime", e.target.value)}
                              min={format(editedMeeting.startTime, "yyyy-MM-dd'T'HH:mm")}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {format(meeting.endTime, "d/MM/yyyy HH:mm", { locale: es })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Descripción</Label>
                    {isEditing ? (
                      <Textarea
                        value={editedMeeting.description}
                        onChange={(e) => setEditedMeeting({ ...editedMeeting, description: e.target.value })}
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">{meeting.description}</p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Asistentes con estado de respuesta */}
                <div>
                  <h3 className="font-medium mb-3">Asistentes ({editedMeeting.attendees.length})</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {editedMeeting.attendees.map((email) => {
                      const isAccepted = editedMeeting.acceptedBy?.some(a => a.name === email || a.odId === email);
                      const isRejected = editedMeeting.rejectedBy?.some(a => a.name === email || a.odId === email);
                      const isProvisional = editedMeeting.provisionalBy?.some(a => a.name === email || a.odId === email);
                      
                      let statusColor = "bg-slate-100";
                      let statusText = "Sin respuesta";
                      let statusBadge = "bg-slate-200 text-slate-600";
                      
                      if (isAccepted) {
                        statusColor = "bg-green-50 border-l-2 border-green-500";
                        statusText = "Aceptada";
                        statusBadge = "bg-green-100 text-green-700";
                      } else if (isRejected) {
                        statusColor = "bg-red-50 border-l-2 border-red-500";
                        statusText = "Rechazada";
                        statusBadge = "bg-red-100 text-red-700";
                      } else if (isProvisional) {
                        statusColor = "bg-amber-50 border-l-2 border-amber-500";
                        statusText = "Provisional";
                        statusBadge = "bg-amber-100 text-amber-700";
                      }
                      
                      return (
                        <div key={email} className={`flex items-center justify-between p-2 rounded ${statusColor}`}>
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Avatar className="h-6 w-6 flex-shrink-0">
                              <AvatarFallback className="text-xs">{email.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm truncate">{email}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${statusBadge}`}>
                              {statusText}
                            </span>
                          </div>
                          {isEditing && (
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveAttendee(email)}>
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="email@ejemplo.com"
                          value={newAttendee}
                          onChange={(e) => setNewAttendee(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleAddAttendee()}
                          className="text-sm"
                        />
                        <Button size="sm" onClick={handleAddAttendee}>
                          +
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Resumen de respuestas */}
                  {!isEditing && (
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                        Aceptadas: {editedMeeting.acceptedBy?.length || 0}
                      </span>
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded">
                        Provisional: {editedMeeting.provisionalBy?.length || 0}
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                        Rechazadas: {editedMeeting.rejectedBy?.length || 0}
                      </span>
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded">
                        Sin respuesta: {editedMeeting.attendees.length - 
                          (editedMeeting.acceptedBy?.length || 0) - 
                          (editedMeeting.rejectedBy?.length || 0) - 
                          (editedMeeting.provisionalBy?.length || 0)}
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Comentarios */}
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Comentarios ({editedMeeting.comments.length})
                  </h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {editedMeeting.comments.map((comment) => (
                      <div key={comment.id} className="bg-muted/50 rounded p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-xs">{comment.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(comment.createdAt), "d MMM, HH:mm", { locale: es })}
                          </span>
                        </div>
                        <p className="text-sm ml-7">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Input
                      placeholder="Escribe un comentario..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                    />
                    <Button size="sm" onClick={handleAddComment}>
                      Enviar
                    </Button>
                  </div>
                </div>

                {/* Botones de acción */}
                {isEditing && (
                  <>
                    <Separator />
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSave}>Guardar cambios</Button>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </>
        )}
      </div>
    </>
  )
}
