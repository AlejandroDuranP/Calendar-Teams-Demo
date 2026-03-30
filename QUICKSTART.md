# Quick Start Guide - Calendar-Teams-Demo

## Project Overview (30-second Pitch)

**Calendar-Teams-Demo** is a full-stack, responsive team meeting management application built with Next.js and React. It demonstrates modern web development practices including:
- Component-driven architecture with Radix UI
- Real-time state management with React hooks
- TypeScript for type safety
- Responsive design with Tailwind CSS
- Firebase integration capabilities
- Comprehensive business logic implementation

---

## What You Can Do (Features at a Glance)

### ✅ Core Features
- 📅 **Interactive Calendar**: Month view with meeting visualization
- 🆕 **Create Meetings**: Click any empty slot to schedule a meeting
- ✏️ **Edit Meetings**: Update meeting details, attendees, and status
- 🗑️ **Delete Meetings**: Remove meetings from the calendar
- 🔄 **Recurring Meetings**: Configure weekly recurring meetings
- 🔍 **Advanced Filtering**: Filter by status, time, organizer, or search text
- 👥 **Attendee Management**: Track acceptances, rejections, and provisional responses
- 📎 **File Attachments**: Upload and manage meeting files
- 💬 **Comments**: Add meeting discussion comments
- 🔔 **Notifications**: Real-time notification widget
- 📤 **Export**: Download meeting data

---

## Quick Installation (5 minutes)

### Prerequisites
```bash
# Check Node.js version (need 18.0.0+)
node --version

# Check pnpm (or use npm/yarn)
pnpm --version
```

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/AlejandroDuranP/Calendar-Teams-Demo.git
cd Calendar-Teams-Demo

# 2. Install dependencies
pnpm install

# 3. Run development server
pnpm dev

# 4. Open in browser
# Navigate to http://localhost:3000
```

### Troubleshooting Installation

**Issue**: `pnpm: command not found`  
**Solution**: Use `npm install` instead or install pnpm globally: `npm install -g pnpm`

**Issue**: Port 3000 already in use  
**Solution**: Run on different port: `pnpm dev --port 3001`

**Issue**: Module not found errors  
**Solution**: Run `pnpm install` again or `pnpm install --force`

---

## Exploring the Application

### First Run Experience

1. **Home Page Loads**: You'll see a responsive calendar interface
2. **Current Month**: Calendar shows the current month
3. **Sample Meetings**: Pre-populated with demo data
4. **User Info**: Shows logged-in user in top right
5. **Notifications**: Widget appears if there are notifications

### Try These Actions

#### 1. View a Meeting
```
1. Look for blue/highlighted dates with meetings
2. Click on any meeting
3. Modal opens showing:
   - Meeting title and time
   - Organizer and company
   - Description
   - Attendee list
   - Comments
   - Attached files
```

#### 2. Create a New Meeting
```
1. Click on any empty date/time slot
2. Fill in the meeting form:
   - Title (required)
   - Time (required)
   - Description (optional)
   - Select attendees
   - Add files (optional)
3. Click "Create Meeting"
4. Meeting appears on calendar immediately
```

#### 3. Edit a Meeting
```
1. Click on existing meeting
2. Click "Edit" button in modal
3. Modify any fields
4. Click "Save Changes"
```

#### 4. Filter Meetings
```
1. Use filter panel on left sidebar
2. Filter by:
   - Status (Open/Closed/Cancelled/Optional)
   - Time range (hour filter)
   - Organizer/Attendee (user selector)
   - Search text
3. Calendar updates in real-time
```

#### 5. Create Recurring Meeting
```
1. Click "New Meeting"
2. Fill basic details
3. Enable "Recurring Meeting" toggle
4. Configure:
   - Pattern: Weekly
   - Select days: Mon, Wed, Fri
   - Number of occurrences
