"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MEETING_STATUS_CONFIG, type MeetingStatus } from "@/types/meeting"

interface StatusFilterProps {
  selectedStatuses: MeetingStatus[]
  onStatusToggle: (status: MeetingStatus) => void
  onClearAll: () => void
}

export function StatusFilter({ selectedStatuses, onStatusToggle, onClearAll }: StatusFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium">Filtrar por estado:</span>
      {Object.entries(MEETING_STATUS_CONFIG).map(([status, config]) => {
        const isSelected = selectedStatuses.includes(status as MeetingStatus)
        return (
          <Badge
            key={status}
            variant={isSelected ? "default" : "outline"}
            className={`cursor-pointer transition-colors ${
              isSelected ? `${config.color} text-white hover:opacity-80` : `hover:${config.bgColor}`
            }`}
            onClick={() => onStatusToggle(status as MeetingStatus)}
          >
            <div className={`w-2 h-2 rounded-full mr-1 ${isSelected ? "bg-white" : config.color}`} />
            {config.label}
          </Badge>
        )
      })}
      {selectedStatuses.length > 0 && (
        <Button variant="ghost" size="sm" onClick={onClearAll}>
          Limpiar filtros
        </Button>
      )}
    </div>
  )
}
