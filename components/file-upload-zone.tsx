"use client"

import type React from "react"

import { useCallback } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploadZoneProps {
  onFilesSelected: (files: FileList) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // en MB
}

export function FileUploadZone({
  onFilesSelected,
  accept = "*/*",
  multiple = true,
  maxSize = 10,
}: FileUploadZoneProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const files = e.dataTransfer.files
      if (files.length > 0) {
        // Validar tamaño de archivos
        const validFiles = Array.from(files).filter((file) => {
          const sizeInMB = file.size / 1024 / 1024
          return sizeInMB <= maxSize
        })

        if (validFiles.length > 0) {
          const fileList = new DataTransfer()
          validFiles.forEach((file) => fileList.items.add(file))
          onFilesSelected(fileList.files)
        }
      }
    },
    [onFilesSelected, maxSize],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(e.target.files)
    }
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors"
    >
      <div className="flex flex-col items-center gap-2">
        <Upload className="h-8 w-8 text-muted-foreground/50" />
        <div>
          <p className="text-sm font-medium">Arrastra archivos aquí o</p>
          <div className="mt-2">
            <input
              type="file"
              multiple={multiple}
              accept={accept}
              onChange={handleFileInput}
              className="hidden"
              id="file-upload-input"
            />
            <Button variant="outline" size="sm" asChild>
              <label htmlFor="file-upload-input" className="cursor-pointer">
                Seleccionar archivos
              </label>
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Máximo {maxSize}MB por archivo</p>
      </div>
    </div>
  )
}