5. Create - multiple meetings added at once
```

---

## Project Structure Deep Dive

### Key Directories

```
project/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main calendar page (START HERE)
│   └── layout.tsx         # Root layout
│
├── components/            # React components
│   ├── calendar.tsx       # Calendar display
│   ├── meeting-modal.tsx  # Meeting details view
│   ├── new-meeting-modal.tsx  # Create meeting form
│   └── ui/                # Reusable UI components
│
├── hooks/                 # Custom React hooks
│   └── use-meetings.ts    # Meeting state management (IMPORTANT)
│
├── lib/                   # Services & utilities
│   ├── meetings-service.ts      # Meeting CRUD
│   ├── auth-service.ts          # Authentication
│   ├── notifications.ts         # Notifications
│   └── mock-data.ts            # Sample data
│
└── types/                 # TypeScript definitions
    ├── meeting.ts         # Meeting interfaces
    └── user.ts            # User interfaces
```

### Files to Read (Learning Path)

**1. Start Here** (Understanding the flow):
- `app/page.tsx` - Main component, shows how everything connects

**2. Core Logic** (Business implementation):
- `hooks/use-meetings.ts` - State management patterns
- `lib/meetings-service.ts` - CRUD operations

**3. UI Components** (React best practices):
- `components/calendar.tsx` - Calendar rendering
- `components/meeting-modal.tsx` - Modal with form handling

**4. Data & Types** (TypeScript patterns):
- `types/meeting.ts` - Interface definitions
- `lib/mock-data.ts` - Sample data structure

---

## Code Walkthrough

### Example 1: How State Management Works

```typescript
// In hooks/use-meetings.ts
export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  // Load meetings on component mount
  useEffect(() => {
    loadMeetings();
  }, []);

  // CRUD operations
  const addMeetings = async (meetingsData) => {
    const createdIds = await createMeetings(meetingsData);
    setMeetings([...meetings, ...createdMeetings]);
  };

  return { meetings, loading, addMeetings, /* ... */ };
}

// In components/calendar.tsx
function Calendar() {
  const { meetings, addMeetings } = useMeetings();
  
  // meetings automatically updates when data changes
  return <div>{meetings.map(m => <Meeting key={m.id} {...m} />)}</div>;
}
```

### Example 2: Event Handling Pattern

```typescript
// In app/page.tsx
const handleEmptySlotClick = (date: Date) => {
  setNewMeetingDate(date);
  setShowNewMeetingModal(true);
};

const handleCreateMeetings = async (meetingsData) => {
  try {
    const createdMeetings = await addMeetings(meetingsData);
    // Success feedback
    setShowNewMeetingModal(false);
  } catch (error) {
    // Error handling
    console.error(error);
  }
};

// Component usage
<Calendar onEmptySlotClick={handleEmptySlotClick} />
<NewMeetingModal 
  onCreateMeetings={handleCreateMeetings}
/>
```

### Example 3: Filtering Implementation

```typescript
// Combine multiple filters
const filteredMeetings = useMemo(() => {
  return meetings.filter(meeting => {
    const matchesStatus = !statusFilter || meeting.status === statusFilter;
    const matchesTime = isWithinTimeRange(meeting.startTime, timeRange);
    const matchesUser = !userFilter || meeting.attendees.includes(userFilter);
    const matchesSearch = !searchText || 
      meeting.title.toLowerCase().includes(searchText.toLowerCase());
    
    return matchesStatus && matchesTime && matchesUser && matchesSearch;
  });
}, [meetings, statusFilter, timeRange, userFilter, searchText]);
```

---

## Technology Showcase

### What This Project Demonstrates

#### Frontend Architecture ✨
- ✅ Next.js App Router (modern React framework)
- ✅ React Hooks (useState, useEffect, useMemo, useCallback)
- ✅ Custom Hooks (code reusability & testability)
- ✅ TypeScript (type safety & developer experience)

#### Component Design 🎨
- ✅ Component composition
- ✅ Props drilling management
- ✅ Controlled vs uncontrolled components
- ✅ Modal dialog patterns

#### State Management 🔄
- ✅ Local state with useState
- ✅ Derived state with useMemo
- ✅ Effects with useEffect
- ✅ Async operations with async/await

#### UI/UX 🖼️
- ✅ Radix UI unstyled components
- ✅ Tailwind CSS utility-first styling
- ✅ Responsive design
- ✅ Accessibility considerations

#### Business Logic 📊
- ✅ CRUD operations
- ✅ Data filtering & searching
- ✅ Recurring event generation
- ✅ Notification management

#### Professional Practices 📋
- ✅ Error handling & user feedback
- ✅ Loading states
- ✅ Data validation
- ✅ Code organization
- ✅ TypeScript interfaces
- ✅ Consistent naming conventions

---

## Building for Production

### Production Build

```bash
# Create optimized production build
pnpm build

