"use client"

import type React from "react"

import { useState } from "react"
import { format, addHours, addWeeks, addDays, parse } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, Clock, Repeat, CalendarDays, ChevronDown } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Meeting, RecurrenceInfo } from "@/types/meeting"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MEETING_STATUS_CONFIG, type MeetingStatus } from "@/types/meeting"
import { useUsersClients } from "@/hooks/use-users-clients"
import { UserSelector } from "@/components/user-selector"
import { ClientSelector } from "@/components/client-selector"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarUI } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface NewMeetingModalProps {
  initialDate: Date
  onClose: () => void
  onCreate: (meetings: Omit<Meeting, "id">[]) => void
}

// Solo días laborables (lunes a viernes)
const WORKDAYS = [
  { id: 1, name: "Lunes", short: "L" },
  { id: 2, name: "Martes", short: "M" },
  { id: 3, name: "Miércoles", short: "X" },
  { id: 4, name: "Jueves", short: "J" },
  { id: 5, name: "Viernes", short: "V" },
]

export function NewMeetingModal({ initialDate, onClose, onCreate }: NewMeetingModalProps) {
  // Configurar hora de fin automaticamente (1 hora despues)
  const endDate = addHours(initialDate, 1)
  // Una reunion se considera pasada cuando su hora de FIN ya paso
  const isPastDate = endDate < new Date()

  const [formData, setFormData] = useState({
    title: "",
    organizer: "Usuario Actual",
    company: "",
    description: "",
    startDate: format(initialDate, "yyyy-MM-dd"),
    startHour: format(initialDate, "HH:mm"),
    endDate: format(endDate, "yyyy-MM-dd"),
    endHour: format(endDate, "HH:mm"),
    attendees: "",
    status: (isPastDate ? "Cerrada" : "Abierta") as MeetingStatus,
  })

  const { users, clients, loading: dataLoading } = useUsersClients()
  const [selectedOrganizer, setSelectedOrganizer] = useState<any | null>(null)
  const [selectedAttendees, setSelectedAttendees] = useState<any[]>([])
  const [selectedClient, setSelectedClient] = useState<any | null>(null)

  // Estado para recurrencia - solo incluir el día inicial si es día laborable
  const initialDay = initialDate.getDay()
  const isWorkday = initialDay >= 1 && initialDay <= 5
  const [isRecurring, setIsRecurring] = useState(false)
  const [selectedDays, setSelectedDays] = useState<number[]>(isWorkday ? [initialDay] : [])
  const [weeksToCreate, setWeeksToCreate] = useState(4) // Por defecto 4 semanas

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const attendeesList = formData.attendees
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0)

    const baseMeeting: Omit<Meeting, "id"> = {
      title: formData.title,
      organizer: selectedOrganizer?.nombre || "Usuario Actual",
      company: selectedClient?.nombre || "",
      description: formData.description,
      startTime: new Date(`${formData.startDate}T${formData.startHour}`),
      endTime: new Date(`${formData.endDate}T${formData.endHour}`),
      attendees: selectedAttendees.map((user) => user.correo),
      status: formData.status,
      files: [],
      comments: [],
    }

    if (!isRecurring) {
      // Reunión única
      onCreate([baseMeeting])
      toast.success("✅ Reunión creada exitosamente")
    } else {
      // Reuniones recurrentes
      const meetings = generateRecurringMeetings(baseMeeting)
      onCreate(meetings)
      toast.success(`✅ ${meetings.length} reuniones recurrentes creadas`)
    }
  }

  const generateRecurringMeetings = (baseMeeting: Omit<Meeting, "id">): Omit<Meeting, "id">[] => {
    const meetings: Omit<Meeting, "id">[] = []
    const parentId = Date.now().toString()
    const startDate = new Date(baseMeeting.startTime)
    const endDate = new Date(baseMeeting.endTime)
    const duration = endDate.getTime() - startDate.getTime()

    // Generar reuniones para las próximas semanas
    for (let week = 0; week < weeksToCreate; week++) {
      for (const dayOfWeek of selectedDays) {
        // Calcular la fecha para este día de la semana
        const weekStart = addWeeks(startDate, week)
        const targetDate = new Date(weekStart)

        // Ajustar al día de la semana correcto
        const currentDay = targetDate.getDay()
        const daysToAdd = (dayOfWeek - currentDay + 7) % 7
        const meetingDate = addDays(targetDate, daysToAdd)

        // Mantener la misma hora
        meetingDate.setHours(startDate.getHours(), startDate.getMinutes(), 0, 0)

        // Calcular hora de fin
        const meetingEndDate = new Date(meetingDate.getTime() + duration)

        // Solo crear si la fecha es futura o es la fecha inicial
        if (meetingDate >= startDate || week === 0) {
          const recurrenceInfo: RecurrenceInfo = {
            isRecurring: true,
            pattern: "weekly",
            daysOfWeek: selectedDays,
            parentId: parentId,
          }

          meetings.push({
            ...baseMeeting,
            title: `${baseMeeting.title}${meetings.length > 0 ? ` (Semana ${week + 1})` : ""}`,
            startTime: meetingDate,
            endTime: meetingEndDate,
            recurrence: recurrenceInfo,
          })
        }
      }
    }

    return meetings
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDayToggle = (dayId: number) => {
    setSelectedDays((prev) => {
      if (prev.includes(dayId)) {
        return prev.filter((id) => id !== dayId)
      } else {
        return [...prev, dayId].sort()
      }
    })
  }

  // Formatear la fecha de manera segura
  const formatDisplayDate = (date: Date) => {
    try {
      const dayNames = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]
      const monthNames = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ]

      const dayName = dayNames[date.getDay()]
      const day = date.getDate()
      const monthName = monthNames[date.getMonth()]
      const hours = date.getHours().toString().padStart(2, "0")
      const minutes = date.getMinutes().toString().padStart(2, "0")

      return `${dayName}, ${day} de ${monthName} a las ${hours}:${minutes}`
    } catch (error) {
      return format(date, "EEEE, d 'de' MMMM 'a las' HH:mm", { locale: es })
    }
  }

  // Generar opciones de hora en intervalos de 15 minutos
  const generateTimeOptions = (): string[] => {
    const times: string[] = []
    for (let h = 0; h < 24; h++) {
      for (const m of [0, 15, 30, 45]) {
        times.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`)
      }
    }
    return times
  }

  // Determinar qué estados están disponibles
  const availableStatuses = isPastDate
    ? Object.entries(MEETING_STATUS_CONFIG).filter(([status]) => status === "Cerrada" || status === "Cancelada")
    : Object.entries(MEETING_STATUS_CONFIG)

  // Calcular cuántas reuniones se crearán
  const totalMeetings = isRecurring ? selectedDays.length * weeksToCreate : 1

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-green-700 to-green-800 rounded-lg">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            Nueva Reunión
          </DialogTitle>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Programada para {formatDisplayDate(initialDate)}</p>
            {isPastDate && (
              <p className="text-sm text-amber-800 bg-amber-50 px-3 py-2 rounded-lg">
                ⚠️ Esta fecha ya ha pasado. Solo se pueden usar los estados "Cerrada" o "Cancelada".
              </p>
            )}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título de la reunión *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Ej: Reunión de planificación"
                required
                className="border-slate-200 focus:border-green-700"
              />
            </div>
            {/* Empresa */}
            <div className="space-y-2">
              <Label>Empresa *</Label>
              <ClientSelector
                clients={clients}
                selectedClient={selectedClient}
                onSelectionChange={setSelectedClient}
                placeholder="Seleccionar empresa..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado de la reunión</Label>
            <Select value={formData.status} onValueChange={(value: MeetingStatus) => handleChange("status", value)}>
              <SelectTrigger className="border-slate-200 focus:border-green-700">
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
          </div>

          {/* Organizador */}
          <div className="space-y-2">
            <Label>Organizador</Label>
            <UserSelector
              users={users}
              selectedUsers={selectedOrganizer ? [selectedOrganizer] : []}
              onSelectionChange={(users) => setSelectedOrganizer(users[0] || null)}
              placeholder="Seleccionar organizador..."
              multiple={false}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Inicio */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Fecha de inicio *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between font-normal border-slate-200 hover:border-green-700 hover:bg-white"
                    >
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        {formData.startDate
                          ? format(parse(formData.startDate, "yyyy-MM-dd", new Date()), "dd/MM/yyyy")
                          : "Seleccionar fecha"}
                      </span>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarUI
                      mode="single"
                      selected={formData.startDate ? parse(formData.startDate, "yyyy-MM-dd", new Date()) : undefined}
                      onSelect={(date) => date && handleChange("startDate", format(date, "yyyy-MM-dd"))}
                      locale={es}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Hora de inicio *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between font-normal border-slate-200 hover:border-green-700 hover:bg-white"
                    >
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        {formData.startHour || "Seleccionar hora"}
                      </span>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-0" align="start">
                    <div className="max-h-60 overflow-y-auto overscroll-contain p-1">
                      {generateTimeOptions().map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => handleChange("startHour", time)}
                          className={`w-full text-left px-3 py-1.5 text-sm rounded hover:bg-slate-100 transition-colors ${
                            formData.startHour === time ? "bg-green-50 text-green-800 font-medium" : ""
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Fin */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Fecha de fin *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between font-normal border-slate-200 hover:border-green-700 hover:bg-white"
                    >
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        {formData.endDate
                          ? format(parse(formData.endDate, "yyyy-MM-dd", new Date()), "dd/MM/yyyy")
                          : "Seleccionar fecha"}
                      </span>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarUI
                      mode="single"
                      selected={formData.endDate ? parse(formData.endDate, "yyyy-MM-dd", new Date()) : undefined}
                      onSelect={(date) => date && handleChange("endDate", format(date, "yyyy-MM-dd"))}
                      locale={es}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Hora de fin *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between font-normal border-slate-200 hover:border-green-700 hover:bg-white"
                    >
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        {formData.endHour || "Seleccionar hora"}
                      </span>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-0" align="start">
                    <div className="max-h-60 overflow-y-auto overscroll-contain p-1">
                      {generateTimeOptions().map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => handleChange("endHour", time)}
                          className={`w-full text-left px-3 py-1.5 text-sm rounded hover:bg-slate-100 transition-colors ${
                            formData.endHour === time ? "bg-green-50 text-green-800 font-medium" : ""
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>


          {/* Sección de Recurrencia */}
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Repeat className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="recurring" className="text-base font-medium">
                  Reunión recurrente (días laborables)
                </Label>
              </div>
              <Switch id="recurring" checked={isRecurring} onCheckedChange={setIsRecurring} />
            </div>

            {isRecurring && (
              <Card className="border-green-200 bg-green-50/30">
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-green-800" />
                      <Label className="text-sm font-medium text-green-800">
                        Selecciona los días laborables de la semana:
                      </Label>
                    </div>

                    <div className="grid grid-cols-5 gap-3">
                      {WORKDAYS.map((day) => (
                        <div key={day.id} className="flex flex-col items-center">
                          <Checkbox
                            id={`day-${day.id}`}
                            checked={selectedDays.includes(day.id)}
                            onCheckedChange={() => handleDayToggle(day.id)}
                            className="mb-2"
                          />
                          <Label htmlFor={`day-${day.id}`} className="text-sm text-center cursor-pointer">
                            <div className="font-medium text-green-700">{day.short}</div>
                            <div className="text-green-800 text-xs">{day.name}</div>
                          </Label>
                        </div>
                      ))}
                    </div>

                    <div className="text-xs text-green-800 bg-green-100/50 p-2 rounded">
                      💡 Solo días laborables disponibles (Lunes a Viernes)
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weeks">Número de semanas a programar:</Label>
                    <Select
                      value={weeksToCreate.toString()}
                      onValueChange={(value) => setWeeksToCreate(Number.parseInt(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 semanas</SelectItem>
                        <SelectItem value="4">4 semanas (1 mes)</SelectItem>
                        <SelectItem value="8">8 semanas (2 meses)</SelectItem>
                        <SelectItem value="12">12 semanas (3 meses)</SelectItem>
                        <SelectItem value="24">24 semanas (6 meses)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedDays.length > 0 && (
                    <div className="bg-white/60 p-3 rounded-lg border border-green-200">
                      <div className="text-sm">
                        <div className="font-medium text-green-800 mb-1">Resumen:</div>
                        <div className="text-green-700">
                          Se crearán <span className="font-semibold">{totalMeetings} reuniones</span>
                        </div>
                        <div className="text-green-800 text-xs mt-1">
                          {selectedDays.length} día{selectedDays.length !== 1 ? "s" : ""} por semana × {weeksToCreate}{" "}
                          semanas
                        </div>
                        <div className="text-green-800 text-xs">
                          Días: {selectedDays.map((dayId) => WORKDAYS.find((d) => d.id === dayId)?.name).join(", ")}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe el propósito de la reunión..."
              rows={3}
              className="border-slate-200 focus:border-green-700"
            />
          </div>

          {/* Asistentes */}
          <div className="space-y-2">
            <Label>Asistentes</Label>
            <UserSelector
              users={users}
              selectedUsers={selectedAttendees}
              onSelectionChange={setSelectedAttendees}
              placeholder="Seleccionar asistentes..."
              multiple={true}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-700 text-white"
              disabled={(isRecurring && selectedDays.length === 0) || !selectedClient || dataLoading}
            >
              {dataLoading ? "Cargando..." : isRecurring ? `Crear ${totalMeetings} Reuniones` : "Crear Reunión"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
