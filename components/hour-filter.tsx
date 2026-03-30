"use client"
import { Clock, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface HourFilterProps {
  startHour: number
  endHour: number
  onStartHourChange: (hour: number) => void
  onEndHourChange: (hour: number) => void
}

export function HourFilter({ startHour, endHour, onStartHourChange, onEndHourChange }: HourFilterProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Clock className="h-4 w-4" />
          <span className="hidden sm:inline">Horario:</span>
          <span>
            {formatHour(startHour)} - {formatHour(endHour)}
          </span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-4">
        <div className="space-y-4">
          <div className="text-sm font-medium">Filtrar horario visible</div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Hora inicio</Label>
              <Select value={startHour.toString()} onValueChange={(v) => onStartHourChange(Number.parseInt(v))}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {hours
                    .filter((h) => h < endHour)
                    .map((hour) => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {formatHour(hour)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Hora fin</Label>
              <Select value={endHour.toString()} onValueChange={(v) => onEndHourChange(Number.parseInt(v))}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {hours
                    .filter((h) => h > startHour)
                    .map((hour) => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {formatHour(hour)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs bg-transparent"
              onClick={() => {
                onStartHourChange(8)
                onEndHourChange(18)
              }}
            >
              Laboral (8-18)
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs bg-transparent"
              onClick={() => {
                onStartHourChange(0)
                onEndHourChange(24)
              }}
            >
              Todo el día
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
