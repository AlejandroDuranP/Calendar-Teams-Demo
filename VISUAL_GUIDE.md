# Calendar-Teams-Demo: Visual Guide & Cheat Sheet

## Quick Visual Overview

### Project Structure at a Glance

```
┌─────────────────────────────────────────────────────────────────┐
│                     CALENDAR-TEAMS-DEMO                         │
│              React + Next.js Meeting Management App              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐   │
│  │   Components     │  │     Hooks        │  │  Services   │   │
│  ├──────────────────┤  ├──────────────────┤  ├─────────────┤   │
│  │ • Calendar       │  │ • useMeetings    │  │ • meetings  │   │
│  │ • Modals         │  │ • useAuth        │  │ • auth      │   │
│  │ • Filters        │  │ • useNotif.      │  │ • notif.    │   │
│  │ • UI Components  │  │ • useUsers       │  │ • users     │   │
│  └──────────────────┘  └──────────────────┘  └─────────────┘   │
│           ↓                    ↓                     ↓           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Types (TypeScript Interfaces)              │   │
│  │   Meeting | User | Notification | Comment | File       │   │
│  └──────────────────────────────────────────────────────────┘   │
│           ↓                                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │        Backend (Firebase or Local Storage)              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## File Organization Guide

### By Purpose

```
📁 PRESENTATION LAYER
├── app/page.tsx              ← Main component, entry point
├── app/layout.tsx            ← Root layout wrapper
└── app/globals.css           ← Global styles

📁 COMPONENTS (UI Layer)
├── calendar.tsx              ← Calendar grid display
├── meeting-modal.tsx         ← View/edit meeting
├── new-meeting-modal.tsx     ← Create meeting form
├── notification-widget.tsx   ← Notifications display
├── export-button.tsx         ← Export functionality
├── filter-components/        ← All filter types
└── ui/                       ← Radix UI wrappers

📁 BUSINESS LOGIC
├── hooks/                    ← State management
│   └── use-meetings.ts       ← Core logic
└── lib/                      ← Services
    ├── meetings-service.ts   ← CRUD operations
    ├── auth-service.ts       ← Authentication
    └── notifications.ts      ← Notifications

📁 DATA & TYPES
├── types/                    ← TypeScript definitions
│   ├── meeting.ts
│   ├── user.ts
│   └── notification.ts
└── lib/mock-data.ts         ← Sample data
```

---

## Data Flow Diagram

### Creating a Meeting

```
User Interface
    ↓
    └─→ Clicks empty slot
        ↓
        └─→ NewMeetingModal opens
            ↓
            └─→ User fills form
                ↓
                └─→ Clicks "Create"
                    ↓
                    └─→ handleCreateMeetings() called
                        ↓
                        ├─→ Validation
                        ├─→ addMeetings() hook method
                        ├─→ createMeetings() service
                        ├─→ Firebase/LocalStorage update
                        ├─→ State update
                        └─→ Component re-renders
                            ↓
                            └─→ Calendar updated
                            └─→ Modal closed
                            └─→ User sees new meeting
```

### Filtering Meetings

```
User Changes Filter
    ↓
Filter Component Updates
    ↓
Parent Receives New Values
    ↓
useMemo Recalculates
    ↓
Filtered Array Updated
    ↓
Calendar Re-renders
    ↓
Only Matching Meetings Shown
```

---

## Component Hierarchy

```
Page (page.tsx)
│
├─ UserInfo
│
├─ Calendar
│  └─ CalendarGrid
│     └─ MeetingCard(s)
│
├─ MeetingModal
│  ├─ MeetingDetails
│  ├─ AttendeesList
│  ├─ CommentSection
│  └─ FileList
│
├─ NewMeetingModal
│  ├─ MeetingForm
│  ├─ RecurrenceConfig
│  ├─ AttendeeSelector
│  └─ FileUploadZone
│
├─ FilterPanel
│  ├─ SearchFilter
│  ├─ StatusFilter
│  ├─ HourFilter
│  └─ UserSelector
│
└─ NotificationWidget
   └─ NotificationCard(s)
```

---

## State Management Map

```
Global State (Application Level)
├─ Meetings[]          ← useMeetings hook
├─ CurrentUser         ← useAuth hook
├─ Notifications[]     ← useNotifications hook
└─ Users/Clients[]     ← useUsersClients hook

