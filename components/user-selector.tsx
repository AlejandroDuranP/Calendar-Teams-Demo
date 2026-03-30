"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, UserIcon, Mail, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/types/user"

interface UserSelectorProps {
  users: User[]
  selectedUsers: User[]
  onSelectionChange: (users: User[]) => void
  placeholder?: string
  multiple?: boolean
  className?: string
}

export function UserSelector({
  users,
  selectedUsers,
  onSelectionChange,
  placeholder = "Seleccionar usuario...",
  multiple = false,
  className,
}: UserSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const handleSelect = (user: User) => {
    if (multiple) {
      const isSelected = selectedUsers.some((u) => u.id === user.id)
      if (isSelected) {
        onSelectionChange(selectedUsers.filter((u) => u.id !== user.id))
      } else {
        onSelectionChange([...selectedUsers, user])
      }
    } else {
      onSelectionChange([user])
      setOpen(false)
    }
  }

  const removeUser = (userId: string) => {
    onSelectionChange(selectedUsers.filter((u) => u.id !== userId))
  }

  const filteredUsers = users.filter(
    (user) =>
      user.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.correo.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.tipo.toLowerCase().includes(searchValue.toLowerCase()),
  )

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-left font-normal bg-transparent"
          >
            {selectedUsers.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : multiple ? (
              <span>{selectedUsers.length} usuario(s) seleccionado(s)</span>
            ) : (
              <span>{selectedUsers[0].nombre}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Buscar por nombre, correo o tipo..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>No se encontraron usuarios.</CommandEmpty>
              <CommandGroup>
                {filteredUsers.map((user) => {
                  const isSelected = selectedUsers.some((u) => u.id === user.id)
                  return (
                    <CommandItem 
                      key={user.id} 
                      value={`${user.nombre} ${user.correo} ${user.tipo}`} 
                      onSelect={() => handleSelect(user)}
                    >
                      <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{user.nombre}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span className="truncate">{user.correo}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">{user.tipo}</div>
                          </div>
                        </div>
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Mostrar usuarios seleccionados como badges */}
      {multiple && selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedUsers.map((user) => (
            <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
              <UserIcon className="h-3 w-3" />
              {user.nombre}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeUser(user.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
