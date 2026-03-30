"use client"

import { useState, useEffect } from "react"
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight, CalendarIcon, Plus, Users, Clock, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Meeting, MeetingStatus } from "@/types/meeting"
import { MEETING_STATUS_CONFIG } from "@/types/meeting"
import { SearchFilter } from "@/components/search-filter"
import { HourFilter } from "@/components/hour-filter"
import { ExportButton } from "@/components/export-button"

interface CalendarProps {
  meetings: Meeting[]
  onMeetingClick: (meeting: Meeting) => void
  onEmptySlotClick: (date: Date) => void
  onUpdateMeeting: (meeting: Meeting) => void
}

interface MeetingLayout {
  meeting: Meeting
  left: string
  width: string
  top: number
  height: number
  zIndex: number
}

export function Calendar({ meetings, onMeetingClick, onEmptySlotClick, onUpdateMeeting }: CalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [hoveredMeeting, setHoveredMeeting] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>(meetings)
  const [startHour, setStartHour] = useState(8)
  const [endHour, setEndHour] = useState(18)

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i))
  const hours = Array.from({ length: endHour - startHour }, (_, i) => i + startHour)

  const HOUR_HEIGHT = 60

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setFilteredMeetings(meetings)
  }, [meetings])

  useEffect(() => {
    const now = new Date()
    filteredMeetings.forEach((meeting) => {
      if (new Date(meeting.endTime) < now && meeting.status === "Abierta") {
        const updated = { ...meeting, status: "Cerrada" as MeetingStatus }
        onUpdateMeeting(updated)
      }
    })
  }, [filteredMeetings, onUpdateMeeting])

  const handleSlotClick = (day: Date, hour: number) => {
    const clickedDate = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, 0)
    onEmptySlotClick(clickedDate)
  }

  const handleFilteredMeetingsChange = (filtered: Meeting[]) => {
    setFilteredMeetings(filtered)
  }

  const doMeetingsOverlap = (meeting1: Meeting, meeting2: Meeting) => {
    const start1 = new Date(meeting1.startTime)
    const end1 = new Date(meeting1.endTime)
    const start2 = new Date(meeting2.startTime)
    const end2 = new Date(meeting2.endTime)
    return start1 < end2 && start2 < end1
  }

  const formatDuration = (startTime: Date, endTime: Date) => {
    const diffMs = endTime.getTime() - startTime.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    if (diffHours === 0) return `${diffMinutes}min`
    else if (diffMinutes === 0) return `${diffHours}h`
    else return `${diffHours}h ${diffMinutes}min`
  }

  const getCurrentTimePosition = () => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinutes = now.getMinutes()
    if (currentHour < startHour || currentHour >= endHour) return null
    const offsetMinutes = (currentHour - startHour) * 60 + currentMinutes
    return offsetMinutes
  }

  const shouldShowCurrentTimeLine = () => {
    const today = new Date()
    const currentHour = today.getHours()
    return weekDays.some((day) => isSameDay(day, today)) && currentHour >= startHour && currentHour < endHour
  }

  const getCurrentDayIndex = () => {
    const today = new Date()
    return weekDays.findIndex((day) => isSameDay(day, today))
  }

  const calculateMeetingLayouts = (): MeetingLayout[] => {
    const layouts: MeetingLayout[] = []

    const weekMeetings = filteredMeetings.filter((meeting) => {
      const meetingDate = new Date(meeting.startTime)
      return weekDays.some((day) => isSameDay(day, meetingDate))
    })

    const meetingsByDay = weekDays.map((day, dayIndex) => ({
      dayIndex,
      meetings: weekMeetings.filter((meeting) => isSameDay(new Date(meeting.startTime), day)),
    }))

    meetingsByDay.forEach(({ dayIndex, meetings: dayMeetings }) => {
      if (dayMeetings.length === 0) return

      const sortedMeetings = [...dayMeetings].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      )

      const overlapGroups: Meeting[][] = []
      const processed = new Set<string>()

      sortedMeetings.forEach((meeting) => {
        if (processed.has(meeting.id)) return
        const group = [meeting]
        processed.add(meeting.id)
        sortedMeetings.forEach((otherMeeting) => {
          if (
            !processed.has(otherMeeting.id) &&
            group.some((groupMeeting) => doMeetingsOverlap(groupMeeting, otherMeeting))
          ) {
            group.push(otherMeeting)
            processed.add(otherMeeting.id)
          }
        })
        overlapGroups.push(group)
      })

      overlapGroups.forEach((group) => {
        const HOUR_COLUMN_WIDTH = 6
        const TOTAL_DAYS_WIDTH = 94
        const DAY_WIDTH = TOTAL_DAYS_WIDTH / 5
        const USABLE_PERCENT = 0.85
        const MARGIN_LEFT = 0.5

        const dayStartPosition = HOUR_COLUMN_WIDTH + dayIndex * DAY_WIDTH + MARGIN_LEFT
        const availableWidth = DAY_WIDTH * USABLE_PERCENT
        const meetingWidth = availableWidth / group.length

        group.forEach((meeting, index) => {
          const meetingStart = new Date(meeting.startTime)
          const meetingEnd = new Date(meeting.endTime)

          const startHourMeeting = meetingStart.getHours()
          const startMinutes = meetingStart.getMinutes()
          const endHourMeeting = meetingEnd.getHours()
          const endMinutes = meetingEnd.getMinutes()

          const startOffsetMinutes = (startHourMeeting - startHour) * 60 + startMinutes
          const endOffsetMinutes = (endHourMeeting - startHour) * 60 + endMinutes

          const top = startOffsetMinutes
          const height = Math.max(30, endOffsetMinutes - startOffsetMinutes)
          const left = dayStartPosition + index * meetingWidth

          // Solo mostrar si está dentro del rango visible
          if (startHourMeeting < endHour && endHourMeeting > startHour) {
            layouts.push({
              meeting,
              left: `${left}%`,
              width: `${meetingWidth}%`,
              top: Math.max(0, top),
              height,
              zIndex: 20 + index,
            })
          }
        })
      })
    })

    return layouts
  }

  const meetingLayouts = calculateMeetingLayouts()
  const currentTimePosition = getCurrentTimePosition()
  const showCurrentTimeLine = shouldShowCurrentTimeLine()
  const currentDayIndex = getCurrentDayIndex()

  return (
    <div className="bg-gradient-to-br from-slate-50 to-green-50/30 min-h-screen p-2 sm:p-4 lg:p-6">
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <div className="p-3 sm:p-4 lg:p-8">
          {/* Header - Responsivo */}
          <div className="flex flex-col gap-4 mb-4 lg:mb-8">
            {/* Primera fila: navegación y título */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                    className="border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                    className="border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-r from-green-700 to-green-800 rounded-lg">
                    <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg lg:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-800 bg-clip-text text-transparent">
                      {format(weekStart, "d MMM", { locale: es })} -{" "}
                      {format(addDays(weekStart, 4), "d MMM yyyy", { locale: es })}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-700 hidden sm:block">Semana laboral</p>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="text-xs sm:text-sm text-slate-800 bg-white/80 px-2 sm:px-3 py-1 rounded-lg border">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                  {format(currentTime, "HH:mm")}
                </div>
                <HourFilter
                  startHour={startHour}
                  endHour={endHour}
                  onStartHourChange={setStartHour}
                  onEndHourChange={setEndHour}
                />
                <ExportButton meetings={meetings} currentDate={currentWeek} />
                <Button
                  onClick={() => setCurrentWeek(new Date())}
                  size="sm"
                  className="bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Hoy
                </Button>
              </div>
            </div>

            {/* Filtro de búsqueda */}
            <SearchFilter meetings={meetings} onFilteredMeetingsChange={handleFilteredMeetingsChange} />
          </div>

          {/* Calendar Grid - Responsivo con scroll horizontal en móviles */}
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="min-w-[600px] sm:min-w-[700px] lg:min-w-[900px] relative px-3 sm:px-0">
              {/* Days Header */}
              <div
                className="grid gap-px bg-slate-200 rounded-t-xl overflow-hidden"
                style={{ gridTemplateColumns: "6% repeat(5, 1fr)" }}
              >
                <div className="bg-gradient-to-r from-slate-100 to-slate-50 p-1 sm:p-2"></div>
                {weekDays.map((day) => (
                  <div
                    key={day.toISOString()}
                    className="bg-gradient-to-r from-slate-100 to-slate-50 p-2 sm:p-3 text-center"
                  >
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      <div className="font-semibold text-slate-800 text-xs sm:text-sm uppercase tracking-wide">
                        {format(day, "EEE", { locale: es })}
                      </div>
                      <div
                        className={`text-sm sm:text-xl font-bold ${
                          isSameDay(day, new Date())
                            ? "text-white bg-gradient-to-r from-green-700 to-green-800 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg"
                            : "text-slate-800"
                        }`}
                      >
                        {format(day, "d")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slots Grid */}
              <div className="relative">
                <div className="grid gap-px bg-slate-200" style={{ gridTemplateColumns: "6% repeat(5, 1fr)" }}>
                  {hours.map((hour, hourIndex) => (
                    <div key={hour} className="contents">
                      <div
                        className={`bg-gradient-to-r from-slate-100 to-slate-50 p-1 sm:p-2 text-right border-r border-slate-200 flex flex-col justify-center ${
                          hourIndex === hours.length - 1 ? "rounded-bl-xl" : ""
                        }`}
                        style={{ height: `${HOUR_HEIGHT}px` }}
                      >
                        <div className="text-xs sm:text-sm font-semibold text-slate-800">{hour}:00</div>
                        <div className="text-[10px] sm:text-xs text-slate-400">{hour < 12 ? "AM" : "PM"}</div>
                      </div>

                      {weekDays.map((day, dayIndex) => (
                        <div
                          key={`${day.toISOString()}-${hour}`}
                          className={`bg-white relative cursor-pointer hover:bg-gradient-to-r hover:from-green-50 hover:to-green-50 transition-all duration-200 group border-b border-slate-100 ${
                            hourIndex === hours.length - 1 && dayIndex === weekDays.length - 1 ? "rounded-br-xl" : ""
                          }`}
                          style={{ height: `${HOUR_HEIGHT}px` }}
                          onClick={() => handleSlotClick(day, hour)}
                        >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="bg-gradient-to-r from-green-700 to-green-800 text-white rounded-full p-1.5 sm:p-2 shadow-lg">
                              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Línea de tiempo actual */}
                {showCurrentTimeLine && currentTimePosition !== null && currentDayIndex !== -1 && (
                  <div
                    className="absolute z-50 border-t-2 border-red-700 shadow-lg"
                    style={{ top: `${currentTimePosition}px`, left: "6%", right: "0%", width: "94%" }}
                  >
                    <div
                      className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-red-700 rounded-full -mt-1 sm:-mt-1.5 shadow-lg"
                      style={{ left: `${currentDayIndex * 18.8 + 9.4}%` }}
                    />
                    <div
                      className="absolute bg-red-700 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded shadow-lg -mt-5 sm:-mt-6"
                      style={{ left: `${currentDayIndex * 18.8 + 9.4}%`, transform: "translateX(-50%)" }}
                    >
                      {format(currentTime, "HH:mm")}
                    </div>
                  </div>
                )}

                {/* Reuniones */}
                {meetingLayouts.map((layout) => {
                  const { meeting, left, width, top, height, zIndex } = layout
                  const isPastMeeting = new Date(meeting.startTime) < new Date()
                  const statusConfig = MEETING_STATUS_CONFIG[meeting.status]
                  const isHovered = hoveredMeeting === meeting.id

                  return (
                    <div
                      key={meeting.id}
                      style={{
                        position: "absolute",
                        top: `${top}px`,
                        left,
                        width,
                        height: `${height}px`,
                        zIndex: isHovered ? 100 : zIndex,
                      }}
                      className={`${statusConfig.bgColor} mx-0 my-2 border-l-2 ${statusConfig.borderColor} rounded-lg transition-all duration-200 cursor-pointer relative overflow-hidden ${
                        isHovered ? "shadow-2xl scale-105 ring-2 ring-green-400 ring-opacity-50" : "hover:shadow-lg"
                      }`}
                      onMouseEnter={() => setHoveredMeeting(meeting.id)}
                      onMouseLeave={() => setHoveredMeeting(null)}
                      onClick={(e) => {
                        e.stopPropagation()
                        onMeetingClick(meeting)
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>

                      {/* Vista normal */}
                      {!isHovered && (
                        <div className="relative z-10 h-full flex flex-col p-1.5 sm:p-2 py-1 w-min">
                          <div className="flex-shrink-0 space-y-0.5">
                            <div className="font-semibold text-[10px] sm:text-xs truncate text-slate-800 leading-tight">
                              {meeting.title}
                            </div>
                            <div className="text-[10px] sm:text-xs text-slate-800 truncate font-medium">
                              {meeting.company}
                            </div>
                            <div className="text-[10px] sm:text-xs text-slate-700 truncate">{meeting.organizer}</div>
                          </div>
                          <div className="flex-1"></div>
                          {height > 50 && (
                            <div className="flex-shrink-0">
                              <div className="text-[10px] sm:text-xs text-slate-700 truncate">
                                {format(meeting.startTime, "HH:mm")} - {format(meeting.endTime, "HH:mm")}
                              </div>
                            </div>
                          )}
                          {isPastMeeting && (
                            <div className="absolute top-1 right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full opacity-60"></div>
                          )}
                        </div>
                      )}

                      {/* Vista hover */}
                      {isHovered && (
                        <div className="relative z-10 flex flex-col p-2 sm:p-3 rounded-lg min-h-[120px] h-full bg-white/95">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-xs sm:text-sm text-slate-800 leading-tight">
                                {meeting.title}
                              </h4>
                            </div>
                          </div>

                          <div className="space-y-1.5 text-[10px] sm:text-xs">
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Users className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{meeting.organizer}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Building2 className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{meeting.company}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Clock className="h-3 w-3 flex-shrink-0" />
                              <span>
                                {format(meeting.startTime, "HH:mm")} - {format(meeting.endTime, "HH:mm")}
                                <span className="text-slate-400 ml-1">
                                  ({formatDuration(new Date(meeting.startTime), new Date(meeting.endTime))})
                                </span>
                              </span>
                            </div>
                            {meeting.attendees.length > 0 && (
                              <div className="text-slate-500">
                                {meeting.attendees.length} asistente{meeting.attendees.length !== 1 ? "s" : ""}
                              </div>
                            )}
                          </div>

                          {meeting.description && (
                            <p className="text-[10px] sm:text-xs text-slate-500 mt-2 line-clamp-2">
                              {meeting.description}
                            </p>
                          )}

                          <div className="mt-auto pt-2 text-[10px] text-slate-400">
                            {format(meeting.startTime, "EEEE d 'de' MMMM", { locale: es })}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
