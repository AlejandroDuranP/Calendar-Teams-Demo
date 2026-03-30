# API Reference & Integration Guide

## Table of Contents
1. [Services API Reference](#services-api-reference)
2. [Firebase Integration](#firebase-integration)
3. [Custom Hooks API](#custom-hooks-api)
4. [Component Props Reference](#component-props-reference)
5. [Type Definitions](#type-definitions)
6. [External Service Integration](#external-service-integration)
7. [Error Codes & Handling](#error-codes--handling)
8. [Code Examples](#code-examples)

---

## Services API Reference

### Meetings Service (`lib/meetings-service.ts`)

#### `getMeetings()`

**Description**: Retrieves all meetings from the database

**Signature**:
```typescript
export const getMeetings = async (): Promise<Meeting[]>
```

**Parameters**: None

**Returns**: 
- `Promise<Meeting[]>` - Array of Meeting objects

**Throws**: 
- Firebase errors if database access fails
- Gracefully handles permission denied errors

**Example**:
```typescript
try {
  const meetings = await getMeetings();
  console.log(`Loaded ${meetings.length} meetings`);
} catch (error) {
  console.error('Failed to fetch meetings:', error);
}
```

**Performance Notes**:
- Simulated network delay of 300ms
- Should be cached on client side
- Consider pagination for large datasets

---

#### `createMeeting(meeting)`

**Description**: Creates a single new meeting

**Signature**:
```typescript
export const createMeeting = async (
  meeting: Omit<Meeting, "id">
): Promise<string>
```

**Parameters**:
- `meeting` (Omit<Meeting, "id">): Meeting data excluding ID

**Returns**: 
- `Promise<string>` - ID of the newly created meeting

**Example**:
```typescript
const newMeetingId = await createMeeting({
  title: "Team Standup",
  organizer: "John Doe",
  company: "Tech Corp",
  startTime: new Date('2026-03-31T09:00:00'),
  endTime: new Date('2026-03-31T09:30:00'),
  description: "Daily team synchronization",
  attendees: ["Alice", "Bob"],
  files: [],
  comments: [],
  status: "Abierta",
});

console.log(`Meeting created with ID: ${newMeetingId}`);
```

**Validation**:
- Title must not be empty
- Start time must be before end time
- Attendees must be valid users

---

#### `createMeetings(meetings)`

**Description**: Creates multiple meetings at once (e.g., for recurring meetings)

**Signature**:
```typescript
export const createMeetings = async (
  meetings: Omit<Meeting, "id">[]
): Promise<string[]>
```

**Parameters**:
- `meetings`: Array of Meeting data (without IDs)

**Returns**: 
- `Promise<string[]>` - Array of newly created meeting IDs

**Example**:
```typescript
// Create recurring weekly meetings
const recurringMeetings = [];
for (let i = 0; i < 4; i++) {
  const startDate = new Date('2026-04-01');
  startDate.setDate(startDate.getDate() + i * 7);
  
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 1);
  
  recurringMeetings.push({
    title: "Weekly Sync",
    organizer: "Manager",
    company: "Tech Corp",
    startTime: startDate,
    endTime: endDate,
    description: "Weekly team sync",
    attendees: ["Team1", "Team2"],
    files: [],
    comments: [],
    status: "Abierta",
  });
}

const newIds = await createMeetings(recurringMeetings);
console.log(`Created ${newIds.length} recurring meetings`);
```

**Performance Notes**:
- Batch operation is more efficient than calling createMeeting multiple times
- Use for recurring meetings or bulk imports
- Simulated network delay of 300ms

---

#### `updateMeeting(id, updates)`

**Description**: Updates specific fields of an existing meeting

**Signature**:
```typescript
export const updateMeeting = async (
  id: string,
  meeting: Partial<Meeting>
): Promise<void>
```

**Parameters**:
- `id` (string): Meeting ID to update
- `meeting` (Partial<Meeting>): Fields to update (only provided fields are changed)

**Returns**: 
- `Promise<void>` - No return value

**Example**:
```typescript
await updateMeeting('meeting-123', {
  status: "Cerrada",
  description: "Updated description",
  acceptedBy: [
    {
      odId: "user1",
      name: "Alice",
      respondedAt: new Date(),
    },
  ],
});

console.log("Meeting updated successfully");
```

**Notes**:
- Performs shallow merge with existing data
- Only included fields are updated
- Meeting ID cannot be changed

---

#### `deleteMeeting(id)`

**Description**: Permanently removes a meeting from the database

**Signature**:
```typescript
export const deleteMeeting = async (id: string): Promise<void>
```

**Parameters**:
- `id` (string): ID of meeting to delete

**Returns**: 
- `Promise<void>` - No return value

**Example**:
```typescript
await deleteMeeting('meeting-123');
console.log("Meeting deleted successfully");
```

**Warnings**:
- This operation is permanent and cannot be undone
- Consider soft-delete (marking as cancelled) instead
- No cascade delete logic implemented

---

#### `getFirebaseStatus()`

**Description**: Gets the current Firebase configuration status

**Signature**:
```typescript
export const getFirebaseStatus = (): {
  configured: boolean;
  developmentMode: boolean;
  localMeetingsCount: number;
}
```

**Returns**:
- `configured` (boolean): Whether Firebase is properly configured
- `developmentMode` (boolean): Whether app is in development mode
- `localMeetingsCount` (number): Number of meetings in local storage

**Example**:
```typescript
const status = getFirebaseStatus();

if (status.developmentMode) {
  console.log("Running in development mode with mock data");
  console.log(`Local meetings count: ${status.localMeetingsCount}`);
} else if (status.configured) {
  console.log("Using Firebase backend");
}
```

---

### Authentication Service (`lib/auth-service.ts`)

#### `signInWithGoogle()`

**Description**: Initiates Google OAuth sign-in flow

**Signature**:
```typescript
export const signInWithGoogle = async (): Promise<{
  success: boolean;
  error?: string;
  errorCode?: string;
}>
```

**Returns**:
- `success` (boolean): Whether sign-in succeeded
- `error` (string, optional): Error message if failed
- `errorCode` (string, optional): Firebase error code

**Example**:
```typescript
const result = await signInWithGoogle();

if (result.success) {
  console.log("Signed in successfully");
} else {
  console.error(`Sign-in failed: ${result.error}`);
}
```

**Error Codes**:
- `popup-closed-by-user`: User closed the auth popup
- `network-request-failed`: Network connection issue
- `auth/account-exists-with-different-credential`: Account already exists

---

#### `signOut()`

**Description**: Signs out the current user and clears session

**Signature**:
```typescript
export const signOut = async (): Promise<void>
```

**Example**:
```typescript
await signOut();
console.log("Signed out successfully");
```

---

#### `onAuthStateChange(callback)`

**Description**: Subscribes to authentication state changes

**Signature**:
```typescript
export const onAuthStateChange = (
  callback: (user: AuthUser | null) => void
): (() => void)
```

**Parameters**:
- `callback`: Function called with current user on changes

**Returns**: 
- Unsubscribe function to remove listener

**Example**:
```typescript
const unsubscribe = onAuthStateChange((user) => {
  if (user) {
    console.log(`Logged in as: ${user.appUser.nombre}`);
  } else {
    console.log("Not authenticated");
  }
});

// Later, unsubscribe
unsubscribe();
```

**Notes**:
- Called immediately with current auth state
- Multiple listeners can be registered
- Must clean up in useEffect

---

### Notifications Service (`lib/notifications.ts`)

#### `createNotificationsForMeeting(meeting)`

**Description**: Creates and stores notifications for a meeting

**Signature**:
```typescript
export const createNotificationsForMeeting = async (
  meeting: Meeting
): Promise<void>
```

**Parameters**:
- `meeting`: The meeting for which to create notifications

**Example**:
```typescript
const meeting: Meeting = {
  id: "meet-123",
  title: "Important Discussion",
  organizer: "Manager",
  company: "Tech Corp",
  startTime: new Date(),
  endTime: new Date(Date.now() + 3600000),
  description: "Quarterly review",
  attendees: ["Alice", "Bob"],
  files: [],
  comments: [],
  status: "Abierta",
};

await createNotificationsForMeeting(meeting);
console.log("Notifications created for attendees");
```

---

#### `updateNotificationsForMeeting(meeting)`

**Description**: Updates notifications when meeting details change

**Signature**:
```typescript
export const updateNotificationsForMeeting = async (
  meeting: Meeting
): Promise<void>
```

**Example**:
```typescript
const updatedMeeting = {
  ...originalMeeting,
  startTime: new Date('2026-04-02T10:00:00'),
};

await updateNotificationsForMeeting(updatedMeeting);
console.log("Notifications updated with new time");
```

---

### Users & Clients Service (`lib/users-clients-service.ts`)

#### `getUsers()`

**Description**: Retrieves all team members

**Signature**:
```typescript
export const getUsers = async (): Promise<User[]>
```

**Returns**: Array of User objects

**Example**:
```typescript
const users = await getUsers();
console.log(`Found ${users.length} team members`);
```

---

#### `getClients()`

**Description**: Retrieves all clients/organizations

**Signature**:
```typescript
export const getClients = async (): Promise<Client[]>
```

**Returns**: Array of Client objects

---

#### `searchUsers(query)`

**Description**: Searches for users by name or email

**Signature**:
```typescript
export const searchUsers = async (query: string): Promise<User[]>
```

**Parameters**:
- `query`: Search string (name or email)

**Example**:
```typescript
const results = await searchUsers("john");
console.log(`Found ${results.length} users matching "john"`);
```

---

## Firebase Integration

### Setup

#### 1. Initialize Firebase

```typescript
// In your environment configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

import { initializeApp } from 'firebase/app';
const app = initializeApp(firebaseConfig);
```

#### 2. Configure Firestore

```typescript
import { getFirestore } from 'firebase/firestore';
const db = getFirestore(app);
```

#### 3. Configure Authentication

```typescript
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
```

### Firestore Collections

#### Meetings Collection

**Path**: `meetings/{meetingId}`

**Document Structure**:
```typescript
{
  title: string;
  organizer: string;
  company: string;
  startTime: Timestamp;
  endTime: Timestamp;
  description: string;
  attendees: string[];
  files: FileAttachment[];
  comments: Comment[];
  status: MeetingStatus;
  recurrence?: RecurrenceInfo;
  acceptedBy?: AttendeeResponse[];
  rejectedBy?: AttendeeResponse[];
  provisionalBy?: AttendeeResponse[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes Required**:
- `status` (Ascending)
- `startTime` (Descending)
- `organizer` (Ascending)

#### Users Collection

**Path**: `users/{userId}`

**Document Structure**:
```typescript
{
  nombre: string;
  correo: string;
  rol: string;
  empresa: string;
  departamento: string;
  telefono: string;
  fotoPerfil?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Notifications Collection

**Path**: `notifications/{notificationId}`

**Document Structure**:
```typescript
{
  type: string;
  message: string;
  meetingId?: string;
  userId: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Timestamp;
}
```

### Firestore Queries

**Get all meetings for a date range**:
```typescript
import { collection, query, where, orderBy } from 'firebase/firestore';

const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);

const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

const q = query(
  collection(db, 'meetings'),
  where('startTime', '>=', startOfDay),
  where('startTime', '<=', endOfDay),
  orderBy('startTime', 'asc')
);
```

**Get meetings for specific user**:
```typescript
const q = query(
  collection(db, 'meetings'),
  where('organizer', '==', currentUser.id),
  where('startTime', '>=', new Date()),
  orderBy('startTime', 'asc')
);
```

---

## Custom Hooks API

### `useMeetings()` Hook

**Complete API**:
```typescript
interface UseMeetingsReturn {
  meetings: Meeting[];
  loading: boolean;
  error: string | null;
  firebaseStatus: {
    configured: boolean;
    developmentMode: boolean;
    localMeetingsCount: number;
  };
  addMeeting: (meeting: Omit<Meeting, "id">) => Promise<void>;
  addMeetings: (meetings: Omit<Meeting, "id">[]) => Promise<Meeting[]>;
  editMeeting: (id: string, updates: Partial<Meeting>) => Promise<void>;
  removeMeeting: (id: string) => Promise<void>;
  refreshMeetings: () => Promise<void>;
}

function useMeetings(): UseMeetingsReturn
```

**Full Example**:
```typescript
import { useMeetings } from "@/hooks/use-meetings";

function MyComponent() {
  const { 
    meetings, 
    loading, 
    error,
    addMeetings,
    editMeeting,
    removeMeeting 
  } = useMeetings();

  const handleCreateMeeting = async () => {
    const newMeeting = {
      title: "New Meeting",
      // ... other fields
    };
    
    try {
      await addMeetings([newMeeting]);
      console.log("Meeting created");
    } catch (err) {
      console.error("Failed:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {meetings.map(meeting => (
        <div key={meeting.id}>{meeting.title}</div>
      ))}
    </div>
  );
}
```

---

### `useAuth()` Hook

**API**:
```typescript
interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

function useAuth(): UseAuthReturn
```

**Example**:
```typescript
function LoginComponent() {
  const { user, loading, signIn, signOut } = useAuth();

  if (loading) return <div>Loading auth...</div>;

  if (user) {
    return (
      <div>
        <p>Welcome, {user.appUser.nombre}</p>
        <button onClick={signOut}>Sign Out</button>
      </div>
    );
  }

  return <button onClick={signIn}>Sign In with Google</button>;
}
```

---

### `useNotifications()` Hook

**API**:
```typescript
interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

function useNotifications(): UseNotificationsReturn
```

**Example**:
```typescript
function NotificationCenter() {
  const { 
    notifications, 
    unreadCount, 
    removeNotification,
    markAsRead 
  } = useNotifications();

  return (
    <div>
      <h3>Notifications ({unreadCount})</h3>
      {notifications.map(notif => (
        <div key={notif.id}>
          <p>{notif.message}</p>
          <button onClick={() => markAsRead(notif.id)}>
            Mark as read
          </button>
          <button onClick={() => removeNotification(notif.id)}>
            Dismiss
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## Component Props Reference

### Calendar Component

```typescript
interface CalendarProps {
  meetings: Meeting[];
  onMeetingClick: (meeting: Meeting) => void;
  onEmptySlotClick: (date: Date) => void;
  loading?: boolean;
  filters?: CalendarFilters;
}

interface CalendarFilters {
  status?: MeetingStatus;
  startDate?: Date;
  endDate?: Date;
  organizer?: string;
}
```

**Usage**:
```typescript
<Calendar
  meetings={meetings}
  onMeetingClick={handleMeetingClick}
  onEmptySlotClick={handleEmptySlotClick}
  loading={isLoading}
  filters={{
    status: "Abierta",
    startDate: new Date(),
  }}
/>
```

---

### MeetingModal Component

```typescript
interface MeetingModalProps {
  meeting: Meeting;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (meeting: Meeting) => void;
  onDelete: (meetingId: string) => void;
  currentUser?: User;
}
```

---

### NewMeetingModal Component

```typescript
interface NewMeetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date;
  onCreateMeetings: (meetings: Omit<Meeting, "id">[]) => void;
  availableUsers?: User[];
  availableClients?: Client[];
}
```

---

### NotificationWidget Component

```typescript
interface NotificationWidgetProps {
  notifications: Notification[];
  onNotificationClick?: (notificationId: string) => void;
  onDismiss: (notificationId: string) => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  maxNotifications?: number;
}
```

---

## Type Definitions

### Meeting Type
```typescript
export interface Meeting {
  id: string;
  title: string;
  organizer: string;
  company: string;
  startTime: Date;
  endTime: Date;
  description: string;
  attendees: string[];
  files: FileAttachment[];
  comments: Comment[];
  status: MeetingStatus;
  recurrence?: RecurrenceInfo;
  acceptedBy?: AttendeeResponse[];
  rejectedBy?: AttendeeResponse[];
  provisionalBy?: AttendeeResponse[];
}

export type MeetingStatus = "Abierta" | "Cerrada" | "Cancelada" | "Opcional";
```

### User Type
```typescript
export interface User {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
  empresa: string;
  departamento: string;
  telefono: string;
  fotoPerfil?: string;
}
```

### Notification Type
```typescript
export interface Notification {
  id: string;
  type: string;
  message: string;
  meetingId?: string;
  createdAt: Date;
  read: boolean;
  actionUrl?: string;
}
```

---

## External Service Integration

### Google Calendar Sync

**Planned Integration**:
```typescript
// Future implementation
export const syncWithGoogleCalendar = async (user: AuthUser) => {
  // Get user's Google Calendar
  // Fetch all events
  // Map to Meeting objects
  // Store in Firestore
};

export const createGoogleCalendarEvent = async (meeting: Meeting) => {
  // Create event in user's Google Calendar
  // Link meeting to calendar event
};
```

### Slack Notifications

**Planned Integration**:
```typescript
export const sendSlackNotification = async (
  channel: string,
  meeting: Meeting
) => {
  // Send formatted meeting info to Slack channel
  // Include action buttons
};
```

### Email Notifications

**Implementation Pattern**:
```typescript
export const sendEmailNotification = async (
  recipient: string,
  meeting: Meeting
) => {
  // Use SendGrid or similar service
  // Send meeting details to attendee email
  // Include calendar invite
};
```

---

## Error Codes & Handling

### Firebase Error Codes

| Code | Message | Handling |
|------|---------|----------|
| `permission-denied` | User lacks permissions | Show permission error dialog |
| `not-found` | Resource doesn't exist | Handle gracefully or redirect |
| `already-exists` | Resource already created | Update instead of create |
| `failed-precondition` | Precondition failed | Retry or notify user |
| `unauthenticated` | User not authenticated | Redirect to login |

### Application Error Codes

```typescript
export enum AppErrorCode {
  INVALID_MEETING_DATA = "INVALID_MEETING_DATA",
  MEETING_NOT_FOUND = "MEETING_NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  NETWORK_ERROR = "NETWORK_ERROR",
  FILE_TOO_LARGE = "FILE_TOO_LARGE",
  INVALID_FILE_TYPE = "INVALID_FILE_TYPE",
  DATABASE_ERROR = "DATABASE_ERROR",
}

export const getErrorMessage = (code: AppErrorCode): string => {
  const messages: Record<AppErrorCode, string> = {
    [AppErrorCode.INVALID_MEETING_DATA]: "Meeting data is invalid",
    [AppErrorCode.MEETING_NOT_FOUND]: "Meeting not found",
    [AppErrorCode.UNAUTHORIZED]: "You are not authorized",
    [AppErrorCode.NETWORK_ERROR]: "Network connection failed",
    [AppErrorCode.FILE_TOO_LARGE]: "File is too large",
    [AppErrorCode.INVALID_FILE_TYPE]: "Invalid file type",
    [AppErrorCode.DATABASE_ERROR]: "Database error occurred",
  };
  return messages[code] || "Unknown error occurred";
};
```

---

## Code Examples

### Complete Example: Create Meeting with Recurrence

```typescript
import { useState } from "react";
import { useMeetings } from "@/hooks/use-meetings";
import type { Meeting } from "@/types/meeting";

export function RecurringMeetingForm() {
  const { addMeetings } = useMeetings();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateRecurringMeeting = async (data: {
    title: string;
    startDate: Date;
    endDate: Date;
    attendees: string[];
    daysOfWeek: number[];
    occurrences: number;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const meetings: Omit<Meeting, "id">[] = [];
      let currentDate = new Date(data.startDate);

      for (let i = 0; i < data.occurrences; i++) {
        // Find next occurrence on selected day
        while (data.daysOfWeek.indexOf(currentDate.getDay()) === -1) {
          currentDate.setDate(currentDate.getDate() + 1);
        }

        const endTime = new Date(data.startDate);
        endTime.setHours(endTime.getHours() + 1);

        meetings.push({
          title: data.title,
          organizer: "Current User",
          company: "Company",
          startTime: currentDate,
          endTime: endTime,
          description: "Recurring meeting",
          attendees: data.attendees,
          files: [],
          comments: [],
          status: "Abierta",
          recurrence: {
            isRecurring: true,
            pattern: "weekly",
            daysOfWeek: data.daysOfWeek,
          },
        });

        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      await addMeetings(meetings);
      console.log(`Created ${meetings.length} recurring meetings`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <button 
        onClick={() => handleCreateRecurringMeeting({
          title: "Weekly Sync",
          startDate: new Date(),
          endDate: new Date(Date.now() + 86400000),
          attendees: ["Alice", "Bob"],
          daysOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
          occurrences: 4,
        })}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Recurring Meetings"}
      </button>
    </div>
  );
}
```

### Example: Advanced Filtering

```typescript
function AdvancedMeetingFilter() {
  const { meetings } = useMeetings();
  const [filters, setFilters] = useState({
    status: null as string | null,
    organizer: null as string | null,
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
    searchText: "",
  });

  const filteredMeetings = useMemo(() => {
    return meetings.filter(meeting => {
      // Status filter
      if (filters.status && meeting.status !== filters.status) {
        return false;
      }

      // Organizer filter
      if (filters.organizer && meeting.organizer !== filters.organizer) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom && meeting.startTime < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && meeting.startTime > filters.dateTo) {
        return false;
      }

      // Text search
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const matchesTitle = meeting.title.toLowerCase().includes(searchLower);
        const matchesDesc = meeting.description.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [meetings, filters]);

  return (
    <div>
      <input
        placeholder="Search..."
        onChange={(e) => setFilters(prev => ({
          ...prev,
          searchText: e.target.value
        }))}
      />
      <select
        onChange={(e) => setFilters(prev => ({
          ...prev,
          status: e.target.value || null
        }))}
      >
        <option value="">All Statuses</option>
        <option value="Abierta">Open</option>
        <option value="Cerrada">Closed</option>
      </select>
      
      <div>Results: {filteredMeetings.length} meetings</div>
    </div>
  );
}
```

---

**API Reference Version**: 1.0  
**Last Updated**: March 2026
