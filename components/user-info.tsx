"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Mail, Briefcase, ChevronDown, Info } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function UserInfo() {
  const { userInfo } = useAuth()

  if (!userInfo) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm">
              {getInitials(userInfo.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{userInfo.name}</span>
            <span className="text-xs text-muted-foreground">{userInfo.type}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Mi Cuenta (Demo)</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="px-2 py-2 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{userInfo.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{userInfo.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            <span>{userInfo.type}</span>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem disabled className="text-slate-500">
          <Info className="mr-2 h-4 w-4" />
          Modo Portafolio Activo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
