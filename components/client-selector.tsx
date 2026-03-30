"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Building } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Client } from "@/types/user"

interface ClientSelectorProps {
  clients: Client[]
  selectedClient: Client | null
  onSelectionChange: (client: Client | null) => void
  placeholder?: string
  className?: string
}

export function ClientSelector({
  clients,
  selectedClient,
  onSelectionChange,
  placeholder = "Seleccionar empresa...",
  className,
}: ClientSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const handleSelect = (client: Client) => {
    onSelectionChange(selectedClient?.id === client.id ? null : client)
    setOpen(false)
  }

  const filteredClients = clients.filter((client) => client.nombre.toLowerCase().includes(searchValue.toLowerCase()))

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
            {selectedClient ? (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{selectedClient.nombre}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput placeholder="Buscar empresa..." value={searchValue} onValueChange={setSearchValue} />
            <CommandList>
              <CommandEmpty>No se encontraron empresas.</CommandEmpty>
              <CommandGroup>
                {filteredClients.map((client) => (
                  <CommandItem key={client.id} value={client.nombre} onSelect={() => handleSelect(client)}>
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedClient?.id === client.id ? "opacity-100" : "opacity-0")}
                    />
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{client.nombre}</span>
                      {client.activo === false && <span className="text-xs text-muted-foreground">(Inactivo)</span>}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
