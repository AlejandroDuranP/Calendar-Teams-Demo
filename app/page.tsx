"use client";

import { useState } from "react";
import { Calendar } from "@/components/calendar";
import { MeetingModal } from "@/components/meeting-modal";
import { NewMeetingModal } from "@/components/new-meeting-modal";
import { UserInfo } from "@/components/user-info";
import { useMeetings } from "@/hooks/use-meetings";
import type { Meeting } from "@/types/meeting";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, RefreshCw, Database, Settings, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createNotificationsForMeeting, updateNotificationsForMeeting } from "@/lib/notifications";
import { NotificationWidget } from "@/components/notification-widget";

export default function CalendarPage() {
  const { meetings, loading, error, firebaseStatus, addMeetings, editMeeting, removeMeeting, refreshMeetings } =
    useMeetings();

  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [newMeetingDate, setNewMeetingDate] = useState<Date | null>(null);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);

  const handleMeetingClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowMeetingModal(true);
  };

  const handleEmptySlotClick = (date: Date) => {
    setNewMeetingDate(date);
    setShowNewMeetingModal(true);
  };

  const handleCreateMeetings = async (meetingsData: Omit<Meeting, "id">[]) => {
    try {
      const createdMeetings = await addMeetings(meetingsData);

      for (const meeting of createdMeetings) {
        await createNotificationsForMeeting(meeting);
      }

      setShowNewMeetingModal(false);
      setNewMeetingDate(null);
      console.log(`${meetingsData.length} reunion(es) creada(s) exitosamente`);
    } catch (error) {
      console.error("Error al crear reuniones:", error);
    }
  };

  const handleUpdateMeeting = async (updatedMeeting: Meeting) => {
    try {
      await editMeeting(updatedMeeting.id, updatedMeeting);
      await updateNotificationsForMeeting(updatedMeeting);

      setShowMeetingModal(false);
      setSelectedMeeting(null);
      console.log("Reunion actualizada exitosamente");
    } catch (error) {
      console.error("Error al actualizar reunion:", error);
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    try {
      await removeMeeting(meetingId);
      setShowMeetingModal(false);
      setSelectedMeeting(null);
      console.log("Reunion eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar reunion:", error);
    }
  };

  const handleOpenMeetingFromNotification = (meetingId: string) => {
    const meeting = meetings.find((m) => m.id === meetingId);
    if (meeting) {
      setSelectedMeeting(meeting);
      setShowMeetingModal(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30">
        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-4 text-sm text-slate-600">Cargando calendario...</p>
        </Card>
      </div>
    );
  }

  if (error && !firebaseStatus.developmentMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30">
        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm max-w-md">
          <AlertCircle className="h-8 w-8 text-red-600" />
          <p className="mt-4 text-sm text-slate-600">{error}</p>
          <Button onClick={refreshMeetings} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header con estado del sistema */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Database className="h-5 w-5 text-slate-600" />
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <Settings className="h-3 w-3 mr-1" />
            Modo Portafolio
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Briefcase className="h-3 w-3 mr-1" />
            Datos de Ejemplo
          </Badge>
          <span className="text-sm text-slate-600">({meetings.length} reuniones)</span>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={refreshMeetings}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Actualizar
          </Button>
          <NotificationWidget onOpenMeeting={handleOpenMeetingFromNotification} />
          <UserInfo />
        </div>
      </div>

      {/* Calendario */}
      <Calendar
        meetings={meetings}
        onMeetingClick={handleMeetingClick}
        onEmptySlotClick={handleEmptySlotClick}
        onUpdateMeeting={handleUpdateMeeting}
      />

      {showMeetingModal && selectedMeeting && (
        <MeetingModal
          meeting={selectedMeeting}
          isOpen={showMeetingModal}
          onClose={() => {
            setShowMeetingModal(false);
            setSelectedMeeting(null);
          }}
          onUpdate={handleUpdateMeeting}
          onDelete={handleDeleteMeeting}
        />
      )}

      {showNewMeetingModal && newMeetingDate && (
        <NewMeetingModal
          initialDate={newMeetingDate}
          onClose={() => {
            setShowNewMeetingModal(false);
            setNewMeetingDate(null);
          }}
          onCreate={handleCreateMeetings}
        />
      )}
    </div>
  );
}
