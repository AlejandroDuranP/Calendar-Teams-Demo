"use client"

import { useState } from "react"
import { Search, X, Filter, Users, User, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Meeting } from "@/types/meeting"

interface SearchFilterProps {
  meetings: Meeting[]
  onFilteredMeetingsChange: (filteredMeetings: Meeting[]) => void
  className?: string
}

export function SearchFilter({ meetings, onFilteredMeetingsChange, className = "" }: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  // Función para filtrar reuniones
  const filterMeetings = (term: string) => {
    if (!term.trim()) {
      onFilteredMeetingsChange(meetings)
      return
    }

    const searchLower = term.toLowerCase().trim()

    const filtered = meetings.filter((meeting) => {
      // Buscar en título de sesión
      const titleMatch = meeting.title.toLowerCase().includes(searchLower)

      // Buscar en organizador
      const organizerMatch = meeting.organizer.toLowerCase().includes(searchLower)

      // Buscar en participantes
      const attendeesMatch = meeting.attendees.some((attendee) => attendee.toLowerCase().includes(searchLower))

      // Buscar en empresa
      const companyMatch = meeting.company.toLowerCase().includes(searchLower)

      return titleMatch || organizerMatch || attendeesMatch || companyMatch
    })

    onFilteredMeetingsChange(filtered)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    filterMeetings(value)
  }

  const clearSearch = () => {
    setSearchTerm("")
    onFilteredMeetingsChange(meetings)
  }

  const getSearchStats = () => {
    if (!searchTerm.trim()) return null

    const filteredCount = meetings.filter((meeting) => {
      const searchLower = searchTerm.toLowerCase().trim()
      return (
        meeting.title.toLowerCase().includes(searchLower) ||
        meeting.organizer.toLowerCase().includes(searchLower) ||
        meeting.attendees.some((attendee) => attendee.toLowerCase().includes(searchLower)) ||
        meeting.company.toLowerCase().includes(searchLower)
      )
    }).length

    return {
      found: filteredCount,
      total: meetings.length,
    }
  }

  const searchStats = getSearchStats()

  return (
    <Card className={`bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg ${className}`}>
      <div className="p-4">
        {/* Barra de búsqueda principal */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              placeholder="Buscar por sesión, organizador, participantes o empresa..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-10 border-slate-200 focus:border-green-700 focus:ring-green-700/20 bg-white/80"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="border-slate-200 hover:bg-slate-50 flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {isExpanded ? "Ocultar" : "Filtros"}
          </Button>
        </div>

        {/* Estadísticas de búsqueda */}
        {searchStats && (
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                <Calendar className="h-3 w-3 mr-1" />
                {searchStats.found} de {searchStats.total} reuniones
              </Badge>
              {searchStats.found === 0 && <span className="text-sm text-slate-700">No se encontraron resultados</span>}
            </div>
            {searchTerm && (
              <Button variant="ghost" size="sm" onClick={clearSearch} className="text-slate-700 hover:text-slate-700">
                Limpiar búsqueda
              </Button>
            )}
          </div>
        )}

        {/* Panel expandido con información adicional */}
        {isExpanded && (
          <>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">Criterios de búsqueda:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  <div className="flex items-center gap-2 text-xs text-slate-800 bg-slate-50 px-2 py-1 rounded">
                    <Calendar className="h-3 w-3" />
                    Nombre de sesión
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-800 bg-slate-50 px-2 py-1 rounded">
                    <User className="h-3 w-3" />
                    Organizador
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-800 bg-slate-50 px-2 py-1 rounded">
                    <Users className="h-3 w-3" />
                    Participantes
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-800 bg-slate-50 px-2 py-1 rounded">
                    <Filter className="h-3 w-3" />
                    Empresa
                  </div>
                </div>
              </div>

              {/* Sugerencias de búsqueda */}
              {!searchTerm && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Sugerencias:</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(meetings.map((m) => m.company)))
                      .slice(0, 4)
                      .map((company) => (
                        <Button
                          key={company}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSearchChange(company)}
                          className="text-xs border-slate-200 hover:bg-slate-50"
                        >
                          {company}
                        </Button>
                      ))}
                    {Array.from(new Set(meetings.map((m) => m.organizer)))
                      .slice(0, 3)
                      .map((organizer) => (
                        <Button
                          key={organizer}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSearchChange(organizer)}
                          className="text-xs border-slate-200 hover:bg-slate-50"
                        >
                          {organizer}
                        </Button>
                      ))}
                  </div>
                </div>
              )}

              {/* Resultados de búsqueda detallados */}
              {searchTerm && searchStats && searchStats.found > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">
                    Reuniones encontradas ({searchStats.found}):
                  </h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {meetings
                      .filter((meeting) => {
                        const searchLower = searchTerm.toLowerCase().trim()
                        return (
                          meeting.title.toLowerCase().includes(searchLower) ||
                          meeting.organizer.toLowerCase().includes(searchLower) ||
                          meeting.attendees.some((attendee) => attendee.toLowerCase().includes(searchLower)) ||
                          meeting.company.toLowerCase().includes(searchLower)
                        )
                      })
                      .slice(0, 5)
                      .map((meeting) => (
                        <div
                          key={meeting.id}
                          className="flex items-center justify-between p-2 bg-slate-50 rounded text-xs"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{meeting.title}</div>
                            <div className="text-slate-700 truncate">
                              {meeting.organizer} • {meeting.company}
                            </div>
                          </div>
                          <div className="text-slate-400 flex-shrink-0 ml-2">
                            {new Date(meeting.startTime).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    {searchStats.found > 5 && (
                      <div className="text-xs text-slate-700 text-center py-1">Y {searchStats.found - 5} más...</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