# Start production server
pnpm start

# Check bundle size
pnpm build --analyze
```

### Environment Configuration

Create `.env.production.local` with Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
```

### Deployment Options

#### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Option 2: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

#### Option 3: Docker
```bash
docker build -t calendar-app .
docker run -p 3000:3000 calendar-app
```

---

## Development Workflow

### Making Changes

```bash
# 1. Start dev server (auto-reloads)
pnpm dev

# 2. Make changes to any file
# 3. Browser hot-reloads automatically
# 4. See changes immediately
```

### Adding a New Feature

**Example: Add a "Print Meeting" button**

1. **Create handler in hook** (`hooks/use-meetings.ts`):
```typescript
const printMeeting = (meetingId: string) => {
  const meeting = meetings.find(m => m.id === meetingId);
  // Print logic
};
```

2. **Add button to modal** (`components/meeting-modal.tsx`):
```typescript
<button onClick={() => printMeeting(meeting.id)}>
  Print Meeting
</button>
```

3. **Test in browser** - Changes auto-reload

### Debugging

```typescript
// Add console logs
console.log("Meeting created:", newMeeting);

// Use React DevTools (Chrome extension)
// - Inspect component props
// - Track state changes
// - See render counts

// Browser DevTools Network tab
// - Monitor API calls
// - Check response times
// - Debug Firebase interactions
```

---

## Common Tasks

### Task 1: Change Meeting Status Options

**File**: `types/meeting.ts`

```typescript
export type MeetingStatus = 
  | "Abierta"      // Open
  | "Cerrada"      // Closed
  | "Cancelada"    // Cancelled
  | "Opcional"     // Optional
  // Add new status here:
  | "En Espera";   // Pending
```

### Task 2: Modify Sample Data

**File**: `lib/mock-data.ts`

```typescript
export function generateSampleMeetings(): Meeting[] {
  return [
    {
      id: "1",
      title: "Your new meeting",
      organizer: "Your name",
      // ... other fields
    },
  ];
}
```

### Task 3: Customize Colors/Styling

**File**: `tailwind.config.ts`

```typescript
export default {
  theme: {
    extend: {
      colors: {
        // Add custom colors
        "meeting-open": "#3B82F6",
        "meeting-closed": "#6B7280",
      },
    },
  },
};
```

### Task 4: Add New Filter Type

**File**: `components/` (create new filter component)

```typescript
export function CompanyFilter({ onSelect }) {
  return (
    <select onChange={(e) => onSelect(e.target.value)}>
      <option>All Companies</option>
      <option>Tech Corp</option>
      <option>Finance Inc</option>
    </select>
  );
}
```

---

## Performance Tips

### Optimization Checklist

- [ ] Use `useMemo` for expensive calculations
- [ ] Use `useCallback` for event handlers
- [ ] Use `React.memo` for pure components
- [ ] Implement pagination for large lists
- [ ] Lazy load images and modals
- [ ] Monitor bundle size with `pnpm build --analyze`
- [ ] Use Next.js Image component for images
- [ ] Profile with React DevTools Profiler

### Quick Performance Check

```bash
# Check Lighthouse score
# Chrome DevTools → Lighthouse tab
# Run audit for Performance

# Recommended targets:
# Performance: 90+
# Best Practices: 90+
# Accessibility: 90+
# SEO: 90+
```

