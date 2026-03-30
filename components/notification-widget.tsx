"use client";

import React from "react";
import { useState } from "react";
import { useNotifications } from "@/hooks/use-notifications";
import { Bell, X, Check, Trash2, CheckCheck, ExternalLink, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Notification } from "@/types/notification";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NotificationWidgetProps {
  onOpenMeeting?: (meetingId: string) => void;
}

type ResponseStatus = "accepted" | "rejected" | "provisional" | null;

export const NotificationWidget = ({ onOpenMeeting }: NotificationWidgetProps) => {
  const { notifications: initialNotifications, unreadCount: initialUnreadCount } = useNotifications();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [open, setOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);

  // Actualizar notificaciones cuando cambien las iniciales
  React.useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const unreadCount = notifications.filter((n) => !n.seen).length;

  const respondToMeeting = async (notif: Notification, response: ResponseStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notif.meetingId) return;

    setRespondingTo(notif.id);
    
    // Simular respuesta (modo demo)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setNotifications(prev => 
      prev.map(n => 
        n.id === notif.id 
          ? { ...n, seen: true, userResponse: response } as Notification & { userResponse: ResponseStatus }
          : n
      )
    );
    
    setRespondingTo(null);
  };

  const markAllAsRead = async () => {
    const unreadNotifs = notifications.filter(n => !n.seen);
    if (unreadNotifs.length === 0) return;
    
    setIsMarkingAll(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setNotifications(prev => prev.map(n => ({ ...n, seen: true })));
    setIsMarkingAll(false);
  };

  const clearAllNotifications = async () => {
    if (notifications.length === 0) return;
    
    setIsClearing(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setNotifications([]);
    setIsClearing(false);
  };

  const handleNotificationClick = (notif: Notification) => {
    if (notif.meetingId && onOpenMeeting) {
      onOpenMeeting(notif.meetingId);
      setOpen(false);
    }
  };

  const formatDate = (date: any) => {
    try {
      const d = new Date(date.seconds ? date.seconds * 1000 : date);
      return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
    } catch {
      return "Fecha invalida";
    }
  };

  const formatTime = (date: any) => {
    try {
      const d = new Date(date.seconds ? date.seconds * 1000 : date);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Hora invalida";
    }
  };

  const getResponseStatus = (notif: Notification): ResponseStatus => {
    return (notif as any).userResponse || null;
  };

  return (
    <TooltipProvider>
      <div className="relative inline-block">
        <button
          onClick={() => setOpen(!open)}
          className="relative bg-transparent hover:text-blue-700 text-slate-700 transition-colors"
          aria-label="Notificaciones"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setOpen(false)}
            />
            
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white shadow-xl rounded-lg z-50 border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800">
                    Notificaciones ({notifications.length})
                    {unreadCount > 0 && (
                      <span className="ml-2 text-xs font-normal text-slate-500">
                        {unreadCount} sin leer
                      </span>
                    )}
                  </h3>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {notifications.length > 0 && (
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/50 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllAsRead}
                    disabled={isMarkingAll || unreadCount === 0}
                    className="flex-1 text-xs h-8 bg-transparent"
                  >
                    <CheckCheck size={14} className="mr-1" />
                    {isMarkingAll ? "Marcando..." : "Marcar leidas"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllNotifications}
                    disabled={isClearing}
                    className="flex-1 text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 bg-transparent"
                  >
                    <Trash2 size={14} className="mr-1" />
                    {isClearing ? "Limpiando..." : "Limpiar todo"}
                  </Button>
                </div>
              )}

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No hay notificaciones</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {notifications.map((notif) => {
                      const responseStatus = getResponseStatus(notif);
                      const isResponding = respondingTo === notif.id;
                      
                      return (
                        <li
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`px-4 py-3 transition-colors ${
                            notif.meetingId ? "cursor-pointer hover:bg-blue-50/50" : ""
                          } ${notif.seen ? "bg-slate-50/50" : "bg-white"}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                {!notif.seen && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                )}
                                <p className={`text-sm font-medium truncate ${notif.seen ? "text-slate-600" : "text-slate-800"}`}>
                                  {notif.message}
                                </p>
                                {notif.meetingId && (
                                  <ExternalLink size={12} className="text-blue-500 flex-shrink-0" />
                                )}
                              </div>
                              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                                <span>Org: {notif.organizer}</span>
                                <span>{formatDate(notif.startTime)} - {formatTime(notif.startTime)}</span>
                              </div>
                              
                              {responseStatus && (
                                <div className="mt-2">
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    responseStatus === "accepted" ? "bg-green-100 text-green-700" :
                                    responseStatus === "rejected" ? "bg-red-100 text-red-700" :
                                    "bg-amber-100 text-amber-700"
                                  }`}>
                                    {responseStatus === "accepted" ? "Aceptada" :
                                     responseStatus === "rejected" ? "Rechazada" : "Provisional"}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {notif.meetingId && (
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={(e) => respondToMeeting(notif, "accepted", e)}
                                      disabled={isResponding}
                                      className={`p-1.5 rounded transition-colors ${
                                        responseStatus === "accepted" 
                                          ? "bg-green-100 text-green-600" 
                                          : "text-slate-400 hover:text-green-600 hover:bg-green-50"
                                      }`}
                                    >
                                      <Check size={14} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>Aceptar</TooltipContent>
                                </Tooltip>
                                
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={(e) => respondToMeeting(notif, "provisional", e)}
                                      disabled={isResponding}
                                      className={`p-1.5 rounded transition-colors ${
                                        responseStatus === "provisional" 
                                          ? "bg-amber-100 text-amber-600" 
                                          : "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                                      }`}
                                    >
                                      <HelpCircle size={14} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>Provisional</TooltipContent>
                                </Tooltip>
                                
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={(e) => respondToMeeting(notif, "rejected", e)}
                                      disabled={isResponding}
                                      className={`p-1.5 rounded transition-colors ${
                                        responseStatus === "rejected" 
                                          ? "bg-red-100 text-red-600" 
                                          : "text-slate-400 hover:text-red-600 hover:bg-red-50"
                                      }`}
                                    >
                                      <X size={14} />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>Rechazar</TooltipContent>
                                </Tooltip>
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  );
};
