# Technical Architecture & Design Decisions

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Design Patterns](#design-patterns)
3. [Component Architecture](#component-architecture)
4. [State Management Strategy](#state-management-strategy)
5. [Data Flow Patterns](#data-flow-patterns)
6. [Performance Considerations](#performance-considerations)
7. [Security Architecture](#security-architecture)
8. [Error Handling Strategy](#error-handling-strategy)
9. [Testing Strategy](#testing-strategy)

---

## Architecture Overview

### Layered Architecture

The application follows a clean, layered architecture pattern:

```
┌─────────────────────────────────────────┐
│        Presentation Layer               │
│  (UI Components, Containers)            │
├─────────────────────────────────────────┤
│        Business Logic Layer             │
│  (Hooks, State Management)              │
├─────────────────────────────────────────┤
│        Service/Integration Layer        │
│  (APIs, External Services)              │
├─────────────────────────────────────────┤
│        Data Layer                       │
│  (Database, Cache, Storage)             │
└─────────────────────────────────────────┘
```

**Characteristics**:
- Clear separation of concerns
- Each layer has specific responsibilities
- Changes in one layer minimally affect others
- Testable at each level independently

### System Components

```
User Interface Layer
    ↓
React Components → Event Handlers
    ↓
Custom Hooks (useMeetings, useAuth, etc.)
    ↓
Service Layer (meetings-service, auth-service)
    ↓
Firebase Backend / Local Storage
```

---

## Design Patterns

### 1. Custom Hooks Pattern

**Purpose**: Encapsulate stateful logic and make it reusable

**Implementation**:
```typescript
// hooks/use-meetings.ts
export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      const data = await getMeetings();
      setMeetings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { meetings, loading, error, loadMeetings };
}
```

**Benefits**:
- Reusable across components
- Cleaner component code
- Easier testing
- Single responsibility

### 2. Container/Presentational Pattern

**Purpose**: Separate business logic from presentation

**Example**:
```typescript
// Container Component (with logic)
function CalendarContainer() {
  const { meetings, loading } = useMeetings();
  
  const handleMeetingClick = (meeting) => {
    // logic
  };

  return (
    <CalendarPresentation 
      meetings={meetings}
      loading={loading}
      onMeetingClick={handleMeetingClick}
    />
  );
}

// Presentational Component (pure UI)
function CalendarPresentation({ meetings, loading, onMeetingClick }) {
  return (
    <div className="calendar">
      {loading ? <Loader /> : <MeetingList meetings={meetings} />}
    </div>
  );
}
```

**Benefits**:
- Reusable presentational components
- Easier styling and UI testing
- Clear props contract

### 3. Factory Pattern

**Purpose**: Create objects with consistent configuration

```typescript
// Factory for creating meetings with defaults
export function createMeetingFactory(overrides?: Partial<Meeting>): Meeting {
  return {
    id: generateId(),
    title: "New Meeting",
    status: "Abierta",
    attendees: [],
    files: [],
    comments: [],
    ...overrides,
  };
}
```

### 4. Observer Pattern

**Purpose**: Notify multiple subscribers of state changes

**Implementation** (Firebase):
```typescript
export const onAuthStateChange = (callback) => {
  authStateListeners.push(callback);
  return () => {
    authStateListeners = authStateListeners.filter(listener => listener !== callback);
  };
};
```

### 5. Strategy Pattern

**Purpose**: Encapsulate different filtering strategies

```typescript
type FilterStrategy = (meetings: Meeting[]) => Meeting[];

const filterByStatus: FilterStrategy = (meetings, status) =>
  meetings.filter(m => m.status === status);

const filterByTime: FilterStrategy = (meetings, timeRange) =>
  meetings.filter(m => isWithinRange(m.startTime, timeRange));

// Combine strategies
const applyFilters = (meetings, strategies) =>
  strategies.reduce((acc, strategy) => strategy(acc), meetings);
```

---

## Component Architecture

### Component Hierarchy

```
Page (page.tsx)
├── UserInfo
├── Calendar
│   └── CalendarGrid (individual day cells)
├── MeetingModal
│   ├── MeetingDetails
│   ├── AttendeesList
│   ├── CommentSection
│   └── FileList
├── NewMeetingModal
│   ├── MeetingForm
│   ├── RecurrenceConfig
│   ├── AttendeeSelector
│   └── FileUploadZone
├── FilterPanel
│   ├── SearchFilter
│   ├── StatusFilter
│   ├── HourFilter
│   └── UserSelector
└── NotificationWidget
```

### Component Communication

1. **Top-Down (Props)**:
```typescript
<ParentComponent>
  <ChildComponent onEvent={handleEvent} data={data} />
</ParentComponent>
```

2. **Bottom-Up (Callbacks)**:
```typescript
const ChildComponent = ({ onEvent }) => (
  <button onClick={() => onEvent("data")}>Click</button>
);
```

3. **Sibling Communication** (via Parent):
```typescript
const Parent = () => {
  const [data, setData] = useState();
  
  return (
    <>
      <ChildA onSelectItem={(item) => setData(item)} />
      <ChildB data={data} />
    </>
  );
};
```

### Component Re-render Optimization

**Problem**: Unnecessary re-renders impact performance

**Solutions**:

1. **useMemo for expensive computations**:
```typescript
const expensiveResult = useMemo(() => {
  return complexCalculation(data);
}, [data]); // Only recalculate when data changes
```

2. **useCallback for stable function references**:
```typescript
const handleMeetingClick = useCallback((meeting) => {
  // handler logic
}, [dependency]); // Function reference stays same until dependency changes
```

3. **React.memo for presentational components**:
```typescript
const MeetingCard = React.memo(({ meeting, onClick }) => (
  <div onClick={() => onClick(meeting)}>
    {meeting.title}
  </div>
));
```

---

## State Management Strategy

### Local State vs Global State

**Local State (useState)**:
- Form input values
- Modal open/close state
- Temporary UI state
- Component-specific data

**Global State (Custom Hooks)**:
- Authenticated user
- Meetings list
- Notifications
- Application-wide configuration

### State Update Patterns

**Pattern 1: Simple State Update**:
```typescript
const [count, setCount] = useState(0);
setCount(count + 1);
```

**Pattern 2: Batch Updates**:
```typescript
const [state, setState] = useState({ meetings: [], loading: false });

setState(prevState => ({
  ...prevState,
  meetings: [...prevState.meetings, newMeeting],
  loading: false,
}));
```

**Pattern 3: Derived State**:
```typescript
const [meetings, setMeetings] = useState<Meeting[]>([]);

// Avoid this:
const [meetingCount, setMeetingCount] = useState(0);

// Do this instead:
const meetingCount = meetings.length;
```

### Side Effects Management

**Pattern: useEffect with Cleanup**:
```typescript
useEffect(() => {
  // Subscribe
  const unsubscribe = onAuthStateChange((user) => {
    setCurrentUser(user);
  });

  // Cleanup: Unsubscribe when component unmounts
  return () => {
    unsubscribe();
  };
}, []); // Empty dependency array = run once on mount
```

---

## Data Flow Patterns

### Meeting Creation Flow

```
┌─ User clicks "New Meeting" button
│
├─ Modal opens (local state)
│
├─ User fills form (form state)
│
├─ User clicks "Create" button
│
├─ handleCreateMeetings() is called
│
├─ Validation runs
│
├─ addMeetings() hook method called
│
├─ createMeetings() service called
│
├─ Firebase/LocalStorage updated
│
├─ Service returns new meeting IDs
│
├─ Hook updates meetings state
│
├─ Component re-renders
│
└─ Modal closes, calendar updates
```

### Meeting Filtering Flow

```
User sets filters
    ↓
Filter component state updates
    ↓
Parent component receives new filter values
    ↓
useMemo recalculates filtered meetings
    ↓
Calendar re-renders with filtered data
```

### Notification Flow

```
Meeting created/updated
    ↓
createNotificationsForMeeting() called
    ↓
Notification objects generated
    ↓
Notifications stored in useNotifications hook
    ↓
NotificationWidget subscribed to notification changes
    ↓
NotificationWidget re-renders and displays
    ↓
User can dismiss notifications
    ↓
Notification removed from state
```

---

## Performance Considerations

### 1. Rendering Performance

**Issue**: Large lists can cause slow renders

**Solutions**:
- Virtual scrolling for long lists
- Pagination or infinite scroll
- Memoization of list items
- Lazy loading of images

**Example**:
```typescript
const MeetingList = React.memo(({ meetings }) => (
  <div className="meeting-list">
    {meetings.map(meeting => (
      <MeetingCard key={meeting.id} meeting={meeting} />
    ))}
  </div>
));
```

### 2. Memory Efficiency

**Issue**: Holding unnecessary data in state

**Solutions**:
```typescript
// Bad: Storing computed values
const [meetings, setMeetings] = useState([]);
const [meetingCount, setMeetingCount] = useState(0);

// Good: Computing on the fly
const meetingCount = meetings.length;
```

### 3. Network Optimization

**Issue**: Too many API calls

**Solutions**:
- Debounce search queries
- Batch operations
- Caching results

**Example**:
```typescript
const debouncedSearch = useMemo(() => {
  return debounce((query: string) => {
    searchUsers(query);
  }, 300); // Wait 300ms before searching
}, []);
```

### 4. Bundle Size

**Issue**: Large JavaScript bundles slow down initial load

**Solutions**:
- Code splitting with dynamic imports
- Tree shaking unused code
- Optimize dependencies

---

## Security Architecture

### Authentication

**Current Implementation**:
- Demo mode with mock user
- Firebase OAuth integration option
- Session-based authentication

**Security Measures**:
```typescript
// Don't store sensitive data in localStorage
// Use HttpOnly cookies for tokens (backend)
// Validate user permissions on backend
```

### Authorization

**Role-Based Access Control Pattern**:
```typescript
enum Role {
  Admin = "admin",
  Organizer = "organizer",
  Attendee = "attendee",
}

const canEditMeeting = (user: User, meeting: Meeting): boolean => {
  return user.role === Role.Admin || user.id === meeting.organizerId;
};

const canDeleteMeeting = (user: User, meeting: Meeting): boolean => {
  return user.role === Role.Admin || user.id === meeting.organizerId;
};
```

### Data Protection

**File Upload Security**:
```typescript
// Validate file type
const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

// Validate file size
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const validateFile = (file: File): boolean => {
  return allowedTypes.includes(file.type) && file.size <= MAX_FILE_SIZE;
};
```

### Input Validation

```typescript
// Sanitize user input
import DOMPurify from 'dompurify';

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input);
};

// Validate meeting data
const validateMeeting = (meeting: Partial<Meeting>): boolean => {
  return (
    meeting.title && meeting.title.length > 0 &&
    meeting.startTime instanceof Date &&
    meeting.endTime instanceof Date &&
    meeting.startTime < meeting.endTime
  );
};
```

---

## Error Handling Strategy

### Error Types & Handling

**Firebase Errors**:
```typescript
enum FirebaseErrorCode {
  PermissionDenied = 'permission-denied',
  NotFound = 'not-found',
  AlreadyExists = 'already-exists',
  FailedPrecondition = 'failed-precondition',
}

const handleFirebaseError = (error: any): string => {
  switch (error.code) {
    case FirebaseErrorCode.PermissionDenied:
      return 'You do not have permission to access this resource';
    case FirebaseErrorCode.NotFound:
      return 'Resource not found';
    default:
      return 'An unexpected error occurred';
  }
};
```

**User Feedback**:
```typescript
const [error, setError] = useState<{
  message: string;
  type: 'error' | 'warning' | 'info';
  dismissible: boolean;
} | null>(null);

const handleMeetingCreation = async (data) => {
  try {
    await addMeetings([data]);
    setError(null); // Clear previous errors
  } catch (err) {
    setError({
      message: 'Failed to create meeting. Please try again.',
      type: 'error',
      dismissible: true,
    });
  }
};
```

### Error Boundaries (React)

```typescript
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
    // Log to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

---

## Testing Strategy

### Unit Testing

**Test Structure**:
```typescript
describe('useMeetings hook', () => {
  it('should initialize with empty meetings', () => {
    const { result } = renderHook(() => useMeetings());
    expect(result.current.meetings).toEqual([]);
  });

  it('should load meetings on mount', async () => {
    const { result } = renderHook(() => useMeetings());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.meetings.length).toBeGreaterThan(0);
  });
});
```

### Integration Testing

```typescript
describe('Meeting Creation Flow', () => {
  it('should create meeting and update calendar', async () => {
    render(<CalendarPage />);
    
    const createButton = screen.getByText('New Meeting');
    userEvent.click(createButton);
    
    const titleInput = screen.getByPlaceholderText('Meeting Title');
    userEvent.type(titleInput, 'Team Sync');
    
    const submitButton = screen.getByText('Create');
    userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Team Sync')).toBeInTheDocument();
    });
  });
});
```

### Component Testing

```typescript
describe('MeetingCard Component', () => {
  it('should render meeting details', () => {
    const meeting = {
      id: '1',
      title: 'All Hands',
      startTime: new Date(),
      // ... other props
    };
    
    render(<MeetingCard meeting={meeting} />);
    
    expect(screen.getByText('All Hands')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    const meeting = { id: '1', title: 'All Hands' };
    
    render(<MeetingCard meeting={meeting} onClick={handleClick} />);
    
    userEvent.click(screen.getByText('All Hands'));
    
    expect(handleClick).toHaveBeenCalledWith(meeting);
  });
});
```

### E2E Testing (Cypress)

```typescript
describe('Calendar Application', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should display calendar on load', () => {
    cy.get('[data-testid="calendar"]').should('be.visible');
  });

  it('should create a new meeting', () => {
    cy.get('[data-testid="new-meeting-btn"]').click();
    cy.get('[name="title"]').type('Team Meeting');
    cy.get('[name="submit"]').click();
    cy.contains('Team Meeting').should('be.visible');
  });
});
```

---

## Database Schema (Firebase)

### Meetings Collection
```
meetings/
├── meeting-id-1/
│   ├── title: "Sprint Planning"
│   ├── organizer: "John Doe"
│   ├── startTime: Timestamp
│   ├── endTime: Timestamp
│   ├── attendees: ["user1", "user2"]
│   ├── status: "Abierta"
│   ├── files: [...]
│   ├── comments: [...]
│   └── recurrence: {...}
└── meeting-id-2/
    └── ...
```

### Users Collection
```
users/
├── user-id-1/
│   ├── nombre: "John Doe"
│   ├── correo: "john@example.com"
│   ├── rol: "organizer"
│   ├── empresa: "Tech Corp"
│   └── departamento: "Engineering"
└── ...
```

### Notifications Collection
```
notifications/
├── notification-id-1/
│   ├── type: "meeting_created"
│   ├── message: "New meeting scheduled"
│   ├── meetingId: "meeting-id-1"
│   ├── userId: "user-id-1"
│   ├── read: false
│   └── createdAt: Timestamp
└── ...
```

---

## API Response Patterns

### Success Response
```typescript
{
  success: true,
  data: {...},
  message: "Operation completed successfully"
}
```

### Error Response
```typescript
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Invalid input",
    details: [...]
  }
}
```

### Paginated Response
```typescript
{
  success: true,
  data: [...],
  pagination: {
    page: 1,
    limit: 20,
    total: 150,
    pages: 8
  }
}
```

---

## Deployment Architecture

### Development
```
Local Machine
    ↓
Git Repository (GitHub)
    ↓
Development Branch Testing
```

### Production
```
Main Branch (GitHub)
    ↓
Vercel/Netlify Webhook
    ↓
Automated Build & Test
    ↓
Deploy to Production CDN
    ↓
Live at https://...
```

---

**Document Version**: 1.0  
**Last Updated**: March 2026
