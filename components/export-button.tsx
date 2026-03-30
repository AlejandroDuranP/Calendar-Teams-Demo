"use client"

import { useState } from "react"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns"
import { es } from "date-fns/locale"
import { Download, FileSpreadsheet, ChevronDown, Calendar, CalendarDays, CalendarRange } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import type { Meeting } from "@/types/meeting"

interface ExportButtonProps {
  meetings: Meeting[]
  currentDate: Date
}

export function ExportButton({ meetings, currentDate }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const filterMeetingsByDateRange = (start: Date, end: Date): Meeting[] => {
    return meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.startTime)
      return meetingDate >= start && meetingDate <= end
    })
  }

  const formatMeetingsToCSV = (meetingsToExport: Meeting[]): string => {
    const headers = [
      "Fecha",
      "Hora Inicio",
      "Hora Fin",
      "Cliente",
      "Nombre de Sesión",
      "Responsable",
      "Asistentes",
      "Comentarios",
    ]

    const rows = meetingsToExport
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .map((meeting) => {
        const fecha = format(new Date(meeting.startTime), "dd/MM/yyyy", { locale: es })
        const horaInicio = format(new Date(meeting.startTime), "HH:mm", { locale: es })
        const horaFin = format(new Date(meeting.endTime), "HH:mm", { locale: es })
        const cliente = meeting.company
        const nombreSesion = meeting.title
        const responsable = meeting.organizer
        const asistentes = meeting.attendees.join("; ")
        const comentarios = meeting.comments.map((c) => `${c.author}: ${c.content}`).join(" | ")

        // Escapar campos que puedan contener comas o comillas
        const escapeField = (field: string) => {
          if (field.includes(",") || field.includes('"') || field.includes("\n")) {
            return `"${field.replace(/"/g, '""')}"`
          }
          return field
        }

        return [
          escapeField(fecha),
          escapeField(horaInicio),
          escapeField(horaFin),
          escapeField(cliente),
          escapeField(nombreSesion),
          escapeField(responsable),
          escapeField(asistentes),
          escapeField(comentarios),
        ].join(",")
      })

    return [headers.join(","), ...rows].join("\n")
  }

  const downloadCSV = (csvContent: string, filename: string) => {
    // BOM para Excel
    const BOM = "\uFEFF"
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleExport = async (period: "week" | "month" | "year") => {
    setIsExporting(true)

    try {
      let start: Date
      let end: Date
      let periodName: string

      switch (period) {
        case "week":
          start = startOfWeek(currentDate, { weekStartsOn: 1 })
          end = endOfWeek(currentDate, { weekStartsOn: 1 })
          periodName = `Semana_${format(start, "dd-MM")}_al_${format(end, "dd-MM-yyyy", { locale: es })}`
          break
        case "month":
          start = startOfMonth(currentDate)
          end = endOfMonth(currentDate)
          periodName = `${format(currentDate, "MMMM_yyyy", { locale: es })}`
          break
        case "year":
          start = startOfYear(currentDate)
          end = endOfYear(currentDate)
          periodName = `Año_${format(currentDate, "yyyy")}`
          break
      }

      const filteredMeetings = filterMeetingsByDateRange(start, end)

      if (filteredMeetings.length === 0) {
        alert(`No hay sesiones para exportar en el período seleccionado.`)
        return
      }

      const csvContent = formatMeetingsToCSV(filteredMeetings)
      const filename = `Sesiones_${periodName}.csv`
      downloadCSV(csvContent, filename)

      console.log(`Exportadas ${filteredMeetings.length} sesiones para ${periodName}`)
    } catch (error) {
      console.error("Error al exportar:", error)
      alert("Error al exportar las sesiones. Por favor, intenta de nuevo.")
    } finally {
      setIsExporting(false)
    }
  }

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
  const weekMeetingsCount = filterMeetingsByDateRange(weekStart, weekEnd).length

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthMeetingsCount = filterMeetingsByDateRange(monthStart, monthEnd).length

  const yearStart = startOfYear(currentDate)
  const yearEnd = endOfYear(currentDate)
  const yearMeetingsCount = filterMeetingsByDateRange(yearStart, yearEnd).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent" disabled={isExporting}>
          {isExporting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <FileSpreadsheet className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Exportar</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar a Excel (CSV)
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleExport("week")} className="cursor-pointer">
          <Calendar className="h-4 w-4 mr-2" />
          <div className="flex-1">
            <div className="font-medium">Esta semana</div>
            <div className="text-xs text-muted-foreground">
              {format(weekStart, "d MMM", { locale: es })} - {format(weekEnd, "d MMM", { locale: es })} (
              {weekMeetingsCount} sesiones)
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleExport("month")} className="cursor-pointer">
          <CalendarDays className="h-4 w-4 mr-2" />
          <div className="flex-1">
            <div className="font-medium">Este mes</div>
            <div className="text-xs text-muted-foreground">
              {format(currentDate, "MMMM yyyy", { locale: es })} ({monthMeetingsCount} sesiones)
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleExport("year")} className="cursor-pointer">
          <CalendarRange className="h-4 w-4 mr-2" />
          <div className="flex-1">
            <div className="font-medium">Este año</div>
            <div className="text-xs text-muted-foreground">
              {format(currentDate, "yyyy")} ({yearMeetingsCount} sesiones)
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