Component Local State
├─ Modal Open/Close    ← useState
├─ Form Input Values   ← useState
├─ Selected Meeting    ← useState
├─ Filter Values       ← useState
└─ Loading/Error       ← useState

Computed/Derived State (useMemo)
├─ filteredMeetings    ← Filter logic
├─ upcomingMeetings    ← Date logic
└─ unreadNotifications ← Notification logic
```

---

## Technology Stack Breakdown

```
Frontend Stack
├─ Framework
│  ├─ Next.js 14+      (React framework, routing, SSR)
│  └─ React 18+        (UI library, hooks)
│
├─ Language & Type Safety
│  └─ TypeScript        (Type checking, IDE support)
│
├─ Styling
│  ├─ Tailwind CSS      (Utility-first CSS)
│  └─ PostCSS           (CSS processing)
│
├─ Components
│  ├─ Radix UI          (Unstyled, accessible components)
│  ├─ Lucide React      (Icons)
│  └─ cmdk              (Command palette)
│
├─ Forms
│  ├─ React Hook Form   (Form state management)
│  └─ @hookform/resolvers (Validation)
│
├─ Date/Time
│  ├─ date-fns          (Date utilities)
│  └─ Embla Carousel    (Carousel component)
│
├─ Backend Integration
│  └─ Firebase          (Optional BaaS)
│
└─ Development
   ├─ pnpm              (Package manager)
   ├─ ESLint            (Code quality)
   └─ Vercel/Netlify    (Deployment)
```

---

## Key Patterns Quick Reference

### Pattern 1: Custom Hook with State

```typescript
export function useFeature() {
  const [state, setState] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchData();
      setState(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { state, loading, error, loadData };
}
```

### Pattern 2: Modal Component

```typescript
interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
}

