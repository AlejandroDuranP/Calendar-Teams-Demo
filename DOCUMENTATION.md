# Calendar-Teams-Demo: Comprehensive Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Installation & Setup](#installation--setup)
6. [Architecture](#architecture)
7. [Core Components](#core-components)
8. [Hooks & State Management](#hooks--state-management)
9. [Services & Business Logic](#services--business-logic)
10. [Data Models](#data-models)
11. [Key Features Implementation](#key-features-implementation)
12. [Development Guide](#development-guide)
13. [Future Enhancements](#future-enhancements)

---

## Project Overview

**Calendar-Teams-Demo** is a professional team meeting management application built with modern web technologies. It provides a comprehensive solution for scheduling, managing, and tracking meetings within a team environment. The application features a responsive calendar interface, real-time meeting synchronization, notification management, and advanced filtering capabilities.

### Purpose

This application demonstrates:
- Full-stack React development with Next.js
- Component-driven architecture using Radix UI
- Advanced state management patterns
- Responsive design with Tailwind CSS
- TypeScript for type safety
- Integration with modern development workflows

### Target Users

- Team managers and coordinators
- Meeting organizers
- Team members who need to view and manage their calendar
- Administrative users requiring bulk meeting operations

---

## Key Features

### 1. **Calendar Management**
- Interactive calendar view with meeting visualization
- Quick meeting creation by clicking empty time slots
- Real-time meeting updates across the application
- Support for recurring meetings with configurable patterns

### 2. **Meeting Operations**
- **Create**: Add new meetings with detailed information (title, attendees, files, comments)
- **Read**: View meeting details in modal dialogs
- **Update**: Edit existing meetings and their properties
- **Delete**: Remove meetings from the calendar
- **Recurring**: Set up meetings that repeat on specific days

### 3. **Advanced Filtering**
- Filter by meeting status (Open, Closed, Cancelled, Optional)
- Filter by time range (hourly filtering)
- Filter by assigned users
- Filter by organizer
- Combine multiple filters for refined views

### 4. **Attendee Management**
- Track meeting attendees
- Record responses (accepted, rejected, provisional)
- Display attendee information with timestamps
- Support for multiple response types

### 5. **File Management**
- Attach files to meetings
- Track file metadata (name, size, upload date, uploader)
- Export meeting information with attached files
- File type indication

### 6. **Notifications System**
- Real-time notification widget
- Meeting-related alerts
- Notification history
- Notification cleanup and management

### 7. **User Management**
- User authentication (demo mode)
- User profile management
- Team member directory
- Client/organization tracking

### 8. **Data Export**
- Export meeting data to various formats
- Bulk data export capabilities
- Downloadable reports

---

## Technology Stack

### Frontend Framework
- **Next.js 14+** - React framework with SSR and SSG capabilities
- **React 18+** - UI library with hooks support
- **TypeScript** - Type-safe JavaScript development

### UI & Styling
- **Radix UI** - Unstyled, accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, consistent icon library
- **cmdk** - Command menu component for CLI-like interactions

### Form & Validation
- **React Hook Form** - Performant, flexible form management
- **@hookform/resolvers** - Form validation resolvers

### Date & Time
- **date-fns** - Modern JavaScript date utility library
- **Embla Carousel** - Lightweight carousel/slider library

### Backend Services
- **Firebase** - Backend-as-a-Service for authentication and database

### Development Tools
- **PostCSS** - CSS transformation tool
- **Autoprefixer** - CSS vendor prefixing
- **ESLint** - Code quality and consistency
- **Netlify Plugin for Next.js** - Deployment optimization

### Package Manager
- **pnpm** - Fast, disk space efficient package manager

---

## Project Structure

```
project-root/
├── app/                              # Next.js App Router directory
│   ├── layout.tsx                    # Root layout component
│   ├── page.tsx                      # Main calendar page
│   └── globals.css                   # Global styles
│
├── components/                       # Reusable React components
│   ├── calendar.tsx                  # Calendar grid component
│   ├── meeting-modal.tsx             # Meeting details modal
│   ├── new-meeting-modal.tsx         # Create meeting modal
│   ├── login-screen.tsx              # Authentication UI
│   ├── notification-widget.tsx       # Notification display
│   ├── user-info.tsx                 # User profile display
│   ├── file-upload-zone.tsx          # File upload interface
│   ├── search-filter.tsx             # Search functionality
│   ├── status-filter.tsx             # Meeting status filtering
│   ├── hour-filter.tsx               # Time range filtering
│   ├── client-selector.tsx           # Client/organization selection
│   ├── user-selector.tsx             # Multiple user selection
│   ├── export-button.tsx             # Data export functionality
│   ├── theme-provider.tsx            # Theme management (dark/light mode)
│   └── ui/                           # Radix UI component wrappers
│       ├── button.tsx                # Button component
│       ├── card.tsx                  # Card container
│       ├── dialog.tsx                # Modal dialog
│       ├── dropdown-menu.tsx         # Dropdown menu
│       ├── select.tsx                # Select input
│       ├── input.tsx                 # Text input
│       ├── textarea.tsx              # Multi-line text input
│       ├── calendar.tsx              # Calendar picker
│       ├── checkbox.tsx              # Checkbox input
│       ├── switch.tsx                # Toggle switch
│       ├── badge.tsx                 # Status badge
│       ├── avatar.tsx                # User avatar
│       ├── tooltip.tsx               # Tooltip popup
│       ├── command.tsx               # Command palette
│       └── ... (more UI components)
│
├── hooks/                            # Custom React hooks
│   ├── use-meetings.ts               # Meeting management hook
│   ├── use-auth.ts                   # Authentication hook
│   ├── use-notifications.ts          # Notification management hook
│   └── use-users-clients.ts          # Users and clients data hook
│
├── lib/                              # Utility functions and services
│   ├── meetings-service.ts           # Meeting CRUD operations
│   ├── auth-service.ts               # Authentication logic
│   ├── notifications.ts              # Notification utilities
│   ├── users-clients-service.ts      # User and client management
│   ├── mock-data.ts                  # Sample data generation
│   └── utils.ts                      # General utility functions
│
├── types/                            # TypeScript type definitions
│   ├── meeting.ts                    # Meeting interfaces
│   ├── user.ts                       # User interfaces
│   └── notification.ts               # Notification interfaces
│
├── public/                           # Static assets
│
├── styles/                           # Global styles
│   └── globals.css                   # Global CSS definitions
│
├── next.config.mjs                   # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── postcss.config.mjs                # PostCSS configuration
├── components.json                   # Component shadcn configuration
├── package.json                      # Project dependencies
├── pnpm-lock.yaml                    # Lock file for pnpm
└── README.md                         # Quick start guide
```

---

## Installation & Setup

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **pnpm**: Version 8.0.0 or higher (or npm/yarn as alternatives)
- **Git**: For version control

### Step-by-Step Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/AlejandroDuranP/Calendar-Teams-Demo.git
cd Calendar-Teams-Demo
```

#### 2. Install Dependencies
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

#### 3. Environment Configuration
Create a `.env.local` file in the project root:
```env
# Firebase Configuration (if Firebase is enabled)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Application Mode
NEXT_PUBLIC_DEVELOPMENT_MODE=true
```

#### 4. Run Development Server
```bash
# Using pnpm
pnpm dev

# Or using npm
npm run dev
```

The application will be available at `http://localhost:3000`

#### 5. Build for Production
```bash
# Using pnpm
pnpm build
pnpm start

# Or using npm
npm run build
npm start
```

---

## Architecture

### Application Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                        │
├─────────────────────────────────────────────────────────────┤
│                    React Components                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Calendar Page (page.tsx)                            │   │
│  │  - Main container                                    │   │
│  │  - State management                                  │   │
│  │  - Event handlers                                    │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    Custom Hooks Layer                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  useMeetings | useAuth | useNotifications            │   │
│  │  - Business logic                                    │   │
│  │  - State management                                  │   │
│  │  - Side effects                                      │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    Services Layer                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  meetings-service | auth-service | notifications    │   │
│  │  - Data operations (CRUD)                            │   │
│  │  - API communication                                 │   │
│  │  - Business logic                                    │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    Data Layer                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Firebase | Local Storage | Mock Data                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Interaction**: User interacts with UI components
2. **Component Handler**: Component calls event handler
3. **Hook Method**: Hook method processes the request
4. **Service Layer**: Service performs data operations
5. **Backend**: Data is persisted or retrieved
6. **State Update**: Hook updates component state
7. **Re-render**: Component re-renders with new data

### State Management Pattern

The application uses React's built-in hooks for state management:
- **useState**: For local component state
- **useEffect**: For side effects and data fetching
- **Custom Hooks**: For shared business logic across components

This approach provides:
- Simplicity and ease of understanding
- No additional dependencies for state management
- Clear separation of concerns
- Easy testing and debugging

---

## Core Components

### 1. Calendar Component (`calendar.tsx`)
**Purpose**: Displays the calendar grid with meeting events

**Key Props**:
- `meetings: Meeting[]` - Array of meetings to display
- `onMeetingClick: (meeting: Meeting) => void` - Callback when meeting is clicked
- `onEmptySlotClick: (date: Date) => void` - Callback when empty slot is clicked
- `loading: boolean` - Loading state indicator

**Features**:
- Month view with day cells
- Navigation between months
- Visual indicators for meetings
- Click detection for both events and empty slots

### 2. Meeting Modal Component (`meeting-modal.tsx`)
**Purpose**: Display and edit meeting details in a modal dialog

**Key Props**:
- `meeting: Meeting` - Meeting data to display
- `open: boolean` - Modal visibility state
- `onOpenChange: (open: boolean) => void` - Callback for modal state change
- `onUpdate: (meeting: Meeting) => void` - Callback when meeting is updated
- `onDelete: (meetingId: string) => void` - Callback when meeting is deleted

**Features**:
- Meeting detail view
- Edit form for meeting properties
- Attendee response tracking
- File attachment display
- Comments section
- Delete confirmation

### 3. New Meeting Modal Component (`new-meeting-modal.tsx`)
**Purpose**: Interface for creating new meetings

**Key Props**:
- `open: boolean` - Modal visibility state
- `onOpenChange: (open: boolean) => void` - State change callback
- `defaultDate?: Date` - Pre-selected date
- `onCreateMeetings: (meetings: Omit<Meeting, "id">[]) => void` - Creation callback

**Features**:
- Meeting form with all required fields
- Recurring meeting configuration
- Multiple attendee selection
- File attachment interface
- Form validation

### 4. Notification Widget Component (`notification-widget.tsx`)
**Purpose**: Display real-time notifications

**Key Props**:
- `notifications: Notification[]` - Array of notifications
- `onNotificationClick: (notificationId: string) => void` - Click handler
- `onDismiss: (notificationId: string) => void` - Dismissal handler

**Features**:
- Toast-style notifications
- Auto-dismiss capability
- Action buttons
- Close button

### 5. Filter Components
**Search Filter** (`search-filter.tsx`):
- Text search across meeting titles and descriptions
- Real-time filtering

**Status Filter** (`status-filter.tsx`):
- Filter by meeting status (Open, Closed, Cancelled, Optional)
- Multi-select capability

**Hour Filter** (`hour-filter.tsx`):
- Filter meetings by time range
- Hour range selection

**User Selector** (`user-selector.tsx`):
- Select multiple users/attendees
- Search and multi-select interface

---

## Hooks & State Management

### 1. `useMeetings` Hook

**Purpose**: Manage all meeting-related state and operations

**State**:
```typescript
{
  meetings: Meeting[]           // Array of all meetings
  loading: boolean              // Loading indicator
  error: string | null          // Error message if any
  firebaseStatus: {             // Firebase configuration status
    configured: boolean
    developmentMode: boolean
    localMeetingsCount: number
  }
}
```

**Methods**:
- `loadMeetings()` - Fetch all meetings
- `addMeeting(meeting)` - Create single meeting
- `addMeetings(meetings)` - Create multiple meetings
- `editMeeting(id, updates)` - Update meeting
- `removeMeeting(id)` - Delete meeting
- `refreshMeetings()` - Refresh meeting list

**Usage Example**:
```typescript
const { meetings, loading, error, addMeetings } = useMeetings();

const handleCreateMeeting = async (meetingData) => {
  try {
    await addMeetings([meetingData]);
  } catch (error) {
    console.error("Failed to create meeting", error);
  }
};
```

### 2. `useAuth` Hook

**Purpose**: Manage user authentication and current user state

**State**:
```typescript
{
  user: AuthUser | null         // Current authenticated user
  loading: boolean              // Authentication loading state
  error: string | null          // Authentication error
}
```

**Methods**:
- `signIn()` - Initiate sign-in process
- `signOut()` - Sign out user
- `getCurrentUser()` - Get current user info

### 3. `useNotifications` Hook

**Purpose**: Manage notifications throughout the application

**State**:
```typescript
{
  notifications: Notification[]  // Array of active notifications
  unreadCount: number           // Count of unread notifications
}
```

**Methods**:
- `addNotification(notification)` - Add new notification
- `removeNotification(id)` - Remove notification
- `markAsRead(id)` - Mark notification as read
- `clearAll()` - Clear all notifications

### 4. `useUsersClients` Hook

**Purpose**: Manage user and client data

**State**:
```typescript
{
  users: User[]                 // Array of team members
  clients: Client[]             // Array of clients/organizations
  loading: boolean              // Loading state
}
```

**Methods**:
- `loadUsers()` - Fetch all users
- `loadClients()` - Fetch all clients
- `searchUsers(query)` - Search users by name

---

## Services & Business Logic

### 1. Meetings Service (`meetings-service.ts`)

**Core Functions**:

#### `getMeetings()`
```typescript
export const getMeetings = async (): Promise<Meeting[]>
```
- Fetches all meetings from the database
- Returns array of Meeting objects
- Handles Firebase permission errors gracefully

#### `createMeeting(meeting)`
```typescript
export const createMeeting = async (
  meeting: Omit<Meeting, "id">
): Promise<string>
```
- Creates single meeting
- Returns generated meeting ID
- Adds to local or remote storage

#### `createMeetings(meetings)`
```typescript
export const createMeetings = async (
  meetings: Omit<Meeting, "id">[]
): Promise<string[]>
```
- Creates multiple meetings at once
- Useful for recurring meetings
- Returns array of generated IDs

#### `updateMeeting(id, updates)`
```typescript
export const updateMeeting = async (
  id: string,
  meeting: Partial<Meeting>
): Promise<void>
```
- Updates specific meeting fields
- Merges with existing data
- No return value (void)

#### `deleteMeeting(id)`
```typescript
export const deleteMeeting = async (id: string): Promise<void>
```
- Removes meeting from database
- Permanent deletion
- No undo available

### 2. Authentication Service (`auth-service.ts`)

**Core Functions**:

#### `signInWithGoogle()`
```typescript
export const signInWithGoogle = async (): Promise<{
  success: boolean;
  error?: string;
  errorCode?: string;
}>
```
- Initiates Google OAuth flow
- Returns success status and optional error

#### `signOut()`
```typescript
export const signOut = async (): Promise<void>
```
- Clears user session
- Redirects to login

#### `onAuthStateChange(callback)`
```typescript
export const onAuthStateChange = (
  callback: (user: AuthUser | null) => void
): (() => void)
```
- Subscribes to auth state changes
- Returns unsubscribe function
- Fires immediately with current state

### 3. Notifications Service (`notifications.ts`)

**Core Functions**:

#### `createNotificationsForMeeting(meeting)`
```typescript
export const createNotificationsForMeeting = async (
  meeting: Meeting
): Promise<void>
```
- Creates notifications for meeting attendees
- Sends appropriate alerts
- Logs notification creation

#### `updateNotificationsForMeeting(meeting)`
```typescript
export const updateNotificationsForMeeting = async (
  meeting: Meeting
): Promise<void>
```
- Updates notifications when meeting changes
- Re-sends alerts if needed

### 4. Users & Clients Service (`users-clients-service.ts`)

**Core Functions**:

#### `getUsers()`
```typescript
export const getUsers = async (): Promise<User[]>
```
- Fetches all team members

#### `getClients()`
```typescript
export const getClients = async (): Promise<Client[]>
```
- Fetches all clients/organizations

#### `searchUsers(query)`
```typescript
export const searchUsers = async (query: string): Promise<User[]>
```
- Searches users by name or email

---

## Data Models

### Meeting Interface
```typescript
export interface Meeting {
  id: string                      // Unique identifier
  title: string                   // Meeting title
  organizer: string               // Organizer name
  company: string                 // Company/organization
  startTime: Date                 // Meeting start time
  endTime: Date                   // Meeting end time
  description: string             // Meeting description
  attendees: string[]             // List of attendee names
  files: FileAttachment[]         // Attached files
  comments: Comment[]             // Meeting comments
  status: MeetingStatus           // Current status
  recurrence?: RecurrenceInfo     // Recurrence configuration
  acceptedBy?: AttendeeResponse[] // Attendees who accepted
  rejectedBy?: AttendeeResponse[] // Attendees who rejected
  provisionalBy?: AttendeeResponse[] // Attendees provisional
}
```

### FileAttachment Interface
```typescript
export interface FileAttachment {
  id: string                      // File unique ID
  name: string                    // File name
  size: string                    // File size (formatted)
  uploadedBy: string              // Uploader name
  uploadedAt: Date                // Upload timestamp
  url?: string                    // Optional file URL
  type: string                    // MIME type
}
```

### Comment Interface
```typescript
export interface Comment {
  id: string                      // Comment ID
  author: string                  // Author name
  content: string                 // Comment text
  createdAt: Date                 // Creation time
}
```

### AttendeeResponse Interface
```typescript
export interface AttendeeResponse {
  odId: string                    // Office Directory ID
  name: string                    // Attendee name
  respondedAt: Date               // Response timestamp
}
```

### RecurrenceInfo Interface
```typescript
export interface RecurrenceInfo {
  isRecurring: boolean            // Is meeting recurring
  pattern: "weekly"               // Recurrence pattern
  daysOfWeek: number[]            // Days (0=Sun, 1=Mon, etc)
  endDate?: Date                  // Optional end date
  parentId?: string               // Parent meeting ID
}
```

### User Interface
```typescript
export interface User {
  id: string                      // User unique ID
  nombre: string                  // User name
  correo: string                  // Email address
  rol: string                     // User role
  empresa: string                 // Company
  departamento: string            // Department
  telefono: string                // Phone number
  fotoPerfil?: string             // Optional profile photo URL
}
```

### Notification Interface
```typescript
export interface Notification {
  id: string                      // Notification ID
  type: string                    // Notification type
  message: string                 // Notification message
  meetingId?: string              // Associated meeting ID
  createdAt: Date                 // Creation timestamp
  read: boolean                   // Read status
  actionUrl?: string              // Optional action URL
}
```

---

## Key Features Implementation

### 1. Recurring Meetings

**Implementation**:
1. User selects "Create Recurring Meeting"
2. Configuration form appears with:
   - Recurrence pattern (weekly)
   - Days of week selection
   - Optional end date
3. System generates multiple meeting instances
4. All instances share `parentId` for grouping
5. Modifications can apply to single or all instances

**Code Location**: `components/new-meeting-modal.tsx`

**Example**:
```typescript
const createRecurringMeeting = async (meetingData, recurrence) => {
  const instances = generateRecurrenceInstances(
    meetingData,
    recurrence.pattern,
    recurrence.daysOfWeek,
    recurrence.endDate
  );
  
  const parentId = `parent-${Date.now()}`;
  const meetingsWithParent = instances.map(m => ({
    ...m,
    recurrence: {
      ...recurrence,
      parentId
    }
  }));
  
  await addMeetings(meetingsWithParent);
};
```

### 2. Advanced Filtering

**Implemented Filters**:
- **Status Filter**: Open, Closed, Cancelled, Optional
- **Time Filter**: Hour range selection
- **User Filter**: Filter by attendee or organizer
- **Search Filter**: Text search in title/description

**Filter Combination**:
```typescript
const filteredMeetings = meetings.filter(meeting => {
  const matchesStatus = !selectedStatus || meeting.status === selectedStatus;
  const matchesTimeRange = isWithinTimeRange(meeting.startTime, timeRange);
  const matchesUser = !selectedUser || meeting.attendees.includes(selectedUser);
  const matchesSearch = !searchQuery || 
    meeting.title.includes(searchQuery) ||
    meeting.description.includes(searchQuery);
  
  return matchesStatus && matchesTimeRange && matchesUser && matchesSearch;
});
```

### 3. Notification System

**Flow**:
1. Meeting is created/updated
2. `createNotificationsForMeeting()` is called
3. System identifies relevant users
4. Notifications are generated and stored
5. NotificationWidget displays notifications
6. Users can dismiss or interact with notifications

**Key Features**:
- Real-time notification updates
- Notification history
- Auto-dismiss after timeout
- Action buttons (e.g., "View Meeting")
- Read/unread status tracking

### 4. File Attachment Management

**Supported Operations**:
- **Upload**: Files can be attached to meetings
- **Track Metadata**: Name, size, uploader, upload time
- **Download**: Files can be retrieved
- **Delete**: Files can be removed from meetings

**Security Considerations**:
- File size limits enforced
- File type validation
- Uploader attribution

### 5. Meeting Export

**Export Functionality**:
- Export single meeting details
- Export meeting list with filters applied
- Format support: JSON, CSV
- Include meeting metadata, attendees, files

**Location**: `components/export-button.tsx`

---

## Development Guide

### Adding a New Feature

#### 1. Define Type
Create new interface in `types/` directory:
```typescript
// types/newfeature.ts
export interface NewFeature {
  id: string;
  name: string;
  // ... properties
}
```

#### 2. Create Service
Add functions in `lib/`:
```typescript
// lib/newfeature-service.ts
export const getNewFeatures = async (): Promise<NewFeature[]> => {
  // implementation
};
```

#### 3. Create Hook
Add custom hook in `hooks/`:
```typescript
// hooks/use-new-feature.ts
export function useNewFeature() {
  const [features, setFeatures] = useState<NewFeature[]>([]);
  
  useEffect(() => {
    loadFeatures();
  }, []);
  
  // ... implementation
}
```

#### 4. Create Component
Add component in `components/`:
```typescript
// components/new-feature-display.tsx
export function NewFeatureDisplay() {
  const { features } = useNewFeature();
  
  return (
    <div>
      {features.map(feature => (
        <div key={feature.id}>{feature.name}</div>
      ))}
    </div>
  );
}
```

#### 5. Integrate
Use component in main page or other components:
```typescript
import { NewFeatureDisplay } from "@/components/new-feature-display";

export default function Page() {
  return (
    <div>
      <NewFeatureDisplay />
    </div>
  );
}
```

### Testing Components

#### Unit Testing Pattern
```typescript
import { render, screen } from "@testing-library/react";
import { MyComponent } from "@/components/my-component";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });
});
```

#### Integration Testing Pattern
```typescript
import { render, screen, userEvent } from "@testing-library/react";
import { Page } from "@/app/page";

describe("Calendar Page", () => {
  it("creates new meeting when clicking empty slot", async () => {
    render(<Page />);
    
    const emptySlot = screen.getByTestId("calendar-slot");
    await userEvent.click(emptySlot);
    
    expect(screen.getByText("New Meeting")).toBeInTheDocument();
  });
});
```

### Debugging Tips

1. **Check Browser Console**: Look for error messages
2. **React DevTools**: Inspect component props and state
3. **Network Tab**: Monitor API calls (Firebase)
4. **Console Logging**: Add strategic `console.log()` statements
5. **Breakpoints**: Use browser debugger to pause execution
6. **Mock Data**: Use `mock-data.ts` for consistent test scenarios

### Performance Optimization

1. **Memoization**:
```typescript
const MemoizedComponent = React.memo(({ meetings }) => {
  return <div>{/* render meetings */}</div>;
});
```

2. **useMemo Hook**:
```typescript
const filteredMeetings = useMemo(() => {
  return meetings.filter(/* condition */);
}, [meetings]);
```

3. **useCallback Hook**:
```typescript
const handleMeetingClick = useCallback((meeting) => {
  // handler logic
}, [dependencies]);
```

### Code Style Guidelines

1. **File Naming**: 
   - Components: `PascalCase` (MyComponent.tsx)
   - Utilities: `kebab-case` (my-utility.ts)
   - Types: `kebab-case` (meeting.ts)

2. **Component Structure**:
```typescript
"use client"; // Client component marker if needed

import { useState } from "react";
import type { MyType } from "@/types/my-type";
import { MySubComponent } from "./my-sub-component";

interface Props {
  // Type props here
}

export function MyComponent({ prop1, prop2 }: Props) {
  const [state, setState] = useState();
  
  const handleEvent = () => {
    // Event handler
  };
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

3. **Import Organization**:
   - React imports
   - Third-party imports
   - Local imports (types, components, hooks, lib)

---

## Future Enhancements

### Short-term Improvements

1. **Enhanced Notifications**
   - Email notifications
   - SMS alerts
   - Slack integration
   - Browser push notifications

2. **Meeting Analytics**
   - Meeting duration statistics
   - Attendance rate tracking
   - Meeting frequency analysis
   - Team utilization reports

3. **Search Enhancements**
   - Full-text search
   - Advanced query syntax
   - Search history
   - Saved searches

4. **Accessibility Improvements**
   - WCAG 2.1 AA compliance
   - Screen reader optimization
   - Keyboard navigation enhancements
   - High contrast mode

### Medium-term Improvements

1. **Real-time Collaboration**
   - Live meeting notes
   - Real-time attendee presence
   - Collaborative agenda editing
   - WebSocket integration

2. **Integration Capabilities**
   - Microsoft Teams integration
   - Google Calendar sync
   - Outlook integration
   - Slack notifications

3. **Advanced Features**
   - Meeting room booking
   - Resource management
   - Conflict detection and resolution
   - Smart scheduling suggestions

4. **Mobile Application**
   - React Native implementation
   - Offline capabilities
   - Push notifications
   - Mobile-optimized UI

### Long-term Vision

1. **AI-Powered Features**
   - Meeting summary generation
   - Automatic action item extraction
   - Smart scheduling optimization
   - Meeting sentiment analysis

2. **Enterprise Features**
   - SSO (Single Sign-On)
   - Role-based access control (RBAC)
   - Audit logging
   - Compliance reporting

3. **Advanced Analytics**
   - Predictive meeting scheduling
   - Team productivity metrics
   - Meeting ROI calculation
   - Custom report generation

4. **Scalability**
   - Multi-tenant architecture
   - High availability setup
   - Performance optimization
   - Global deployment

---

## Deployment Guide

### Deploy to Vercel (Recommended)

1. **Connect Repository**:
   - Push code to GitHub
   - Visit vercel.com and sign in
   - Select "Import Project"
   - Connect GitHub repository

2. **Configure Environment**:
   - Add environment variables in Vercel dashboard
   - Configure production/preview environments

3. **Deploy**:
   - Merges to main branch auto-deploy
   - Preview deployments for PRs

### Deploy to Netlify

1. **Connect Site**:
   - Visit netlify.com
   - Click "New site from Git"
   - Connect GitHub repository

2. **Configure Build**:
   - Build command: `pnpm build` or `npm run build`
   - Publish directory: `.next`

3. **Deploy**:
   - Automatic builds on push

### Docker Deployment

1. **Create Dockerfile**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

2. **Build and Run**:
```bash
docker build -t calendar-teams-demo .
docker run -p 3000:3000 calendar-teams-demo
```

---

## Troubleshooting

### Common Issues

**Issue**: Calendar not loading meetings
- **Solution**: Check Firebase configuration and permissions
- **Debugging**: Check browser console for Firebase errors

**Issue**: Recurring meetings not creating
- **Solution**: Verify recurrence configuration values
- **Debugging**: Check `console.log` in createRecurringMeeting function

**Issue**: Notifications not appearing
- **Solution**: Verify notification permissions
- **Debugging**: Check notification hook state

**Issue**: TypeScript compilation errors
- **Solution**: Run `pnpm install` to update types
- **Debugging**: Check error message in terminal

### Performance Issues

1. **Slow page load**: 
   - Optimize images
   - Enable caching
   - Review Firebase queries

2. **Slow meeting updates**:
   - Batch database operations
   - Implement pagination
   - Use incremental loading

3. **Memory leaks**:
   - Check subscription cleanup
   - Verify effect dependencies
   - Profile with DevTools

---

## Contributing Guidelines

### Code Review Process

1. Create feature branch from main
2. Implement feature with tests
3. Push to GitHub and create Pull Request
4. Code review by team members
5. Address feedback
6. Merge to main

### Commit Message Convention

```
[TYPE] Short description

Detailed explanation of changes

Fixes #issue-number
```

Types: feat, fix, docs, style, refactor, test, chore

### Before Committing

- Run linter: `pnpm lint`
- Run tests: `pnpm test`
- Check TypeScript: `pnpm type-check`
- Test in browser: `pnpm dev`

---

## License

This project is part of a portfolio demonstration. Please refer to the LICENSE file for usage terms.

---

## Contact & Support

For questions or support regarding this project:
- GitHub: [AlejandroDuranP](https://github.com/AlejandroDuranP)
- Project Repository: [Calendar-Teams-Demo](https://github.com/AlejandroDuranP/Calendar-Teams-Demo)

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [Firebase Documentation](https://firebase.google.com/docs)

---

**Last Updated**: March 2026
**Version**: 1.0.0