---

## Testing

### Unit Test Example

```typescript
import { render, screen } from '@testing-library/react';
import { Calendar } from '@/components/calendar';

describe('Calendar', () => {
  it('displays meetings on calendar', () => {
    const meetings = [
      {
        id: '1',
        title: 'Team Meeting',
        startTime: new Date('2026-03-31'),
        // ...
      },
    ];

    render(
      <Calendar 
        meetings={meetings}
        onMeetingClick={() => {}}
        onEmptySlotClick={() => {}}
      />
    );

    expect(screen.getByText('Team Meeting')).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Generate coverage report
pnpm test --coverage
```

---

## Troubleshooting Common Issues

| Problem | Solution |
|---------|----------|
| Calendar not loading | Check browser console for errors; verify Firebase config |
| Meetings not appearing | Clear browser cache; refresh page |
| Styling looks broken | Check Tailwind CSS build; run `pnpm install` |
| TypeScript errors | Run `pnpm type-check` to see all issues |
| Hot reload not working | Restart dev server with `Ctrl+C` then `pnpm dev` |
| Slow performance | Check React DevTools Profiler; optimize re-renders |
| Firebase not connecting | Verify environment variables; check Firebase project settings |

---

## Next Steps for Learning

### Level 1: Understand the Code (1-2 hours)
- [ ] Read `DOCUMENTATION.md` overview
- [ ] Browse `app/page.tsx`
- [ ] Read `hooks/use-meetings.ts`
- [ ] Understand component hierarchy

### Level 2: Make Changes (1-2 hours)
- [ ] Add a new filter type
- [ ] Modify meeting status values
- [ ] Change sample data
- [ ] Update styling

### Level 3: Add Features (4-6 hours)
- [ ] Add meeting export to CSV
- [ ] Implement email notifications
- [ ] Add meeting duration statistics
- [ ] Create advanced search

### Level 4: Production Ready (ongoing)
- [ ] Add comprehensive tests
- [ ] Set up CI/CD pipeline
- [ ] Configure Firebase Firestore
- [ ] Implement authentication
- [ ] Deploy to production

---

## Resources

### Documentation
- Main Documentation: `DOCUMENTATION.md`
- Technical Architecture: `TECHNICAL_ARCHITECTURE.md`
- API Reference: `API_REFERENCE.md`

### External Links
- [Next.js Docs](https://nextjs.org/docs)
- [React Hooks](https://react.dev/reference/react/hooks)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/docs)

### Learning Paths
- [React Learning Path](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Next.js Tutorial](https://nextjs.org/learn)

---

## Project Statistics

### Codebase
- **Total Components**: 25+
- **Custom Hooks**: 4
- **Service Files**: 4
- **Type Definitions**: 3
- **Lines of Code**: 2000+
- **TypeScript Coverage**: 100%

### Features
- **CRUD Operations**: ✅
- **Advanced Filtering**: ✅
- **Recurring Events**: ✅
- **Notifications**: ✅
- **File Management**: ✅
- **Comments System**: ✅

### Tech Stack
- **Frontend**: React 18+, Next.js 14+
- **Styling**: Tailwind CSS, Radix UI
- **Language**: TypeScript
- **State**: React Hooks
- **Backend**: Firebase (optional)

---

## Contact & Support

- **Repository**: [GitHub](https://github.com/AlejandroDuranP/Calendar-Teams-Demo)
- **Author**: Alejandro Duran
- **Portfolio**: Available for positions in React/Next.js development

---

## Quick Reference Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm lint             # Check code quality
pnpm type-check       # Check TypeScript

# Building
pnpm build            # Create production build
pnpm start            # Run production build
pnpm export           # Static export

# Testing
pnpm test             # Run tests
pnpm test --coverage  # With coverage report

# Database
pnpm db:push          # Sync database schema
pnpm db:studio        # Open database UI
```

---

**Last Updated**: March 2026  
**Version**: 1.0  
**Status**: Ready for Portfolio Submission ✅
