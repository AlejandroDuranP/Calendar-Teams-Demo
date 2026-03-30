export interface Notification {
  id: string;
  userId: string;
  message: string;
  meetingId?: string;
  organizer: string;
  startTime: any; 
  seen: boolean;
  timestamp: any;
}