export function MyModal({ open, onOpenChange, onConfirm }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>Title</DialogHeader>
        {/* Content */}
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Pattern 3: Filter Component

```typescript
interface FilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function MyFilter({ value, onChange }: FilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

---

## Common Patterns Cheat Sheet

| Pattern | Use Case | File Location |
|---------|----------|-----------------|
| **Custom Hook** | Share stateful logic | `hooks/*.ts` |
| **Container Component** | Logic + UI together | `components/*.tsx` |
| **Modal Dialog** | User confirmation/forms | `components/*-modal.tsx` |
| **Filter Component** | Data filtering | `components/*-filter.tsx` |
| **Context API** | Global state | Not used, using hooks instead |
| **Prop Drilling** | Pass data down | Preferred over context for this app |
| **Memoization** | Performance | `useMemo`, `useCallback`, `React.memo` |
| **Service Layer** | Data operations | `lib/*-service.ts` |

---

## Development Workflow Diagram

```
Start Development
    ↓
Run: pnpm dev
    ↓
Changes in Files
    ↓
Hot Module Replacement (HMR)
    ↓
Browser Auto-Refreshes
    ↓
See Changes Immediately
    ↓
Test in Browser
    ↓
Use React DevTools
    ↓
Check Console for Errors
    ↓
Make More Changes
    ↓
Repeat...
```

---

## Installation Dependency Tree

```
pnpm install
├─ React 18+
│  ├─ hooks (useState, useEffect, etc.)
│  └─ components (FC, memo, etc.)
│
├─ Next.js 14+
│  ├─ App Router
│  ├─ TypeScript support
│  └─ Build/optimization
│
├─ TypeScript
│  ├─ Type definitions
│  ├─ IDE support
│  └─ Compilation
│
├─ Tailwind CSS
│  ├─ Utility classes
│  ├─ PostCSS
│  └─ Configuration
│
├─ Radix UI
│  ├─ Button, Dialog, etc.
│  ├─ Accessibility
│  └─ Unstyled
│
├─ Firebase
│  ├─ Authentication
│  ├─ Firestore
│  └─ Real-time updates
│
└─ Utilities
   ├─ date-fns (dates)
   ├─ lucide-react (icons)
   ├─ class-variance-authority (styling)
   └─ clsx (classnames)
```

---

## Feature Implementation Checklist

### Creating a New Feature

- [ ] **Define Types** → `types/feature.ts`
- [ ] **Create Service** → `lib/feature-service.ts`
- [ ] **Create Hook** → `hooks/use-feature.ts`
- [ ] **Create Components** → `components/feature-*.tsx`
- [ ] **Add UI Components** → `components/ui/` if needed
- [ ] **Integrate in Page** → `app/page.tsx`
- [ ] **Add Tests** → `__tests__/feature.test.ts`
- [ ] **Update Documentation** → `DOCUMENTATION.md`
- [ ] **Test in Browser** → `pnpm dev`
- [ ] **Build Check** → `pnpm build`
- [ ] **Type Check** → `pnpm type-check`
- [ ] **Lint Check** → `pnpm lint`

---

## Performance Optimization Checklist

```
Rendering Performance
☐ Use React.memo for pure components
☐ Use useMemo for expensive computations
☐ Use useCallback for stable function refs
☐ Avoid inline functions in render

Data Fetching
☐ Batch API calls when possible
☐ Implement pagination
☐ Cache frequently accessed data
☐ Debounce search queries

Bundle Size
☐ Tree-shake unused code
☐ Code split large features
☐ Lazy load components
☐ Minify and compress

Images
☐ Use Next.js Image component
☐ Optimize image size
☐ Use appropriate formats
☐ Implement lazy loading

Network
☐ Enable compression
☐ Use CDN for static assets
☐ Minimize API requests
☐ Batch database queries
```

---

## Testing Checklist

```
Unit Tests
☐ Test individual components
☐ Test hooks in isolation
☐ Test service functions
☐ Test utility functions

Integration Tests
☐ Test component interactions
☐ Test hook + component together
☐ Test data flow

E2E Tests
☐ Test user workflows
☐ Test form submissions
☐ Test navigation
☐ Test error scenarios

Quality Checks
☐ Run linter
☐ Run type checker
☐ Run tests
☐ Check coverage
```

---

## Deployment Checklist

```
Pre-Deployment
☐ Environment variables set
☐ Build succeeds
☐ Tests pass
☐ No console errors
☐ Performance acceptable

Firebase Setup
☐ Project created
☐ Firestore enabled
☐ Authentication configured
☐ Security rules set

Deployment
☐ Choose platform (Vercel/Netlify)
☐ Connect repository
☐ Configure build settings
☐ Set environment variables
☐ Deploy

Post-Deployment
☐ Test live site
☐ Monitor errors
☐ Check performance
☐ Verify functionality
```

---

## Error Codes Reference

```
Authentication Errors
❌ 401 Unauthorized        → User not logged in
❌ 403 Forbidden           → User lacks permissions
❌ 404 Not Found          → Resource doesn't exist

Data Errors
❌ 400 Bad Request        → Invalid input data
❌ 409 Conflict           → Resource already exists
❌ 422 Unprocessable      → Validation failed

Server Errors
❌ 500 Internal Error     → Server error
❌ 503 Service Unavailable → Service down

Network Errors
❌ 0 Network Error        → No internet connection
❌ timeout                → Request took too long
```

---

## Keyboard Shortcuts

```
Development
Ctrl+C                     Stop dev server
Ctrl+Shift+P (VSCode)      Command palette
Cmd+K+L (VSCode)           Format document
Cmd+/ (VSCode)             Comment/uncomment

Browser
F12                        Open DevTools
Cmd+Shift+I (Mac)          Open DevTools
Ctrl+Shift+I (Windows)     Open DevTools
Cmd+Option+U (Mac)         View page source
```

---

## Git Commands Reference

```bash
# Setup
git clone <repo>
git config user.name "Name"
git config user.email "email"

# Daily workflow
git status                  # Check changes
git add .                   # Stage changes
git commit -m "message"     # Commit
git push origin main        # Push to remote
git pull origin main        # Pull latest

# Branches
git checkout -b feature     # Create branch
git switch main             # Switch branch
git merge feature           # Merge branch
git branch -d feature       # Delete branch

# Undo changes
git restore .               # Undo all changes
git restore file.ts         # Undo specific file
git reset HEAD~1            # Undo last commit
```

---

## TypeScript Quick Tips

```typescript
// Define Props interface
interface ComponentProps {
  title: string;
  count: number;
  onClick: () => void;
}

// Use with component
const Component: React.FC<ComponentProps> = ({ title, count, onClick }) => {
  return <div>{title}: {count}</div>;
};

// Define types
type Status = "open" | "closed" | "pending";
interface Meeting {
  id: string;
  title: string;
  status: Status;
}

// Generics
function getValue<T>(key: string, obj: T): T[keyof T] | undefined {
  return obj[key as keyof T];
}

// Utility types
type Optional<T> = Partial<T>;
type ReadOnly<T> = Readonly<T>;
type Record<K extends PropertyKey, T> = { [P in K]: T };
```

---

## Environment Variables Template

```env
# .env.local file

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Application Settings
NEXT_PUBLIC_DEVELOPMENT_MODE=true
NEXT_PUBLIC_API_URL=http://localhost:3000

# Optional: Analytics, Monitoring, etc.
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

---

## Project Metrics

```
📊 Codebase Statistics
├─ Total Files: 100+
├─ Total Lines: 5000+
├─ Components: 25+
├─ Hooks: 4
├─ Services: 4
├─ TypeScript Coverage: 100%
└─ Documentation: 57 pages

📈 Supported Features
├─ Meetings: CRUD + Recurring
├─ Filtering: 5 filter types
├─ Notifications: Real-time
├─ Comments: Thread system
├─ File Management: Upload/Download
├─ Export: Multiple formats
├─ Users: Directory + Search
└─ Analytics: Ready for integration

🔧 Technology Versions
├─ Next.js: 14+
├─ React: 18+
├─ TypeScript: 5.0+
├─ Tailwind CSS: 3.3+
└─ Node.js: 18.0+
```

---

## Troubleshooting Quick Guide

| Problem | Quick Fix |
|---------|-----------|
| Port 3000 in use | `pnpm dev --port 3001` |
| Dependencies error | `pnpm install --force` |
| TypeScript errors | `pnpm type-check` |
| Styling broken | Clear cache, restart dev server |
| Components not updating | Check React DevTools Profiler |
| Firebase not working | Check credentials in .env.local |
| Build fails | `pnpm clean && pnpm install` |
| Hot reload not working | Restart dev server |

---

## Resources Quick Links

| Resource | Link |
|----------|------|
| React Docs | https://react.dev |
| Next.js Docs | https://nextjs.org/docs |
| TypeScript Docs | https://www.typescriptlang.org/docs/ |
| Tailwind CSS | https://tailwindcss.com/docs |
| Radix UI | https://www.radix-ui.com/docs |
| Firebase | https://firebase.google.com/docs |
| MDN Web Docs | https://developer.mozilla.org |
| Can I Use | https://caniuse.com |

---

## Success Indicators Checklist

```
Development Environment ✅
☑ Project runs locally
☑ No console errors
☑ Hot reload works
☑ DevTools available

Code Quality ✅
☑ TypeScript passes
☑ Linter passes
☑ Tests pass
☑ Code formatted

Features ✅
☑ All features work
☑ No broken links
☑ Forms validate
☑ Errors handled

Performance ✅
☑ Page loads in <3s
☑ Lighthouse score >90
☑ No memory leaks
☑ Smooth animations

Documentation ✅
☑ README complete
☑ Code commented
☑ API documented
☑ Examples provided
```

---

## Quick Reference Commands

```bash
# Project Setup
npm install -g pnpm           # Install pnpm globally
pnpm install                  # Install dependencies
pnpm dev                       # Start dev server

# Quality Checks
pnpm type-check              # Check TypeScript
pnpm lint                     # Run ESLint
pnpm test                     # Run tests
pnpm test:coverage           # Test with coverage

# Building
pnpm build                    # Create production build
pnpm start                    # Start production server
pnpm export                   # Static export

# Database
pnpm db:push                 # Sync database
pnpm db:studio               # Open database UI

# Utilities
pnpm clean                   # Clean build artifacts
pnpm analyze                 # Analyze bundle size
```

---

**Quick Reference Guide Created**: March 2026  
**Version**: 1.0  
**Status**: Ready for Portfolio ✅

For detailed information, refer to:
- 📖 DOCUMENTATION.md (Complete guide)
- 🏗️ TECHNICAL_ARCHITECTURE.md (Architecture deep-dive)
- 🔌 API_REFERENCE.md (API details)
- 🚀 QUICKSTART.md (Getting started)
