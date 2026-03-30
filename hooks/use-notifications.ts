"use client";

import { useEffect, useState } from "react";
import { generateSampleNotifications } from "@/lib/mock-data";
import { Notification } from "@/types/notification";

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Cargar notificaciones de ejemplo
    const sampleNotifications = generateSampleNotifications();
    setNotifications(sampleNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.seen).length;

  return { notifications, unreadCount };
};
